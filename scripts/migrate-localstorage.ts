/**
 * Migration Script: localStorage to Prisma Database
 * 
 * This script helps migrate data from localStorage to the new Prisma database.
 * Run this in the browser console BEFORE switching to the database version.
 * 
 * Usage:
 * 1. Open browser console on your app
 * 2. Copy and paste this entire script
 * 3. Call: exportLocalStorageData()
 * 4. Copy the output JSON
 * 5. Save to a file (e.g., backup.json)
 * 6. Use the import script (see below) to import to database
 */

interface LocalStorageExport {
  goal: number;
  macroGoals: {
    protein: number;
    carbs: number;
    fat: number;
  };
  inbodyHistory: any[];
  foodEntries: {
    [date: string]: {
      meals: {
        breakfast: any[];
        lunch: any[];
        dinner: any[];
      };
    };
  };
}

// Export function - run this in browser console
function exportLocalStorageData(): LocalStorageExport {
  const data: LocalStorageExport = {
    goal: 2000,
    macroGoals: { protein: 150, carbs: 250, fat: 65 },
    inbodyHistory: [],
    foodEntries: {},
  };

  // Export goal
  const goalStr = localStorage.getItem('calcount_goal');
  if (goalStr) {
    data.goal = parseInt(goalStr, 10);
  }

  // Export macro goals
  const macroGoalsStr = localStorage.getItem('calcount_macro_goals');
  if (macroGoalsStr) {
    try {
      data.macroGoals = JSON.parse(macroGoalsStr);
    } catch (e) {
      console.error('Error parsing macro goals:', e);
    }
  }

  // Export InBody history
  const inbodyStr = localStorage.getItem('calcount_inbody_history');
  if (inbodyStr) {
    try {
      data.inbodyHistory = JSON.parse(inbodyStr);
    } catch (e) {
      console.error('Error parsing InBody history:', e);
    }
  }

  // Export food entries for the last 90 days
  const today = new Date();
  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const key = `calcount_${dateStr}`;
    const dayDataStr = localStorage.getItem(key);
    
    if (dayDataStr) {
      try {
        const dayData = JSON.parse(dayDataStr);
        if (dayData.meals) {
          data.foodEntries[dateStr] = {
            meals: dayData.meals,
          };
        }
      } catch (e) {
        console.error(`Error parsing data for ${dateStr}:`, e);
      }
    }
  }

  console.log('✅ Export completed!');
  console.log('📊 Summary:');
  console.log(`  - Goal: ${data.goal} calories`);
  console.log(`  - InBody records: ${data.inbodyHistory.length}`);
  console.log(`  - Days with food entries: ${Object.keys(data.foodEntries).length}`);
  console.log('\n📋 Copy the JSON below and save it to a file:');
  console.log('\n' + JSON.stringify(data, null, 2));
  
  return data;
}

// Make it available globally (for browser console)
if (typeof window !== 'undefined') {
  (window as any).exportLocalStorageData = exportLocalStorageData;
}

console.log('✨ Migration script loaded!');
console.log('Run: exportLocalStorageData()');
