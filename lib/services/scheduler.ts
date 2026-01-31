import { prisma } from '../prisma';
import { postToInstagram } from './instagram';

export interface ScheduleConfig {
  seriesId: string;
  frequency: 'daily' | 'weekly' | 'biweekly';
  timeOfDay: string; // HH:MM format
  daysOfWeek?: number[]; // 0-6 for Sunday-Saturday
}

export async function scheduleAutoPosts(config: ScheduleConfig) {
  // Get all pending posts for the series
  const posts = await prisma.post.findMany({
    where: {
      seriesId: config.seriesId,
      status: 'draft',
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: 30, // Schedule up to 30 posts
  });

  const scheduledPosts = [];
  const now = new Date();
  
  for (let i = 0; i < posts.length; i++) {
    const scheduledDate = calculateNextPostDate(now, config, i);
    
    const updatedPost = await prisma.post.update({
      where: { id: posts[i].id },
      data: {
        status: 'scheduled',
        scheduledFor: scheduledDate,
      },
    });

    scheduledPosts.push(updatedPost);

    // Log the scheduling
    await prisma.postingLog.create({
      data: {
        postId: posts[i].id,
        status: 'scheduled',
        message: `Post scheduled for ${scheduledDate.toISOString()}`,
      },
    });
  }

  return scheduledPosts;
}

function calculateNextPostDate(
  startDate: Date,
  config: ScheduleConfig,
  index: number
): Date {
  const [hours, minutes] = config.timeOfDay.split(':').map(Number);
  const nextDate = new Date(startDate);
  
  // Calculate days to add based on frequency
  let daysToAdd = 0;
  switch (config.frequency) {
    case 'daily':
      daysToAdd = index + 1;
      break;
    case 'weekly':
      daysToAdd = (index + 1) * 7;
      break;
    case 'biweekly':
      daysToAdd = (index + 1) * 14;
      break;
  }

  nextDate.setDate(nextDate.getDate() + daysToAdd);
  nextDate.setHours(hours, minutes, 0, 0);

  return nextDate;
}

export async function processScheduledPosts() {
  const now = new Date();
  
  // Find all posts scheduled for now or earlier
  const postsToPublish = await prisma.post.findMany({
    where: {
      status: 'scheduled',
      scheduledFor: {
        lte: now,
      },
    },
    include: {
      series: true,
    },
  });

  for (const post of postsToPublish) {
    try {
      // Attempt to post to Instagram
      const instagramId = await postToInstagram({
        id: post.id,
        caption: post.caption,
        mediaUrls: JSON.parse(post.mediaUrls),
        contentType: post.contentType as 'reel' | 'carousel',
      });

      // Update post status
      await prisma.post.update({
        where: { id: post.id },
        data: {
          status: 'posted',
          postedAt: now,
          instagramId,
        },
      });

      // Log success
      await prisma.postingLog.create({
        data: {
          postId: post.id,
          status: 'success',
          message: `Successfully posted to Instagram at ${now.toISOString()}`,
        },
      });
    } catch (error) {
      // Log failure
      await prisma.post.update({
        where: { id: post.id },
        data: {
          status: 'failed',
        },
      });

      await prisma.postingLog.create({
        data: {
          postId: post.id,
          status: 'failed',
          message: `Failed to post to Instagram`,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      });
    }
  }

  return postsToPublish.length;
}

export async function initializeAutopilot() {
  // Initialize default series if they don't exist
  const series = ['POV', 'soft_life', 'truth_bombs'];
  
  for (const name of series) {
    await prisma.contentSeries.upsert({
      where: { name },
      update: {},
      create: {
        name,
        description: `${name.replace('_', ' ')} content series`,
        active: true,
      },
    });
  }

  // Set up default scheduling (runs every 5 minutes to check for posts)
  setInterval(processScheduledPosts, 5 * 60 * 1000);
}
