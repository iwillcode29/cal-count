import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - ดึงค่า setting ตาม key
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get("key");

    if (!key) {
      // ถ้าไม่ระบุ key ให้ส่งกลับทุก settings
      const settings = await prisma.userSettings.findMany();
      return NextResponse.json(settings);
    }

    const setting = await prisma.userSettings.findUnique({
      where: { key },
    });

    if (!setting) {
      // Return default values if not found
      const defaults: Record<string, string> = {
        goal: "2000",
        macro_goals: JSON.stringify({ protein: 150, carbs: 250, fat: 65 }),
      };

      return NextResponse.json({
        key,
        value: defaults[key] || "",
      });
    }

    return NextResponse.json(setting);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// POST/PUT - บันทึก setting
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: key, value" },
        { status: 400 }
      );
    }

    const setting = await prisma.userSettings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json(setting);
  } catch (error) {
    console.error("Error saving setting:", error);
    return NextResponse.json(
      { error: "Failed to save setting" },
      { status: 500 }
    );
  }
}
