"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getToday,
  getDayData,
  addEntry,
  deleteEntry,
  getTotalCalories,
  getTotalNutrition,
  getGoal,
  setGoal as saveGoal,
  getMacroGoals,
  setMacroGoals as saveMacroGoals,
  getDateOffset,
  type FoodEntry,
  type NutritionInfo,
  type MacroGoals,
} from "@/lib/storage";
import DaySummary from "./components/DaySummary";
import FoodList from "./components/FoodList";
import AddFoodForm from "./components/AddFoodForm";
import GoalSetter from "./components/GoalSetter";
import HistoryView from "./components/HistoryView";
import NutritionDashboard from "./components/NutritionDashboard";
import MacroGoalsSetter from "./components/MacroGoalsSetter";
import MacroAlert from "./components/MacroAlert";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(getToday());
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [goal, setGoalState] = useState(2000);
  const [macroGoals, setMacroGoalsState] = useState<MacroGoals>({ protein: 150, carbs: 250, fat: 65 });
  const [showGoalSetter, setShowGoalSetter] = useState(false);
  const [showMacroGoalsSetter, setShowMacroGoalsSetter] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [mounted, setMounted] = useState(false);

  const loadDay = useCallback((date: string) => {
    const data = getDayData(date);
    setEntries(data.entries);
    setGoalState(data.goal);
  }, []);

  useEffect(() => {
    setMounted(true);
    loadDay(currentDate);
    setMacroGoalsState(getMacroGoals());
  }, [currentDate, loadDay]);

  const handleAddFood = (name: string, calories: number, nutrition?: NutritionInfo) => {
    const entry = addEntry(currentDate, name, calories, nutrition);
    setEntries((prev) => [entry, ...prev]);
  };

  const handleDeleteFood = (id: string) => {
    deleteEntry(currentDate, id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleGoalSave = (newGoal: number) => {
    saveGoal(newGoal);
    setGoalState(newGoal);
    setShowGoalSetter(false);
  };

  const handleMacroGoalsSave = (newGoals: MacroGoals) => {
    saveMacroGoals(newGoals);
    setMacroGoalsState(newGoals);
    setShowMacroGoalsSetter(false);
  };

  const handlePrevDay = () => {
    setCurrentDate((d) => getDateOffset(d, -1));
  };

  const handleNextDay = () => {
    const today = getToday();
    setCurrentDate((currentDate) => {
      const next = getDateOffset(currentDate, 1);
      // Compare as dates to ensure correct comparison
      const nextDate = new Date(next + "T00:00:00");
      const todayDate = new Date(today + "T00:00:00");
      
      // Don't go beyond today
      if (nextDate > todayDate) {
        return currentDate;
      }
      return next;
    });
  };

  const handleSelectDay = (date: string) => {
    setCurrentDate(date);
    setShowHistory(false);
  };

  const isToday = currentDate === getToday();
  const totalCalories = getTotalCalories(entries);
  const totalNutrition = getTotalNutrition(entries);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <div className="w-8 h-8 border-2 border-ember/30 border-t-ember rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <DaySummary
        date={currentDate}
        totalCalories={totalCalories}
        totalNutrition={totalNutrition}
        goal={goal}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        onGoalClick={() => setShowGoalSetter(true)}
      />

      {/* Nutrition Dashboard */}
      {totalNutrition && (
        <>
          <NutritionDashboard
            nutrition={totalNutrition}
            goals={macroGoals}
            onGoalsClick={() => setShowMacroGoalsSetter(true)}
          />
          {/* Macro Alerts */}
          <MacroAlert nutrition={totalNutrition} goals={macroGoals} />
        </>
      )}

      {/* Food list */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-text-dim tracking-wide uppercase">
            รายการอาหาร
            <span className="font-number text-text-muted ml-2">({entries.length})</span>
          </h3>
          <button
            onClick={() => setShowHistory(true)}
            className="text-xs text-ember hover:text-ember-dim transition-colors font-medium tracking-wide"
          >
            ดูประวัติ
          </button>
        </div>
        <FoodList entries={entries} onDelete={handleDeleteFood} goal={goal} />
      </div>

      {/* Add food form — only shown for today */}
      {isToday && (
        <div className="sticky bottom-4">
          <AddFoodForm onAdd={handleAddFood} />
        </div>
      )}

      {/* Modals */}
      {showGoalSetter && (
        <GoalSetter
          currentGoal={goal}
          onSave={handleGoalSave}
          onClose={() => setShowGoalSetter(false)}
        />
      )}
      {showMacroGoalsSetter && (
        <MacroGoalsSetter
          currentGoals={macroGoals}
          onSave={handleMacroGoalsSave}
          onClose={() => setShowMacroGoalsSetter(false)}
        />
      )}
      {showHistory && (
        <HistoryView
          onSelectDay={handleSelectDay}
          onClose={() => setShowHistory(false)}
        />
      )}
    </>
  );
}
