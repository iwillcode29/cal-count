"use client";

import { getDaysWithData, getDayData, getTotalCalories, formatThaiDate, getGoal, getAllEntries } from "@/lib/storage";

interface HistoryViewProps {
  onSelectDay: (date: string) => void;
  onClose: () => void;
}

export default function HistoryView({ onSelectDay, onClose }: HistoryViewProps) {
  const days = getDaysWithData(60);
  const goal = getGoal();

  return (
    <div className="fixed inset-0 z-50 flex flex-col" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div
        className="relative mt-auto bg-surface border-t border-glass-border rounded-t-3xl p-5 pb-8 w-full max-w-md mx-auto shadow-xl animate-scale-in max-h-[70vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold tracking-wide">ประวัติ</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full glass-card hover:bg-glass-hover transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-text-dim">
              <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" />
            </svg>
          </button>
        </div>

        {days.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8">ยังไม่มีประวัติ</p>
        ) : (
          <div className="flex flex-col gap-2">
            {days.map((date, i) => {
              const data = getDayData(date);
              const allEntries = getAllEntries(data.meals);
              const total = getTotalCalories(allEntries);
              const progress = Math.min(total / goal, 1);
              const isOver = total > goal;
              return (
                <button
                  key={date}
                  onClick={() => onSelectDay(date)}
                  className="flex items-center justify-between py-3.5 px-4 glass-card rounded-2xl text-left animate-slide-in"
                  style={{ animationDelay: `${i * 30}ms`, animationFillMode: "backwards" }}
                >
                  <div>
                    <p className="text-sm font-medium">{formatThaiDate(date)}</p>
                    <p className="text-[11px] text-text-muted font-number">{allEntries.length} รายการ</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-1.5 bg-surface-lighter rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${progress * 100}%`,
                          backgroundColor: isOver ? "var(--color-danger)" : "var(--color-mint)",
                        }}
                      />
                    </div>
                    <span className={`font-number text-sm font-bold w-14 text-right ${isOver ? "text-danger" : "text-mint"}`}>
                      {total.toLocaleString()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
