/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";
    const role = searchParams.get("role");

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Build where clause for role filter
    const baseWhereClause = {
      startedAt: { gte: startDate },
      ...(role && role !== "ALL" && { user: { role: role as UserRole } }),
    };

    // Get key metrics
    const [totalAttempts, completedAttempts, passedAttempts] =
      await Promise.all([
        prisma.testAttempt.count({
          where: baseWhereClause,
        }),
        prisma.testAttempt.count({
          where: {
            ...baseWhereClause,
            isCompleted: true,
          },
        }),
        prisma.testAttempt.count({
          where: {
            ...baseWhereClause,
            isCompleted: true,
            isPassed: true,
          },
        }),
      ]);

    // Get average score
    const avgScoreResult = await prisma.testAttempt.aggregate({
      where: {
        ...baseWhereClause,
        isCompleted: true,
        score: { not: null },
      },
      _avg: {
        score: true,
      },
    });

    // Get unique participants
    const uniqueParticipants = await prisma.testAttempt.groupBy({
      by: ["userId"],
      where: baseWhereClause,
    });

    // Calculate trends (compare with previous period)
    const previousStartDate = new Date(startDate);
    const timeDiff = now.getTime() - startDate.getTime();
    previousStartDate.setTime(previousStartDate.getTime() - timeDiff);

    const prevWhereClause = {
      startedAt: { gte: previousStartDate, lt: startDate },
      ...(role && role !== "ALL" && { user: { role: role as UserRole } }),
    };

    const [prevTotalAttempts, prevCompletedAttempts, prevPassedAttempts] =
      await Promise.all([
        prisma.testAttempt.count({
          where: prevWhereClause,
        }),
        prisma.testAttempt.count({
          where: {
            ...prevWhereClause,
            isCompleted: true,
          },
        }),
        prisma.testAttempt.count({
          where: {
            ...prevWhereClause,
            isCompleted: true,
            isPassed: true,
          },
        }),
      ]);

    const prevUniqueParticipants = await prisma.testAttempt.groupBy({
      by: ["userId"],
      where: prevWhereClause,
    });

    const prevAvgScoreResult = await prisma.testAttempt.aggregate({
      where: {
        ...prevWhereClause,
        isCompleted: true,
        score: { not: null },
      },
      _avg: {
        score: true,
      },
    });

    // Calculate metrics and trends
    const currentParticipants = uniqueParticipants.length;
    const prevParticipants = prevUniqueParticipants.length;
    const currentAvgScore = avgScoreResult._avg.score || 0;
    const prevAvgScore = prevAvgScoreResult._avg.score || 0;
    const currentCompletionRate =
      totalAttempts > 0 ? (completedAttempts / totalAttempts) * 100 : 0;
    const prevCompletionRate =
      prevTotalAttempts > 0
        ? (prevCompletedAttempts / prevTotalAttempts) * 100
        : 0;
    const currentPassRate =
      completedAttempts > 0 ? (passedAttempts / completedAttempts) * 100 : 0;
    const prevPassRate =
      prevCompletedAttempts > 0
        ? (prevPassedAttempts / prevCompletedAttempts) * 100
        : 0;

    // Get test performance by category (using video category as proxy)
    const testPerformance = await prisma.test.findMany({
      where: {
        testAttempts: {
          some: baseWhereClause,
        },
      },
      select: {
        id: true,
        title: true,
        video: {
          select: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        testAttempts: {
          where: {
            ...baseWhereClause,
            isCompleted: true,
          },
          select: {
            score: true,
            isPassed: true,
          },
        },
      },
    });

    const categoryPerformance = testPerformance.reduce((acc: any[], test) => {
      const category = test.video?.category?.name || "Uncategorized";
      const existing = acc.find((item) => item.category === category);

      if (existing) {
        existing.attempts += test.testAttempts.length;
        existing.totalScore += test.testAttempts.reduce(
          (sum, attempt) => sum + (attempt.score || 0),
          0
        );
        existing.passedCount += test.testAttempts.filter(
          (attempt) => attempt.isPassed
        ).length;
      } else {
        acc.push({
          category,
          attempts: test.testAttempts.length,
          totalScore: test.testAttempts.reduce(
            (sum, attempt) => sum + (attempt.score || 0),
            0
          ),
          passedCount: test.testAttempts.filter((attempt) => attempt.isPassed)
            .length,
        });
      }
      return acc;
    }, []);

    const formattedTestPerformance = categoryPerformance.map((item) => ({
      category: item.category,
      avgScore: item.attempts > 0 ? item.totalScore / item.attempts : 0,
      attempts: item.attempts,
      passRate:
        item.attempts > 0 ? (item.passedCount / item.attempts) * 100 : 0,
    }));

    // Get role performance
    const roleFilter = role && role !== "ALL" ? { role: role as UserRole } : {};

    const rolePerformanceData = await prisma.user.groupBy({
      by: ["role"],
      where: {
        ...roleFilter,
        testAttempts: {
          some: baseWhereClause,
        },
      },
      _count: {
        id: true,
      },
    });

    const roleStats = await Promise.all(
      rolePerformanceData.map(async (roleData) => {
        const userAttempts = await prisma.testAttempt.findMany({
          where: {
            ...baseWhereClause,
            user: { role: roleData.role },
          },
          select: {
            score: true,
            isCompleted: true,
          },
        });

        const completedAttempts = userAttempts.filter(
          (attempt) => attempt.isCompleted
        );
        const totalScore = completedAttempts.reduce(
          (sum, attempt) => sum + (attempt.score || 0),
          0
        );

        return {
          role: roleData.role,
          users: roleData._count.id,
          totalAttempts: userAttempts.length,
          completedAttempts: completedAttempts.length,
          avgScore:
            completedAttempts.length > 0
              ? totalScore / completedAttempts.length
              : 0,
          completionRate:
            userAttempts.length > 0
              ? (completedAttempts.length / userAttempts.length) * 100
              : 0,
        };
      })
    );

    // Get question analysis
    const questionAnalysis = await prisma.question.findMany({
      where: {
        test: {
          testAttempts: {
            some: baseWhereClause,
          },
        },
      },
      select: {
        id: true,
        questionText: true,
        test: {
          select: {
            title: true,
          },
        },
        userAnswers: {
          where: {
            testAttempt: baseWhereClause,
          },
          select: {
            isCorrect: true,
          },
        },
      },
      take: 50,
    });

    const formattedQuestionAnalysis = questionAnalysis.map((question) => {
      const correctAnswers = question.userAnswers.filter(
        (answer) => answer.isCorrect
      ).length;
      const incorrectAnswers = question.userAnswers.length - correctAnswers;
      const total = correctAnswers + incorrectAnswers;

      let difficulty = "Medium";
      if (total > 0) {
        const successRate = (correctAnswers / total) * 100;
        if (successRate >= 80) difficulty = "Easy";
        else if (successRate <= 50) difficulty = "Hard";
      }

      return {
        id: question.id,
        questionText: question.questionText,
        correctAnswers,
        incorrectAnswers,
        difficulty,
        testTitle: question.test.title,
      };
    });

    // Generate insights
    const insights = generateInsights(
      formattedTestPerformance,
      roleStats,
      formattedQuestionAnalysis
    );

    const response = {
      keyMetrics: {
        totalParticipants: currentParticipants,
        averageScore: currentAvgScore,
        completionRate: currentCompletionRate,
        passRate: currentPassRate,
        trends: {
          participants:
            prevParticipants > 0
              ? ((currentParticipants - prevParticipants) / prevParticipants) *
                100
              : 0,
          score:
            prevAvgScore > 0
              ? ((currentAvgScore - prevAvgScore) / prevAvgScore) * 100
              : 0,
          completion:
            prevCompletionRate > 0
              ? ((currentCompletionRate - prevCompletionRate) /
                  prevCompletionRate) *
                100
              : 0,
          pass:
            prevPassRate > 0
              ? ((currentPassRate - prevPassRate) / prevPassRate) * 100
              : 0,
        },
      },
      testPerformance: formattedTestPerformance,
      rolePerformance: roleStats,
      questionAnalysis: formattedQuestionAnalysis,
      insights,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}

function generateInsights(
  testPerformance: any[],
  rolePerformance: any[],
  questionAnalysis: any[]
) {
  const keyFindings: string[] = [];
  const recommendations: string[] = [];

  if (rolePerformance.length > 0) {
    const bestRole = rolePerformance.reduce((prev, current) =>
      prev.avgScore > current.avgScore ? prev : current
    );
    const worstRole = rolePerformance.reduce((prev, current) =>
      prev.avgScore < current.avgScore ? prev : current
    );

    keyFindings.push(
      `${bestRole.role.replace(
        "_",
        " "
      )} role shows highest average score (${bestRole.avgScore.toFixed(1)}%)`
    );

    if (bestRole.avgScore - worstRole.avgScore > 10) {
      recommendations.push(
        `Provide additional training resources for ${worstRole.role.replace(
          "_",
          " "
        )} users`
      );
    }
  }

  if (testPerformance.length > 0) {
    const bestCategory = testPerformance.reduce((prev, current) =>
      prev.passRate > current.passRate ? prev : current
    );
    const worstCategory = testPerformance.reduce((prev, current) =>
      prev.passRate < current.passRate ? prev : current
    );

    keyFindings.push(
      `${
        bestCategory.category
      } has the highest pass rate (${bestCategory.passRate.toFixed(1)}%)`
    );

    if (worstCategory.passRate < 70) {
      recommendations.push(
        `Review and improve content for ${worstCategory.category} category`
      );
    }
  }

  if (questionAnalysis.length > 0) {
    const hardQuestions = questionAnalysis.filter(
      (q) => q.difficulty === "Hard"
    ).length;
    const easyQuestions = questionAnalysis.filter(
      (q) => q.difficulty === "Easy"
    ).length;

    if (hardQuestions > questionAnalysis.length * 0.3) {
      keyFindings.push(
        `${Math.round(
          (hardQuestions / questionAnalysis.length) * 100
        )}% of questions are categorized as hard`
      );
      recommendations.push(
        "Consider adding more explanatory content for difficult topics"
      );
    }

    if (easyQuestions > questionAnalysis.length * 0.6) {
      recommendations.push(
        "Consider adding more challenging questions to improve engagement"
      );
    }
  }

  return {
    keyFindings,
    recommendations,
  };
}
