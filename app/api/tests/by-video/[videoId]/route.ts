// app/api/tests/by-video/[videoId]/route.ts
// GET /api/tests/by-video/[videoId] - Mengambil test berdasarkan video ID

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params;

    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    // Ambil test beserta questions dan video info
    const test = await prisma.test.findUnique({
      where: { videoId },
      include: {
        video: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnailUrl: true,
          },
        },
        questions: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            questionText: true,
            type: true,
            options: true,
            points: true,
            order: true,
            imageUrl: true,
            // Tidak include correctAnswer dan explanation untuk keamanan
          },
        },
      },
    });

    if (!test) {
      return NextResponse.json(
        { error: "Test not found for this video" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: test,
    });
  } catch (error) {
    console.error("Error fetching test:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
