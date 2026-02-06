import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");
    const mimeType = image.type || "image/jpeg";

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert nutritionist and fitness advisor specializing in Thai people. Analyze the InBody report image and provide personalized dietary recommendations.

Extract ALL visible data from the InBody report including:
- Weight (kg)
- Skeletal Muscle Mass (kg)
- Body Fat Mass (kg)
- BMI
- InBody Score
- Body Water (L)
- Protein (kg)
- Minerals (kg)
- Body Fat Percentage (%)

Then provide:
1. Recommended daily calorie intake based on their body composition
2. Detailed macronutrient breakdown (protein/carbs/fat in grams)
3. Personalized advice in Thai language

Respond ONLY with valid JSON in this exact format:
{
  "recommendedCalories": number,
  "analysis": {
    "weight": number,
    "skeletalMuscleMass": number,
    "bodyFatMass": number,
    "bmi": number,
    "inbodyScore": number,
    "bodyWater": number,
    "protein": number,
    "minerals": number,
    "bodyFatPercentage": number,
    "macros": {
      "protein": number,
      "carbs": number,
      "fat": number
    },
    "recommendations": "string in Thai"
  }
}`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this InBody report and provide detailed nutritional recommendations in Thai.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1500,
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid JSON response from AI");
    }

    const result = JSON.parse(jsonMatch[0]);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("InBody analysis error:", error);

    // Type-safe error handling
    let errorMessage = "Failed to analyze InBody report";
    let errorDetails = "Unknown error";

    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.message;
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      errorDetails = String(error.message);
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}
