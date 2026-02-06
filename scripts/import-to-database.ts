/**
 * Import Script: Import exported localStorage data to Prisma Database
 * 
 * This script imports the exported localStorage data into the Prisma database.
 * 
 * Usage:
 * 1. Save your exported data as backup.json in the project root
 * 2. Run: npx tsx scripts/import-to-database.ts
 * 
 * Requirements:
 * - npm install -D tsx (if not installed)
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

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

async function importData() {
  console.log('🚀 Starting import process...\n');

  // Read backup file
  const backupPath = path.join(process.cwd(), 'backup.json');
  
  if (!fs.existsSync(backupPath)) {
    console.error('❌ Error: backup.json not found!');
    console.log('Please create backup.json in the project root with your exported data.');
    process.exit(1);
  }

  const data: LocalStorageExport = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));

  let stats = {
    settings: 0,
    foodEntries: 0,
    inbodyRecords: 0,
  };

  try {
    // 1. Import goal
    console.log('📝 Importing settings...');
    await prisma.userSettings.upsert({
      where: { key: 'goal' },
      update: { value: String(data.goal) },
      create: { key: 'goal', value: String(data.goal) },
    });
    stats.settings++;

    // 2. Import macro goals
    await prisma.userSettings.upsert({
      where: { key: 'macro_goals' },
      update: { value: JSON.stringify(data.macroGoals) },
      create: { key: 'macro_goals', value: JSON.stringify(data.macroGoals) },
    });
    stats.settings++;
    console.log(`✅ Imported ${stats.settings} settings\n`);

    // 3. Import food entries
    console.log('🍽️  Importing food entries...');
    for (const [date, dayData] of Object.entries(data.foodEntries)) {
      for (const [meal, entries] of Object.entries(dayData.meals)) {
        for (const entry of entries as any[]) {
          await prisma.foodEntry.create({
            data: {
              id: entry.id,
              name: entry.name,
              calories: entry.calories,
              meal: meal,
              date: date,
              createdAt: new Date(entry.createdAt),
              protein: entry.nutrition?.protein,
              carbs: entry.nutrition?.carbs,
              fat: entry.nutrition?.fat,
              fiber: entry.nutrition?.fiber,
              sugar: entry.nutrition?.sugar,
              sodium: entry.nutrition?.sodium,
            },
          });
          stats.foodEntries++;
        }
      }
    }
    console.log(`✅ Imported ${stats.foodEntries} food entries\n`);

    // 4. Import InBody history
    console.log('📊 Importing InBody records...');
    for (const record of data.inbodyHistory) {
      await prisma.inBodyAnalysis.create({
        data: {
          id: record.id,
          uploadedAt: new Date(record.uploadedAt),
          recommendedCalories: record.recommendedCalories,
          
          // Basic Info
          testDate: record.analysis.testDate,
          height: record.analysis.height,
          age: record.analysis.age,
          gender: record.analysis.gender,
          weight: record.analysis.weight,
          skeletalMuscleMass: record.analysis.skeletalMuscleMass,
          bodyFatMass: record.analysis.bodyFatMass,
          bmi: record.analysis.bmi,
          inbodyScore: record.analysis.inbodyScore,
          bodyWater: record.analysis.bodyWater,
          protein: record.analysis.protein,
          minerals: record.analysis.minerals,
          bodyFatPercentage: record.analysis.bodyFatPercentage,
          
          // Macros
          macroProtein: record.analysis.macros.protein,
          macroCarbs: record.analysis.macros.carbs,
          macroFat: record.analysis.macros.fat,
          
          // AI Analysis
          recommendations: record.analysis.recommendations,
          healthSummary: record.analysis.healthSummary,
          strengths: record.analysis.strengths ? JSON.stringify(record.analysis.strengths) : null,
          improvements: record.analysis.improvements ? JSON.stringify(record.analysis.improvements) : null,
          healthRisks: record.analysis.healthRisks ? JSON.stringify(record.analysis.healthRisks) : null,
          exercisePlan: record.analysis.exercisePlan,
          shortTermGoals: record.analysis.shortTermGoals ? JSON.stringify(record.analysis.shortTermGoals) : null,
          longTermGoals: record.analysis.longTermGoals ? JSON.stringify(record.analysis.longTermGoals) : null,
          
          // Advanced metrics
          waistHipRatio: record.analysis.waistHipRatio,
          visceralFatLevel: record.analysis.visceralFatLevel,
          bmr: record.analysis.bmr,
          fatFreeMass: record.analysis.fatFreeMass,
          obesityDegree: record.analysis.obesityDegree,
          smi: record.analysis.smi,
          
          // Muscle-Fat Analysis
          weightValue: record.analysis.muscleFatAnalysis?.weight?.value,
          weightRating: record.analysis.muscleFatAnalysis?.weight?.rating,
          smmValue: record.analysis.muscleFatAnalysis?.smm?.value,
          smmRating: record.analysis.muscleFatAnalysis?.smm?.rating,
          bodyFatValue: record.analysis.muscleFatAnalysis?.bodyFat?.value,
          bodyFatRating: record.analysis.muscleFatAnalysis?.bodyFat?.rating,
          
          // Segmental Lean
          segLeanRightArmMass: record.analysis.segmentalLean?.rightArm?.mass,
          segLeanRightArmPct: record.analysis.segmentalLean?.rightArm?.percent,
          segLeanRightArmRate: record.analysis.segmentalLean?.rightArm?.rating,
          segLeanLeftArmMass: record.analysis.segmentalLean?.leftArm?.mass,
          segLeanLeftArmPct: record.analysis.segmentalLean?.leftArm?.percent,
          segLeanLeftArmRate: record.analysis.segmentalLean?.leftArm?.rating,
          segLeanTrunkMass: record.analysis.segmentalLean?.trunk?.mass,
          segLeanTrunkPct: record.analysis.segmentalLean?.trunk?.percent,
          segLeanTrunkRate: record.analysis.segmentalLean?.trunk?.rating,
          segLeanRightLegMass: record.analysis.segmentalLean?.rightLeg?.mass,
          segLeanRightLegPct: record.analysis.segmentalLean?.rightLeg?.percent,
          segLeanRightLegRate: record.analysis.segmentalLean?.rightLeg?.rating,
          segLeanLeftLegMass: record.analysis.segmentalLean?.leftLeg?.mass,
          segLeanLeftLegPct: record.analysis.segmentalLean?.leftLeg?.percent,
          segLeanLeftLegRate: record.analysis.segmentalLean?.leftLeg?.rating,
          
          // Segmental Fat
          segFatRightArmMass: record.analysis.segmentalFat?.rightArm?.mass,
          segFatRightArmPct: record.analysis.segmentalFat?.rightArm?.percent,
          segFatRightArmRate: record.analysis.segmentalFat?.rightArm?.rating,
          segFatLeftArmMass: record.analysis.segmentalFat?.leftArm?.mass,
          segFatLeftArmPct: record.analysis.segmentalFat?.leftArm?.percent,
          segFatLeftArmRate: record.analysis.segmentalFat?.leftArm?.rating,
          segFatTrunkMass: record.analysis.segmentalFat?.trunk?.mass,
          segFatTrunkPct: record.analysis.segmentalFat?.trunk?.percent,
          segFatTrunkRate: record.analysis.segmentalFat?.trunk?.rating,
          segFatRightLegMass: record.analysis.segmentalFat?.rightLeg?.mass,
          segFatRightLegPct: record.analysis.segmentalFat?.rightLeg?.percent,
          segFatRightLegRate: record.analysis.segmentalFat?.rightLeg?.rating,
          segFatLeftLegMass: record.analysis.segmentalFat?.leftLeg?.mass,
          segFatLeftLegPct: record.analysis.segmentalFat?.leftLeg?.percent,
          segFatLeftLegRate: record.analysis.segmentalFat?.leftLeg?.rating,
          
          // Weight Control
          targetWeight: record.analysis.weightControl?.targetWeight,
          weightControl: record.analysis.weightControl?.weightControl,
          fatControl: record.analysis.weightControl?.fatControl,
          muscleControl: record.analysis.weightControl?.muscleControl,
        },
      });
      stats.inbodyRecords++;
    }
    console.log(`✅ Imported ${stats.inbodyRecords} InBody records\n`);

    // Summary
    console.log('🎉 Import completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`  - Settings: ${stats.settings}`);
    console.log(`  - Food entries: ${stats.foodEntries}`);
    console.log(`  - InBody records: ${stats.inbodyRecords}`);
    console.log('\n✨ Your data has been migrated to the database!');

  } catch (error) {
    console.error('❌ Error during import:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importData()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
