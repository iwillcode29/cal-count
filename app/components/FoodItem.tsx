"use client";

import { useState } from "react";
import type { FoodEntry } from "@/lib/storage";

interface FoodItemProps {
  entry: FoodEntry;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  goal: number;
  index: number;
}

const MACRO_CONFIG = [
  { key: "protein" as const, label: "โปรตีน", color: "var(--color-mint)", bg: "rgba(76,175,130,0.12)", unit: "g", daily: 50 },
  { key: "carbs" as const, label: "คาร์บ", color: "var(--color-ember)", bg: "rgba(212,114,92,0.12)", unit: "g", daily: 300 },
  { key: "fat" as const, label: "ไขมัน", color: "#D4A843", bg: "rgba(212,168,67,0.12)", unit: "g", daily: 65 },
  { key: "fiber" as const, label: "ไฟเบอร์", color: "#5A9A6B", bg: "rgba(90,154,107,0.12)", unit: "g", daily: 25 },
  { key: "sugar" as const, label: "น้ำตาล", color: "#C75B7A", bg: "rgba(199,91,122,0.12)", unit: "g", daily: 50 },
  { key: "sodium" as const, label: "โซเดียม", color: "#5B8EC9", bg: "rgba(91,142,201,0.12)", unit: "mg", daily: 2300 },
];

export default function FoodItem({ entry, onDelete, onEdit, goal, index }: FoodItemProps) {
  const [deleting, setDeleting] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleting(true);
    setTimeout(() => onDelete(entry.id), 280);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(entry.id);
  };

  const percentage = Math.round((entry.calories / goal) * 100);
  const time = new Date(entry.createdAt).toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={`glass-card rounded-2xl cursor-pointer transition-all ${
        deleting ? "animate-slide-out" : "animate-slide-in"
      }`}
      style={{ animationDelay: `${index * 40}ms`, animationFillMode: "backwards" }}
    >
      {/* Main row */}
      <div className="flex items-center justify-between py-3.5 px-4">
        <div className="flex items-center gap-3 flex-1 min-w-0 mr-3">
          {/* Percentage indicator dot */}
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{
              backgroundColor: percentage > 30 ? "var(--color-ember)" : percentage > 15 ? "var(--color-mint)" : "var(--color-text-muted)",
            }}
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-text truncate">{entry.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-number text-sm font-bold text-ember">
            {entry.calories}
          </span>
          <button
            onClick={handleEdit}
            className="w-7 h-7 flex items-center justify-center rounded-full text-text-muted hover:bg-sky-500/10 hover:text-sky-400 transition-all"
            aria-label="แก้ไข"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8.5 1.5l2 2-6 6H2.5v-2l6-6z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="w-7 h-7 flex items-center justify-center rounded-full text-text-muted hover:bg-danger/10 hover:text-danger transition-all"
            aria-label="ลบ"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3 3l6 6M9 3l-6 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expandable detail */}
      <div className={`detail-expand ${expanded ? "open" : ""}`}>
        <div>
          <div className="px-4 pb-3.5 pt-0">
            <div className="h-px bg-glass-border mb-3" />
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-text-muted">เวลา</span>
                  <span className="font-number text-text-dim ml-1.5">{time}</span>
                </div>
                <div>
                  <span className="text-text-muted">สัดส่วน</span>
                  <span className="font-number text-ember ml-1.5">{percentage}%</span>
                </div>
              </div>
              <span className="text-text-muted">ของเป้าหมาย</span>
            </div>
            {/* Progress bar */}
            <div className="mt-2.5 h-1.5 rounded-full bg-surface-lighter overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(percentage, 100)}%`,
                  backgroundColor: percentage > 30 ? "var(--color-ember)" : "var(--color-mint)",
                }}
              />
            </div>

            {/* Nutrition breakdown */}
            {entry.nutrition && (
              <div className="mt-3 space-y-2">
                <div className="h-px bg-glass-border mb-3" />
                {MACRO_CONFIG.map(({ key, label, color, bg, unit, daily }) => {
                  const value = entry.nutrition![key];
                  const pct = Math.min(Math.round((value / daily) * 100), 100);
                  return (
                    <div key={key} className="flex items-center gap-2 text-[11px]">
                      <span className="text-text-dim w-14 shrink-0 font-medium">{label}</span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: bg }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: color }}
                        />
                      </div>
                      <span className="font-number text-text-dim w-16 text-right shrink-0">
                        {value}{unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
