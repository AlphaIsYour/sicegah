/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/users/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        province: true,
        city: true,
        address: true,
        profileImage: true,
        isActive: true,
        createdAt: true,
        children: {
          select: {
            id: true,
            name: true,
            fullName: true,
            dateOfBirth: true,
            gender: true,
            isPremature: true,
            birthWeight: true,
            currentWeight: true,
            currentHeight: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const body = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        name: body.name,
        phone: body.phone,
        role: body.role,
        province: body.province,
        city: body.city,
        address: body.address,
        profileImage: body.profileImage,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        province: true,
        city: true,
        address: true,
        profileImage: true,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}
