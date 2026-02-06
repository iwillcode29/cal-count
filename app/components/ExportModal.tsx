"use client";

import { useState } from "react";
import { type FoodEntry, type NutritionInfo } from "@/lib/storage";
import ExportCard from "./ExportCard";
import {
  exportToImage,
  downloadImage,
  shareImage,
  canShare,
} from "@/lib/exportImage";

interface ExportModalProps {
  date: string;
  entries: FoodEntry[];
  totalCalories: number;
  totalNutrition: NutritionInfo | null;
  goal: number;
  onClose: () => void;
}

export default function ExportModal({
  date,
  entries,
  totalCalories,
  totalNutrition,
  goal,
  onClose,
}: ExportModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const handleExport = async (action: "download" | "share") => {
    setIsExporting(true);
    try {
      // Wait for fonts to load
      if (document.fonts) {
        await document.fonts.ready;
      }
      
      // Hide preview temporarily to capture the card
      setShowPreview(false);

      // Wait for DOM update and ensure fonts are applied
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const blob = await exportToImage("export-card");

      // Show preview again
      setShowPreview(true);

      if (!blob) {
        alert("ไม่สามารถสร้างรูปภาพได้ กรุณาลองใหม่อีกครั้ง");
        return;
      }

      if (action === "download") {
        const filename = `cal-count-${date}.png`;
        await downloadImage(blob, filename);
      } else if (action === "share") {
        await shareImage(
          blob,
          `Cal Count - ${date}`,
          `แคลอรี่วันนี้: ${totalCalories.toLocaleString()} แคล`
        );
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("เกิดข้อผิดพลาดในการ export รูปภาพ");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-surface/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text">Export รูปภาพ</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-glass-hover transition-colors text-text-muted"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M5 5L15 15M5 15L15 5" />
            </svg>
          </button>
        </div>


          {/* Action Buttons */}
          <div className="flex gap-3 justify-center mt-3">
            <button
              onClick={() => handleExport("download")}
              disabled={isExporting}
              className="px-6 py-3 bg-ember hover:bg-ember-dim text-white rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>กำลังสร้างรูป...</span>
                </>
              ) : (
                <>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 17v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2" />
                    <path d="M10 3v12" />
                    <path d="M6 11l4 4 4-4" />
                  </svg>
                  <span>ดาวน์โหลด</span>
                </>
              )}
            </button>

            {canShare() && (
              <button
                onClick={() => handleExport("share")}
                disabled={isExporting}
                className="px-6 py-3 bg-glass-card hover:bg-glass-hover text-text rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="14" cy="4" r="2" />
                  <circle cx="6" cy="10" r="2" />
                  <circle cx="14" cy="16" r="2" />
                  <path d="M8 10.5l4-2M8 9.5l4 5" />
                </svg>
                <span>แชร์</span>
              </button>
            )}
          </div>

          <div className="mt-4 text-xs text-text-muted text-center">
            รูปภาพจะมีขนาด 600x800 พิกเซล เหมาะสำหรับแชร์ SNS
          </div>

        {/* Preview */}
        <div className="p-6">
          <div className="mb-4 text-sm text-text-dim text-center">
            ตัวอย่างรูปภาพที่จะถูก export
          </div>

          {/* Card Preview - shown by default, hidden during export */}
          <div
            className={`flex justify-center mb-6 ${
              showPreview ? "" : "absolute -left-[9999px]"
            }`}
          >
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
              <div className="scale-90 origin-top">
                <ExportCard
                  date={date}
                  entries={entries}
                  totalCalories={totalCalories}
                  totalNutrition={totalNutrition}
                  goal={goal}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
