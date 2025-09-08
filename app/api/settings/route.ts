/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Default settings
const DEFAULT_SETTINGS = {
  siteName: "Si Cegah App",
  siteDescription: "Platform edukasi kesehatan untuk orang tua dan kader",
  maxTestAttempts: 3,
  defaultPassingScore: 60,
  emailNotifications: true,
  systemMaintenance: false,
  registrationOpen: true,
};

export async function GET() {
  try {
    // Get all settings from database
    const settings = await prisma.appSettings.findMany({
      select: {
        key: true,
        value: true,
      },
    });

    // Convert to key-value object
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as any);

    // Merge with defaults for any missing keys
    const result = { ...DEFAULT_SETTINGS, ...settingsObj };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      siteName,
      siteDescription,
      maxTestAttempts,
      defaultPassingScore,
      emailNotifications,
      systemMaintenance,
      registrationOpen,
    } = body;

    // Validate input
    if (maxTestAttempts < 1 || maxTestAttempts > 10) {
      return NextResponse.json(
        { error: "Max test attempts must be between 1 and 10" },
        { status: 400 }
      );
    }

    if (defaultPassingScore < 1 || defaultPassingScore > 100) {
      return NextResponse.json(
        { error: "Default passing score must be between 1 and 100" },
        { status: 400 }
      );
    }

    // Prepare upsert operations
    const settingsToUpdate = [
      { key: "siteName", value: siteName },
      { key: "siteDescription", value: siteDescription },
      { key: "maxTestAttempts", value: maxTestAttempts },
      { key: "defaultPassingScore", value: defaultPassingScore },
      { key: "emailNotifications", value: emailNotifications },
      { key: "systemMaintenance", value: systemMaintenance },
      { key: "registrationOpen", value: registrationOpen },
    ];

    // Update each setting
    await Promise.all(
      settingsToUpdate.map(async (setting) => {
        await prisma.appSettings.upsert({
          where: { key: setting.key },
          update: {
            value: setting.value,
            updatedAt: new Date(),
          },
          create: {
            key: setting.key,
            value: setting.value,
            description: getSettingDescription(setting.key),
          },
        });
      })
    );

    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

function getSettingDescription(key: string): string {
  const descriptions: Record<string, string> = {
    siteName: "The name of the application",
    siteDescription: "A brief description of the application",
    maxTestAttempts: "Maximum number of test attempts allowed per user",
    defaultPassingScore: "Default minimum score required to pass tests",
    emailNotifications: "Enable or disable email notifications",
    systemMaintenance: "Enable maintenance mode to restrict user access",
    registrationOpen: "Allow or restrict new user registrations",
  };

  return descriptions[key] || "";
}
