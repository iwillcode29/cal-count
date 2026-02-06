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

const GOAL_KEY = "calcount_goal";
const DEFAULT_GOAL = 2000;

function dayKey(date: string): string {
  return `calcount_${date}`;
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getToday(): string {
  return formatDate(new Date());
}

export function getGoal(): number {
  if (typeof window === "undefined") return DEFAULT_GOAL;
  const stored = localStorage.getItem(GOAL_KEY);
  return stored ? parseInt(stored, 10) : DEFAULT_GOAL;
}

export function setGoal(goal: number): void {
  localStorage.setItem(GOAL_KEY, String(goal));
}

export function getDayData(date: string): DayData {
  if (typeof window === "undefined") {
    return { 
      entries: [], 
      meals: { breakfast: [], lunch: [], dinner: [] },
      goal: DEFAULT_GOAL 
    };
  }
  const stored = localStorage.getItem(dayKey(date));
  const goal = getGoal();
  if (!stored) return { 
    entries: [], 
    meals: { breakfast: [], lunch: [], dinner: [] },
    goal 
  };
  try {
    const parsed = JSON.parse(stored);
    // Handle legacy data structure
    if (parsed.entries && !parsed.meals) {
      // Migrate old data: put all entries in lunch by default
      const meals: MealData = {
        breakfast: [],
        lunch: parsed.entries || [],
        dinner: []
      };
      return { entries: parsed.entries || [], meals, goal };
    }
    return { 
      entries: parsed.entries || [], 
      meals: parsed.meals || { breakfast: [], lunch: [], dinner: [] },
      goal 
    };
  } catch {
    return { 
      entries: [], 
      meals: { breakfast: [], lunch: [], dinner: [] },
      goal 
    };
  }
}

function saveDayData(date: string, meals: MealData): void {
  // Also maintain entries array for legacy compatibility
  const entries = [...meals.breakfast, ...meals.lunch, ...meals.dinner];
  localStorage.setItem(dayKey(date), JSON.stringify({ entries, meals }));
}

export function addEntry(date: string, name: string, calories: number, meal: MealType, nutrition?: NutritionInfo): FoodEntry {
  const data = getDayData(date);
  const entry: FoodEntry = {
    id: crypto.randomUUID(),
    name,
    calories,
    meal,
    ...(nutrition && { nutrition }),
    createdAt: new Date().toISOString(),
  };
  data.meals[meal].unshift(entry);
  saveDayData(date, data.meals);
  return entry;
}

export function deleteEntry(date: string, entryId: string, meal: MealType): void {
  const data = getDayData(date);
  data.meals[meal] = data.meals[meal].filter((e) => e.id !== entryId);
  saveDayData(date, data.meals);
}

export function updateEntry(
  date: string, 
  entryId: string, 
  currentMeal: MealType, 
  updates: { name?: string; calories?: number; nutrition?: NutritionInfo; newMeal?: MealType }
): { entry: FoodEntry; oldMeal: MealType; newMeal: MealType } | null {
  const data = getDayData(date);
  const entryIndex = data.meals[currentMeal].findIndex((e) => e.id === entryId);
  
  if (entryIndex === -1) return null;
  
  const entry = data.meals[currentMeal][entryIndex];
  const newMeal = updates.newMeal ?? currentMeal;
  
  const updatedEntry: FoodEntry = {
    ...entry,
    ...(updates.name !== undefined && { name: updates.name }),
    ...(updates.calories !== undefined && { calories: updates.calories }),
    ...(updates.nutrition !== undefined && { nutrition: updates.nutrition }),
    meal: newMeal,
  };
  
  // If meal changed, move entry to new meal
  if (newMeal !== currentMeal) {
    // Remove from current meal
    data.meals[currentMeal].splice(entryIndex, 1);
    // Add to new meal
    data.meals[newMeal].unshift(updatedEntry);
  } else {
    // Just update in place
    data.meals[currentMeal][entryIndex] = updatedEntry;
  }
  
  saveDayData(date, data.meals);
  
  return { entry: updatedEntry, oldMeal: currentMeal, newMeal };
}

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

export function getDaysWithData(limit = 30): string[] {
  if (typeof window === "undefined") return [];
  const days: string[] = [];
  const today = getToday();
  for (let i = 0; i < limit; i++) {
    const date = getDateOffset(today, -i);
    const stored = localStorage.getItem(dayKey(date));
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const hasData = parsed.meals 
          ? (parsed.meals.breakfast?.length > 0 || parsed.meals.lunch?.length > 0 || parsed.meals.dinner?.length > 0)
          : (parsed.entries && parsed.entries.length > 0);
        if (hasData) {
          days.push(date);
        }
      } catch {
        // skip invalid
      }
    }
  }
  return days;
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

const INBODY_KEY = "calcount_inbody_history";
const MAX_INBODY_HISTORY = 10;

export function getInBodyHistory(): InBodyAnalysis[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(INBODY_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveInBodyAnalysis(analysis: Omit<InBodyAnalysis, "id" | "uploadedAt">): InBodyAnalysis {
  const newAnalysis: InBodyAnalysis = {
    id: crypto.randomUUID(),
    uploadedAt: new Date().toISOString(),
    ...analysis,
  };

  const history = getInBodyHistory();
  history.unshift(newAnalysis);

  // Keep only the latest MAX_INBODY_HISTORY items
  const limited = history.slice(0, MAX_INBODY_HISTORY);
  localStorage.setItem(INBODY_KEY, JSON.stringify(limited));

  return newAnalysis;
}

export function deleteInBodyAnalysis(id: string): void {
  const history = getInBodyHistory();
  const filtered = history.filter((item) => item.id !== id);
  localStorage.setItem(INBODY_KEY, JSON.stringify(filtered));
}

// Macro Goals Storage
export interface MacroGoals {
  protein: number;  // grams
  carbs: number;    // grams
  fat: number;      // grams
}

const MACRO_GOALS_KEY = "calcount_macro_goals";
const DEFAULT_MACRO_GOALS: MacroGoals = {
  protein: 150,
  carbs: 250,
  fat: 65,
};

export function getMacroGoals(): MacroGoals {
  if (typeof window === "undefined") return DEFAULT_MACRO_GOALS;
  const stored = localStorage.getItem(MACRO_GOALS_KEY);
  if (!stored) return DEFAULT_MACRO_GOALS;
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_MACRO_GOALS;
  }
}

export function setMacroGoals(goals: MacroGoals): void {
  localStorage.setItem(MACRO_GOALS_KEY, JSON.stringify(goals));
}
