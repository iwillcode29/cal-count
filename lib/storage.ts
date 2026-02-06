export interface NutritionInfo {
  protein: number;   // grams
  carbs: number;     // grams
  fat: number;       // grams
  fiber: number;     // grams
  sugar: number;     // grams
  sodium: number;    // mg
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  nutrition?: NutritionInfo;
  createdAt: string;
}

export interface DayData {
  entries: FoodEntry[];
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
    return { entries: [], goal: DEFAULT_GOAL };
  }
  const stored = localStorage.getItem(dayKey(date));
  const goal = getGoal();
  if (!stored) return { entries: [], goal };
  try {
    const parsed = JSON.parse(stored);
    return { entries: parsed.entries || [], goal };
  } catch {
    return { entries: [], goal };
  }
}

function saveDayEntries(date: string, entries: FoodEntry[]): void {
  localStorage.setItem(dayKey(date), JSON.stringify({ entries }));
}

export function addEntry(date: string, name: string, calories: number, nutrition?: NutritionInfo): FoodEntry {
  const data = getDayData(date);
  const entry: FoodEntry = {
    id: crypto.randomUUID(),
    name,
    calories,
    ...(nutrition && { nutrition }),
    createdAt: new Date().toISOString(),
  };
  data.entries.unshift(entry);
  saveDayEntries(date, data.entries);
  return entry;
}

export function deleteEntry(date: string, entryId: string): void {
  const data = getDayData(date);
  data.entries = data.entries.filter((e) => e.id !== entryId);
  saveDayEntries(date, data.entries);
}

export function getTotalCalories(entries: FoodEntry[]): number {
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
        if (parsed.entries && parsed.entries.length > 0) {
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
export interface InBodyAnalysis {
  id: string;
  uploadedAt: string;
  recommendedCalories: number;
  analysis: {
    weight: number;
    skeletalMuscleMass: number;
    bodyFatMass: number;
    bmi: number;
    inbodyScore: number;
    bodyWater: number;
    protein: number;
    minerals: number;
    bodyFatPercentage: number;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
    };
    recommendations: string;
  };
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
