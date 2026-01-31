import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateContent } from '@/lib/services/ai-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { seriesName, contentType, theme, count = 1 } = body;

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

    const posts = [];

    // Generate multiple posts if count > 1
    for (let i = 0; i < count; i++) {
      const generated = await generateContent({
        series: seriesName,
        contentType: contentType || 'reel',
        theme,
      });

      const post = await prisma.post.create({
        data: {
          seriesId: series.id,
          contentType: contentType || 'reel',
          caption: generated.caption,
          aiPrompt: generated.aiPrompt,
          mediaUrls: JSON.stringify([]), // Empty for now, would contain generated media URLs
          status: 'draft',
        },
      });

      posts.push(post);
    }

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const seriesName = searchParams.get('series');

    const where = seriesName
      ? {
          series: {
            name: seriesName,
          },
        }
      : {};

    const posts = await prisma.post.findMany({
      where,
      include: {
        series: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
