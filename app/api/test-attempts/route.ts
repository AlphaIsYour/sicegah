// app/api/test-attempts/route.ts
// POST /api/test-attempts - Memulai attempt baru

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, testId } = body;

    // Validasi input
    if (!userId || !testId) {
      return NextResponse.json(
        { error: "User ID and Test ID are required" },
        { status: 400 }
      );
    }

    // Cek apakah test exists dan aktif
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          select: { id: true },
        },
      },
    });

    if (!test || !test.isActive) {
      return NextResponse.json(
        { error: "Test not found or inactive" },
        { status: 404 }
      );
    }

    // Cek jumlah attempt yang sudah dilakukan user
    const existingAttempts = await prisma.testAttempt.count({
      where: {
        userId,
        testId,
        isCompleted: true,
      },
    });

    if (existingAttempts >= test.maxAttempts) {
      return NextResponse.json(
        {
          error: `Maximum attempts (${test.maxAttempts}) reached for this test`,
        },
        { status: 400 }
      );
    }

    // Cek apakah ada attempt yang sedang berlangsung
    const ongoingAttempt = await prisma.testAttempt.findFirst({
      where: {
        userId,
        testId,
        isCompleted: false,
      },
    });

    if (ongoingAttempt) {
      return NextResponse.json({
        success: true,
        data: ongoingAttempt,
        message: "Continuing existing attempt",
      });
    }

    // Buat attempt baru
    const newAttempt = await prisma.testAttempt.create({
      data: {
        userId,
        testId,
        totalQuestions: test.questions.length,
        startedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newAttempt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating test attempt:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
