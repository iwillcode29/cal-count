"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  getInBodyHistory,
  saveInBodyAnalysis,
  deleteInBodyAnalysis,
  type InBodyAnalysis,
  type InBodyAnalysisData,
  type SegmentRating,
} from "@/lib/storageDb";

// ─── Helper Components ──────────────────────────────────────────

function RatingBadge({ rating }: { rating: "under" | "normal" | "over" }) {
  const config = {
    under: { label: "ต่ำ", bg: "bg-sky-100", text: "text-sky-700", border: "border-sky-200" },
    normal: { label: "ปกติ", bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
    over: { label: "สูง", bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
  };
  const c = config[rating];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.bg} ${c.text} border ${c.border}`}>
      {c.label}
    </span>
  );
}

function StatCard({ label, value, unit, color, subtext }: {
  label: string; value: string | number; unit?: string; color?: string; subtext?: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-4 space-y-1">
      <p className="text-[10px] text-text-muted uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className={`text-xl font-bold font-number ${color || "text-text"}`}>{value}</span>
        {unit && <span className="text-xs text-text-muted">{unit}</span>}
      </div>
      {subtext && <p className="text-[10px] text-text-muted">{subtext}</p>}
    </div>
  );
}

function GaugeBar({ value, min, max, zones, label, unit }: {
  value: number; min: number; max: number;
  zones: { end: number; color: string; label: string }[];
  label: string; unit?: string;
}) {
  const percent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-dim font-medium">{label}</span>
        <span className="text-sm font-bold font-number text-text">{value}{unit}</span>
      </div>
      <div className="relative">
        <div className="flex h-2.5 rounded-full overflow-hidden">
          {zones.map((zone, i) => {
            const prevEnd = i > 0 ? zones[i - 1].end : 0;
            const width = ((zone.end - prevEnd) / (max - min)) * 100;
            return (
              <div
                key={i}
                className={`${zone.color} ${i === 0 ? "rounded-l-full" : ""} ${i === zones.length - 1 ? "rounded-r-full" : ""}`}
                style={{ width: `${width}%` }}
              />
            );
          })}
        </div>
        {/* Indicator */}
        <div
          className="absolute top-[-4px] w-0 h-0"
          style={{ left: `${percent}%`, transform: "translateX(-50%)" }}
        >
          <div className="w-4 h-4 rounded-full bg-charcoal border-2 border-white shadow-md relative top-[-2px]" />
        </div>
      </div>
      <div className="flex justify-between text-[9px] text-text-muted font-number">
        {zones.map((zone, i) => (
          <span key={i}>{zone.label}</span>
        ))}
      </div>
    </div>
  );
}

function SegmentBar({ segment, label }: { segment: SegmentRating; label: string }) {
  const barColor = segment.rating === "over"
    ? "bg-amber-400"
    : segment.rating === "under"
    ? "bg-sky-400"
    : "bg-emerald-400";
  const barWidth = Math.min(100, segment.percent);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-dim">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold font-number text-text">{segment.mass}kg</span>
          <RatingBadge rating={segment.rating} />
        </div>
      </div>
      <div className="h-2 bg-surface-lighter rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
      <p className="text-[10px] text-text-muted font-number text-right">{segment.percent}%</p>
    </div>
  );
}

function BodyDiagram({ segmentalLean, segmentalFat, mode }: {
  segmentalLean?: InBodyAnalysisData["segmentalLean"];
  segmentalFat?: InBodyAnalysisData["segmentalFat"];
  mode: "lean" | "fat";
}) {
  const data = mode === "lean" ? segmentalLean : segmentalFat;
  if (!data) return null;

  const getColor = (rating: string) => {
    if (rating === "over") return mode === "lean" ? "#4CAF82" : "#D94B4B";
    if (rating === "under") return mode === "lean" ? "#D94B4B" : "#4CAF82";
    return "#D4725C";
  };

  return (
    <div className="flex items-center justify-center py-4">
      <svg viewBox="0 0 200 300" width="160" height="240" className="drop-shadow-sm">
        {/* Head */}
        <circle cx="100" cy="30" r="18" fill="#E8E6E0" stroke="#D5D2CA" strokeWidth="1" />

        {/* Trunk */}
        <rect x="70" y="52" width="60" height="80" rx="10" fill={getColor(data.trunk.rating)} opacity="0.7" stroke={getColor(data.trunk.rating)} strokeWidth="1.5" />
        <text x="100" y="90" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white" fontFamily="Space Mono, monospace">{data.trunk.mass}kg</text>
        <text x="100" y="104" textAnchor="middle" fontSize="9" fill="white" opacity="0.8" fontFamily="Space Mono, monospace">{data.trunk.percent}%</text>

        {/* Left Arm */}
        <rect x="30" y="56" width="34" height="60" rx="10" fill={getColor(data.leftArm.rating)} opacity="0.7" stroke={getColor(data.leftArm.rating)} strokeWidth="1.5" />
        <text x="47" y="84" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white" fontFamily="Space Mono, monospace">{data.leftArm.mass}</text>
        <text x="47" y="96" textAnchor="middle" fontSize="8" fill="white" opacity="0.8" fontFamily="Space Mono, monospace">{data.leftArm.percent}%</text>

        {/* Right Arm */}
        <rect x="136" y="56" width="34" height="60" rx="10" fill={getColor(data.rightArm.rating)} opacity="0.7" stroke={getColor(data.rightArm.rating)} strokeWidth="1.5" />
        <text x="153" y="84" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white" fontFamily="Space Mono, monospace">{data.rightArm.mass}</text>
        <text x="153" y="96" textAnchor="middle" fontSize="8" fill="white" opacity="0.8" fontFamily="Space Mono, monospace">{data.rightArm.percent}%</text>

        {/* Left Leg */}
        <rect x="55" y="140" width="38" height="90" rx="10" fill={getColor(data.leftLeg.rating)} opacity="0.7" stroke={getColor(data.leftLeg.rating)} strokeWidth="1.5" />
        <text x="74" y="182" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white" fontFamily="Space Mono, monospace">{data.leftLeg.mass}</text>
        <text x="74" y="194" textAnchor="middle" fontSize="8" fill="white" opacity="0.8" fontFamily="Space Mono, monospace">{data.leftLeg.percent}%</text>

        {/* Right Leg */}
        <rect x="107" y="140" width="38" height="90" rx="10" fill={getColor(data.rightLeg.rating)} opacity="0.7" stroke={getColor(data.rightLeg.rating)} strokeWidth="1.5" />
        <text x="126" y="182" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white" fontFamily="Space Mono, monospace">{data.rightLeg.mass}</text>
        <text x="126" y="194" textAnchor="middle" fontSize="8" fill="white" opacity="0.8" fontFamily="Space Mono, monospace">{data.rightLeg.percent}%</text>

        {/* Labels */}
        <text x="47" y="52" textAnchor="middle" fontSize="8" fill="#8A857C">แขนซ้าย</text>
        <text x="153" y="52" textAnchor="middle" fontSize="8" fill="#8A857C">แขนขวา</text>
        <text x="74" y="240" textAnchor="middle" fontSize="8" fill="#8A857C">ขาซ้าย</text>
        <text x="126" y="240" textAnchor="middle" fontSize="8" fill="#8A857C">ขาขวา</text>
        <text x="100" y="48" textAnchor="middle" fontSize="8" fill="#8A857C">ลำตัว</text>
      </svg>
    </div>
  );
}

function ScoreRing({ score, size = 140 }: { score: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.min(100, Math.max(0, score));
  const offset = circumference - (percent / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 80) return { stroke: "#4CAF82", text: "text-mint", glow: "ring-glow-mint", label: "ดีมาก" };
    if (score >= 70) return { stroke: "#D4725C", text: "text-ember", glow: "ring-glow-ember", label: "ปานกลาง" };
    return { stroke: "#D94B4B", text: "text-danger", glow: "ring-glow-danger", label: "ต้องปรับปรุง" };
  };

  const config = getScoreColor();

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className={config.glow}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E8E6E0"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={config.stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute text-center">
        <p className={`text-3xl font-bold font-number ${config.text}`}>{score}</p>
        <p className="text-[10px] text-text-muted">/100</p>
        <p className={`text-[10px] font-semibold mt-0.5 ${config.text}`}>{config.label}</p>
      </div>
    </div>
  );
}

function WeightControlBar({ label, value, unit, isPositive }: {
  label: string; value: number; unit: string; isPositive: boolean;
}) {
  const color = value > 0
    ? (isPositive ? "text-mint bg-mint/10 border-mint/20" : "text-danger bg-danger/10 border-danger/20")
    : value < 0
    ? (isPositive ? "text-danger bg-danger/10 border-danger/20" : "text-mint bg-mint/10 border-mint/20")
    : "text-text-dim bg-surface-light border-glass-border";

  return (
    <div className={`flex items-center justify-between rounded-xl p-3 border ${color}`}>
      <span className="text-xs">{label}</span>
      <span className="text-sm font-bold font-number">
        {value > 0 ? "+" : ""}{value} {unit}
      </span>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────

export default function InBodyPage() {
  const [history, setHistory] = useState<InBodyAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<InBodyAnalysis | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [segmentMode, setSegmentMode] = useState<"lean" | "fat">("lean");
  const [mounted, setMounted] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const loadHistory = async () => {
      setLoadingHistory(true);
      try {
        const h = await getInBodyHistory();
        setHistory(h);
        if (h.length > 0) {
          setSelectedAnalysis(h[0]);
        }
      } finally {
        setLoadingHistory(false);
      }
    };
    loadHistory();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch("/api/analyze-inbody", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to analyze");

      const result = await response.json();
      const saved = await saveInBodyAnalysis({
        recommendedCalories: result.recommendedCalories,
        analysis: result.analysis,
      });

      const updatedHistory = await getInBodyHistory();
      setHistory(updatedHistory);
      setSelectedAnalysis(saved);
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      alert("เกิดข้อผิดพลาดในการวิเคราะห์ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบข้อมูลนี้ใช่ไหม?")) return;
    try {
      await deleteInBodyAnalysis(id);
      const updated = await getInBodyHistory();
      setHistory(updated);
      if (selectedAnalysis?.id === id) {
        setSelectedAnalysis(updated[0] || null);
      }
    } catch (error) {
      console.error("Error deleting InBody analysis:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <div className="w-8 h-8 border-2 border-ember/30 border-t-ember rounded-full animate-spin" />
      </div>
    );
  }

  const a = selectedAnalysis?.analysis;

  return (
    <div className="py-6 space-y-6 animate-fade-in">
      {/* ── Header ───────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-9 h-9 flex items-center justify-center rounded-full glass-card hover:bg-glass-hover transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M10 12L6 8l4-4" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight">InBody Analysis</h1>
            <p className="text-xs text-text-muted">วิเคราะห์องค์ประกอบร่างกายเชิงลึก</p>
          </div>
        </div>

        <label className="cursor-pointer">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="flex items-center gap-2 px-4 py-2.5 bg-ember text-white rounded-2xl text-xs font-semibold hover:bg-ember-dim transition-all active:scale-[0.97]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M7 2v10M2 7h10" />
            </svg>
            อัพโหลด
          </div>
        </label>
      </div>

      {/* ── Upload Preview ────────────────────────── */}
      {previewUrl && (
        <div className="glass-card rounded-3xl p-5 space-y-4 animate-scale-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">รูปภาพที่เลือก</h3>
            <button
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="text-xs text-text-muted hover:text-text transition-colors"
            >
              ยกเลิก
            </button>
          </div>
          <div className="relative w-full aspect-3/4 max-h-[300px] rounded-2xl overflow-hidden bg-surface-light border border-glass-border">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full py-3 bg-ember text-white rounded-2xl text-sm font-semibold hover:bg-ember-dim transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>กำลังวิเคราะห์...</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M2 10l3 3 7-9" />
                </svg>
                วิเคราะห์ InBody Report
              </>
            )}
          </button>
        </div>
      )}

      {/* ── Loading State ─────────────────────────── */}
      {loadingHistory && !previewUrl && (
        <div className="space-y-4 animate-fade-in">
          {/* History selector skeleton */}
          <div className="space-y-2">
            <div className="shimmer h-3 w-24 rounded-full" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="shimmer h-14 w-24 rounded-2xl shrink-0" />
              ))}
            </div>
          </div>

          {/* Score card skeleton */}
          <div className="glass-card rounded-3xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="shimmer h-3 w-20 rounded-full" />
                <div className="shimmer h-3 w-28 rounded-full" />
              </div>
              <div className="shimmer h-8 w-8 rounded-full" />
            </div>
            <div className="flex items-center gap-6">
              <div className="shimmer rounded-full" style={{ width: 140, height: 140 }} />
              <div className="flex-1 grid grid-cols-2 gap-2.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-surface-light rounded-xl p-3 space-y-2">
                    <div className="shimmer h-2.5 w-12 rounded-full" />
                    <div className="shimmer h-5 w-16 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Body composition skeleton */}
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <div className="shimmer w-1.5 h-1.5 rounded-full" />
              <div className="shimmer h-4 w-28 rounded-full" />
            </div>
            <div className="shimmer h-6 w-full rounded-xl" />
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="shimmer w-2.5 h-2.5 rounded" />
                  <div className="shimmer h-2.5 w-14 rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Gauge skeletons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="glass-card rounded-3xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="shimmer w-1.5 h-1.5 rounded-full" />
                  <div className="shimmer h-3 w-8 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="shimmer h-3 w-20 rounded-full" />
                  <div className="shimmer h-4 w-12 rounded-full" />
                </div>
                <div className="shimmer h-2.5 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── History Selector ─────────────────────── */}
      {!loadingHistory && history.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">ประวัติการวิเคราะห์</p>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {history.map((item) => {
              const isSelected = selectedAnalysis?.id === item.id;
              const date = new Date(item.uploadedAt);
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedAnalysis(item)}
                  className={`shrink-0 rounded-2xl px-4 py-2.5 text-left transition-all border ${
                    isSelected
                      ? "bg-ember/10 border-ember/30 shadow-sm"
                      : "glass-card hover:bg-glass-hover"
                  }`}
                >
                  <p className={`text-xs font-semibold ${isSelected ? "text-ember" : "text-text"}`}>
                    {date.toLocaleDateString("th-TH", { day: "numeric", month: "short" })}
                  </p>
                  <p className="text-[10px] text-text-muted font-number mt-0.5">
                    Score: {item.analysis.inbodyScore}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── No Data State ────────────────────────── */}
      {!loadingHistory && !selectedAnalysis && !previewUrl && (
        <div className="glass-card rounded-3xl p-10 text-center space-y-4 animate-slide-up">
          <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center mx-auto">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-text-muted">
              <path d="M14 2v6M14 20v6M6 14H2M26 14h-4M7 7l3 3M18 18l3 3M7 21l3-3M18 10l3-3" />
            </svg>
          </div>
          <div>
            <p className="text-base font-semibold text-text">ยังไม่มีข้อมูล InBody</p>
            <p className="text-sm text-text-dim mt-1">
              อัพโหลดรูป InBody Report เพื่อเริ่มวิเคราะห์<br />
              องค์ประกอบร่างกายอย่างละเอียด
            </p>
          </div>
          <label className="cursor-pointer inline-block">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="px-6 py-3 bg-ember text-white rounded-2xl text-sm font-semibold hover:bg-ember-dim transition-all active:scale-[0.97]">
              เลือกรูปภาพ
            </div>
          </label>
        </div>
      )}

      {/* ── Analysis Results ─────────────────────── */}
      {selectedAnalysis && a && (
        <div className="space-y-5">
          {/* ── Hero: Score + Key Metrics ─────────── */}
          <div className="glass-card rounded-3xl p-6 space-y-5 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider">InBody Score</p>
                <p className="text-xs text-text-dim mt-1">
                  {new Date(selectedAnalysis.uploadedAt).toLocaleDateString("th-TH", {
                    day: "numeric", month: "long", year: "numeric"
                  })}
                </p>
              </div>
              <button
                onClick={() => handleDelete(selectedAnalysis.id)}
                className="w-8 h-8 flex items-center justify-center rounded-full glass-card hover:bg-danger/10 hover:border-danger/20 transition-all group"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-text-muted group-hover:text-danger transition-colors">
                  <path d="M2 4h10M5 4V3a1 1 0 011-1h2a1 1 0 011 1v1M9 7v4M5 7v4M3 4l.7 7.4A1 1 0 004.7 12h4.6a1 1 0 001-0.6L11 4" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-6">
              <ScoreRing score={a.inbodyScore} />
              <div className="flex-1 grid grid-cols-2 gap-2.5">
                <div className="bg-surface-light rounded-xl p-3">
                  <p className="text-[10px] text-text-muted">น้ำหนัก</p>
                  <p className="text-base font-bold font-number mt-0.5">{a.weight}<span className="text-[10px] text-text-muted ml-0.5">kg</span></p>
                </div>
                <div className="bg-surface-light rounded-xl p-3">
                  <p className="text-[10px] text-text-muted">BMI</p>
                  <p className="text-base font-bold font-number mt-0.5">{a.bmi}</p>
                </div>
                <div className="bg-surface-light rounded-xl p-3">
                  <p className="text-[10px] text-text-muted">กล้ามเนื้อ</p>
                  <p className="text-base font-bold font-number mt-0.5 text-mint">{a.skeletalMuscleMass}<span className="text-[10px] text-text-muted ml-0.5">kg</span></p>
                </div>
                <div className="bg-surface-light rounded-xl p-3">
                  <p className="text-[10px] text-text-muted">ไขมัน</p>
                  <p className="text-base font-bold font-number mt-0.5 text-ember">{a.bodyFatPercentage}<span className="text-[10px] text-text-muted ml-0.5">%</span></p>
                </div>
              </div>
            </div>

            {/* Basic info row */}
            {(a.height || a.age) && (
              <div className="flex items-center gap-3 pt-3 border-t border-glass-border">
                {a.height && (
                  <span className="text-xs text-text-dim font-number">
                    <span className="text-text-muted">ส่วนสูง</span> {a.height} cm
                  </span>
                )}
                {a.age && (
                  <span className="text-xs text-text-dim font-number">
                    <span className="text-text-muted">อายุ</span> {a.age} ปี
                  </span>
                )}
                {a.gender && (
                  <span className="text-xs text-text-dim">
                    {a.gender === "male" ? "ชาย" : "หญิง"}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* ── Body Composition ──────────────────── */}
          <div className="glass-card rounded-3xl p-6 space-y-4 animate-slide-up" style={{ animationDelay: "50ms" }}>
            <h3 className="text-sm font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ember" />
              องค์ประกอบร่างกาย
            </h3>

            {/* Stacked bar */}
            <div className="space-y-2">
              <div className="flex h-6 rounded-xl overflow-hidden">
                {(() => {
                  const total = a.weight || (a.bodyWater + a.protein + a.minerals + a.bodyFatMass);
                  const waterPct = (a.bodyWater / total) * 100;
                  const proteinPct = (a.protein / total) * 100;
                  const mineralPct = (a.minerals / total) * 100;
                  const fatPct = (a.bodyFatMass / total) * 100;
                  return (
                    <>
                      <div className="bg-sky-400 flex items-center justify-center" style={{ width: `${waterPct}%` }}>
                        <span className="text-[9px] text-white font-bold font-number">{a.bodyWater}L</span>
                      </div>
                      <div className="bg-emerald-400 flex items-center justify-center" style={{ width: `${proteinPct}%` }}>
                        <span className="text-[9px] text-white font-bold font-number">{a.protein}</span>
                      </div>
                      <div className="bg-amber-400 flex items-center justify-center" style={{ width: `${mineralPct}%` }}>
                        <span className="text-[9px] text-white font-bold font-number">{a.minerals}</span>
                      </div>
                      <div className="bg-rose-400 flex items-center justify-center" style={{ width: `${fatPct}%` }}>
                        <span className="text-[9px] text-white font-bold font-number">{a.bodyFatMass}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-sky-400" />
                  <span className="text-[10px] text-text-dim">น้ำ {a.bodyWater}L</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-emerald-400" />
                  <span className="text-[10px] text-text-dim">โปรตีน {a.protein}kg</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-amber-400" />
                  <span className="text-[10px] text-text-dim">แร่ธาตุ {a.minerals}kg</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-rose-400" />
                  <span className="text-[10px] text-text-dim">ไขมัน {a.bodyFatMass}kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Muscle-Fat Analysis ───────────────── */}
          {a.muscleFatAnalysis && (
            <div className="glass-card rounded-3xl p-6 space-y-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-mint" />
                วิเคราะห์กล้ามเนื้อ-ไขมัน
              </h3>

              <div className="space-y-4">
                {[
                  { label: "น้ำหนัก", data: a.muscleFatAnalysis.weight },
                  { label: "มวลกล้ามเนื้อ (SMM)", data: a.muscleFatAnalysis.smm },
                  { label: "มวลไขมัน", data: a.muscleFatAnalysis.bodyFat },
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-dim">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-number">{item.data.value}</span>
                        <RatingBadge rating={item.data.rating} />
                      </div>
                    </div>
                    <div className="relative h-3 bg-surface-lighter rounded-full overflow-hidden">
                      {/* Three zones */}
                      <div className="absolute inset-0 flex">
                        <div className="w-1/3 bg-sky-100 border-r border-white/50" />
                        <div className="w-1/3 bg-emerald-100 border-r border-white/50" />
                        <div className="w-1/3 bg-amber-100" />
                      </div>
                      {/* Indicator dot */}
                      <div
                        className="absolute top-0 bottom-0 flex items-center"
                        style={{
                          left: item.data.rating === "under" ? "16%" : item.data.rating === "normal" ? "50%" : "83%",
                          transform: "translateX(-50%)",
                        }}
                      >
                        <div className="w-3.5 h-3.5 rounded-full bg-charcoal border-2 border-white shadow-sm" />
                      </div>
                    </div>
                    <div className="flex justify-between text-[9px] text-text-muted">
                      <span>ต่ำ</span>
                      <span>ปกติ</span>
                      <span>สูง</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Segmental Analysis ───────────────── */}
          {(a.segmentalLean || a.segmentalFat) && (
            <div className="glass-card rounded-3xl p-6 space-y-4 animate-slide-up" style={{ animationDelay: "150ms" }}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  วิเคราะห์แต่ละส่วน
                </h3>
                <div className="flex rounded-xl overflow-hidden border border-glass-border">
                  <button
                    onClick={() => setSegmentMode("lean")}
                    className={`px-3 py-1.5 text-[10px] font-semibold transition-all ${
                      segmentMode === "lean" ? "bg-mint/10 text-mint" : "text-text-muted hover:text-text"
                    }`}
                  >
                    กล้ามเนื้อ
                  </button>
                  <button
                    onClick={() => setSegmentMode("fat")}
                    className={`px-3 py-1.5 text-[10px] font-semibold transition-all ${
                      segmentMode === "fat" ? "bg-ember/10 text-ember" : "text-text-muted hover:text-text"
                    }`}
                  >
                    ไขมัน
                  </button>
                </div>
              </div>

              <BodyDiagram
                segmentalLean={a.segmentalLean}
                segmentalFat={a.segmentalFat}
                mode={segmentMode}
              />

              {/* Detailed segment bars */}
              {(() => {
                const data = segmentMode === "lean" ? a.segmentalLean : a.segmentalFat;
                if (!data) return null;
                return (
                  <div className="space-y-3 pt-2">
                    <SegmentBar segment={data.rightArm} label="แขนขวา" />
                    <SegmentBar segment={data.leftArm} label="แขนซ้าย" />
                    <SegmentBar segment={data.trunk} label="ลำตัว" />
                    <SegmentBar segment={data.rightLeg} label="ขาขวา" />
                    <SegmentBar segment={data.leftLeg} label="ขาซ้าย" />
                  </div>
                );
              })()}

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 pt-2 border-t border-glass-border">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded bg-sky-400" />
                  <span className="text-[9px] text-text-muted">ต่ำกว่าปกติ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded bg-emerald-400" />
                  <span className="text-[9px] text-text-muted">ปกติ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded bg-amber-400" />
                  <span className="text-[9px] text-text-muted">สูงกว่าปกติ</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Health Risk Indicators ────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
            {/* BMI Gauge */}
            <div className="glass-card rounded-3xl p-5 space-y-3">
              <h4 className="text-xs font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                BMI
              </h4>
              <GaugeBar
                value={a.bmi}
                min={10}
                max={40}
                zones={[
                  { end: 18.5, color: "bg-sky-300", label: "ผอม" },
                  { end: 25, color: "bg-emerald-300", label: "ปกติ" },
                  { end: 30, color: "bg-amber-300", label: "อ้วน" },
                  { end: 40, color: "bg-rose-300", label: "อ้วนมาก" },
                ]}
                label="ค่าดัชนีมวลกาย"
              />
            </div>

            {/* Body Fat % Gauge */}
            <div className="glass-card rounded-3xl p-5 space-y-3">
              <h4 className="text-xs font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                เปอร์เซ็นต์ไขมัน
              </h4>
              <GaugeBar
                value={a.bodyFatPercentage}
                min={5}
                max={45}
                zones={[
                  { end: 10, color: "bg-sky-300", label: "ต่ำ" },
                  { end: 20, color: "bg-emerald-300", label: "ปกติ" },
                  { end: 30, color: "bg-amber-300", label: "สูง" },
                  { end: 45, color: "bg-rose-300", label: "สูงมาก" },
                ]}
                label="% ไขมันในร่างกาย"
                unit="%"
              />
            </div>

            {/* Visceral Fat */}
            {a.visceralFatLevel != null && (
              <div className="glass-card rounded-3xl p-5 space-y-3">
                <h4 className="text-xs font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-danger" />
                  ไขมันในช่องท้อง
                </h4>
                <GaugeBar
                  value={a.visceralFatLevel}
                  min={0}
                  max={20}
                  zones={[
                    { end: 10, color: "bg-emerald-300", label: "ปกติ" },
                    { end: 15, color: "bg-amber-300", label: "สูง" },
                    { end: 20, color: "bg-rose-300", label: "อันตราย" },
                  ]}
                  label="Visceral Fat Level"
                />
              </div>
            )}

            {/* Waist-Hip Ratio */}
            {a.waistHipRatio != null && (
              <div className="glass-card rounded-3xl p-5 space-y-3">
                <h4 className="text-xs font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  สัดส่วนเอว-สะโพก
                </h4>
                <GaugeBar
                  value={a.waistHipRatio}
                  min={0.6}
                  max={1.1}
                  zones={[
                    { end: 0.8, color: "bg-emerald-300", label: "ปกติ" },
                    { end: 0.9, color: "bg-amber-300", label: "เฝ้าระวัง" },
                    { end: 1.1, color: "bg-rose-300", label: "เสี่ยง" },
                  ]}
                  label="Waist-Hip Ratio"
                />
              </div>
            )}
          </div>

          {/* ── Weight Control ────────────────────── */}
          {a.weightControl && (
            <div className="glass-card rounded-3xl p-6 space-y-4 animate-slide-up" style={{ animationDelay: "250ms" }}>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                เป้าหมายการควบคุมน้ำหนัก
              </h3>

              <div className="flex items-center justify-between bg-surface-light rounded-2xl p-4">
                <div className="text-center">
                  <p className="text-[10px] text-text-muted">น้ำหนักปัจจุบัน</p>
                  <p className="text-xl font-bold font-number mt-1">{a.weight}<span className="text-xs text-text-muted ml-0.5">kg</span></p>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B8B3A8" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
                <div className="text-center">
                  <p className="text-[10px] text-text-muted">น้ำหนักเป้าหมาย</p>
                  <p className="text-xl font-bold font-number mt-1 text-mint">{a.weightControl.targetWeight}<span className="text-xs text-text-muted ml-0.5">kg</span></p>
                </div>
              </div>

              <div className="space-y-2">
                <WeightControlBar
                  label="ควบคุมน้ำหนัก"
                  value={a.weightControl.weightControl}
                  unit="kg"
                  isPositive={false}
                />
                <WeightControlBar
                  label="ลดไขมัน"
                  value={a.weightControl.fatControl}
                  unit="kg"
                  isPositive={false}
                />
                <WeightControlBar
                  label="เพิ่มกล้ามเนื้อ"
                  value={a.weightControl.muscleControl}
                  unit="kg"
                  isPositive={true}
                />
              </div>
            </div>
          )}

          {/* ── Advanced Metrics ──────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: "300ms" }}>
            {a.bmr != null && (
              <StatCard label="BMR" value={a.bmr} unit="kcal/day" color="text-ember" subtext="อัตราเผาผลาญพื้นฐาน" />
            )}
            {a.fatFreeMass != null && (
              <StatCard label="Fat Free Mass" value={a.fatFreeMass} unit="kg" color="text-mint" subtext="มวลร่างกายไร้ไขมัน" />
            )}
            {a.obesityDegree != null && (
              <StatCard label="Obesity Degree" value={`${a.obesityDegree}%`} subtext="ระดับโรคอ้วน" />
            )}
            {a.smi != null && (
              <StatCard label="SMI" value={a.smi} unit="kg/m²" subtext="ดัชนีมวลกล้ามเนื้อ" />
            )}
          </div>

          {/* ── Nutrition Plan ────────────────────── */}
          <div className="glass-card rounded-3xl p-6 space-y-4 animate-slide-up" style={{ animationDelay: "350ms" }}>
            <h3 className="text-sm font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ember" />
              แผนโภชนาการแนะนำ
            </h3>

            <div className="bg-ember/5 border border-ember/15 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-text-muted uppercase tracking-wider">แคลอรี่แนะนำต่อวัน</p>
                <p className="text-2xl font-bold text-ember font-number mt-1">{selectedAnalysis.recommendedCalories}</p>
              </div>
              <div className="text-3xl">🔥</div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-mint/10 border border-mint/20 rounded-2xl p-4 text-center">
                <p className="text-[10px] text-mint-dim uppercase tracking-wider font-semibold">โปรตีน</p>
                <p className="text-lg font-bold text-mint font-number mt-1">{a.macros.protein}<span className="text-xs">g</span></p>
                <p className="text-[10px] text-text-muted mt-1 font-number">
                  {Math.round((a.macros.protein * 4 / selectedAnalysis.recommendedCalories) * 100)}%
                </p>
              </div>
              <div className="bg-ember/10 border border-ember/20 rounded-2xl p-4 text-center">
                <p className="text-[10px] text-ember-dim uppercase tracking-wider font-semibold">คาร์บ</p>
                <p className="text-lg font-bold text-ember font-number mt-1">{a.macros.carbs}<span className="text-xs">g</span></p>
                <p className="text-[10px] text-text-muted mt-1 font-number">
                  {Math.round((a.macros.carbs * 4 / selectedAnalysis.recommendedCalories) * 100)}%
                </p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-center">
                <p className="text-[10px] text-amber-700 uppercase tracking-wider font-semibold">ไขมัน</p>
                <p className="text-lg font-bold text-amber-600 font-number mt-1">{a.macros.fat}<span className="text-xs">g</span></p>
                <p className="text-[10px] text-text-muted mt-1 font-number">
                  {Math.round((a.macros.fat * 9 / selectedAnalysis.recommendedCalories) * 100)}%
                </p>
              </div>
            </div>

            {/* Macro donut visual */}
            <div className="flex items-center justify-center py-2">
              {(() => {
                const proteinCal = a.macros.protein * 4;
                const carbsCal = a.macros.carbs * 4;
                const fatCal = a.macros.fat * 9;
                const total = proteinCal + carbsCal + fatCal;
                const pPct = (proteinCal / total) * 100;
                const cPct = (carbsCal / total) * 100;

                const r = 50;
                const circ = 2 * Math.PI * r;
                const pLen = (pPct / 100) * circ;
                const cLen = (cPct / 100) * circ;
                const fLen = circ - pLen - cLen;

                return (
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    {/* Protein arc */}
                    <circle cx="60" cy="60" r={r} fill="none" stroke="#4CAF82" strokeWidth="12"
                      strokeDasharray={`${pLen} ${circ - pLen}`}
                      strokeDashoffset={circ / 4}
                      strokeLinecap="round"
                    />
                    {/* Carbs arc */}
                    <circle cx="60" cy="60" r={r} fill="none" stroke="#D4725C" strokeWidth="12"
                      strokeDasharray={`${cLen} ${circ - cLen}`}
                      strokeDashoffset={circ / 4 - pLen}
                      strokeLinecap="round"
                    />
                    {/* Fat arc */}
                    <circle cx="60" cy="60" r={r} fill="none" stroke="#F59E0B" strokeWidth="12"
                      strokeDasharray={`${fLen} ${circ - fLen}`}
                      strokeDashoffset={circ / 4 - pLen - cLen}
                      strokeLinecap="round"
                    />
                    <text x="60" y="56" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2C2A25" fontFamily="Space Mono, monospace">
                      {selectedAnalysis.recommendedCalories}
                    </text>
                    <text x="60" y="70" textAnchor="middle" fontSize="9" fill="#8A857C">
                      kcal/day
                    </text>
                  </svg>
                );
              })()}
            </div>
          </div>

          {/* ── AI Health Summary ─────────────────── */}
          {a.healthSummary && (
            <div className="glass-card rounded-3xl p-6 space-y-3 animate-slide-up" style={{ animationDelay: "400ms" }}>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-charcoal" />
                สรุปสุขภาพโดยรวม
              </h3>
              <p className="text-sm text-text-dim leading-relaxed">{a.healthSummary}</p>
            </div>
          )}

          {/* ── Strengths & Improvements ──────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: "450ms" }}>
            {a.strengths && a.strengths.length > 0 && (
              <div className="glass-card rounded-3xl p-5 space-y-3">
                <h4 className="text-xs font-bold flex items-center gap-2 text-mint">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M2 8l3 3 7-8" />
                  </svg>
                  จุดแข็งของร่างกาย
                </h4>
                <ul className="space-y-2">
                  {a.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-text-dim leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-mint/50 mt-1.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {a.improvements && a.improvements.length > 0 && (
              <div className="glass-card rounded-3xl p-5 space-y-3">
                <h4 className="text-xs font-bold flex items-center gap-2 text-amber-600">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M7 2v7M7 12v0" />
                  </svg>
                  จุดที่ต้องปรับปรุง
                </h4>
                <ul className="space-y-2">
                  {a.improvements.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-text-dim leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50 mt-1.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ── Health Risks ─────────────────────── */}
          {a.healthRisks && a.healthRisks.length > 0 && (
            <div className="bg-danger/5 border border-danger/15 rounded-3xl p-5 space-y-3 animate-slide-up" style={{ animationDelay: "500ms" }}>
              <h4 className="text-xs font-bold flex items-center gap-2 text-danger">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M7 1L1 12h12L7 1zM7 5v3M7 10v0" />
                </svg>
                ความเสี่ยงด้านสุขภาพ
              </h4>
              <ul className="space-y-2">
                {a.healthRisks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-danger/80 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-danger/40 mt-1.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Exercise Plan ────────────────────── */}
          {a.exercisePlan && (
            <div className="glass-card rounded-3xl p-6 space-y-3 animate-slide-up" style={{ animationDelay: "550ms" }}>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                แผนออกกำลังกายแนะนำ
              </h3>
              <p className="text-sm text-text-dim leading-relaxed whitespace-pre-line">{a.exercisePlan}</p>
            </div>
          )}

          {/* ── Goals ────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: "600ms" }}>
            {a.shortTermGoals && a.shortTermGoals.length > 0 && (
              <div className="glass-card rounded-3xl p-5 space-y-3">
                <h4 className="text-xs font-bold flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-ember">
                    <circle cx="7" cy="7" r="5" />
                    <circle cx="7" cy="7" r="2" fill="currentColor" />
                  </svg>
                  <span className="text-ember">เป้าหมายระยะสั้น</span>
                  <span className="text-[10px] text-text-muted font-normal">1-3 เดือน</span>
                </h4>
                <ul className="space-y-2">
                  {a.shortTermGoals.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-text-dim leading-relaxed">
                      <span className="text-text-muted font-number text-[10px] mt-0.5">{String(i + 1).padStart(2, "0")}.</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {a.longTermGoals && a.longTermGoals.length > 0 && (
              <div className="glass-card rounded-3xl p-5 space-y-3">
                <h4 className="text-xs font-bold flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-mint">
                    <path d="M2 12L7 2l5 10" />
                    <path d="M4 8h6" />
                  </svg>
                  <span className="text-mint">เป้าหมายระยะยาว</span>
                  <span className="text-[10px] text-text-muted font-normal">6-12 เดือน</span>
                </h4>
                <ul className="space-y-2">
                  {a.longTermGoals.map((g, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-text-dim leading-relaxed">
                      <span className="text-text-muted font-number text-[10px] mt-0.5">{String(i + 1).padStart(2, "0")}.</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ── Full Recommendations ─────────────── */}
          {a.recommendations && (
            <div className="glass-card rounded-3xl p-6 space-y-3 animate-slide-up" style={{ animationDelay: "650ms" }}>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                คำแนะนำจาก AI
              </h3>
              <p className="text-sm text-text-dim leading-relaxed whitespace-pre-line">{a.recommendations}</p>
            </div>
          )}

          {/* ── History Comparison ────────────────── */}
          {history.length >= 2 && (
            <div className="glass-card rounded-3xl p-6 space-y-4 animate-slide-up" style={{ animationDelay: "700ms" }}>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                เปรียบเทียบประวัติ
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-glass-border">
                      <th className="text-left py-2 text-text-muted font-medium">ค่า</th>
                      {history.slice(0, 4).reverse().map((item) => (
                        <th key={item.id} className="text-center py-2 text-text-muted font-medium font-number">
                          {new Date(item.uploadedAt).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="font-number">
                    {[
                      { label: "น้ำหนัก", key: "weight" as const, unit: "kg" },
                      { label: "กล้ามเนื้อ", key: "skeletalMuscleMass" as const, unit: "kg" },
                      { label: "ไขมัน", key: "bodyFatMass" as const, unit: "kg" },
                      { label: "BMI", key: "bmi" as const, unit: "" },
                      { label: "% ไขมัน", key: "bodyFatPercentage" as const, unit: "%" },
                      { label: "Score", key: "inbodyScore" as const, unit: "" },
                    ].map((row) => (
                      <tr key={row.key} className="border-b border-glass-border/50">
                        <td className="py-2 text-text-dim">{row.label}</td>
                        {history.slice(0, 4).reverse().map((item, i, arr) => {
                          const val = item.analysis[row.key];
                          const prevVal = i > 0 ? arr[i - 1].analysis[row.key] : null;
                          const diff = prevVal != null ? val - prevVal : null;
                          const improved =
                            row.key === "inbodyScore" || row.key === "skeletalMuscleMass"
                              ? diff != null && diff > 0
                              : row.key === "bodyFatMass" || row.key === "bodyFatPercentage"
                              ? diff != null && diff < 0
                              : null;

                          return (
                            <td key={item.id} className="text-center py-2">
                              <span className="font-semibold">{val}{row.unit}</span>
                              {diff != null && diff !== 0 && (
                                <span className={`block text-[9px] ${improved ? "text-mint" : "text-danger"}`}>
                                  {diff > 0 ? "+" : ""}{diff.toFixed(1)}
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
