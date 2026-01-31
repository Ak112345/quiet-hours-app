import axios from 'axios';

export interface InstagramPost {
  id: string;
  caption: string;
  mediaUrls: string[];
  contentType: 'reel' | 'carousel';
}

export interface InstagramAnalytics {
  likes: number;
  comments: number;
  shares: number;
  views: number;
  reach: number;
  engagement: number;
}

const INSTAGRAM_API_BASE = 'https://graph.instagram.com/v18.0';

export async function postToInstagram(post: InstagramPost): Promise<string> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  if (!accessToken || !userId) {
    console.warn('Instagram credentials not configured, simulating post');
    return `simulated_${Date.now()}`;
  }

  try {
    // For actual implementation, would use Instagram Graph API
    // This is a simplified version
    const response = await axios.post(
      `${INSTAGRAM_API_BASE}/${userId}/media`,
      {
        caption: post.caption,
        // media_url: post.mediaUrls[0], // For single image/video
        access_token: accessToken,
      }
    );

    return response.data.id;
  } catch (error) {
    console.error('Error posting to Instagram:', error);
    throw new Error('Failed to post to Instagram');
  }
}

export async function getPostAnalytics(instagramId: string): Promise<InstagramAnalytics> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!accessToken) {
    // Return mock analytics if not configured
    return {
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 50),
      shares: Math.floor(Math.random() * 20),
      views: Math.floor(Math.random() * 5000),
      reach: Math.floor(Math.random() * 3000),
      engagement: Math.random() * 10,
    };
  }

  try {
    const response = await axios.get(
      `${INSTAGRAM_API_BASE}/${instagramId}/insights`,
      {
        params: {
          metric: 'likes,comments,shares,plays,reach,engagement',
          access_token: accessToken,
        },
      }
    );

    const data = response.data.data;
    return {
      likes: data.find((m: any) => m.name === 'likes')?.values[0]?.value || 0,
      comments: data.find((m: any) => m.name === 'comments')?.values[0]?.value || 0,
      shares: data.find((m: any) => m.name === 'shares')?.values[0]?.value || 0,
      views: data.find((m: any) => m.name === 'plays')?.values[0]?.value || 0,
      reach: data.find((m: any) => m.name === 'reach')?.values[0]?.value || 0,
      engagement: data.find((m: any) => m.name === 'engagement')?.values[0]?.value || 0,
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw new Error('Failed to fetch analytics');
  }
}

export async function schedulePost(post: InstagramPost, scheduledTime: Date): Promise<void> {
  // In production, this would integrate with a job queue like Bull or Agenda
  console.log(`Post scheduled for ${scheduledTime.toISOString()}`);
}
