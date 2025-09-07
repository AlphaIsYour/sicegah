import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/tests
export async function GET() {
  try {
    const tests = await prisma.test.findMany({
      include: {
        video: {
          select: {
            title: true,
          },
        },
        _count: {
          select: {
            questions: true,
            testAttempts: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tests);
  } catch (error) {
    console.error("Error fetching tests:", error);
    return NextResponse.json(
      { error: "Failed to fetch tests" },
      { status: 500 }
    );
  }
}

// POST /api/tests
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      videoId,
      timeLimit,
      passingScore,
      maxAttempts,
    } = body;

    const test = await prisma.test.create({
      data: {
        title,
        description,
        videoId,
        timeLimit,
        passingScore: passingScore || 60,
        maxAttempts: maxAttempts || 3,
      },
      include: {
        video: {
          select: {
            title: true,
          },
        },
      },
    });

    return NextResponse.json(test, { status: 201 });
  } catch (error) {
    console.error("Error creating test:", error);
    return NextResponse.json(
      { error: "Failed to create test" },
      { status: 500 }
    );
  }
}
