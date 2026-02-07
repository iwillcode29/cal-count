"use client";

import { useState, useRef, useEffect } from "react";
import type { MacroGoals, InBodyAnalysis } from "@/lib/storage";
import InBodyUpload from "./InBodyUpload";
import InBodyHistory from "./InBodyHistory";

interface MacroGoalsSetterProps {
  currentGoals: MacroGoals;
  currentCalorieGoal: number;
  onSave: (goals: MacroGoals, calorieGoal: number) => void;
  onClose: () => void;
}

const PRESETS = [
  {
    name: "เพิ่มกล้ามเนื้อ",
    description: "โปรตีนสูง สำหรับเล่นกล้าม",
    goals: { protein: 150, carbs: 250, fat: 65 },
  },
  {
    name: "ลดน้ำหนัก",
    description: "คาร์บต่ำ ไขมันปานกลาง",
    goals: { protein: 120, carbs: 150, fat: 50 },
  },
  {
    name: "สมดุล",
    description: "สัดส่วนสมดุลทั่วไป",
    goals: { protein: 100, carbs: 225, fat: 60 },
  },
  {
    name: "Keto",
    description: "คาร์บต่ำมาก ไขมันสูง",
    goals: { protein: 100, carbs: 50, fat: 150 },
  },
];

export default function MacroGoalsSetter({ currentGoals, currentCalorieGoal, onSave, onClose }: MacroGoalsSetterProps) {
  const [protein, setProtein] = useState(String(currentGoals.protein));
  const [carbs, setCarbs] = useState(String(currentGoals.carbs));
  const [fat, setFat] = useState(String(currentGoals.fat));
  const [calorieGoal, setCalorieGoal] = useState(String(currentCalorieGoal));
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [showInBodyUpload, setShowInBodyUpload] = useState(false);
  const [showInBodyHistory, setShowInBodyHistory] = useState(false);
  const calorieRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!showInBodyUpload && !showInBodyHistory) {
      calorieRef.current?.select();
    }
  }, [showInBodyUpload, showInBodyHistory]);

  const handlePresetSelect = (preset: typeof PRESETS[0]) => {
    setProtein(String(preset.goals.protein));
    setCarbs(String(preset.goals.carbs));
    setFat(String(preset.goals.fat));
    setSelectedPreset(preset.name);
    const estimatedCalories = preset.goals.protein * 4 + preset.goals.carbs * 4 + preset.goals.fat * 9;
    setCalorieGoal(String(estimatedCalories));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proteinNum = parseInt(protein, 10);
    const carbsNum = parseInt(carbs, 10);
    const fatNum = parseInt(fat, 10);
    const calorieNum = parseInt(calorieGoal, 10);

    if (proteinNum > 0 && carbsNum > 0 && fatNum > 0 && calorieNum > 0) {
      onSave(
        { protein: proteinNum, carbs: carbsNum, fat: fatNum },
        calorieNum,
      );
    }
  };

  const handleInBodyAnalysis = (calories: number) => {
    setCalorieGoal(String(calories));
    setShowInBodyUpload(false);
  };

  const handleHistoryApply = (calories: number, _analysis: InBodyAnalysis) => {
    setCalorieGoal(String(calories));
    setShowInBodyHistory(false);
  };

  const totalCalories = (
    parseInt(protein || "0") * 4 +
    parseInt(carbs || "0") * 4 +
    parseInt(fat || "0") * 9
  );

  if (showInBodyUpload) {
    return (
      <InBodyUpload
        onAnalysisComplete={handleInBodyAnalysis}
        onClose={() => setShowInBodyUpload(false)}
      />
    );
  }

  if (showInBodyHistory) {
    return (
      <InBodyHistory
        onClose={() => setShowInBodyHistory(false)}
        onApplyAnalysis={handleHistoryApply}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-charcoal/30 backdrop-blur-sm" />
      <div
        className="relative bg-midnight rounded-2xl p-6 w-full max-w-md shadow-lg animate-fade-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-charcoal">ตั้งเป้าหมาย</h3>
            <p className="text-xs text-charcoal-light mt-1">แคลอรี่และโภชนาการต่อวัน</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-charcoal/10 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        {/* Calorie Goal */}
        <div className="mb-5">
          <label className="text-xs text-charcoal-light mb-1.5 block font-medium">
            เป้าหมายแคลอรี่ต่อวัน
          </label>
          <div className="flex items-center gap-2">
            <input
              ref={calorieRef}
              type="number"
              value={calorieGoal}
              onChange={(e) => setCalorieGoal(e.target.value)}
              inputMode="numeric"
              className="flex-1 px-4 py-2.5 bg-white rounded-xl text-sm font-number text-center focus:outline-none focus:ring-2 focus:ring-forest/30 shadow-sm border border-charcoal/10"
            />
            <span className="text-xs text-charcoal-light w-8">แคล</span>
          </div>
        </div>

        {/* InBody Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setShowInBodyUpload(true)}
            className="flex-1 py-2 px-3 bg-ember/10 text-ember border border-ember/20 rounded-xl text-xs font-medium hover:bg-ember/20 transition-all flex items-center justify-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2M11 5l-3-3m0 0L5 5m3-3v9" />
            </svg>
            อัพโหลด InBody
          </button>
          <button
            type="button"
            onClick={() => setShowInBodyHistory(true)}
            className="flex-1 py-2 px-3 bg-surface-light text-text-dim border border-glass-border rounded-xl text-xs font-medium hover:bg-surface-lighter hover:text-text transition-all flex items-center justify-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M8 14A6 6 0 108 2a6 6 0 000 12z" />
              <path d="M8 4v4l2 2" />
            </svg>
            ประวัติ InBody
          </button>
        </div>

        <div className="border-t border-charcoal/10 pt-5 mb-4">
          <p className="text-xs text-charcoal-light font-medium mb-3">เป้าหมายโภชนาการ (กรัมต่อวัน)</p>
        </div>

        {/* Presets */}
        <div className="mb-6">
          <p className="text-xs text-charcoal-light mb-3 font-medium">เลือกแบบสำเร็จ:</p>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className={`p-3 rounded-xl text-left transition-all border-2 ${
                  selectedPreset === preset.name
                    ? "bg-forest/10 border-forest"
                    : "bg-white border-charcoal/10 hover:border-forest/30"
                }`}
              >
                <div className="text-xs font-semibold text-charcoal mb-1">
                  {preset.name}
                </div>
                <div className="text-[10px] text-charcoal-light leading-tight">
                  {preset.description}
                </div>
                <div className="text-[9px] text-charcoal-light mt-2 font-number">
                  P:{preset.goals.protein} C:{preset.goals.carbs} F:{preset.goals.fat}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom input */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-charcoal-light mb-1.5 block font-medium">
              โปรตีน (Protein)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={protein}
                onChange={(e) => {
                  setProtein(e.target.value);
                  setSelectedPreset(null);
                }}
                inputMode="numeric"
                className="flex-1 px-4 py-2.5 bg-white rounded-xl text-sm font-number text-center focus:outline-none focus:ring-2 focus:ring-forest/30 shadow-sm border border-charcoal/10"
              />
              <span className="text-xs text-charcoal-light w-8">กรัม</span>
            </div>
          </div>

          <div>
            <label className="text-xs text-charcoal-light mb-1.5 block font-medium">
              คาร์โบไฮเดรต (Carbs)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={carbs}
                onChange={(e) => {
                  setCarbs(e.target.value);
                  setSelectedPreset(null);
                }}
                inputMode="numeric"
                className="flex-1 px-4 py-2.5 bg-white rounded-xl text-sm font-number text-center focus:outline-none focus:ring-2 focus:ring-forest/30 shadow-sm border border-charcoal/10"
              />
              <span className="text-xs text-charcoal-light w-8">กรัม</span>
            </div>
          </div>

          <div>
            <label className="text-xs text-charcoal-light mb-1.5 block font-medium">
              ไขมัน (Fat)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={fat}
                onChange={(e) => {
                  setFat(e.target.value);
                  setSelectedPreset(null);
                }}
                inputMode="numeric"
                className="flex-1 px-4 py-2.5 bg-white rounded-xl text-sm font-number text-center focus:outline-none focus:ring-2 focus:ring-forest/30 shadow-sm border border-charcoal/10"
              />
              <span className="text-xs text-charcoal-light w-8">กรัม</span>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-forest/5 rounded-xl p-3 border border-forest/20">
            <div className="text-xs text-charcoal-light mb-1">แคลอรี่จากโภชนาการ</div>
            <div className="text-2xl font-bold text-forest font-number">
              {totalCalories.toLocaleString()}
            </div>
            <div className="text-[10px] text-charcoal-light mt-1">
              แคล/วัน จากโภชนาการที่ตั้งไว้
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-forest text-white rounded-xl text-sm font-medium hover:bg-forest-dark transition-colors active:scale-95"
          >
            บันทึก
          </button>
        </form>
      </div>
    </div>
  );
}
