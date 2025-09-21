// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, tempToken, newPassword, confirmPassword } =
      await request.json();

    // Validasi input
    if (!email || !tempToken || !newPassword || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    // Validasi password match
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match",
        },
        { status: 400 }
      );
    }

    // Validasi panjang password
    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 6 characters long",
        },
        { status: 400 }
      );
    }

    // Cari user dengan email dan temp token
    const user = await prisma.user.findFirst({
      where: {
        email: email.trim().toLowerCase(),
        resetToken: tempToken,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired reset token",
        },
        { status: 400 }
      );
    }

    // Cek apakah temp token masih berlaku
    if (!user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
      // Clear expired token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: "Reset session has expired. Please start over",
        },
        { status: 400 }
      );
    }

    // Hash password baru
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password dan clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Password has been reset successfully",
        data: {
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
