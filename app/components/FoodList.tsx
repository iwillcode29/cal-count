"use client";

import type { FoodEntry } from "@/lib/storage";
import FoodItem from "./FoodItem";

interface FoodListProps {
  entries: FoodEntry[];
  onDelete: (id: string) => void;
  goal: number;
}

export default function FoodList({ entries, onDelete, goal }: FoodListProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-text-muted">
        <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-text-muted">
            <path d="M3 6h18M6 6v14a2 2 0 002 2h8a2 2 0 002-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            <path d="M10 11v6M14 11v6" />
          </svg>
        </div>
        <p className="text-sm font-medium text-text-dim">ยังไม่มีรายการอาหาร</p>
        <p className="text-xs mt-1 text-text-muted">เพิ่มมื้ออาหารด้านล่างเลย!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {entries.map((entry, index) => (
        <FoodItem key={entry.id} entry={entry} onDelete={onDelete} goal={goal} index={index} />
      ))}
    </div>
  );
}
