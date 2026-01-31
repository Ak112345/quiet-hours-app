import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    const where = postId ? { postId } : {};

    const logs = await prisma.postingLog.findMany({
      where,
      include: {
        post: {
          include: {
            series: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: 100,
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error fetching posting logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posting logs' },
      { status: 500 }
    );
  }
}
