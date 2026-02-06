"use client";

import { useEffect, useState } from "react";
import type { NutritionInfo, MacroGoals } from "@/lib/storage";

interface DailySummaryNotificationProps {
  nutrition: NutritionInfo;
  goals: MacroGoals;
  onClose: () => void;
}

export default function DailySummaryNotification({
  nutrition,
  goals,
  onClose,
}: DailySummaryNotificationProps) {
  const [show, setShow] = useState(true);

  const macros = [
    { key: "protein" as const, label: "โปรตีน", emoji: "💪" },
    { key: "carbs" as const, label: "คาร์บ", emoji: "🍚" },
    { key: "fat" as const, label: "ไขมัน", emoji: "🥑" },
  ];

  const results = macros.map(({ key, label, emoji }) => {
    const current = Math.round(nutrition[key]);
    const goal = goals[key];
    const percentage = Math.round((current / goal) * 100);
    const status =
      percentage >= 100
        ? "ครบแล้ว"
        : percentage >= 80
        ? "ใกล้ครบ"
        : "ยังขาด";
    const color =
      percentage >= 100
        ? "text-mint"
        : percentage >= 80
        ? "text-ember"
        : "text-coral";

    return { key, label, emoji, current, goal, percentage, status, color };
  });

  const allComplete = results.every((r) => r.percentage >= 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300);
    }, 8000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div className="glass-card rounded-2xl p-5 shadow-2xl max-w-[320px] border border-white/20">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-text mb-1">
              {allComplete ? "🎉 สมบูรณ์แบบ!" : "📊 สรุปวันนี้"}
            </h3>
            <p className="text-[11px] text-text-dim">
              {allComplete
                ? "ครบทุก macro แล้ว เยี่ยมมาก!"
                : "ติดตามความคืบหน้า"}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        <div className="space-y-2.5">
          {results.map(({ key, label, emoji, current, goal, percentage, status, color }) => (
            <div key={key} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-base">{emoji}</span>
                <span className="text-text-dim">{label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-number font-medium ${color}`}>
                  {current}/{goal}g
                </span>
                <span className={`text-[10px] ${color} font-medium`}>
                  ({percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>

        {!allComplete && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-[10px] text-text-dim text-center">
              เพิ่มอาหารเพื่อให้ครบเป้าหมาย 🎯
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
