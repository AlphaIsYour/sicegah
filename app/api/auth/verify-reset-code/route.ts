// app/api/auth/verify-reset-code/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, resetCode } = await request.json();

    // Validasi input
    if (!email || !resetCode) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and reset code are required",
        },
        { status: 400 }
      );
    }

    // Validasi format kode (harus 6 digit)
    if (!/^\d{6}$/.test(resetCode)) {
      return NextResponse.json(
        {
          success: false,
          message: "Reset code must be 6 digits",
        },
        { status: 400 }
      );
    }

    // Cari user dengan email dan reset token
    const user = await prisma.user.findFirst({
      where: {
        email: email.trim().toLowerCase(),
        resetToken: resetCode,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid reset code or email",
        },
        { status: 400 }
      );
    }

    // Cek apakah token masih berlaku
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
          message: "Reset code has expired. Please request a new one",
        },
        { status: 400 }
      );
    }

    // Generate temporary token untuk reset password (berlaku 5 menit)
    const tempToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    const tempTokenExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 menit

    // Update user dengan temporary token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: tempToken, // Ganti dengan temp token
        resetTokenExpiry: tempTokenExpiry,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Reset code verified successfully",
        data: {
          tempToken,
          email: user.email,
          expiresIn: "5 minutes",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify reset code error:", error);
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
