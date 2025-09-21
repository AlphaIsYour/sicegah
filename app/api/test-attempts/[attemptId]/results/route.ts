// app/api/test-attempts/[attemptId]/results/route.ts
// GET /api/test-attempts/[attemptId]/results - Get detailed test results

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const { attemptId } = await params;

    if (!attemptId) {
      return NextResponse.json(
        { error: "Attempt ID is required" },
        { status: 400 }
      );
    }

    // Ambil data test attempt dengan semua relasi yang dibutuhkan
    const testAttempt = await prisma.testAttempt.findUnique({
      where: { id: attemptId },
      include: {
        test: {
          include: {
            questions: {
              orderBy: { createdAt: "asc" }, // Urutan soal sesuai pembuatan
              select: {
                id: true,
                questionText: true,
                options: true,
                correctAnswer: true,
                explanation: true,
                points: true,
              },
            },
            video: {
              select: {
                title: true,
              },
            },
          },
        },
        userAnswers: {
          include: {
            question: {
              select: {
                id: true,
                questionText: true,
                options: true,
                correctAnswer: true,
                explanation: true,
                points: true,
              },
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

    if (!testAttempt.isCompleted) {
      return NextResponse.json(
        { error: "Test attempt not completed yet" },
        { status: 400 }
      );
    }

    // Hitung total points
    const totalPointsEarned = testAttempt.userAnswers.reduce((sum, answer) => {
      return sum + answer.points;
    }, 0);

    const totalMaxPoints = testAttempt.test.questions.reduce(
      (sum, question) => {
        return sum + question.points;
      },
      0
    );

    // Buat detailed results per soal
    const detailedResults = testAttempt.test.questions.map((question) => {
      // Cari jawaban user untuk soal ini
      const userAnswer = testAttempt.userAnswers.find(
        (answer) => answer.questionId === question.id
      );

      return {
        questionId: question.id,
        questionText: question.questionText,
        options: question.options, // Assuming this is array of strings
        userAnswer: userAnswer?.answer || "", // Jawaban user
        correctAnswer: question.correctAnswer, // JAWABAN BENAR - INI YANG KURANG!
        isCorrect: userAnswer?.isCorrect || false,
        points: userAnswer?.points || 0,
        maxPoints: question.points,
        explanation: question.explanation || "", // SELALU KASIH EXPLANATION
      };
    });

    // Summary data
    const summary = {
      score: testAttempt.score,
      isPassed: testAttempt.isPassed,
      totalQuestions: testAttempt.test.questions.length,
      correctAnswers: testAttempt.correctAnswers,
      passingScore: testAttempt.test.passingScore,
      totalPointsEarned: totalPointsEarned,
      totalMaxPoints: totalMaxPoints,
      timeSpent: testAttempt.timeSpent || 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        summary: summary,
        detailedResults: detailedResults,
        videoTitle: testAttempt.test.video?.title || "Unknown Video",
        testTitle: testAttempt.test.title,
        completedAt: testAttempt.completedAt,
      },
    });
  } catch (error) {
    console.error("Error getting test results:", error);
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
