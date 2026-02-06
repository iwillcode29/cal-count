"use client";

import Link from "next/link";
import CalorieRing from "./CalorieRing";
import { formatThaiDate, getToday, type NutritionInfo } from "@/lib/storage";

interface DaySummaryProps {
  date: string;
  totalCalories: number;
  totalNutrition: NutritionInfo | null;
  goal: number;
  entriesCount: number;
  onPrevDay: () => void;
  onNextDay: () => void;
  onGoalClick: () => void;
}

export default function DaySummary({
  date,
  totalCalories,
  totalNutrition,
  goal,
  entriesCount,
  onPrevDay,
  onNextDay,
  onGoalClick,
}: DaySummaryProps) {
  const isToday = date === getToday();
  const progressPercent = Math.round((totalCalories / goal) * 100);
  const remaining = goal - totalCalories;

  return (
    <div className="flex flex-col items-center pt-10 pb-8 animate-fade-in">
      {/* App title + InBody link */}
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-xs font-bold tracking-[0.3em] uppercase text-text-muted">
          Cal Count
        </h1>
        <span className="text-text-muted/30">|</span>
        <Link
          href="/inbody"
          className="text-[11px] font-semibold text-ember hover:text-ember-dim transition-colors tracking-wide flex items-center gap-1.5"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-70">
            <path d="M6 1v10M3 4h6M4 7h4" />
          </svg>
          InBody
        </Link>
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

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-sm px-4">
        {/* Meals Count */}
        {/* <div className="glass-card p-3 flex flex-col items-center justify-center">
          <div className="text-xl font-bold font-number text-text">
            {entriesCount}
          </div>
          <div className="text-[10px] text-text-muted mt-1 tracking-wide">
            มื้อ
          </div>
        </div> */}

        {/* Progress Percentage */}
        {/* <div className="glass-card p-3 flex flex-col items-center justify-center">
          <div className={`text-xl font-bold font-number ${
            progressPercent >= 100 
              ? progressPercent > 110 
                ? "text-orange-400" 
                : "text-emerald-400"
              : "text-text"
          }`}>
            {progressPercent}%
          </div>
          <div className="text-[10px] text-text-muted mt-1 tracking-wide">
            ความสำเร็จ
          </div>
        </div> */}

        {/* Remaining/Excess */}
        {/* <div className="glass-card p-3 flex flex-col items-center justify-center">
          <div className={`text-xl font-bold font-number ${
            remaining < 0 ? "text-orange-400" : "text-text"
          }`}>
            {remaining < 0 ? "+" : ""}{Math.abs(remaining)}
          </div>
          <div className="text-[10px] text-text-muted mt-1 tracking-wide">
            {remaining >= 0 ? "เหลือ" : "เกิน"}
          </div>
        </div> */}

        {/* Macros Summary */}
        {/* {totalNutrition && (
          <>
            <div className="glass-card p-3 flex flex-col items-center justify-center">
              <div className="text-lg font-bold font-number text-sky-400">
                {Math.round(totalNutrition.protein)}
              </div>
              <div className="text-[10px] text-text-muted mt-1 tracking-wide">
                โปรตีน (g)
              </div>
            </div>

            <div className="glass-card p-3 flex flex-col items-center justify-center">
              <div className="text-lg font-bold font-number text-amber-400">
                {Math.round(totalNutrition.carbs)}
              </div>
              <div className="text-[10px] text-text-muted mt-1 tracking-wide">
                คาร์บ (g)
              </div>
            </div>

            <div className="glass-card p-3 flex flex-col items-center justify-center">
              <div className="text-lg font-bold font-number text-rose-400">
                {Math.round(totalNutrition.fat)}
              </div>
              <div className="text-[10px] text-text-muted mt-1 tracking-wide">
                ไขมัน (g)
              </div>
            </div>
          </>
        )} */}
      </div>
    </div>
  );
}
