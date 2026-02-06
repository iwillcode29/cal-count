"use client";

import { useEffect, useState } from "react";
import { getInBodyHistory, type InBodyAnalysis } from "@/lib/storage";

export default function LatestInBodyCard() {
  const [latestInBody, setLatestInBody] = useState<InBodyAnalysis | null>(null);

  useEffect(() => {
    const history = getInBodyHistory();
    if (history.length > 0) {
      setLatestInBody(history[0]);
    }
  }, []);

  if (!latestInBody) {
    return null;
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const thaiMonths = [
      "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
    ];
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${date.getFullYear() + 543}`;
  };

  const { analysis } = latestInBody;

  return (
    <div className="bg-surface border border-glass-border rounded-3xl p-5 mb-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-text">InBody ล่าสุด</h3>
          <p className="text-xs text-text-muted mt-0.5">
            {formatDate(latestInBody.uploadedAt)}
          </p>
        </div>
        <div className="w-12 h-12 bg-ember/10 rounded-2xl flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-ember">
            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <path d="M20 8v6M23 11h-6" />
          </svg>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-surface-light rounded-2xl p-3">
          <div className="text-xs text-text-muted mb-1">น้ำหนัก</div>
          <div className="text-xl font-semibold font-number text-text">
            {analysis.weight}
            <span className="text-sm text-text-muted ml-1">kg</span>
          </div>
        </div>
        <div className="bg-surface-light rounded-2xl p-3">
          <div className="text-xs text-text-muted mb-1">BMI</div>
          <div className="text-xl font-semibold font-number text-text">
            {analysis.bmi.toFixed(1)}
          </div>
        </div>
        <div className="bg-surface-light rounded-2xl p-3">
          <div className="text-xs text-text-muted mb-1">กล้ามเนื้อ</div>
          <div className="text-xl font-semibold font-number text-text">
            {analysis.skeletalMuscleMass.toFixed(1)}
            <span className="text-sm text-text-muted ml-1">kg</span>
          </div>
        </div>
        <div className="bg-surface-light rounded-2xl p-3">
          <div className="text-xs text-text-muted mb-1">ไขมัน</div>
          <div className="text-xl font-semibold font-number text-text">
            {analysis.bodyFatPercentage.toFixed(1)}
            <span className="text-sm text-text-muted ml-1">%</span>
          </div>
        </div>
      </div>

      {/* InBody Score */}
      <div className="bg-gradient-to-r from-ember/10 to-ember/5 rounded-2xl p-3 mb-4">
        <div className="text-xs text-text-muted mb-1">InBody Score</div>
        <div className="text-2xl font-bold font-number text-ember">
          {analysis.inbodyScore}
          <span className="text-sm text-text-muted ml-1">/100</span>
        </div>
      </div>

      {/* Recommended Calories */}
      <div className="border-t border-glass-border pt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">แคลอรี่แนะนำ</span>
          <span className="text-sm font-semibold font-number text-text">
            {latestInBody.recommendedCalories.toLocaleString()} cal
          </span>
        </div>
      </div>
    </div>
  );
}
