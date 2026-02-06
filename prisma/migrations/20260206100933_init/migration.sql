-- CreateTable
CREATE TABLE "FoodEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    "meal" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "protein" REAL,
    "carbs" REAL,
    "fat" REAL,
    "fiber" REAL,
    "sugar" REAL,
    "sodium" REAL
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "InBodyAnalysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recommendedCalories" INTEGER NOT NULL,
    "testDate" TEXT,
    "height" REAL,
    "age" INTEGER,
    "gender" TEXT,
    "weight" REAL NOT NULL,
    "skeletalMuscleMass" REAL NOT NULL,
    "bodyFatMass" REAL NOT NULL,
    "bmi" REAL NOT NULL,
    "inbodyScore" INTEGER NOT NULL,
    "bodyWater" REAL NOT NULL,
    "protein" REAL NOT NULL,
    "minerals" REAL NOT NULL,
    "bodyFatPercentage" REAL NOT NULL,
    "weightValue" REAL,
    "weightRating" TEXT,
    "smmValue" REAL,
    "smmRating" TEXT,
    "bodyFatValue" REAL,
    "bodyFatRating" TEXT,
    "segLeanRightArmMass" REAL,
    "segLeanRightArmPct" REAL,
    "segLeanRightArmRate" TEXT,
    "segLeanLeftArmMass" REAL,
    "segLeanLeftArmPct" REAL,
    "segLeanLeftArmRate" TEXT,
    "segLeanTrunkMass" REAL,
    "segLeanTrunkPct" REAL,
    "segLeanTrunkRate" TEXT,
    "segLeanRightLegMass" REAL,
    "segLeanRightLegPct" REAL,
    "segLeanRightLegRate" TEXT,
    "segLeanLeftLegMass" REAL,
    "segLeanLeftLegPct" REAL,
    "segLeanLeftLegRate" TEXT,
    "segFatRightArmMass" REAL,
    "segFatRightArmPct" REAL,
    "segFatRightArmRate" TEXT,
    "segFatLeftArmMass" REAL,
    "segFatLeftArmPct" REAL,
    "segFatLeftArmRate" TEXT,
    "segFatTrunkMass" REAL,
    "segFatTrunkPct" REAL,
    "segFatTrunkRate" TEXT,
    "segFatRightLegMass" REAL,
    "segFatRightLegPct" REAL,
    "segFatRightLegRate" TEXT,
    "segFatLeftLegMass" REAL,
    "segFatLeftLegPct" REAL,
    "segFatLeftLegRate" TEXT,
    "targetWeight" REAL,
    "weightControl" REAL,
    "fatControl" REAL,
    "muscleControl" REAL,
    "waistHipRatio" REAL,
    "visceralFatLevel" REAL,
    "bmr" REAL,
    "fatFreeMass" REAL,
    "obesityDegree" REAL,
    "smi" REAL,
    "macroProtein" REAL NOT NULL,
    "macroCarbs" REAL NOT NULL,
    "macroFat" REAL NOT NULL,
    "recommendations" TEXT NOT NULL,
    "healthSummary" TEXT,
    "strengths" TEXT,
    "improvements" TEXT,
    "healthRisks" TEXT,
    "exercisePlan" TEXT,
    "shortTermGoals" TEXT,
    "longTermGoals" TEXT
);

-- CreateIndex
CREATE INDEX "FoodEntry_date_idx" ON "FoodEntry"("date");

-- CreateIndex
CREATE INDEX "FoodEntry_date_meal_idx" ON "FoodEntry"("date", "meal");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_key_key" ON "UserSettings"("key");

-- CreateIndex
CREATE INDEX "InBodyAnalysis_uploadedAt_idx" ON "InBodyAnalysis"("uploadedAt");
