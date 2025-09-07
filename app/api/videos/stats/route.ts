// app/api/videos/stats/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/videos/stats
export async function GET() {
  try {
    const [totalVideos, activeVideos, totalViews, videosWithTests] =
      await Promise.all([
        prisma.video.count(),
        prisma.video.count({ where: { isActive: true } }),
        prisma.video.aggregate({
          _sum: { viewCount: true },
        }),
        prisma.video.count({
          where: {
            test: {
              isNot: null,
            },
          },
        }),
      ]);

    return NextResponse.json({
      totalVideos,
      activeVideos,
      totalViews: totalViews._sum.viewCount || 0,
      videosWithTests,
    });
  } catch (error) {
    console.error("Error fetching video stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch video stats" },
      { status: 500 }
    );
  }
}
