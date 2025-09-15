// app/api/test-attempts/[attemptId]/complete/route.ts
// PUT /api/test-attempts/[attemptId]/complete - Menyelesaikan test dan hitung score

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  try {
    const { attemptId } = await params;
    const body = await request.json();
    const { userId } = body; // Untuk validasi ownership

    if (!attemptId) {
      return NextResponse.json(
        { error: "Attempt ID is required" },
        { status: 400 }
      );
    }

    // Ambil data test attempt dengan relasi yang diperlukan
    const testAttempt = await prisma.testAttempt.findUnique({
      where: { id: attemptId },
      include: {
        test: {
          include: {
            questions: true,
          },
        },
        userAnswers: true,
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

    if (userId && testAttempt.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized access to test attempt" },
        { status: 403 }
      );
    }

    // Hitung total points yang diperoleh
    const totalPointsEarned = testAttempt.userAnswers.reduce((sum, answer) => {
      return sum + answer.points;
    }, 0);

    // Hitung total points maksimum
    const totalMaxPoints = testAttempt.test.questions.reduce(
      (sum, question) => {
        return sum + question.points;
      },
      0
    );

    // Hitung score persentase
    const score =
      totalMaxPoints > 0
        ? Math.round((totalPointsEarned / totalMaxPoints) * 100)
        : 0;

    // Tentukan apakah lulus berdasarkan passing score
    const isPassed = score >= testAttempt.test.passingScore;

    // Hitung waktu yang dihabiskan
    const timeSpent = Math.floor(
      (new Date().getTime() - testAttempt.startedAt.getTime()) / 1000
    );

    // Update test attempt
    const completedAttempt = await prisma.testAttempt.update({
      where: { id: attemptId },
      data: {
        score,
        correctAnswers: testAttempt.userAnswers.filter(
          (answer) => answer.isCorrect
        ).length,
        isPassed,
        isCompleted: true,
        completedAt: new Date(),
        timeSpent,
      },
      include: {
        test: {
          select: {
            title: true,
            passingScore: true,
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
                questionText: true,
                correctAnswer: true,
                explanation: true,
                points: true,
              },
            },
          },
        },
      },
    });

    // Buat notifikasi hasil test
    await prisma.notification.create({
      data: {
        userId: testAttempt.userId,
        title: isPassed ? "Test Passed!" : "Test Completed",
        message: `You ${isPassed ? "passed" : "completed"} the test "${
          testAttempt.test.title
        }" with score ${score}%`,
        type: "TEST_RESULT",
        actionUrl: `/test-results/${attemptId}`,
      },
    });

    // Jika lulus dan ini video dengan test, mungkin bisa unlock konten selanjutnya
    // (implementasi bisa disesuaikan dengan business logic)

    return NextResponse.json({
      success: true,
      data: {
        attempt: completedAttempt,
        summary: {
          score,
          isPassed,
          totalQuestions: testAttempt.totalQuestions,
          correctAnswers: testAttempt.userAnswers.filter(
            (answer) => answer.isCorrect
          ).length,
          totalPointsEarned,
          totalMaxPoints,
          timeSpent,
          passingScore: testAttempt.test.passingScore,
        },
      },
    });
  } catch (error) {
    console.error("Error completing test attempt:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Jika Anda juga ingin mendukung method lain, tambahkan di sini
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
