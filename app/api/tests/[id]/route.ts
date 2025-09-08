import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT /api/tests/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      description,
      timeLimit,
      passingScore,
      maxAttempts,
      isActive,
    } = body;

    const test = await prisma.test.update({
      where: { id },
      data: {
        title,
        description,
        timeLimit,
        passingScore,
        maxAttempts,
        isActive,
      },
      include: {
        video: {
          select: {
            title: true,
          },
        },
        _count: {
          select: {
            questions: true,
            testAttempts: true,
          },
        },
      },
    });

    return NextResponse.json(test);
  } catch (error) {
    console.error("Error updating test:", error);
    return NextResponse.json(
      { error: "Failed to update test" },
      { status: 500 }
    );
  }
}

// DELETE /api/tests/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check if test has questions
    const questionsCount = await prisma.question.count({
      where: { testId: id },
    });

    if (questionsCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete test. It has ${questionsCount} question(s) associated with it.`,
        },
        { status: 400 }
      );
    }

    await prisma.test.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Test deleted successfully" });
  } catch (error) {
    console.error("Error deleting test:", error);
    return NextResponse.json(
      { error: "Failed to delete test" },
      { status: 500 }
    );
  }
}
