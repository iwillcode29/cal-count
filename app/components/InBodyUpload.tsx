"use client";

import { useState } from "react";
import { saveInBodyAnalysis } from "@/lib/storageDb";

interface InBodyAnalysis {
  weight: number;
  skeletalMuscleMass: number;
  bodyFatMass: number;
  bmi: number;
  inbodyScore: number;
  bodyWater: number;
  protein: number;
  minerals: number;
  bodyFatPercentage: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  recommendations: string;
}

interface ApiResponse {
  recommendedCalories: number;
  analysis: InBodyAnalysis;
}

interface InBodyUploadProps {
  onAnalysisComplete: (calories: number, analysis: ApiResponse) => void;
  onClose: () => void;
}

export default function InBodyUpload({ onAnalysisComplete, onClose }: InBodyUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ApiResponse | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setAnalysis(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("/api/analyze-inbody", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const result: ApiResponse = await response.json();
      setAnalysis(result);

      await saveInBodyAnalysis({
        recommendedCalories: result.recommendedCalories,
        analysis: result.analysis,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      alert("เกิดข้อผิดพลาดในการวิเคราะห์รูปภาพ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (analysis) {
      onAnalysisComplete(analysis.recommendedCalories, analysis);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div
        className="relative bg-surface border border-glass-border rounded-3xl p-6 w-full max-w-md shadow-xl animate-scale-in overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">วิเคราะห์ InBody</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full glass-card hover:bg-glass-hover transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-text-dim">
              <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" />
            </svg>
          </button>
        </div>

        {!analysis ? (
          <div className="space-y-4">
            <p className="text-sm text-text-dim leading-relaxed">
              อัพโหลดรูป InBody report ของคุณ AI จะวิเคราะห์และแนะนำแคลอรี่ที่เหมาะสม
            </p>

            <div className="space-y-3">
              {previewUrl && (
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-surface-light border border-glass-border">
                  <img
                    src={previewUrl}
                    alt="InBody Report Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="w-full py-3 px-4 glass-card rounded-2xl text-sm text-center cursor-pointer hover:bg-glass-hover transition-all border-2 border-dashed border-glass-border-hover text-text-dim">
                  {selectedFile ? "เปลี่ยนรูปภาพ" : "เลือกรูปภาพ"}
                </div>
              </label>

              <button
                onClick={handleAnalyze}
                disabled={!selectedFile || loading}
                className="w-full py-3 px-4 bg-ember text-white rounded-2xl text-sm font-semibold hover:bg-ember-dim transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>กำลังวิเคราะห์...</span>
                  </>
                ) : (
                  "วิเคราะห์"
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Recommended calories hero */}
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

              {/* Body stats grid */}
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

              {/* Macros */}
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

            {/* AI Recommendations */}
            <div className="glass-card rounded-2xl p-5">
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-3">คำแนะนำจาก AI</p>
              <p className="text-sm text-text-dim leading-relaxed whitespace-pre-line">{analysis.analysis.recommendations}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setAnalysis(null);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="flex-1 py-3 px-4 glass-card rounded-2xl text-sm font-medium text-text-dim hover:text-text transition-all"
              >
                วิเคราะห์ใหม่
              </button>
              <button
                onClick={handleApply}
                className="flex-1 py-3 px-4 bg-ember text-white rounded-2xl text-sm font-semibold hover:bg-ember-dim transition-all active:scale-[0.98]"
              >
                ใช้ค่านี้
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
