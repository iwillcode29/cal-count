"use client";

import CalorieRing from "./CalorieRing";
import { formatThaiDate, getToday, type NutritionInfo } from "@/lib/storage";

interface DaySummaryProps {
  date: string;
  totalCalories: number;
  totalNutrition: NutritionInfo | null;
  goal: number;
  onPrevDay: () => void;
  onNextDay: () => void;
  onGoalClick: () => void;
}

export default function DaySummary({
  date,
  totalCalories,
  totalNutrition,
  goal,
  onPrevDay,
  onNextDay,
  onGoalClick,
}: DaySummaryProps) {
  const isToday = date === getToday();

  return (
    <div className="flex flex-col items-center pt-10 pb-8 animate-fade-in">
      {/* App title */}
      <div className="mb-6">
        <h1 className="text-xs font-bold tracking-[0.3em] uppercase text-text-muted">
          Cal Count
        </h1>
      </div>

      {/* Date navigation */}
      <div className="flex items-center gap-5 mb-8">
        <button
          onClick={onPrevDay}
          className="w-10 h-10 flex items-center justify-center rounded-full glass-card hover:bg-glass-hover transition-all active:scale-90"
          aria-label="วันก่อน"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-dim">
            <path d="M10 3.5L5.5 8L10 12.5" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold min-w-[110px] text-center tracking-wide">
          {formatThaiDate(date)}
        </h2>
        <button
          onClick={onNextDay}
          disabled={isToday}
          className="w-10 h-10 flex items-center justify-center rounded-full glass-card hover:bg-glass-hover transition-all active:scale-90 disabled:opacity-20 disabled:cursor-not-allowed disabled:active:scale-100"
          aria-label="วันถัดไป"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-dim">
            <path d="M6 3.5L10.5 8L6 12.5" />
          </svg>
        </button>
      </div>

      {/* Calorie ring */}
      <CalorieRing current={totalCalories} goal={goal} />

      {/* Goal button */}
      <button
        onClick={onGoalClick}
        className="mt-6 px-4 py-1.5 rounded-full glass-card text-[11px] text-text-dim hover:text-ember transition-colors tracking-wide group"
      >
        เป้าหมาย: <span className="font-number">{goal.toLocaleString()}</span> แคล
        <span className="inline-block ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          ✎
        </span>
      </button>
    </div>
  );
}
