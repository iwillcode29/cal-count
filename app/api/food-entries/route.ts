import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - ดึงรายการอาหารตามวันที่
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");
    
    if (!date) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    const entries = await prisma.foodEntry.findMany({
      where: { date },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error fetching food entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch food entries" },
      { status: 500 }
    );
  }
}

// POST - เพิ่มรายการอาหารใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, calories, meal, date, nutrition } = body;

    if (!name || !calories || !meal || !date) {
      return NextResponse.json(
        { error: "Missing required fields: name, calories, meal, date" },
        { status: 400 }
      );
    }

    const entry = await prisma.foodEntry.create({
      data: {
        name,
        calories: parseInt(calories),
        meal,
        date,
        ...(nutrition && {
          protein: nutrition.protein,
          carbs: nutrition.carbs,
          fat: nutrition.fat,
          fiber: nutrition.fiber,
          sugar: nutrition.sugar,
          sodium: nutrition.sodium,
        }),
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("Error creating food entry:", error);
    return NextResponse.json(
      { error: "Failed to create food entry" },
      { status: 500 }
    );
  }
}

// PUT - อัปเดตรายการอาหาร
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, calories, meal, nutrition } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing required field: id" },
        { status: 400 }
      );
    }

    const entry = await prisma.foodEntry.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(calories !== undefined && { calories: parseInt(calories) }),
        ...(meal !== undefined && { meal }),
        ...(nutrition && {
          protein: nutrition.protein,
          carbs: nutrition.carbs,
          fat: nutrition.fat,
          fiber: nutrition.fiber,
          sugar: nutrition.sugar,
          sodium: nutrition.sodium,
        }),
      },
    });

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Error updating food entry:", error);
    return NextResponse.json(
      { error: "Failed to update food entry" },
      { status: 500 }
    );
  }
}

// DELETE - ลบรายการอาหาร
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing required parameter: id" },
        { status: 400 }
      );
    }

    await prisma.foodEntry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting food entry:", error);
    return NextResponse.json(
      { error: "Failed to delete food entry" },
      { status: 500 }
    );
  }
}
