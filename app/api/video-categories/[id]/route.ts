// app/api/video-categories/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/video-categories/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.videoCategory.findUnique({
      where: { id },
      include: {
        videos: {
          select: {
            id: true,
            title: true,
            isActive: true,
          },
        },
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching video category:", error);
    return NextResponse.json(
      { error: "Failed to fetch video category" },
      { status: 500 }
    );
  }
}

// PUT /api/video-categories/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, icon, color, order, isActive } = body;

    const category = await prisma.videoCategory.update({
      where: { id },
      data: {
        name,
        description,
        icon,
        color,
        order,
        isActive,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating video category:", error);
    return NextResponse.json(
      { error: "Failed to update video category" },
      { status: 500 }
    );
  }
}

// DELETE /api/video-categories/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if category has videos
    const videosCount = await prisma.video.count({
      where: { categoryId: id },
    });

    if (videosCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category. It has ${videosCount} video(s) associated with it.`,
        },
        { status: 400 }
      );
    }

    await prisma.videoCategory.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting video category:", error);
    return NextResponse.json(
      { error: "Failed to delete video category" },
      { status: 500 }
    );
  }
}
