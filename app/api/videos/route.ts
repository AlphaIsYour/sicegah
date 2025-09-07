// app/api/videos/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/videos
export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        test: {
          select: {
            id: true,
          },
        },
      },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

// POST /api/videos
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      youtubeId,
      categoryId,
      minAge,
      maxAge,
      targetRole,
    } = body;

    // Get YouTube video duration (optional - you can implement YouTube API integration)
    // const duration = await getYouTubeDuration(youtubeId);

    const video = await prisma.video.create({
      data: {
        title,
        description,
        youtubeId,
        categoryId,
        minAge,
        maxAge,
        targetRole,
        // duration, // If you implement YouTube API
        thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        test: {
          select: {
            id: true,
          },
        },
      },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error("Error creating video:", error);
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
