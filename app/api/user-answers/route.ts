// app/api/user-answers/route.ts
// POST /api/user-answers - Submit jawaban per soal

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, questionId, testAttemptId, answer } = body;

    // Validasi input
    if (!userId || !questionId || !testAttemptId || !answer) {
      return NextResponse.json(
        {
          error:
            "User ID, Question ID, Test Attempt ID, and Answer are required",
        },
        { status: 400 }
      );
    }

    // Cek apakah test attempt valid dan belum selesai
    const testAttempt = await prisma.testAttempt.findUnique({
      where: { id: testAttemptId },
      include: {
        test: {
          include: {
            questions: {
              where: { id: questionId },
            },
          },
        },
      },
    });

    if (!testAttempt) {
      return NextResponse.json(
        { error: "Test attempt not found" },
        { status: 404 }
      );
    }

    if (testAttempt.isCompleted) {
      return NextResponse.json(
        { error: "Test attempt already completed" },
        { status: 400 }
      );
    }

    if (testAttempt.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access to test attempt" },
        { status: 403 }
      );
    }

    const question = testAttempt.test.questions[0];
    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Cek apakah jawaban benar
    const isCorrect = question.correctAnswer === answer;
    const points = isCorrect ? question.points : 0;

    // Upsert user answer (update jika sudah ada, create jika belum)
    const userAnswer = await prisma.userAnswer.upsert({
      where: {
        testAttemptId_questionId: {
          testAttemptId,
          questionId,
        },
      },
      update: {
        answer,
        isCorrect,
        points,
        answeredAt: new Date(),
      },
      create: {
        userId,
        questionId,
        testAttemptId,
        answer,
        isCorrect,
        points,
      },
    });

    // Update correct answers count di test attempt
    const correctAnswersCount = await prisma.userAnswer.count({
      where: {
        testAttemptId,
        isCorrect: true,
      },
    });

    await prisma.testAttempt.update({
      where: { id: testAttemptId },
      data: {
        correctAnswers: correctAnswersCount,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        userAnswer,
        isCorrect,
        points,
        explanation: isCorrect ? null : question.explanation, // Hanya tampilkan explanation jika salah
      },
    });
  } catch (error) {
    console.error("Error submitting answer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
