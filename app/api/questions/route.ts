import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/questions
export async function GET() {
  try {
    const questions = await prisma.question.findMany({
      include: {
        test: {
          select: {
            title: true,
            video: {
              select: {
                title: true,
              },
            },
          },
        },
      },
      orderBy: [{ testId: "asc" }, { order: "asc" }],
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

// POST /api/questions
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      questionText,
      type,
      options,
      correctAnswer,
      explanation,
      points,
      order,
      testId,
    } = body;

    const question = await prisma.question.create({
      data: {
        questionText,
        type,
        options: options || null,
        correctAnswer,
        explanation,
        points: points || 1,
        order: order || 0,
        testId,
      },
      include: {
        test: {
          select: {
            title: true,
            video: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
