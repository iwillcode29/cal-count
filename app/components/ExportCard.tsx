"use client";

import { formatThaiDate, type FoodEntry, type NutritionInfo, type MealType } from "@/lib/storage";

interface ExportCardProps {
  date: string;
  entries: FoodEntry[];
  totalCalories: number;
  totalNutrition: NutritionInfo | null;
  goal: number;
}

const mealConfig = {
  breakfast: { label: "มื้อเช้า", icon: "🌅", emoji: "🌅" },
  lunch: { label: "มื้อกลางวัน", icon: "☀️", emoji: "☀️" },
  dinner: { label: "มื้อเย็น", icon: "🌙", emoji: "🌙" }
};

export default function ExportCard({
  date,
  entries,
  totalCalories,
  totalNutrition,
  goal,
}: ExportCardProps) {
  const progressPercent = Math.round((totalCalories / goal) * 100);
  
  // Group entries by meal (fallback to lunch for legacy data)
  const breakfastEntries = entries.filter(e => e.meal === "breakfast");
  const lunchEntries = entries.filter(e => e.meal === "lunch" || !e.meal);
  const dinnerEntries = entries.filter(e => e.meal === "dinner");
  
  const getMealCalories = (mealEntries: FoodEntry[]) => {
    return mealEntries.reduce((sum, e) => sum + e.calories, 0);
  };

  return (
    <div
      id="export-card"
      style={{
        width: "600px",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        padding: "32px",
        borderRadius: "16px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans Thai', 'Sarabun', sans-serif",
        color: "#ffffff",
        fontWeight: "400",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom: "1px solid #334155",
        }}
      >
        <h1
          style={{
            fontSize: "12px",
            fontWeight: "700",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#94a3b8",
            marginBottom: "8px",
          }}
        >
          CAL COUNT
        </h1>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#ffffff",
          }}
        >
          {formatThaiDate(date)}
        </h2>
      </div>

      {/* Summary Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            background: "rgba(30, 41, 59, 0.5)",
            borderRadius: "12px",
            padding: "16px",
            textAlign: "center",
            border: "1px solid rgba(51, 65, 85, 0.5)",
          }}
        >
          <div
            style={{
              fontSize: "30px",
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: "4px",
            }}
          >
            {totalCalories.toLocaleString()}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#94a3b8",
              letterSpacing: "0.05em",
            }}
          >
            แคลอรี่
          </div>
        </div>
        <div
          style={{
            background: "rgba(30, 41, 59, 0.5)",
            borderRadius: "12px",
            padding: "16px",
            textAlign: "center",
            border: "1px solid rgba(51, 65, 85, 0.5)",
          }}
        >
          <div
            style={{
              fontSize: "30px",
              fontWeight: "700",
              marginBottom: "4px",
              color:
                progressPercent >= 100
                  ? progressPercent > 110
                    ? "#fb923c"
                    : "#34d399"
                  : "#ffffff",
            }}
          >
            {progressPercent}%
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#94a3b8",
              letterSpacing: "0.05em",
            }}
          >
            ความสำเร็จ
          </div>
        </div>
        <div
          style={{
            background: "rgba(30, 41, 59, 0.5)",
            borderRadius: "12px",
            padding: "16px",
            textAlign: "center",
            border: "1px solid rgba(51, 65, 85, 0.5)",
          }}
        >
          <div
            style={{
              fontSize: "30px",
              fontWeight: "700",
              color: "#ffffff",
              marginBottom: "4px",
            }}
          >
            {entries.length}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#94a3b8",
              letterSpacing: "0.05em",
            }}
          >
            รายการ
          </div>
        </div>
      </div>

      {/* Macros */}
      {totalNutrition && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              background: "rgba(14, 165, 233, 0.1)",
              borderRadius: "12px",
              padding: "12px",
              textAlign: "center",
              border: "1px solid rgba(14, 165, 233, 0.2)",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#38bdf8",
                marginBottom: "4px",
              }}
            >
              {Math.round(totalNutrition.protein)}g
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                letterSpacing: "0.05em",
              }}
            >
              โปรตีน
            </div>
          </div>
          <div
            style={{
              background: "rgba(245, 158, 11, 0.1)",
              borderRadius: "12px",
              padding: "12px",
              textAlign: "center",
              border: "1px solid rgba(245, 158, 11, 0.2)",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#fbbf24",
                marginBottom: "4px",
              }}
            >
              {Math.round(totalNutrition.carbs)}g
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                letterSpacing: "0.05em",
              }}
            >
              คาร์บ
            </div>
          </div>
          <div
            style={{
              background: "rgba(244, 63, 94, 0.1)",
              borderRadius: "12px",
              padding: "12px",
              textAlign: "center",
              border: "1px solid rgba(244, 63, 94, 0.2)",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#fb7185",
                marginBottom: "4px",
              }}
            >
              {Math.round(totalNutrition.fat)}g
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#94a3b8",
                letterSpacing: "0.05em",
              }}
            >
              ไขมัน
            </div>
          </div>
        </div>
      )}

      {/* Meals */}
      <div>
        <h3
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "#cbd5e1",
            marginBottom: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          รายการอาหาร ({entries.length} รายการ)
        </h3>

        {/* Breakfast */}
        {breakfastEntries.length > 0 && (
          <div
            style={{
              background: "rgba(251, 146, 60, 0.1)",
              borderRadius: "12px",
              padding: "12px",
              border: "1px solid rgba(251, 146, 60, 0.2)",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#fbbf24" }}>
                {mealConfig.breakfast.emoji} {mealConfig.breakfast.label}
              </div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#fbbf24" }}>
                {getMealCalories(breakfastEntries).toLocaleString()} แคล
              </div>
            </div>
            {breakfastEntries.map((entry) => (
              <div
                key={entry.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 10px",
                  background: "rgba(30, 41, 59, 0.4)",
                  borderRadius: "8px",
                  marginBottom: "6px",
                }}
              >
                <div style={{ flex: 1, fontSize: "13px", fontWeight: "500", color: "#ffffff" }}>
                  {entry.name}
                </div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#34d399", marginLeft: "12px" }}>
                  {entry.calories.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lunch */}
        {lunchEntries.length > 0 && (
          <div
            style={{
              background: "rgba(56, 189, 248, 0.1)",
              borderRadius: "12px",
              padding: "12px",
              border: "1px solid rgba(56, 189, 248, 0.2)",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#38bdf8" }}>
                {mealConfig.lunch.emoji} {mealConfig.lunch.label}
              </div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#38bdf8" }}>
                {getMealCalories(lunchEntries).toLocaleString()} แคล
              </div>
            </div>
            {lunchEntries.map((entry) => (
              <div
                key={entry.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 10px",
                  background: "rgba(30, 41, 59, 0.4)",
                  borderRadius: "8px",
                  marginBottom: "6px",
                }}
              >
                <div style={{ flex: 1, fontSize: "13px", fontWeight: "500", color: "#ffffff" }}>
                  {entry.name}
                </div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#34d399", marginLeft: "12px" }}>
                  {entry.calories.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dinner */}
        {dinnerEntries.length > 0 && (
          <div
            style={{
              background: "rgba(168, 85, 247, 0.1)",
              borderRadius: "12px",
              padding: "12px",
              border: "1px solid rgba(168, 85, 247, 0.2)",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: "600", color: "#a855f7" }}>
                {mealConfig.dinner.emoji} {mealConfig.dinner.label}
              </div>
              <div style={{ fontSize: "12px", fontWeight: "600", color: "#a855f7" }}>
                {getMealCalories(dinnerEntries).toLocaleString()} แคล
              </div>
            </div>
            {dinnerEntries.map((entry) => (
              <div
                key={entry.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 10px",
                  background: "rgba(30, 41, 59, 0.4)",
                  borderRadius: "8px",
                  marginBottom: "6px",
                }}
              >
                <div style={{ flex: 1, fontSize: "13px", fontWeight: "500", color: "#ffffff" }}>
                  {entry.name}
                </div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#34d399", marginLeft: "12px" }}>
                  {entry.calories.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {entries.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#64748b",
              padding: "24px 0",
              background: "rgba(30, 41, 59, 0.3)",
              borderRadius: "12px",
              border: "1px solid rgba(51, 65, 85, 0.5)",
            }}
          >
            ยังไม่มีรายการอาหาร
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: "24px",
          paddingTop: "16px",
          borderTop: "1px solid #334155",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            color: "#64748b",
          }}
        >
          เป้าหมาย: {goal.toLocaleString()} แคลอรี่
        </div>
      </div>
    </div>
  );
}
