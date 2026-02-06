"use client";

import { useState } from "react";
import type { FoodEntry, NutritionInfo, MealType } from "@/lib/storage";

interface EditFoodModalProps {
  entry: FoodEntry;
  currentMeal: MealType;
  onSave: (name: string, calories: number, meal: MealType, nutrition?: NutritionInfo) => void;
  onClose: () => void;
}

const mealLabels = {
  breakfast: "เช้า",
  lunch: "กลางวัน",
  dinner: "เย็น"
};

export default function EditFoodModal({ entry, currentMeal, onSave, onClose }: EditFoodModalProps) {
  const [name, setName] = useState(entry.name);
  const [calories, setCalories] = useState(entry.calories.toString());
  const [meal, setMeal] = useState<MealType>(currentMeal);
  const [error, setError] = useState("");
  
  // Nutrition states
  const [protein, setProtein] = useState(entry.nutrition?.protein?.toString() || "");
  const [carbs, setCarbs] = useState(entry.nutrition?.carbs?.toString() || "");
  const [fat, setFat] = useState(entry.nutrition?.fat?.toString() || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("กรุณาใส่ชื่ออาหาร");
      return;
    }
    
    const caloriesNum = parseInt(calories, 10);
    if (isNaN(caloriesNum) || caloriesNum < 0) {
      setError("กรุณาใส่แคลอรี่ที่ถูกต้อง");
      return;
    }
    
    // Build nutrition object if any nutrition values are provided
    let nutrition: NutritionInfo | undefined;
    if (protein || carbs || fat) {
      const proteinNum = parseFloat(protein) || 0;
      const carbsNum = parseFloat(carbs) || 0;
      const fatNum = parseFloat(fat) || 0;
      
      if (proteinNum < 0 || carbsNum < 0 || fatNum < 0) {
        setError("กรุณาใส่ค่าโภชนาการที่ถูกต้อง");
        return;
      }
      
      nutrition = {
        protein: proteinNum,
        carbs: carbsNum,
        fat: fatNum,
        fiber: entry.nutrition?.fiber ?? 0,
        sugar: entry.nutrition?.sugar ?? 0,
        sodium: entry.nutrition?.sodium ?? 0,
      };
    }
    
    onSave(name.trim(), caloriesNum, meal, nutrition);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl shadow-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-glass-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text">แก้ไขอาหาร</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-glass-hover transition-colors text-text-muted"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M5 5L15 15M5 15L15 5" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5">
          <div className="space-y-4">
            {/* Meal Select */}
            <div>
              <label className="block text-sm font-medium text-text-dim mb-2">
                มื้ออาหาร
              </label>
              <select
                value={meal}
                onChange={(e) => setMeal(e.target.value as MealType)}
                className="w-full px-4 py-3 bg-surface-lighter border border-glass-border rounded-xl text-sm text-text focus:outline-none focus:border-ember/40 focus:shadow-[0_0_0_3px_rgba(212,114,92,0.08)] transition-all"
              >
                <option value="breakfast">🌅 {mealLabels.breakfast}</option>
                <option value="lunch">☀️ {mealLabels.lunch}</option>
                <option value="dinner">🌙 {mealLabels.dinner}</option>
              </select>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-text-dim mb-2">
                ชื่ออาหาร
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                className="w-full px-4 py-3 bg-surface-lighter border border-glass-border rounded-xl text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-ember/40 focus:shadow-[0_0_0_3px_rgba(212,114,92,0.08)] transition-all"
                placeholder="ชื่ออาหาร"
              />
            </div>

            {/* Calories Input */}
            <div>
              <label className="block text-sm font-medium text-text-dim mb-2">
                แคลอรี่
              </label>
              <input
                type="number"
                value={calories}
                onChange={(e) => {
                  setCalories(e.target.value);
                  if (error) setError("");
                }}
                className="w-full px-4 py-3 bg-surface-lighter border border-glass-border rounded-xl text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-ember/40 focus:shadow-[0_0_0_3px_rgba(212,114,92,0.08)] transition-all"
                placeholder="แคลอรี่"
                min="0"
              />
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-xs text-danger">{error}</p>
            )}

            {/* Nutrition Info (Editable) */}
            <div className="pt-3 border-t border-glass-border">
              <p className="text-xs text-text-muted mb-2">ข้อมูลโภชนาการ (ไม่บังคับ)</p>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">โปรตีน (g)</label>
                  <input
                    type="number"
                    value={protein}
                    onChange={(e) => {
                      setProtein(e.target.value);
                      if (error) setError("");
                    }}
                    className="w-full px-3 py-2 bg-surface-lighter border border-glass-border rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-ember/40 focus:shadow-[0_0_0_3px_rgba(212,114,92,0.08)] transition-all"
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">คาร์บ (g)</label>
                  <input
                    type="number"
                    value={carbs}
                    onChange={(e) => {
                      setCarbs(e.target.value);
                      if (error) setError("");
                    }}
                    className="w-full px-3 py-2 bg-surface-lighter border border-glass-border rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-ember/40 focus:shadow-[0_0_0_3px_rgba(212,114,92,0.08)] transition-all"
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">ไขมัน (g)</label>
                  <input
                    type="number"
                    value={fat}
                    onChange={(e) => {
                      setFat(e.target.value);
                      if (error) setError("");
                    }}
                    className="w-full px-3 py-2 bg-surface-lighter border border-glass-border rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-ember/40 focus:shadow-[0_0_0_3px_rgba(212,114,92,0.08)] transition-all"
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-glass-card hover:bg-glass-hover text-text rounded-xl font-medium transition-all"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-ember hover:bg-ember-dim text-white rounded-xl font-medium transition-all"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
