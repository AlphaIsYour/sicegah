// app/api/video-categories/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/video-categories
export async function GET() {
  try {
    const categories = await prisma.videoCategory.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching video categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch video categories" },
      { status: 500 }
    );
  }
}

// POST /api/video-categories
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, icon, color, order } = body;

    const category = await prisma.videoCategory.create({
      data: {
        name,
        description,
        icon,
        color,
        order: order || 0,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating video category:", error);
    return NextResponse.json(
      { error: "Failed to create video category" },
      { status: 500 }
    );
  }
}
