"use client";

import { useEffect, useState } from "react";
import type { NutritionInfo, MacroGoals } from "@/lib/storage";

interface MacroAlert {
  id: string;
  type: "warning" | "success" | "danger";
  macro: "protein" | "carbs" | "fat";
  message: string;
}

interface MacroAlertProps {
  nutrition: NutritionInfo;
  goals: MacroGoals;
}

export default function MacroAlert({ nutrition, goals }: MacroAlertProps) {
  const [alerts, setAlerts] = useState<MacroAlert[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newAlerts: MacroAlert[] = [];

    // Check Protein
    const proteinPct = (nutrition.protein / goals.protein) * 100;
    if (proteinPct >= 100 && proteinPct < 110) {
      newAlerts.push({
        id: "protein-success",
        type: "success",
        macro: "protein",
        message: `ยอดเยี่ยม! โปรตีนครบ ${Math.round(nutrition.protein)}g แล้ว 🎯`,
      });
    } else if (proteinPct >= 110) {
      newAlerts.push({
        id: "protein-over",
        type: "warning",
        macro: "protein",
        message: `โปรตีนเกินเป้า ${Math.round(nutrition.protein)}g / ${goals.protein}g ⚠️`,
      });
    } else if (proteinPct < 50) {
      newAlerts.push({
        id: "protein-low",
        type: "danger",
        macro: "protein",
        message: `โปรตีนน้อยไป! เหลือ ${goals.protein - Math.round(nutrition.protein)}g 🚨`,
      });
    }

    // Check Carbs
    const carbsPct = (nutrition.carbs / goals.carbs) * 100;
    if (carbsPct >= 100 && carbsPct < 110) {
      newAlerts.push({
        id: "carbs-success",
        type: "success",
        macro: "carbs",
        message: `คาร์บครบ ${Math.round(nutrition.carbs)}g แล้ว ✅`,
      });
    } else if (carbsPct >= 110) {
      newAlerts.push({
        id: "carbs-over",
        type: "warning",
        macro: "carbs",
        message: `คาร์บเกินเป้า ${Math.round(nutrition.carbs)}g / ${goals.carbs}g ⚠️`,
      });
    }

    // Check Fat
    const fatPct = (nutrition.fat / goals.fat) * 100;
    if (fatPct >= 100 && fatPct < 110) {
      newAlerts.push({
        id: "fat-success",
        type: "success",
        macro: "fat",
        message: `ไขมันครบ ${Math.round(nutrition.fat)}g แล้ว ✅`,
      });
    } else if (fatPct >= 110) {
      newAlerts.push({
        id: "fat-over",
        type: "warning",
        macro: "fat",
        message: `ไขมันเกินเป้า ${Math.round(nutrition.fat)}g / ${goals.fat}g ⚠️`,
      });
    }

    setAlerts(newAlerts.filter((alert) => !dismissed.has(alert.id)));
  }, [nutrition, goals, dismissed]);

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
  };

  if (alerts.length === 0) return null;

  return (
    <div className="w-full max-w-[340px] mx-auto mt-4 space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`
            rounded-xl p-3 pr-10 relative animate-fade-in text-sm
            ${
              alert.type === "success"
                ? "bg-mint/10 text-mint border border-mint/30"
                : alert.type === "warning"
                ? "bg-ember/10 text-ember border border-ember/30"
                : "bg-coral/10 text-coral border border-coral/30"
            }
          `}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">
              {alert.type === "success" ? "✅" : alert.type === "warning" ? "⚠️" : "🚨"}
            </span>
            <span className="font-medium">{alert.message}</span>
          </div>
          <button
            onClick={() => handleDismiss(alert.id)}
            className="absolute top-3 right-3 w-5 h-5 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
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
      ))}
    </div>
  );
}
