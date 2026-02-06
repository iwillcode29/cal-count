"use client";

import { useState, useRef, useEffect } from "react";
import type { MacroGoals } from "@/lib/storage";

interface MacroGoalsSetterProps {
  currentGoals: MacroGoals;
  onSave: (goals: MacroGoals) => void;
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

export default function MacroGoalsSetter({ currentGoals, onSave, onClose }: MacroGoalsSetterProps) {
  const [protein, setProtein] = useState(String(currentGoals.protein));
  const [carbs, setCarbs] = useState(String(currentGoals.carbs));
  const [fat, setFat] = useState(String(currentGoals.fat));
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const proteinRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    proteinRef.current?.focus();
  }, []);

  const handlePresetSelect = (preset: typeof PRESETS[0]) => {
    setProtein(String(preset.goals.protein));
    setCarbs(String(preset.goals.carbs));
    setFat(String(preset.goals.fat));
    setSelectedPreset(preset.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const proteinNum = parseInt(protein, 10);
    const carbsNum = parseInt(carbs, 10);
    const fatNum = parseInt(fat, 10);

    if (proteinNum > 0 && carbsNum > 0 && fatNum > 0) {
      onSave({
        protein: proteinNum,
        carbs: carbsNum,
        fat: fatNum,
      });
    }
  };

  const totalCalories = (
    parseInt(protein || "0") * 4 +
    parseInt(carbs || "0") * 4 +
    parseInt(fat || "0") * 9
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-charcoal/30 backdrop-blur-sm" />
      <div
        className="relative bg-midnight rounded-2xl p-6 w-full max-w-md shadow-lg animate-fade-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-charcoal">เป้าหมายโภชนาการ</h3>
            <p className="text-xs text-charcoal-light mt-1">กรัมต่อวันที่ต้องการ</p>
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
                ref={proteinRef}
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
            <div className="text-xs text-charcoal-light mb-1">แคลอรี่โดยประมาณ</div>
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
