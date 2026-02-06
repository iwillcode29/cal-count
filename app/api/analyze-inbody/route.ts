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
          content: `You are an expert body composition analyst, nutritionist, and fitness advisor specializing in Thai people. You are analyzing an InBody body composition report.

Extract ALL visible data from the InBody report as thoroughly as possible. Read every section carefully.

Required sections to extract:
1. **Basic Info**: Height, Weight, Age, Gender, Test Date, InBody Score
2. **Body Composition Analysis**: Total Body Water, Protein, Minerals, Body Fat Mass, Weight
3. **Muscle-Fat Analysis**: Weight (with bar position), SMM (with bar position), Body Fat Mass (with bar position). Bar positions indicate Under/Normal/Over.
4. **Obesity Analysis**: BMI (value + bar position), PBF/Body Fat Percentage (value + bar position)
5. **Segmental Lean Analysis**: Right Arm, Left Arm, Trunk, Right Leg, Left Leg — each with mass (kg), percentage (%), and rating (Under/Normal/Over)
6. **Segmental Fat Analysis**: Right Arm, Left Arm, Trunk, Right Leg, Left Leg — each with mass (kg), percentage (%), and rating (Under/Normal/Over)
7. **Weight Control**: Target Weight, Weight Control, Fat Control, Muscle Control
8. **Obesity Evaluation**: BMI rating, PBF rating
9. **Waist-Hip Ratio**: value
10. **Visceral Fat Level**: value
11. **Research Parameters**: Fat Free Mass, Basal Metabolic Rate (BMR), Obesity Degree, SMI, Recommended Calorie Intake
12. **Body Composition History**: If visible, extract past measurements (weight, SMM, PBF over time)

Then provide a comprehensive analysis in Thai:
- สรุปสุขภาพโดยรวม (Overall health summary)
- จุดแข็งของร่างกาย (Body strengths)
- จุดที่ต้องปรับปรุง (Areas to improve)  
- ความเสี่ยงด้านสุขภาพ (Health risks based on visceral fat, waist-hip ratio, etc.)
- แผนโภชนาการแนะนำ (Nutrition plan) - calories + macro breakdown with reasoning
- แผนออกกำลังกายแนะนำ (Exercise plan) - specific to their body composition
- เป้าหมายระยะสั้น 1-3 เดือน (Short-term goals)
- เป้าหมายระยะยาว 6-12 เดือน (Long-term goals)

Respond ONLY with valid JSON in this exact format:
{
  "recommendedCalories": number,
  "analysis": {
    "testDate": "string or null",
    "height": number_or_null,
    "age": number_or_null,
    "gender": "male" | "female" | null,
    "weight": number,
    "skeletalMuscleMass": number,
    "bodyFatMass": number,
    "bmi": number,
    "inbodyScore": number,
    "bodyWater": number,
    "protein": number,
    "minerals": number,
    "bodyFatPercentage": number,
    "muscleFatAnalysis": {
      "weight": { "value": number, "rating": "under" | "normal" | "over" },
      "smm": { "value": number, "rating": "under" | "normal" | "over" },
      "bodyFat": { "value": number, "rating": "under" | "normal" | "over" }
    },
    "segmentalLean": {
      "rightArm": { "mass": number, "percent": number, "rating": "under" | "normal" | "over" },
      "leftArm": { "mass": number, "percent": number, "rating": "under" | "normal" | "over" },
      "trunk": { "mass": number, "percent": number, "rating": "under" | "normal" | "over" },
      "rightLeg": { "mass": number, "percent": number, "rating": "under" | "normal" | "over" },
      "leftLeg": { "mass": number, "percent": number, "rating": "under" | "normal" | "over" }
    },
    "segmentalFat": {
      "rightArm": { "mass": number, "percent": number, "rating": "under" | "normal" | "over" },
      "leftArm": { "mass": number, "percent": number, "rating": "under" | "normal" | "over" },
      "trunk": { "mass": number, "percent": number, "rating": "under" | "normal" | "over" },
      "rightLeg": { "mass": number, "percent": number, "rating": "under" | "normal" | "over" },
      "leftLeg": { "mass": number, "percent": number, "rating": "under" | "normal" | "over" }
    },
    "weightControl": {
      "targetWeight": number,
      "weightControl": number,
      "fatControl": number,
      "muscleControl": number
    },
    "waistHipRatio": number_or_null,
    "visceralFatLevel": number_or_null,
    "bmr": number_or_null,
    "fatFreeMass": number_or_null,
    "obesityDegree": number_or_null,
    "smi": number_or_null,
    "macros": {
      "protein": number,
      "carbs": number,
      "fat": number
    },
    "recommendations": "string in Thai - comprehensive recommendations",
    "healthSummary": "string in Thai - overall health summary",
    "strengths": ["array of strings in Thai - body strengths"],
    "improvements": ["array of strings in Thai - areas to improve"],
    "healthRisks": ["array of strings in Thai - health risk warnings"],
    "exercisePlan": "string in Thai - recommended exercise plan",
    "shortTermGoals": ["array of strings in Thai - 1-3 month goals"],
    "longTermGoals": ["array of strings in Thai - 6-12 month goals"]
  }
}

Important: If a value is not visible or readable from the report, use null for optional fields. Never make up data - only extract what's actually visible.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this InBody report thoroughly. Extract ALL visible data and provide comprehensive health analysis and recommendations in Thai.",
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
      max_tokens: 4000,
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
