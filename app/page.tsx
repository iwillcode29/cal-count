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
} from "@/lib/storageDb";
import DaySummary from "./components/DaySummary";
import MealSection from "./components/MealSection";
import AddFoodForm from "./components/AddFoodForm";
import HistoryView from "./components/HistoryView";
import NutritionDashboard from "./components/NutritionDashboard";
import MacroGoalsSetter from "./components/MacroGoalsSetter";
import MacroAlert from "./components/MacroAlert";
import LatestInBodyCard from "./components/LatestInBodyCard";
import ExportModal from "./components/ExportModal";
import EditFoodModal from "./components/EditFoodModal";
import LoadingSkeleton from "./components/LoadingSkeleton";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(getToday());
  const [meals, setMeals] = useState<MealData>({ breakfast: [], lunch: [], dinner: [] });
  const [goal, setGoalState] = useState(2000);
  const [macroGoals, setMacroGoalsState] = useState<MacroGoals>({ protein: 150, carbs: 250, fat: 65 });
  const [showMacroGoalsSetter, setShowMacroGoalsSetter] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<{ entry: FoodEntry; meal: MealType } | null>(null);
  const [mounted, setMounted] = useState(false);

  const loadDay = useCallback(async (date: string) => {
    const data = await getDayData(date);
    setMeals(data.meals);
    setGoalState(data.goal);
  }, []);

  useEffect(() => {
    setMounted(true);
    loadDay(currentDate);
    getMacroGoals().then(setMacroGoalsState);
  }, [currentDate, loadDay]);

  const handleAddFood = async (name: string, calories: number, meal: MealType, nutrition?: NutritionInfo) => {
    try {
      const entry = await addEntry(currentDate, name, calories, meal, nutrition);
      setMeals((prev) => ({
        ...prev,
        [meal]: [entry, ...prev[meal]]
      }));
    } catch (error) {
      console.error("Error adding food:", error);
      alert("เกิดข้อผิดพลาดในการเพิ่มรายการอาหาร");
    }
  };

  const handleDeleteFood = async (id: string, meal: MealType) => {
    try {
      await deleteEntry(currentDate, id, meal);
      setMeals((prev) => ({
        ...prev,
        [meal]: prev[meal].filter((e) => e.id !== id)
      }));
    } catch (error) {
      console.error("Error deleting food:", error);
      alert("เกิดข้อผิดพลาดในการลบรายการอาหาร");
    }
  };

  const handleEditFood = (id: string, meal: MealType) => {
    const entry = meals[meal].find((e) => e.id === id);
    if (entry) {
      setEditingEntry({ entry, meal });
    }
  };

  const handleSaveEdit = async (name: string, calories: number, newMeal: MealType, nutrition?: NutritionInfo) => {
    if (!editingEntry) return;

    try {
      const result = await updateEntry(currentDate, editingEntry.entry.id, editingEntry.meal, {
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
    } catch (error) {
      console.error("Error updating food:", error);
      alert("เกิดข้อผิดพลาดในการแก้ไขรายการอาหาร");
    }
  };

  const handleMacroGoalsSave = async (newGoals: MacroGoals, calorieGoal: number) => {
    await saveMacroGoals(newGoals);
    await saveGoal(calorieGoal);
    setMacroGoalsState(newGoals);
    setGoalState(calorieGoal);
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
    return <LoadingSkeleton />;
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
        onGoalClick={() => setShowMacroGoalsSetter(true)}
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

      {/* Add food form — shown for today and past dates */}
      <div className="sticky bottom-4">
        <AddFoodForm onAdd={handleAddFood} />
      </div>

      {/* Modals */}
      {showMacroGoalsSetter && (
        <MacroGoalsSetter
          currentGoals={macroGoals}
          currentCalorieGoal={goal}
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
