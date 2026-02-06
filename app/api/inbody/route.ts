import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const MAX_INBODY_HISTORY = 10;

// GET - ดึงประวัติ InBody Analysis
export async function GET() {
  try {
    const analyses = await prisma.inBodyAnalysis.findMany({
      orderBy: { uploadedAt: "desc" },
      take: MAX_INBODY_HISTORY,
    });

    return NextResponse.json(analyses);
  } catch (error) {
    console.error("Error fetching InBody analyses:", error);
    return NextResponse.json(
      { error: "Failed to fetch InBody analyses" },
      { status: 500 }
    );
  }
}

// POST - เพิ่ม InBody Analysis ใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recommendedCalories, analysis } = body;

    if (!recommendedCalories || !analysis) {
      return NextResponse.json(
        { error: "Missing required fields: recommendedCalories, analysis" },
        { status: 400 }
      );
    }

    // Create the analysis
    const newAnalysis = await prisma.inBodyAnalysis.create({
      data: {
        recommendedCalories,
        
        // Basic Info
        testDate: analysis.testDate || null,
        height: analysis.height || null,
        age: analysis.age || null,
        gender: analysis.gender || null,
        weight: analysis.weight,
        skeletalMuscleMass: analysis.skeletalMuscleMass,
        bodyFatMass: analysis.bodyFatMass,
        bmi: analysis.bmi,
        inbodyScore: analysis.inbodyScore,
        bodyWater: analysis.bodyWater,
        protein: analysis.protein,
        minerals: analysis.minerals,
        bodyFatPercentage: analysis.bodyFatPercentage,

        // Muscle-Fat Analysis
        weightValue: analysis.muscleFatAnalysis?.weight?.value || null,
        weightRating: analysis.muscleFatAnalysis?.weight?.rating || null,
        smmValue: analysis.muscleFatAnalysis?.smm?.value || null,
        smmRating: analysis.muscleFatAnalysis?.smm?.rating || null,
        bodyFatValue: analysis.muscleFatAnalysis?.bodyFat?.value || null,
        bodyFatRating: analysis.muscleFatAnalysis?.bodyFat?.rating || null,

        // Segmental Lean
        segLeanRightArmMass: analysis.segmentalLean?.rightArm?.mass || null,
        segLeanRightArmPct: analysis.segmentalLean?.rightArm?.percent || null,
        segLeanRightArmRate: analysis.segmentalLean?.rightArm?.rating || null,
        segLeanLeftArmMass: analysis.segmentalLean?.leftArm?.mass || null,
        segLeanLeftArmPct: analysis.segmentalLean?.leftArm?.percent || null,
        segLeanLeftArmRate: analysis.segmentalLean?.leftArm?.rating || null,
        segLeanTrunkMass: analysis.segmentalLean?.trunk?.mass || null,
        segLeanTrunkPct: analysis.segmentalLean?.trunk?.percent || null,
        segLeanTrunkRate: analysis.segmentalLean?.trunk?.rating || null,
        segLeanRightLegMass: analysis.segmentalLean?.rightLeg?.mass || null,
        segLeanRightLegPct: analysis.segmentalLean?.rightLeg?.percent || null,
        segLeanRightLegRate: analysis.segmentalLean?.rightLeg?.rating || null,
        segLeanLeftLegMass: analysis.segmentalLean?.leftLeg?.mass || null,
        segLeanLeftLegPct: analysis.segmentalLean?.leftLeg?.percent || null,
        segLeanLeftLegRate: analysis.segmentalLean?.leftLeg?.rating || null,

        // Segmental Fat
        segFatRightArmMass: analysis.segmentalFat?.rightArm?.mass || null,
        segFatRightArmPct: analysis.segmentalFat?.rightArm?.percent || null,
        segFatRightArmRate: analysis.segmentalFat?.rightArm?.rating || null,
        segFatLeftArmMass: analysis.segmentalFat?.leftArm?.mass || null,
        segFatLeftArmPct: analysis.segmentalFat?.leftArm?.percent || null,
        segFatLeftArmRate: analysis.segmentalFat?.leftArm?.rating || null,
        segFatTrunkMass: analysis.segmentalFat?.trunk?.mass || null,
        segFatTrunkPct: analysis.segmentalFat?.trunk?.percent || null,
        segFatTrunkRate: analysis.segmentalFat?.trunk?.rating || null,
        segFatRightLegMass: analysis.segmentalFat?.rightLeg?.mass || null,
        segFatRightLegPct: analysis.segmentalFat?.rightLeg?.percent || null,
        segFatRightLegRate: analysis.segmentalFat?.rightLeg?.rating || null,
        segFatLeftLegMass: analysis.segmentalFat?.leftLeg?.mass || null,
        segFatLeftLegPct: analysis.segmentalFat?.leftLeg?.percent || null,
        segFatLeftLegRate: analysis.segmentalFat?.leftLeg?.rating || null,

        // Weight Control
        targetWeight: analysis.weightControl?.targetWeight || null,
        weightControl: analysis.weightControl?.weightControl || null,
        fatControl: analysis.weightControl?.fatControl || null,
        muscleControl: analysis.weightControl?.muscleControl || null,

        // Advanced Metrics
        waistHipRatio: analysis.waistHipRatio || null,
        visceralFatLevel: analysis.visceralFatLevel || null,
        bmr: analysis.bmr || null,
        fatFreeMass: analysis.fatFreeMass || null,
        obesityDegree: analysis.obesityDegree || null,
        smi: analysis.smi || null,

        // Macros
        macroProtein: analysis.macros.protein,
        macroCarbs: analysis.macros.carbs,
        macroFat: analysis.macros.fat,

        // AI Analysis
        recommendations: analysis.recommendations,
        healthSummary: analysis.healthSummary || null,
        strengths: analysis.strengths ? JSON.stringify(analysis.strengths) : null,
        improvements: analysis.improvements ? JSON.stringify(analysis.improvements) : null,
        healthRisks: analysis.healthRisks ? JSON.stringify(analysis.healthRisks) : null,
        exercisePlan: analysis.exercisePlan || null,
        shortTermGoals: analysis.shortTermGoals ? JSON.stringify(analysis.shortTermGoals) : null,
        longTermGoals: analysis.longTermGoals ? JSON.stringify(analysis.longTermGoals) : null,
      },
    });

    // Keep only the latest MAX_INBODY_HISTORY items
    const count = await prisma.inBodyAnalysis.count();
    if (count > MAX_INBODY_HISTORY) {
      const toDelete = await prisma.inBodyAnalysis.findMany({
        orderBy: { uploadedAt: "asc" },
        take: count - MAX_INBODY_HISTORY,
        select: { id: true },
      });
      
      await prisma.inBodyAnalysis.deleteMany({
        where: {
          id: {
            in: toDelete.map((item) => item.id),
          },
        },
      });
    }

    return NextResponse.json(newAnalysis, { status: 201 });
  } catch (error) {
    console.error("Error creating InBody analysis:", error);
    return NextResponse.json(
      { error: "Failed to create InBody analysis" },
      { status: 500 }
    );
  }
}

// DELETE - ลบ InBody Analysis
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

    await prisma.inBodyAnalysis.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting InBody analysis:", error);
    return NextResponse.json(
      { error: "Failed to delete InBody analysis" },
      { status: 500 }
    );
  }
}
