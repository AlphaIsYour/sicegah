/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
// app/api/test-attempts/route.ts - GET user test progress by userId & videoId
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const videoId = searchParams.get("videoId");
    const latest = searchParams.get("latest"); // Get latest attempt only

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    let whereClause: any = {
      userId,
      isCompleted: true,
    };

    if (videoId) {
      whereClause.test = {
        videoId,
      };
    }

    if (latest === "true") {
      // Get latest attempt for specific video
      const latestAttempt = await prisma.testAttempt.findFirst({
        where: whereClause,
        include: {
          test: {
            select: {
              videoId: true,
              title: true,
            },
          },
        },
        orderBy: { completedAt: "desc" },
      });

      return NextResponse.json({
        success: true,
        data: latestAttempt,
      });
    } else {
      // Get all completed attempts
      const attempts = await prisma.testAttempt.findMany({
        where: whereClause,
        include: {
          test: {
            select: {
              videoId: true,
              title: true,
            },
          },
        },
        orderBy: { completedAt: "desc" },
      });

      return NextResponse.json({
        success: true,
        data: attempts,
      });
    }
  } catch (error) {
    console.error("Error fetching test attempts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  // Existing POST logic for creating test attempt
  try {
    const body = await request.json();
    const { userId, testId } = body;

    if (!userId || !testId) {
      return NextResponse.json(
        { error: "User ID and Test ID are required" },
        { status: 400 }
      );
    }

    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          select: { id: true },
        },
      },
    });

    if (!test || !test.isActive) {
      return NextResponse.json(
        { error: "Test not found or inactive" },
        { status: 404 }
      );
    }

    const existingAttempts = await prisma.testAttempt.count({
      where: {
        userId,
        testId,
        isCompleted: true,
      },
    });

    if (existingAttempts >= test.maxAttempts) {
      return NextResponse.json(
        {
          error: `Maximum attempts (${test.maxAttempts}) reached for this test`,
        },
        { status: 400 }
      );
    }

    const ongoingAttempt = await prisma.testAttempt.findFirst({
      where: {
        userId,
        testId,
        isCompleted: false,
      },
    });

    if (ongoingAttempt) {
      return NextResponse.json({
        success: true,
        data: ongoingAttempt,
        message: "Continuing existing attempt",
      });
    }

    const newAttempt = await prisma.testAttempt.create({
      data: {
        userId,
        testId,
        totalQuestions: test.questions.length,
        startedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newAttempt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating test attempt:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
