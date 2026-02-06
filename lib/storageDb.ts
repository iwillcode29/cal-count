// Database-backed storage using Prisma via API routes
// This file replaces localStorage with database persistence

export interface NutritionInfo {
  protein: number;   // grams
  carbs: number;     // grams
  fat: number;       // grams
  fiber: number;     // grams
  sugar: number;     // grams
  sodium: number;    // mg
}

export type MealType = "breakfast" | "lunch" | "dinner";

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  nutrition?: NutritionInfo;
  createdAt: string;
  meal: MealType;
}

export interface MealData {
  breakfast: FoodEntry[];
  lunch: FoodEntry[];
  dinner: FoodEntry[];
}

export interface DayData {
  entries: FoodEntry[]; // Legacy support
  meals: MealData;
  goal: number;
}

const DEFAULT_GOAL = 2000;

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getToday(): string {
  return formatDate(new Date());
}

// Goal Management (async)
export async function getGoal(): Promise<number> {
  try {
    const response = await fetch("/api/settings?key=goal");
    if (!response.ok) return DEFAULT_GOAL;
    const data = await response.json();
    return data.value ? parseInt(data.value, 10) : DEFAULT_GOAL;
  } catch (error) {
    console.error("Error fetching goal:", error);
    return DEFAULT_GOAL;
  }
}

export async function setGoal(goal: number): Promise<void> {
  try {
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "goal", value: String(goal) }),
    });
  } catch (error) {
    console.error("Error saving goal:", error);
  }
}

// Day Data Management (async)
export async function getDayData(date: string): Promise<DayData> {
  try {
    const [entriesRes, goalValue] = await Promise.all([
      fetch(`/api/food-entries?date=${date}`),
      getGoal(),
    ]);

    if (!entriesRes.ok) {
      return {
        entries: [],
        meals: { breakfast: [], lunch: [], dinner: [] },
        goal: goalValue,
      };
    }

    const entries: FoodEntry[] = await entriesRes.json();
    
    // Convert database entries to FoodEntry format with nutrition
    const formattedEntries = entries.map((entry: any) => ({
      id: entry.id,
      name: entry.name,
      calories: entry.calories,
      meal: entry.meal as MealType,
      createdAt: entry.createdAt,
      ...(entry.protein !== null && {
        nutrition: {
          protein: entry.protein,
          carbs: entry.carbs,
          fat: entry.fat,
          fiber: entry.fiber,
          sugar: entry.sugar,
          sodium: entry.sodium,
        },
      }),
    }));

    // Organize by meal
    const meals: MealData = {
      breakfast: formattedEntries.filter((e) => e.meal === "breakfast"),
      lunch: formattedEntries.filter((e) => e.meal === "lunch"),
      dinner: formattedEntries.filter((e) => e.meal === "dinner"),
    };

    return {
      entries: formattedEntries,
      meals,
      goal: goalValue,
    };
  } catch (error) {
    console.error("Error fetching day data:", error);
    const goalValue = await getGoal();
    return {
      entries: [],
      meals: { breakfast: [], lunch: [], dinner: [] },
      goal: goalValue,
    };
  }
}

export async function addEntry(
  date: string,
  name: string,
  calories: number,
  meal: MealType,
  nutrition?: NutritionInfo
): Promise<FoodEntry> {
  try {
    const response = await fetch("/api/food-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, name, calories, meal, nutrition }),
    });

    if (!response.ok) {
      throw new Error("Failed to add entry");
    }

    const entry = await response.json();
    
    return {
      id: entry.id,
      name: entry.name,
      calories: entry.calories,
      meal: entry.meal,
      createdAt: entry.createdAt,
      ...(entry.protein !== null && {
        nutrition: {
          protein: entry.protein,
          carbs: entry.carbs,
          fat: entry.fat,
          fiber: entry.fiber,
          sugar: entry.sugar,
          sodium: entry.sodium,
        },
      }),
    };
  } catch (error) {
    console.error("Error adding entry:", error);
    throw error;
  }
}

export async function deleteEntry(date: string, entryId: string, meal: MealType): Promise<void> {
  try {
    const response = await fetch(`/api/food-entries?id=${entryId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete entry");
    }
  } catch (error) {
    console.error("Error deleting entry:", error);
    throw error;
  }
}

export async function updateEntry(
  date: string,
  entryId: string,
  currentMeal: MealType,
  updates: { name?: string; calories?: number; nutrition?: NutritionInfo; newMeal?: MealType }
): Promise<{ entry: FoodEntry; oldMeal: MealType; newMeal: MealType } | null> {
  try {
    const response = await fetch("/api/food-entries", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: entryId,
        name: updates.name,
        calories: updates.calories,
        meal: updates.newMeal || currentMeal,
        nutrition: updates.nutrition,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update entry");
    }

    const entry = await response.json();
    const newMeal = updates.newMeal || currentMeal;

    return {
      entry: {
        id: entry.id,
        name: entry.name,
        calories: entry.calories,
        meal: entry.meal,
        createdAt: entry.createdAt,
        ...(entry.protein !== null && {
          nutrition: {
            protein: entry.protein,
            carbs: entry.carbs,
            fat: entry.fat,
            fiber: entry.fiber,
            sugar: entry.sugar,
            sodium: entry.sodium,
          },
        }),
      },
      oldMeal: currentMeal,
      newMeal,
    };
  } catch (error) {
    console.error("Error updating entry:", error);
    return null;
  }
}

// Helper functions (keep synchronous)
export function getAllEntries(meals: MealData): FoodEntry[] {
  return [...meals.breakfast, ...meals.lunch, ...meals.dinner];
}

export function getTotalCalories(entries: FoodEntry[]): number {
  return entries.reduce((sum, e) => sum + e.calories, 0);
}

export function getMealCalories(entries: FoodEntry[]): number {
  return entries.reduce((sum, e) => sum + e.calories, 0);
}

export function getTotalNutrition(entries: FoodEntry[]): NutritionInfo | null {
  const withNutrition = entries.filter((e) => e.nutrition);
  if (withNutrition.length === 0) return null;
  return {
    protein: withNutrition.reduce((s, e) => s + (e.nutrition?.protein ?? 0), 0),
    carbs: withNutrition.reduce((s, e) => s + (e.nutrition?.carbs ?? 0), 0),
    fat: withNutrition.reduce((s, e) => s + (e.nutrition?.fat ?? 0), 0),
    fiber: withNutrition.reduce((s, e) => s + (e.nutrition?.fiber ?? 0), 0),
    sugar: withNutrition.reduce((s, e) => s + (e.nutrition?.sugar ?? 0), 0),
    sodium: withNutrition.reduce((s, e) => s + (e.nutrition?.sodium ?? 0), 0),
  };
}

export function getDateOffset(date: string, offset: number): string {
  const d = new Date(date + "T00:00:00");
  d.setDate(d.getDate() + offset);
  return formatDate(d);
}

export function formatThaiDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const today = getToday();
  const yesterday = getDateOffset(today, -1);

  if (dateStr === today) return "วันนี้";
  if (dateStr === yesterday) return "เมื่อวาน";

  const thaiMonths = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
  ];
  return `${d.getDate()} ${thaiMonths[d.getMonth()]}`;
}

export async function getDaysWithData(limit = 30): Promise<string[]> {
  try {
    const response = await fetch(`/api/history?limit=${limit}`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Error fetching days with data:", error);
    return [];
  }
}

// InBody Analysis Storage
export interface SegmentRating {
  mass: number;
  percent: number;
  rating: "under" | "normal" | "over";
}

export interface MuscleFatItem {
  value: number;
  rating: "under" | "normal" | "over";
}

export interface InBodyAnalysisData {
  // Basic
  testDate?: string | null;
  height?: number | null;
  age?: number | null;
  gender?: "male" | "female" | null;
  weight: number;
  skeletalMuscleMass: number;
  bodyFatMass: number;
  bmi: number;
  inbodyScore: number;
  bodyWater: number;
  protein: number;
  minerals: number;
  bodyFatPercentage: number;

  // Muscle-Fat Analysis
  muscleFatAnalysis?: {
    weight: MuscleFatItem;
    smm: MuscleFatItem;
    bodyFat: MuscleFatItem;
  };

  // Segmental Analysis
  segmentalLean?: {
    rightArm: SegmentRating;
    leftArm: SegmentRating;
    trunk: SegmentRating;
    rightLeg: SegmentRating;
    leftLeg: SegmentRating;
  };
  segmentalFat?: {
    rightArm: SegmentRating;
    leftArm: SegmentRating;
    trunk: SegmentRating;
    rightLeg: SegmentRating;
    leftLeg: SegmentRating;
  };

  // Weight Control
  weightControl?: {
    targetWeight: number;
    weightControl: number;
    fatControl: number;
    muscleControl: number;
  };

  // Advanced metrics
  waistHipRatio?: number | null;
  visceralFatLevel?: number | null;
  bmr?: number | null;
  fatFreeMass?: number | null;
  obesityDegree?: number | null;
  smi?: number | null;

  // Macros
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };

  // AI Analysis (Thai)
  recommendations: string;
  healthSummary?: string;
  strengths?: string[];
  improvements?: string[];
  healthRisks?: string[];
  exercisePlan?: string;
  shortTermGoals?: string[];
  longTermGoals?: string[];
}

export interface InBodyAnalysis {
  id: string;
  uploadedAt: string;
  recommendedCalories: number;
  analysis: InBodyAnalysisData;
}

export async function getInBodyHistory(): Promise<InBodyAnalysis[]> {
  try {
    const response = await fetch("/api/inbody");
    if (!response.ok) return [];
    const data = await response.json();

    // Parse JSON strings back to arrays and reconstruct nested objects
    return data.map((item: any) => ({
      id: item.id,
      uploadedAt: item.uploadedAt,
      recommendedCalories: item.recommendedCalories,
      analysis: {
        testDate: item.testDate,
        height: item.height,
        age: item.age,
        gender: item.gender,
        weight: item.weight,
        skeletalMuscleMass: item.skeletalMuscleMass,
        bodyFatMass: item.bodyFatMass,
        bmi: item.bmi,
        inbodyScore: item.inbodyScore,
        bodyWater: item.bodyWater,
        protein: item.protein,
        minerals: item.minerals,
        bodyFatPercentage: item.bodyFatPercentage,
        waistHipRatio: item.waistHipRatio,
        visceralFatLevel: item.visceralFatLevel,
        bmr: item.bmr,
        fatFreeMass: item.fatFreeMass,
        obesityDegree: item.obesityDegree,
        smi: item.smi,
        macros: {
          protein: item.macroProtein,
          carbs: item.macroCarbs,
          fat: item.macroFat,
        },
        recommendations: item.recommendations,
        healthSummary: item.healthSummary,
        strengths: item.strengths ? JSON.parse(item.strengths) : undefined,
        improvements: item.improvements ? JSON.parse(item.improvements) : undefined,
        healthRisks: item.healthRisks ? JSON.parse(item.healthRisks) : undefined,
        exercisePlan: item.exercisePlan,
        shortTermGoals: item.shortTermGoals ? JSON.parse(item.shortTermGoals) : undefined,
        longTermGoals: item.longTermGoals ? JSON.parse(item.longTermGoals) : undefined,
        muscleFatAnalysis: item.weightValue ? {
          weight: { value: item.weightValue, rating: item.weightRating },
          smm: { value: item.smmValue, rating: item.smmRating },
          bodyFat: { value: item.bodyFatValue, rating: item.bodyFatRating },
        } : undefined,
        segmentalLean: item.segLeanRightArmMass ? {
          rightArm: { mass: item.segLeanRightArmMass, percent: item.segLeanRightArmPct, rating: item.segLeanRightArmRate },
          leftArm: { mass: item.segLeanLeftArmMass, percent: item.segLeanLeftArmPct, rating: item.segLeanLeftArmRate },
          trunk: { mass: item.segLeanTrunkMass, percent: item.segLeanTrunkPct, rating: item.segLeanTrunkRate },
          rightLeg: { mass: item.segLeanRightLegMass, percent: item.segLeanRightLegPct, rating: item.segLeanRightLegRate },
          leftLeg: { mass: item.segLeanLeftLegMass, percent: item.segLeanLeftLegPct, rating: item.segLeanLeftLegRate },
        } : undefined,
        segmentalFat: item.segFatRightArmMass ? {
          rightArm: { mass: item.segFatRightArmMass, percent: item.segFatRightArmPct, rating: item.segFatRightArmRate },
          leftArm: { mass: item.segFatLeftArmMass, percent: item.segFatLeftArmPct, rating: item.segFatLeftArmRate },
          trunk: { mass: item.segFatTrunkMass, percent: item.segFatTrunkPct, rating: item.segFatTrunkRate },
          rightLeg: { mass: item.segFatRightLegMass, percent: item.segFatRightLegPct, rating: item.segFatRightLegRate },
          leftLeg: { mass: item.segFatLeftLegMass, percent: item.segFatLeftLegPct, rating: item.segFatLeftLegRate },
        } : undefined,
        weightControl: item.targetWeight ? {
          targetWeight: item.targetWeight,
          weightControl: item.weightControl,
          fatControl: item.fatControl,
          muscleControl: item.muscleControl,
        } : undefined,
      },
    }));
  } catch (error) {
    console.error("Error fetching InBody history:", error);
    return [];
  }
}

export async function saveInBodyAnalysis(
  analysis: Omit<InBodyAnalysis, "id" | "uploadedAt">
): Promise<InBodyAnalysis> {
  try {
    const response = await fetch("/api/inbody", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(analysis),
    });

    if (!response.ok) {
      throw new Error("Failed to save InBody analysis");
    }

    const data = await response.json();

    return {
      id: data.id,
      uploadedAt: data.uploadedAt,
      recommendedCalories: data.recommendedCalories,
      analysis: {
        ...analysis.analysis,
        macros: {
          protein: data.macroProtein,
          carbs: data.macroCarbs,
          fat: data.macroFat,
        },
      },
    };
  } catch (error) {
    console.error("Error saving InBody analysis:", error);
    throw error;
  }
}

export async function deleteInBodyAnalysis(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/inbody?id=${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete InBody analysis");
    }
  } catch (error) {
    console.error("Error deleting InBody analysis:", error);
    throw error;
  }
}

// Macro Goals Storage
export interface MacroGoals {
  protein: number;  // grams
  carbs: number;    // grams
  fat: number;      // grams
}

const DEFAULT_MACRO_GOALS: MacroGoals = {
  protein: 150,
  carbs: 250,
  fat: 65,
};

export async function getMacroGoals(): Promise<MacroGoals> {
  try {
    const response = await fetch("/api/settings?key=macro_goals");
    if (!response.ok) return DEFAULT_MACRO_GOALS;
    const data = await response.json();
    if (!data.value) return DEFAULT_MACRO_GOALS;
    return JSON.parse(data.value);
  } catch (error) {
    console.error("Error fetching macro goals:", error);
    return DEFAULT_MACRO_GOALS;
  }
}

export async function setMacroGoals(goals: MacroGoals): Promise<void> {
  try {
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "macro_goals", value: JSON.stringify(goals) }),
    });
  } catch (error) {
    console.error("Error saving macro goals:", error);
  }
}
