/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import crypto from "crypto";

const prisma = new PrismaClient();

// Konfigurasi nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // App Password, bukan password biasa
  },
});

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validasi input
    if (!email || !email.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required",
        },
        { status: 400 }
      );
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email format",
        },
        { status: 400 }
      );
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    // Jangan berikan info apakah email ada atau tidak (security)
    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message: "If the email exists, a reset code has been sent",
        },
        { status: 200 }
      );
    }

    // Generate 6 digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiry time (15 menit dari sekarang)
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000);

    // Update user dengan reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetCode,
        resetTokenExpiry: expiryTime,
      },
    });

    // Template email
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email.trim(),
      subject: "Sicegah - Kode Reset Password",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #42A5F5 0%, #1976D2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .code-box { background: white; border: 2px solid #42A5F5; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .code { font-size: 32px; font-weight: bold; color: #1976D2; letter-spacing: 5px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Reset Password</h1>
              <p>Aplikasi Sicegah</p>
            </div>
            <div class="content">
              <p>Halo <strong>${user.name}</strong>,</p>
              <p>Kami menerima permintaan untuk mereset password akun Anda. Gunakan kode berikut untuk melanjutkan proses reset password:</p>
              
              <div class="code-box">
                <div class="code">${resetCode}</div>
                <p style="margin: 10px 0 0 0; color: #666;">Kode Reset Password</p>
              </div>
              
              <div class="warning">
                <strong>⚠️ Penting:</strong>
                <ul>
                  <li>Kode ini berlaku selama <strong>15 menit</strong></li>
                  <li>Jangan bagikan kode ini kepada siapapun</li>
                  <li>Jika Anda tidak meminta reset password, abaikan email ini</li>
                </ul>
              </div>
              
              <p>Masukkan kode di atas pada aplikasi Sicegah untuk melanjutkan proses reset password.</p>
              
              <p>Salam,<br><strong>Tim Sicegah</strong></p>
            </div>
            <div class="footer">
              <p>Email ini dikirim secara otomatis. Mohon jangan membalas email ini.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Kirim email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        success: true,
        message: "Reset code has been sent to your email",
        data: {
          email: email.trim(),
          expiresIn: "15 minutes",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
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
