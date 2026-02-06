"use client";

import { useState, useEffect } from "react";
import { getInBodyHistory, deleteInBodyAnalysis, type InBodyAnalysis } from "@/lib/storage";

interface InBodyHistoryProps {
  onClose: () => void;
  onApplyAnalysis: (calories: number, analysis: InBodyAnalysis) => void;
}

export default function InBodyHistory({ onClose, onApplyAnalysis }: InBodyHistoryProps) {
  const [history, setHistory] = useState<InBodyAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<InBodyAnalysis | null>(null);

  useEffect(() => {
    setHistory(getInBodyHistory());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("ต้องการลบข้อมูล InBody นี้ใช่หรือไม่?")) {
      deleteInBodyAnalysis(id);
      setHistory(getInBodyHistory());
      if (selectedAnalysis?.id === id) {
        setSelectedAnalysis(null);
      }
    }
  };

  const handleApply = (analysis: InBodyAnalysis) => {
    onApplyAnalysis(analysis.recommendedCalories, analysis);
  };

  if (selectedAnalysis) {
    const analysis = selectedAnalysis;
    const date = new Date(analysis.uploadedAt);
    const formattedDate = date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        <div
          className="relative bg-surface border border-glass-border rounded-3xl p-6 w-full max-w-md shadow-xl animate-scale-in overflow-y-auto max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full glass-card hover:bg-glass-hover transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-text-dim">
                  <path d="M9 11L5 7l4-4" />
                </svg>
              </button>
              <h2 className="text-lg font-bold">ข้อมูล InBody</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full glass-card hover:bg-glass-hover transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-text-dim">
                <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div className="text-[11px] text-text-muted font-number tracking-wider">
              {formattedDate}
            </div>

            <div className="glass-card rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-glass-border">
                <div>
                  <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">แคลอรี่แนะนำ</p>
                  <p className="text-3xl font-bold text-ember font-number">{analysis.recommendedCalories}</p>
                  <p className="text-[11px] text-text-muted mt-0.5">แคล/วัน</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">InBody Score</p>
                  <p className="text-2xl font-bold text-mint font-number">{analysis.analysis.inbodyScore}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-light rounded-xl p-3">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">น้ำหนัก</p>
                  <p className="text-sm font-bold font-number mt-1">{analysis.analysis.weight} <span className="text-text-muted font-normal">kg</span></p>
                </div>
                <div className="bg-surface-light rounded-xl p-3">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">BMI</p>
                  <p className="text-sm font-bold font-number mt-1">{analysis.analysis.bmi}</p>
                </div>
                <div className="bg-surface-light rounded-xl p-3">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">กล้ามเนื้อ</p>
                  <p className="text-sm font-bold font-number mt-1">{analysis.analysis.skeletalMuscleMass} <span className="text-text-muted font-normal">kg</span></p>
                </div>
                <div className="bg-surface-light rounded-xl p-3">
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">ไขมัน</p>
                  <p className="text-sm font-bold font-number mt-1">{analysis.analysis.bodyFatMass} <span className="text-text-muted font-normal">kg</span></p>
                </div>
              </div>

              <div className="pt-4 border-t border-glass-border">
                <p className="text-[10px] text-text-muted uppercase tracking-wider mb-3">สัดส่วนโภชนาการแนะนำ</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-mint/10 border border-mint/20 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-mint-dim uppercase tracking-wider">โปรตีน</p>
                    <p className="text-sm font-bold text-mint font-number mt-1">{analysis.analysis.macros.protein}g</p>
                  </div>
                  <div className="bg-ember/10 border border-ember/20 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-ember-dim uppercase tracking-wider">คาร์บ</p>
                    <p className="text-sm font-bold text-ember font-number mt-1">{analysis.analysis.macros.carbs}g</p>
                  </div>
                  <div className="bg-danger/10 border border-danger/20 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-danger uppercase tracking-wider">ไขมัน</p>
                    <p className="text-sm font-bold text-danger font-number mt-1">{analysis.analysis.macros.fat}g</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-3">คำแนะนำจาก AI</p>
              <p className="text-sm text-text-dim leading-relaxed whitespace-pre-line">{analysis.analysis.recommendations}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleDelete(analysis.id)}
                className="flex-1 py-3 px-4 bg-danger/10 text-danger border border-danger/20 rounded-2xl text-sm font-medium hover:bg-danger/20 transition-all"
              >
                ลบ
              </button>
              <button
                onClick={() => handleApply(analysis)}
                className="flex-1 py-3 px-4 bg-ember text-white rounded-2xl text-sm font-semibold hover:bg-ember-dim transition-all active:scale-[0.98]"
              >
                ใช้ค่านี้
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div
        className="relative bg-surface border border-glass-border rounded-3xl p-6 w-full max-w-md shadow-xl animate-scale-in overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold">ประวัติ InBody</h2>
            <p className="text-[11px] text-text-muted mt-1 font-number">{history.length} รายการ</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full glass-card hover:bg-glass-hover transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-text-dim">
              <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" />
            </svg>
          </button>
        </div>

        <div className="space-y-2">
          {history.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center mx-auto mb-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-text-muted">
                  <path d="M10 18A8 8 0 1010 2a8 8 0 000 16z" />
                  <path d="M10 6v4l2 2" />
                </svg>
              </div>
              <p className="text-sm text-text-dim mb-1">ยังไม่มีข้อมูล InBody</p>
              <p className="text-[11px] text-text-muted">อัพโหลดและวิเคราะห์ InBody report เพื่อเริ่มต้น</p>
            </div>
          ) : (
            history.map((item, i) => {
              const date = new Date(item.uploadedAt);
              const formattedDate = date.toLocaleDateString("th-TH", {
                day: "numeric",
                month: "short",
              });
              const formattedTime = date.toLocaleTimeString("th-TH", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedAnalysis(item)}
                  className="w-full glass-card rounded-2xl p-4 hover:bg-glass-hover transition-all text-left animate-slide-in"
                  style={{ animationDelay: `${i * 40}ms`, animationFillMode: "backwards" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">{formattedDate}</p>
                    <p className="text-[11px] text-text-muted font-number">{formattedTime}</p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-text-muted mb-2 font-number">
                    <span>
                      Score: <span className="text-mint">{item.analysis.inbodyScore}</span> | BMI: {item.analysis.bmi}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-ember font-semibold font-number">
                      {item.recommendedCalories} แคล/วัน
                    </span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-text-muted">
                      <path d="M5 3l4 4-4 4" />
                    </svg>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
