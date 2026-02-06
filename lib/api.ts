import {
  FoodEntry,
  NutritionInfo,
  MealType,
  InBodyAnalysis,
  MacroGoals,
} from "./storage";

// Food Entries API
export async function fetchFoodEntriesByDate(date: string): Promise<FoodEntry[]> {
  const response = await fetch(`/api/food-entries?date=${date}`);
  if (!response.ok) {
    throw new Error("Failed to fetch food entries");
  }
  return response.json();
}

export async function createFoodEntry(
  date: string,
  name: string,
  calories: number,
  meal: MealType,
  nutrition?: NutritionInfo
): Promise<FoodEntry> {
  const response = await fetch("/api/food-entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, name, calories, meal, nutrition }),
  });
  if (!response.ok) {
    throw new Error("Failed to create food entry");
  }
  return response.json();
}

export async function updateFoodEntry(
  id: string,
  updates: {
    name?: string;
    calories?: number;
    meal?: MealType;
    nutrition?: NutritionInfo;
  }
): Promise<FoodEntry> {
  const response = await fetch("/api/food-entries", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...updates }),
  });
  if (!response.ok) {
    throw new Error("Failed to update food entry");
  }
  return response.json();
}

export async function deleteFoodEntry(id: string): Promise<void> {
  const response = await fetch(`/api/food-entries?id=${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete food entry");
  }
}

// Settings API
export async function fetchSetting(key: string): Promise<string | null> {
  const response = await fetch(`/api/settings?key=${key}`);
  if (!response.ok) {
    throw new Error("Failed to fetch setting");
  }
  const data = await response.json();
  return data.value || null;
}

export async function saveSetting(key: string, value: string): Promise<void> {
  const response = await fetch("/api/settings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
  if (!response.ok) {
    throw new Error("Failed to save setting");
  }
}

// InBody API
export async function fetchInBodyHistory(): Promise<InBodyAnalysis[]> {
  const response = await fetch("/api/inbody");
  if (!response.ok) {
    throw new Error("Failed to fetch InBody history");
  }
  const data = await response.json();
  
  // Parse JSON strings back to arrays
  return data.map((item: any) => ({
    ...item,
    analysis: {
      ...item,
      strengths: item.strengths ? JSON.parse(item.strengths) : undefined,
      improvements: item.improvements ? JSON.parse(item.improvements) : undefined,
      healthRisks: item.healthRisks ? JSON.parse(item.healthRisks) : undefined,
      shortTermGoals: item.shortTermGoals ? JSON.parse(item.shortTermGoals) : undefined,
      longTermGoals: item.longTermGoals ? JSON.parse(item.longTermGoals) : undefined,
      macros: {
        protein: item.macroProtein,
        carbs: item.macroCarbs,
        fat: item.macroFat,
      },
      muscleFatAnalysis: item.weightValue ? {
        weight: { value: item.weightValue, rating: item.weightRating as any },
        smm: { value: item.smmValue, rating: item.smmRating as any },
        bodyFat: { value: item.bodyFatValue, rating: item.bodyFatRating as any },
      } : undefined,
      segmentalLean: item.segLeanRightArmMass ? {
        rightArm: { mass: item.segLeanRightArmMass, percent: item.segLeanRightArmPct, rating: item.segLeanRightArmRate as any },
        leftArm: { mass: item.segLeanLeftArmMass, percent: item.segLeanLeftArmPct, rating: item.segLeanLeftArmRate as any },
        trunk: { mass: item.segLeanTrunkMass, percent: item.segLeanTrunkPct, rating: item.segLeanTrunkRate as any },
        rightLeg: { mass: item.segLeanRightLegMass, percent: item.segLeanRightLegPct, rating: item.segLeanRightLegRate as any },
        leftLeg: { mass: item.segLeanLeftLegMass, percent: item.segLeanLeftLegPct, rating: item.segLeanLeftLegRate as any },
      } : undefined,
      segmentalFat: item.segFatRightArmMass ? {
        rightArm: { mass: item.segFatRightArmMass, percent: item.segFatRightArmPct, rating: item.segFatRightArmRate as any },
        leftArm: { mass: item.segFatLeftArmMass, percent: item.segFatLeftArmPct, rating: item.segFatLeftArmRate as any },
        trunk: { mass: item.segFatTrunkMass, percent: item.segFatTrunkPct, rating: item.segFatTrunkRate as any },
        rightLeg: { mass: item.segFatRightLegMass, percent: item.segFatRightLegPct, rating: item.segFatRightLegRate as any },
        leftLeg: { mass: item.segFatLeftLegMass, percent: item.segFatLeftLegPct, rating: item.segFatLeftLegRate as any },
      } : undefined,
      weightControl: item.targetWeight ? {
        targetWeight: item.targetWeight,
        weightControl: item.weightControl,
        fatControl: item.fatControl,
        muscleControl: item.muscleControl,
      } : undefined,
    },
  }));
}

export async function createInBodyAnalysis(
  analysis: Omit<InBodyAnalysis, "id" | "uploadedAt">
): Promise<InBodyAnalysis> {
  const response = await fetch("/api/inbody", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(analysis),
  });
  if (!response.ok) {
    throw new Error("Failed to create InBody analysis");
  }
  const data = await response.json();
  
  // Parse JSON strings back to arrays
  return {
    ...data,
    analysis: {
      ...data,
      strengths: data.strengths ? JSON.parse(data.strengths) : undefined,
      improvements: data.improvements ? JSON.parse(data.improvements) : undefined,
      healthRisks: data.healthRisks ? JSON.parse(data.healthRisks) : undefined,
      shortTermGoals: data.shortTermGoals ? JSON.parse(data.shortTermGoals) : undefined,
      longTermGoals: data.longTermGoals ? JSON.parse(data.longTermGoals) : undefined,
      macros: {
        protein: data.macroProtein,
        carbs: data.macroCarbs,
        fat: data.macroFat,
      },
    },
  };
}

export async function deleteInBodyAnalysis(id: string): Promise<void> {
  const response = await fetch(`/api/inbody?id=${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete InBody analysis");
  }
}

// History API
export async function fetchHistoryDates(limit = 30): Promise<string[]> {
  const response = await fetch(`/api/history?limit=${limit}`);
  if (!response.ok) {
    throw new Error("Failed to fetch history dates");
  }
  return response.json();
}
