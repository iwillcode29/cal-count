"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getToday,
  getDayData,
  addEntry,
  deleteEntry,
  updateEntry,
  getTotalCalories,
  getTotalNutrition,
  getGoal,
  setGoal as saveGoal,
  getMacroGoals,
  setMacroGoals as saveMacroGoals,
  getDateOffset,
  getAllEntries,
  type FoodEntry,
  type NutritionInfo,
  type MacroGoals,
  type MealData,
  type MealType,
} from "@/lib/storage";
import DaySummary from "./components/DaySummary";
import MealSection from "./components/MealSection";
import AddFoodForm from "./components/AddFoodForm";
import GoalSetter from "./components/GoalSetter";
import HistoryView from "./components/HistoryView";
import NutritionDashboard from "./components/NutritionDashboard";
import MacroGoalsSetter from "./components/MacroGoalsSetter";
import MacroAlert from "./components/MacroAlert";
import LatestInBodyCard from "./components/LatestInBodyCard";
import ExportModal from "./components/ExportModal";
import EditFoodModal from "./components/EditFoodModal";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(getToday());
  const [meals, setMeals] = useState<MealData>({ breakfast: [], lunch: [], dinner: [] });
  const [goal, setGoalState] = useState(2000);
  const [macroGoals, setMacroGoalsState] = useState<MacroGoals>({ protein: 150, carbs: 250, fat: 65 });
  const [showGoalSetter, setShowGoalSetter] = useState(false);
  const [showMacroGoalsSetter, setShowMacroGoalsSetter] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<{ entry: FoodEntry; meal: MealType } | null>(null);
  const [mounted, setMounted] = useState(false);

  const loadDay = useCallback((date: string) => {
    const data = getDayData(date);
    setMeals(data.meals);
    setGoalState(data.goal);
  }, []);

  useEffect(() => {
    setMounted(true);
    loadDay(currentDate);
    setMacroGoalsState(getMacroGoals());
  }, [currentDate, loadDay]);

  const handleAddFood = (name: string, calories: number, meal: MealType, nutrition?: NutritionInfo) => {
    const entry = addEntry(currentDate, name, calories, meal, nutrition);
    setMeals((prev) => ({
      ...prev,
      [meal]: [entry, ...prev[meal]]
    }));
  };

  const handleDeleteFood = (id: string, meal: MealType) => {
    deleteEntry(currentDate, id, meal);
    setMeals((prev) => ({
      ...prev,
      [meal]: prev[meal].filter((e) => e.id !== id)
    }));
  };

  const handleEditFood = (id: string, meal: MealType) => {
    const entry = meals[meal].find((e) => e.id === id);
    if (entry) {
      setEditingEntry({ entry, meal });
    }
  };

  const handleSaveEdit = (name: string, calories: number, newMeal: MealType, nutrition?: NutritionInfo) => {
    if (!editingEntry) return;

    const result = updateEntry(currentDate, editingEntry.entry.id, editingEntry.meal, {
      name,
      calories,
      nutrition,
      newMeal,
    });

    if (result) {
      const { entry: updatedEntry, oldMeal, newMeal: finalMeal } = result;
      
      setMeals((prev) => {
        if (oldMeal === finalMeal) {
          // Same meal, just update
          return {
            ...prev,
            [oldMeal]: prev[oldMeal].map((e) =>
              e.id === updatedEntry.id ? updatedEntry : e
            ),
          };
        } else {
          // Moved to different meal
          return {
            ...prev,
            [oldMeal]: prev[oldMeal].filter((e) => e.id !== updatedEntry.id),
            [finalMeal]: [updatedEntry, ...prev[finalMeal]],
          };
        }
      });
    }

    setEditingEntry(null);
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
  const allEntries = getAllEntries(meals);
  const totalCalories = getTotalCalories(allEntries);
  const totalNutrition = getTotalNutrition(allEntries);

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
        entriesCount={allEntries.length}
        onPrevDay={handlePrevDay}
        onNextDay={handleNextDay}
        onGoalClick={() => setShowGoalSetter(true)}
      />

      {/* Main Content with Sidebar */}
      <div className="mb-4">
        {/* Left Column - Main Content */}
        <div>
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

          {/* Meals */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-text-dim tracking-wide uppercase">
                รายการอาหาร
                <span className="font-number text-text-muted ml-2">({allEntries.length})</span>
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowExportModal(true)}
                  className="text-xs text-sky-400 hover:text-sky-300 transition-colors font-medium tracking-wide flex items-center gap-1.5"
                >
                  <svg
                    width="14"
                    height="14"
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
                  Export
                </button>
                <button
                  onClick={() => setShowHistory(true)}
                  className="text-xs text-ember hover:text-ember-dim transition-colors font-medium tracking-wide"
                >
                  ดูประวัติ
                </button>
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-4">
            <MealSection 
              meal="breakfast" 
              entries={meals.breakfast} 
              onDelete={handleDeleteFood}
              onEdit={handleEditFood}
              goal={goal} 
            />
            <MealSection 
              meal="lunch" 
              entries={meals.lunch} 
              onDelete={handleDeleteFood}
              onEdit={handleEditFood}
              goal={goal} 
            />
            <MealSection 
              meal="dinner" 
              entries={meals.dinner} 
              onDelete={handleDeleteFood}
              onEdit={handleEditFood}
              goal={goal} 
            />
          </div>
          </div>
        </div>

        {/* Right Column - InBody Info */}
        {/* <div className="hidden lg:block">
          <div className="sticky top-4">
            <LatestInBodyCard />
          </div>
        </div> */}
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
      {showExportModal && (
        <ExportModal
          date={currentDate}
          entries={allEntries}
          totalCalories={totalCalories}
          totalNutrition={totalNutrition}
          goal={goal}
          onClose={() => setShowExportModal(false)}
        />
      )}
      {editingEntry && (
        <EditFoodModal
          entry={editingEntry.entry}
          currentMeal={editingEntry.meal}
          onSave={handleSaveEdit}
          onClose={() => setEditingEntry(null)}
        />
      )}
    </>
  );
}
