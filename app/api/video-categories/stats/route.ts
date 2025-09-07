// app/api/video-categories/stats/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/video-categories/stats
export async function GET() {
  try {
    const categoriesWithStats = await prisma.videoCategory.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            videos: {
              where: { isActive: true },
            },
          },
        },
      },
      orderBy: { order: "asc" },
    });

    const statsWithVideos = await Promise.all(
      categoriesWithStats.map(async (category) => {
        const totalViews = await prisma.video.aggregate({
          where: {
            categoryId: category.id,
            isActive: true,
          },
          _sum: {
            viewCount: true,
          },
        });

        return {
          ...category,
          videoCount: category._count.videos,
          totalViews: totalViews._sum.viewCount || 0,
        };
      })
    );

    return NextResponse.json(statsWithVideos);
  } catch (error) {
    console.error("Error fetching category stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch category stats" },
      { status: 500 }
    );
  }
}
