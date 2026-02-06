import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - ดึงรายการวันที่มีข้อมูลอาหาร
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "30");

    // Get unique dates with food entries
    const entries = await prisma.foodEntry.findMany({
      select: {
        date: true,
      },
      distinct: ["date"],
      orderBy: {
        date: "desc",
      },
      take: limit,
    });

    const dates = entries.map((entry) => entry.date);

    return NextResponse.json(dates);
  } catch (error) {
    console.error("Error fetching history dates:", error);
    return NextResponse.json(
      { error: "Failed to fetch history dates" },
      { status: 500 }
    );
  }
}
