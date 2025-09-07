// app/api/dashboard/stats/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get total counts
    const [
      totalUsers,
      totalVideos,
      totalTests,
      completedTestsCount,
      usersByRole,
      recentTestAttempts,
    ] = await Promise.all([
      // Total users
      prisma.user.count({
        where: { isActive: true },
      }),

      // Total active videos
      prisma.video.count({
        where: { isActive: true },
      }),

      // Total active tests
      prisma.test.count({
        where: { isActive: true },
      }),

      // Completed tests count
      prisma.testAttempt.count({
        where: {
          isCompleted: true,
          isPassed: true,
        },
      }),

      // Users grouped by role
      prisma.user.groupBy({
        by: ["role"],
        where: { isActive: true },
        _count: {
          role: true,
        },
      }),

      // Recent test attempts for activities
      prisma.testAttempt.findMany({
        take: 4,
        orderBy: { completedAt: "desc" },
        where: {
          isCompleted: true,
          completedAt: { not: null },
        },
        include: {
          user: {
            select: { name: true },
          },
          test: {
            include: {
              video: {
                select: { title: true },
              },
            },
          },
        },
      }),
    ]);

    // Calculate user role percentages
    const totalUsersForPercentage = usersByRole.reduce(
      (sum, role) => sum + role._count.role,
      0
    );
    const userRoleStats = usersByRole.map((role) => ({
      role: role.role,
      count: role._count.role,
      percentage:
        totalUsersForPercentage > 0
          ? Math.round((role._count.role / totalUsersForPercentage) * 100)
          : 0,
    }));

    // Format recent activities
    const recentActivities = recentTestAttempts.map((attempt) => {
      const timeAgo = getTimeAgo(attempt.completedAt!);
      const action = attempt.isPassed
        ? `completed test "${attempt.test.video?.title || "Unknown"}"`
        : `attempted test "${attempt.test.video?.title || "Unknown"}"`;

      return {
        user: attempt.user.name,
        action,
        time: timeAgo,
      };
    });

    const stats = {
      totalUsers,
      totalVideos,
      totalTests,
      completedTests: completedTestsCount,
      usersByRole: userRoleStats,
      recentActivities,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }
}
