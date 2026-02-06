"use client";

import { useState, useRef } from "react";
import type { NutritionInfo, MealType } from "@/lib/storage";

interface AddFoodFormProps {
  onAdd: (name: string, calories: number, meal: MealType, nutrition?: NutritionInfo) => void;
}

export default function AddFoodForm({ onAdd }: AddFoodFormProps) {
  const [name, setName] = useState("");
  const [meal, setMeal] = useState<MealType>("lunch");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodName: name.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "ประเมินไม่สำเร็จ");
      }

      const data = await res.json();
      onAdd(name.trim(), data.calories, meal, data.nutrition);
      setName("");
      nameRef.current?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const mealLabels = {
    breakfast: "เช้า",
    lunch: "กลางวัน",
    dinner: "เย็น"
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <select
          value={meal}
          onChange={(e) => setMeal(e.target.value as MealType)}
          disabled={loading}
          className="px-3 py-3 bg-surface border border-glass-border rounded-2xl text-sm text-text focus:outline-none focus:border-ember/40 focus:shadow-[0_0_0_3px_rgba(212,114,92,0.08)] transition-all disabled:opacity-50 shrink-0"
        >
          <option value="breakfast">🌅 {mealLabels.breakfast}</option>
          <option value="lunch">☀️ {mealLabels.lunch}</option>
          <option value="dinner">🌙 {mealLabels.dinner}</option>
        </select>
        <input
          ref={nameRef}
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError("");
          }}
          placeholder="ชื่ออาหาร"
          disabled={loading}
          className="flex-1 min-w-0 px-4 py-3 bg-surface border border-glass-border rounded-2xl text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-ember/40 focus:shadow-[0_0_0_3px_rgba(212,114,92,0.08)] transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!name.trim() || loading}
          className="px-5 py-3 bg-ember text-white rounded-2xl text-sm font-semibold shrink-0 hover:bg-ember-dim disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 min-w-[60px] flex items-center justify-center"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "เพิ่ม"
          )}
        </button>
      </form>
      {error && (
        <p className="text-xs text-danger mt-2 px-1">{error}</p>
      )}
    </div>
  );
}
