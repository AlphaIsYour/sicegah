/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/children/[id]/route.ts
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

// Helper function untuk cek kepemilikan anak
async function checkChildOwnership(childId: string, userId: string) {
  const child = await prisma.child.findFirst({
    where: {
      id: childId,
      parentId: userId,
    },
  });
  return child;
}

// GET - Ambil detail data anak berdasarkan ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid or missing token" },
        { status: 401 }
      );
    }

    const child = await checkChildOwnership(id, user.id);
    if (!child) {
      return NextResponse.json(
        {
          success: false,
          error: "Data anak tidak ditemukan atau tidak memiliki akses",
        },
        { status: 404 }
      );
    }

    // Ambil data lengkap dengan health records
    const childDetail = await prisma.child.findUnique({
      where: { id },
      include: {
        healthRecords: {
          orderBy: {
            recordDate: "desc",
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: childDetail,
      message: "Detail data anak berhasil diambil",
    });
  } catch (error) {
    console.error("Error fetching child detail:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan saat mengambil detail data anak",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}

// PUT - Update data anak berdasarkan ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid or missing token" },
        { status: 401 }
      );
    }

    const existingChild = await checkChildOwnership(id, user.id);
    if (!existingChild) {
      return NextResponse.json(
        {
          success: false,
          error: "Data anak tidak ditemukan atau tidak memiliki akses",
        },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      name,
      fullName,
      dateOfBirth,
      gender,
      isPremature,
      birthWeight,
      currentWeight,
      currentHeight,
      bloodType,
      allergies,
      medicalNotes,
    } = body;

    // Validasi data wajib (jika disediakan)
    if (name && name.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "Nama panggilan tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    // Validasi format gender (jika disediakan)
    if (gender && !["MALE", "FEMALE"].includes(gender)) {
      return NextResponse.json(
        {
          success: false,
          error: "Gender harus MALE atau FEMALE",
        },
        { status: 400 }
      );
    }

    // Validasi tanggal lahir (jika disediakan)
    let birthDate = existingChild.dateOfBirth;
    if (dateOfBirth) {
      birthDate = new Date(dateOfBirth);
      if (isNaN(birthDate.getTime()) || birthDate > new Date()) {
        return NextResponse.json(
          {
            success: false,
            error: "Tanggal lahir tidak valid",
          },
          { status: 400 }
        );
      }
    }

    const updatedChild = await prisma.child.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(fullName !== undefined && { fullName }),
        ...(dateOfBirth && { dateOfBirth: birthDate }),
        ...(gender && { gender }),
        ...(isPremature !== undefined && { isPremature }),
        ...(birthWeight !== undefined && {
          birthWeight: birthWeight ? parseFloat(birthWeight) : null,
        }),
        ...(currentWeight !== undefined && {
          currentWeight: currentWeight ? parseFloat(currentWeight) : null,
        }),
        ...(currentHeight !== undefined && {
          currentHeight: currentHeight ? parseFloat(currentHeight) : null,
        }),
        ...(bloodType !== undefined && { bloodType }),
        ...(allergies !== undefined && {
          allergies: Array.isArray(allergies) ? allergies : [],
        }),
        ...(medicalNotes !== undefined && { medicalNotes }),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedChild,
      message: "Data anak berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating child:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan saat memperbarui data anak",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}

// DELETE - Hapus data anak berdasarkan ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid or missing token" },
        { status: 401 }
      );
    }

    const existingChild = await checkChildOwnership(id, user.id);
    if (!existingChild) {
      return NextResponse.json(
        {
          success: false,
          error: "Data anak tidak ditemukan atau tidak memiliki akses",
        },
        { status: 404 }
      );
    }

    await prisma.child.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Data anak berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting child:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan saat menghapus data anak",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 }
    );
  }
}
