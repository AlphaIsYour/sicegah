// app/api/users/[id]/achievements/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get user achievements
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: id },
      include: {
        achievement: true,
      },
      orderBy: { earnedAt: "desc" },
    });

    // Get user stats
    const completedTests = await prisma.testAttempt.count({
      where: {
        userId: id,
        isCompleted: true,
      },
    });

    const perfectScores = await prisma.testAttempt.count({
      where: {
        userId: id,
        isCompleted: true,
        score: 100,
      },
    });

    const totalStars = await prisma.testAttempt.aggregate({
      where: {
        userId: id,
        isCompleted: true,
      },
      _sum: {
        starRating: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        achievements: userAchievements,
        stats: {
          completedTests,
          perfectScores,
          totalStars: totalStars._sum.starRating || 0,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user achievements:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
