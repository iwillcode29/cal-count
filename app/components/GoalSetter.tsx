"use client";

import { useState, useRef, useEffect } from "react";
import InBodyUpload from "./InBodyUpload";
import InBodyHistory from "./InBodyHistory";
import type { InBodyAnalysis } from "@/lib/storage";

interface GoalSetterProps {
  currentGoal: number;
  onSave: (goal: number) => void;
  onClose: () => void;
}

export default function GoalSetter({ currentGoal, onSave, onClose }: GoalSetterProps) {
  const [value, setValue] = useState(String(currentGoal));
  const inputRef = useRef<HTMLInputElement>(null);
  const [showInBodyUpload, setShowInBodyUpload] = useState(false);
  const [showInBodyHistory, setShowInBodyHistory] = useState(false);

  useEffect(() => {
    if (!showInBodyUpload && !showInBodyHistory) {
      inputRef.current?.select();
    }
  }, [showInBodyUpload, showInBodyHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(value, 10);
    if (num && num > 0) {
      onSave(num);
    }
  };

  const handleInBodyAnalysis = (calories: number) => {
    setValue(String(calories));
    setShowInBodyUpload(false);
  };

  const handleHistoryApply = (calories: number, _analysis: InBodyAnalysis) => {
    setValue(String(calories));
    setShowInBodyHistory(false);
  };

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
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div
        className="relative bg-surface border border-glass-border rounded-3xl p-6 w-full max-w-xs shadow-xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold mb-1">ตั้งเป้าหมายแคลอรี่</h3>
        <p className="text-xs text-text-muted mb-5">แคลอรี่ต่อวันที่ต้องการ</p>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-5">
          <input
            ref={inputRef}
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            inputMode="numeric"
            className="flex-1 px-4 py-3 bg-surface-light border border-glass-border rounded-2xl text-sm font-number text-center text-text focus:outline-none focus:border-ember/40 transition-all"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-ember text-white rounded-2xl text-sm font-semibold hover:bg-ember-dim transition-all active:scale-95"
          >
            บันทึก
          </button>
        </form>

        {/* InBody Buttons */}
        <div className="space-y-2 pt-4 border-t border-glass-border">
          <button
            type="button"
            onClick={() => setShowInBodyUpload(true)}
            className="w-full py-2.5 px-4 bg-ember/10 text-ember border border-ember/20 rounded-2xl text-sm font-medium hover:bg-ember/20 transition-all flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2M11 5l-3-3m0 0L5 5m3-3v9" />
            </svg>
            อัพโหลด InBody
          </button>
          <button
            type="button"
            onClick={() => setShowInBodyHistory(true)}
            className="w-full py-2.5 px-4 bg-surface-light text-text-dim border border-glass-border rounded-2xl text-sm font-medium hover:bg-surface-lighter hover:text-text transition-all flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M8 14A6 6 0 108 2a6 6 0 000 12z" />
              <path d="M8 4v4l2 2" />
            </svg>
            ดูประวัติ InBody
          </button>
        </div>
      </div>
    </div>
  );
}
