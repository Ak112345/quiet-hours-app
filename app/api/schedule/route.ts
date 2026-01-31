import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scheduleAutoPosts } from '@/lib/services/scheduler';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { seriesName, frequency, timeOfDay, daysOfWeek } = body;

    // Find the series
    const series = await prisma.contentSeries.findUnique({
      where: { name: seriesName },
    });

    if (!series) {
      return NextResponse.json(
        { error: 'Series not found' },
        { status: 404 }
      );
    }

    const scheduledPosts = await scheduleAutoPosts({
      seriesId: series.id,
      frequency: frequency || 'daily',
      timeOfDay: timeOfDay || '10:00',
      daysOfWeek,
    });

    return NextResponse.json({
      message: `Scheduled ${scheduledPosts.length} posts`,
      posts: scheduledPosts,
    });
  } catch (error) {
    console.error('Error scheduling posts:', error);
    return NextResponse.json(
      { error: 'Failed to schedule posts' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const scheduledPosts = await prisma.post.findMany({
      where: {
        status: 'scheduled',
      },
      include: {
        series: true,
      },
      orderBy: {
        scheduledFor: 'asc',
      },
    });

    return NextResponse.json({ posts: scheduledPosts });
  } catch (error) {
    console.error('Error fetching scheduled posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scheduled posts' },
      { status: 500 }
    );
  }
}
