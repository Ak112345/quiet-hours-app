import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (postId) {
      // Get analytics for a specific post
      const analytics = await prisma.analytics.findMany({
        where: { postId },
        orderBy: { fetchedAt: 'desc' },
        take: 1,
      });

      return NextResponse.json({ analytics: analytics[0] || null });
    }

    // Get overall analytics
    const totalPosts = await prisma.post.count({
      where: { status: 'posted' },
    });

    const recentAnalytics = await prisma.analytics.findMany({
      include: {
        post: {
          include: {
            series: true,
          },
        },
      },
      orderBy: {
        fetchedAt: 'desc',
      },
      take: 100,
    });

    // Calculate aggregated stats
    const totalLikes = recentAnalytics.reduce((sum, a) => sum + a.likes, 0);
    const totalComments = recentAnalytics.reduce((sum, a) => sum + a.comments, 0);
    const totalViews = recentAnalytics.reduce((sum, a) => sum + a.views, 0);
    const avgEngagement = recentAnalytics.length > 0
      ? recentAnalytics.reduce((sum, a) => sum + a.engagement, 0) / recentAnalytics.length
      : 0;

    return NextResponse.json({
      summary: {
        totalPosts,
        totalLikes,
        totalComments,
        totalViews,
        avgEngagement: avgEngagement.toFixed(2),
      },
      recentAnalytics,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
