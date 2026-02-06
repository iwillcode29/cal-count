"use client";

import { useState } from "react";
import type { NutritionInfo, MacroGoals } from "@/lib/storage";

interface NutritionDashboardProps {
  nutrition: NutritionInfo;
  goals: MacroGoals;
  onGoalsClick: () => void;
}

interface MacroData {
  key: keyof MacroGoals;
  label: string;
  color: string;
  bg: string;
}

const MACROS: MacroData[] = [
  { key: "protein", label: "โปรตีน", color: "#4CAF82", bg: "rgba(76,175,130,0.15)" },
  { key: "carbs", label: "คาร์บ", color: "#D4725C", bg: "rgba(212,114,92,0.15)" },
  { key: "fat", label: "ไขมัน", color: "#D4A843", bg: "rgba(212,168,67,0.15)" },
];

export default function NutritionDashboard({ nutrition, goals, onGoalsClick }: NutritionDashboardProps) {
  const [expanded, setExpanded] = useState(false);

  const macroTotals = {
    protein: Math.round(nutrition.protein),
    carbs: Math.round(nutrition.carbs),
    fat: Math.round(nutrition.fat),
  };

  const totalMacroCalories = 
    macroTotals.protein * 4 + 
    macroTotals.carbs * 4 + 
    macroTotals.fat * 9;

  const macroPercentages = {
    protein: totalMacroCalories > 0 ? (macroTotals.protein * 4 / totalMacroCalories) * 100 : 33,
    carbs: totalMacroCalories > 0 ? (macroTotals.carbs * 4 / totalMacroCalories) * 100 : 33,
    fat: totalMacroCalories > 0 ? (macroTotals.fat * 9 / totalMacroCalories) * 100 : 34,
  };

  const getStatusIcon = (current: number, goal: number) => {
    const pct = (current / goal) * 100;
    if (pct >= 100) return "✅";
    if (pct >= 80) return "👍";
    if (pct >= 50) return "⏳";
    return "⚠️";
  };

  const getStatusColor = (current: number, goal: number) => {
    const pct = (current / goal) * 100;
    if (pct >= 110) return { text: "#C75B7A", bg: "rgba(199,91,122,0.08)" }; // Over - red
    if (pct >= 100) return { text: "#4CAF82", bg: "rgba(76,175,130,0.08)" }; // Perfect - green
    if (pct >= 80) return { text: "#D4A843", bg: "rgba(212,168,67,0.08)" }; // Close - yellow
    return { text: "#D4725C", bg: "rgba(212,114,92,0.08)" }; // Low - orange
  };

  return (
    <div className="w-full mx-auto mt- mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-text-muted">
          โภชนาการวันนี้
        </h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[10px] text-ember hover:text-ember-dim transition-colors font-medium tracking-wide"
        >
          {expanded ? "ซ่อน" : "ดูเพิ่ม"}
        </button>
      </div>

      {/* Macro Pie Chart / Balance */}
      <div className="glass-card rounded-2xl p-5 mb-3">
        {/* Visual balance bar */}
        <div className="h-3 rounded-full overflow-hidden flex mb-4">
          {MACROS.map(({ key, color }) => (
            <div
              key={key}
              className="transition-all duration-500"
              style={{
                width: `${macroPercentages[key]}%`,
                backgroundColor: color,
              }}
            />
          ))}
        </div>

        {/* Macro cards grid */}
        <div className="grid grid-cols-3 gap-3">
          {MACROS.map(({ key, label, color, bg }) => {
            const current = macroTotals[key];
            const goal = goals[key];
            const percentage = goal > 0 ? Math.round((current / goal) * 100) : 0;
            const isOver = current > goal;
            const statusIcon = getStatusIcon(current, goal);
            const statusColor = getStatusColor(current, goal);

            return (
              <div
                key={key}
                className="rounded-xl p-3 transition-all relative overflow-hidden"
                style={{ backgroundColor: bg }}
              >
                {/* Status indicator */}
                {isOver && (
                  <div
                    className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none"
                    style={{ backgroundColor: statusColor.text }}
                  />
                )}
                
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[10px] text-text-dim font-medium">
                    {label}
                  </div>
                  <span className="text-xs">{statusIcon}</span>
                </div>
                
                <div className="flex items-baseline gap-1 mb-1">
                  <span
                    className="text-xl font-bold font-number"
                    style={{ color }}
                  >
                    {current}
                  </span>
                  <span className="text-[10px] text-text-muted">g</span>
                </div>
                
                <div className="text-[10px] text-text-dim">
                  จาก {goal}g
                </div>
                
                <div className="mt-2 h-1 bg-white/40 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: isOver ? statusColor.text : color,
                    }}
                  />
                </div>
                
                <div 
                  className="text-[9px] mt-1.5 font-number font-medium"
                  style={{ color: statusColor.text }}
                >
                  {percentage}%
                  {isOver && <span className="ml-1">เกิน!</span>}
                  {percentage >= 100 && !isOver && <span className="ml-1">ครบแล้ว</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed nutrition info (collapsible) */}
      {expanded && (
        <div className="glass-card rounded-2xl p-4 mb-3 animate-fade-in space-y-2.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-text-dim">ใยอาหาร</span>
            <span className="font-number text-text">
              {Math.round(nutrition.fiber)}g
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-text-dim">น้ำตาล</span>
            <span className="font-number text-text">
              {Math.round(nutrition.sugar)}g
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-text-dim">โซเดียม</span>
            <span className="font-number text-text">
              {Math.round(nutrition.sodium)}mg
            </span>
          </div>
        </div>
      )}

      {/* Goals setting button */}
      <button
        onClick={onGoalsClick}
        className="w-full glass-card rounded-xl px-4 py-2.5 text-[11px] text-text-dim hover:text-ember transition-colors tracking-wide group flex items-center justify-center gap-2"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="8" cy="8" r="6" />
          <path d="M8 5v6M5 8h6" />
        </svg>
        <span>ตั้งเป้าหมายโภชนาการ</span>
      </button>
    </div>
  );
}
