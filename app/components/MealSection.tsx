"use client";

import type { FoodEntry, MealType } from "@/lib/storage";
import FoodItem from "./FoodItem";
import { getMealCalories } from "@/lib/storage";

interface MealSectionProps {
  meal: MealType;
  entries: FoodEntry[];
  onDelete: (id: string, meal: MealType) => void;
  onEdit: (id: string, meal: MealType) => void;
  goal: number;
}

const mealConfig = {
  breakfast: {
    label: "มื้อเช้า",
    icon: "🌅",
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/20"
  },
  lunch: {
    label: "มื้อกลางวัน",
    icon: "☀️",
    color: "from-sky-500/10 to-blue-500/10 border-sky-500/20"
  },
  dinner: {
    label: "มื้อเย็น",
    icon: "🌙",
    color: "from-purple-500/10 to-indigo-500/10 border-purple-500/20"
  }
};

export default function MealSection({ meal, entries, onDelete, onEdit, goal }: MealSectionProps) {
  const config = mealConfig[meal];
  const mealCalories = getMealCalories(entries);

  return (
    <div className={`rounded-3xl border bg-gradient-to-br ${config.color} p-4 mb-4 lg:w-1/3`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{config.icon}</span>
          <h3 className="text-base font-semibold text-text">
            {config.label}
          </h3>
        </div>
        <div className="text-sm font-medium text-text-dim">
          <span className="font-number text-ember">{mealCalories}</span>
          <span className="text-text-muted ml-1">แคล</span>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-text-muted">
          <p className="text-xs">ยังไม่มีรายการอาหาร</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {entries.map((entry, index) => (
            <FoodItem 
              key={entry.id} 
              entry={entry} 
              onDelete={(id) => onDelete(id, meal)} 
              onEdit={(id) => onEdit(id, meal)}
              goal={goal} 
              index={index} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
