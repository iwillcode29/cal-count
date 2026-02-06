"use client";

import { useEffect, useState } from "react";

interface CalorieRingProps {
  current: number;
  goal: number;
  size?: number;
}

export default function CalorieRing({ current, goal, size = 180 }: CalorieRingProps) {
  const [mounted, setMounted] = useState(false);
  const strokeWidth = 8;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(current / goal, 1);
  const offset = circumference * (1 - progress);
  const isOver = current > goal;
  const remaining = Math.max(goal - current, 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const strokeColor = isOver ? "var(--color-danger)" : "var(--color-mint)";
  const glowClass = isOver ? "ring-glow-danger" : "ring-glow-mint";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className={`-rotate-90 ${mounted ? glowClass : ""}`}>
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-surface-lighter)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={mounted ? offset : circumference}
          style={{
            transition: "stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-number text-4xl font-bold leading-none tracking-tight ${isOver ? "text-danger" : "text-mint"}`}>
          {current.toLocaleString()}
        </span>
        <span className="text-text-muted text-[11px] mt-1.5 font-medium tracking-wider uppercase">
          / {goal.toLocaleString()} แคล
        </span>
        {!isOver && remaining > 0 && (
          <span className="text-text-dim text-[10px] mt-2 font-number">
            เหลือ {remaining.toLocaleString()}
          </span>
        )}
        {isOver && (
          <span className="text-danger text-[10px] mt-2 font-number">
            เกิน {(current - goal).toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}
