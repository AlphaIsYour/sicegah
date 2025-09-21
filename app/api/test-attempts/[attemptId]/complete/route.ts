/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/test-attempts/[attemptId]/complete/route.ts - UPDATE DENGAN GAMIFIKASI
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
    const { userId } = body;

    if (!attemptId) {
      return NextResponse.json(
        { error: "Attempt ID is required" },
        { status: 400 }
      );
    }

    const testAttempt = await prisma.testAttempt.findUnique({
      where: { id: attemptId },
      include: {
        test: { include: { questions: true } },
        userAnswers: true,
      },
    });

    if (!testAttempt || testAttempt.isCompleted) {
      return NextResponse.json(
        { error: "Test attempt not found or already completed" },
        { status: 400 }
      );
    }

    // Hitung scoring
    const totalPointsEarned = testAttempt.userAnswers.reduce(
      (sum, answer) => sum + answer.points,
      0
    );
    const totalMaxPoints = testAttempt.test.questions.reduce(
      (sum, question) => sum + question.points,
      0
    );
    const score =
      totalMaxPoints > 0
        ? Math.round((totalPointsEarned / totalMaxPoints) * 100)
        : 0;
    const correctAnswersCount = testAttempt.userAnswers.filter(
      (answer) => answer.isCorrect
    ).length;

    // ⭐ HITUNG STAR RATING (1-5 bintang berdasarkan jawaban benar)
    const starRating = Math.round(
      (correctAnswersCount / testAttempt.test.questions.length) * 5
    );

    const isPassed = score >= testAttempt.test.passingScore;
    const timeSpent = Math.floor(
      (new Date().getTime() - testAttempt.startedAt.getTime()) / 1000
    );

    // Update test attempt dengan star rating
    const completedAttempt = await prisma.testAttempt.update({
      where: { id: attemptId },
      data: {
        score,
        correctAnswers: correctAnswersCount,
        starRating, // ⭐ TAMBAHAN STAR RATING
        isPassed,
        isCompleted: true,
        completedAt: new Date(),
        timeSpent,
      },
    });

    // ⭐ GAMIFIKASI: Check dan unlock achievements
    const achievementsUnlocked = [];

    // 1. First Test Achievement
    const completedTestsCount = await prisma.testAttempt.count({
      where: { userId: testAttempt.userId, isCompleted: true },
    });

    if (completedTestsCount === 1) {
      await unlockAchievement(testAttempt.userId, "First Test Completed");
      achievementsUnlocked.push("First Test Completed");
    }

    // 2. Learning Champion (5 tests)
    if (completedTestsCount === 5) {
      await unlockAchievement(testAttempt.userId, "Learning Champion");
      achievementsUnlocked.push("Learning Champion");
    }

    // 3. Perfect Score Achievement
    if (score === 100) {
      await unlockAchievement(testAttempt.userId, "Perfect Score");
      achievementsUnlocked.push("Perfect Score");
    }

    // 4. Dedicated Learner (10 tests)
    if (completedTestsCount === 10) {
      await unlockAchievement(testAttempt.userId, "Dedicated Learner");
      achievementsUnlocked.push("Dedicated Learner");
    }

    // Create notification
    await prisma.notification.create({
      data: {
        userId: testAttempt.userId,
        title: isPassed ? "Test Passed!" : "Test Completed",
        message: `You ${
          isPassed ? "passed" : "completed"
        } the test with score ${score}% (${starRating} ⭐)`,
        type: "TEST_RESULT",
        actionUrl: `/test-results/${attemptId}`,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        attempt: completedAttempt,
        summary: {
          score,
          starRating, // ⭐ RETURN STAR RATING
          isPassed,
          totalQuestions: testAttempt.totalQuestions,
          correctAnswers: correctAnswersCount,
          totalPointsEarned,
          totalMaxPoints,
          timeSpent,
          passingScore: testAttempt.test.passingScore,
        },
        achievementsUnlocked, // ⭐ RETURN UNLOCKED ACHIEVEMENTS
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

// ⭐ HELPER FUNCTION: Unlock Achievement
async function unlockAchievement(userId: string, achievementName: string) {
  try {
    const achievement = await prisma.achievement.findUnique({
      where: { name: achievementName },
    });

    if (!achievement) return;

    // Check if already unlocked
    const existingAchievement = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId: achievement.id,
        },
      },
    });

    if (!existingAchievement) {
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
          isCompleted: true,
          progress: achievement.requirement || 0,
        },
      });
    }
  } catch (error) {
    console.error("Error unlocking achievement:", error);
  }
}
