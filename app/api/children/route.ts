/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/children/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Helper function untuk verifikasi JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

// GET - Ambil semua data anak milik user
export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid or missing token" },
        { status: 401 }
      );
    }

    const children = await prisma.child.findMany({
      where: {
        parentId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        healthRecords: {
          orderBy: {
            recordDate: "desc",
          },
          take: 5, // Ambil 5 record kesehatan terbaru
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: children,
      message:
        children.length > 0
          ? "Data anak berhasil diambil"
          : "Belum ada data anak",
    });
  } catch (error) {
    console.error("Error fetching children:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan saat mengambil data anak",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}

// POST - Tambah data anak baru
export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid or missing token" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      fullName,
      dateOfBirth,
      gender,
      isPremature = false,
      birthWeight,
      currentWeight,
      currentHeight,
      bloodType,
      allergies = [],
      medicalNotes,
    } = body;

    // Validasi data wajib
    if (!name || !dateOfBirth || !gender) {
      return NextResponse.json(
        {
          success: false,
          error: "Data wajib tidak lengkap",
          required: ["name", "dateOfBirth", "gender"],
        },
        { status: 400 }
      );
    }

    // Validasi format gender
    if (!["MALE", "FEMALE"].includes(gender)) {
      return NextResponse.json(
        {
          success: false,
          error: "Gender harus MALE atau FEMALE",
        },
        { status: 400 }
      );
    }

    // Validasi tanggal lahir
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate.getTime()) || birthDate > new Date()) {
      return NextResponse.json(
        {
          success: false,
          error: "Tanggal lahir tidak valid",
        },
        { status: 400 }
      );
    }

    const newChild = await prisma.child.create({
      data: {
        name,
        fullName,
        dateOfBirth: birthDate,
        gender,
        isPremature,
        birthWeight: birthWeight ? parseFloat(birthWeight) : null,
        currentWeight: currentWeight ? parseFloat(currentWeight) : null,
        currentHeight: currentHeight ? parseFloat(currentHeight) : null,
        bloodType,
        allergies: Array.isArray(allergies) ? allergies : [],
        medicalNotes,
        parentId: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: newChild,
        message: "Data anak berhasil ditambahkan",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating child:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan saat menambah data anak",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
