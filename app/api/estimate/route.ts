import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { foodName } = await request.json();

    if (!foodName || typeof foodName !== "string" || !foodName.trim()) {
      return NextResponse.json(
        { error: "กรุณาระบุชื่ออาหาร" },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `คุณเป็นผู้เชี่ยวชาญด้านโภชนาการอาหารไทยและอาหารทั่วไป ประเมินแคลอรี่และสารอาหารต่อ 1 จาน/หน่วยบริโภคมาตรฐาน

ตอบเป็น JSON เท่านั้น ในรูปแบบนี้:
{
  "calories": number,
  "nutrition": {
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number,
    "sugar": number,
    "sodium": number
  }
}

หน่วย: calories เป็น kcal, protein/carbs/fat/fiber/sugar เป็นกรัม, sodium เป็น mg
ประเมินตามขนาดจานมาตรฐานของร้านอาหารทั่วไป`,
        },
        {
          role: "user",
          content: `ประเมินแคลอรี่และสารอาหารของ: ${foodName.trim()}`,
        },
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from AI");
    }

    const result = JSON.parse(jsonMatch[0]);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Estimate error:", error);

    let errorMessage = "ไม่สามารถประเมินอาหารได้";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
