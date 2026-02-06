-- CreateTable
CREATE TABLE "FoodEntry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "calories" INTEGER NOT NULL,
    "meal" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "protein" DOUBLE PRECISION,
    "carbs" DOUBLE PRECISION,
    "fat" DOUBLE PRECISION,
    "fiber" DOUBLE PRECISION,
    "sugar" DOUBLE PRECISION,
    "sodium" DOUBLE PRECISION,

    CONSTRAINT "FoodEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InBodyAnalysis" (
    "id" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recommendedCalories" INTEGER NOT NULL,
    "testDate" TEXT,
    "height" DOUBLE PRECISION,
    "age" INTEGER,
    "gender" TEXT,
    "weight" DOUBLE PRECISION NOT NULL,
    "skeletalMuscleMass" DOUBLE PRECISION NOT NULL,
    "bodyFatMass" DOUBLE PRECISION NOT NULL,
    "bmi" DOUBLE PRECISION NOT NULL,
    "inbodyScore" INTEGER NOT NULL,
    "bodyWater" DOUBLE PRECISION NOT NULL,
    "protein" DOUBLE PRECISION NOT NULL,
    "minerals" DOUBLE PRECISION NOT NULL,
    "bodyFatPercentage" DOUBLE PRECISION NOT NULL,
    "weightValue" DOUBLE PRECISION,
    "weightRating" TEXT,
    "smmValue" DOUBLE PRECISION,
    "smmRating" TEXT,
    "bodyFatValue" DOUBLE PRECISION,
    "bodyFatRating" TEXT,
    "segLeanRightArmMass" DOUBLE PRECISION,
    "segLeanRightArmPct" DOUBLE PRECISION,
    "segLeanRightArmRate" TEXT,
    "segLeanLeftArmMass" DOUBLE PRECISION,
    "segLeanLeftArmPct" DOUBLE PRECISION,
    "segLeanLeftArmRate" TEXT,
    "segLeanTrunkMass" DOUBLE PRECISION,
    "segLeanTrunkPct" DOUBLE PRECISION,
    "segLeanTrunkRate" TEXT,
    "segLeanRightLegMass" DOUBLE PRECISION,
    "segLeanRightLegPct" DOUBLE PRECISION,
    "segLeanRightLegRate" TEXT,
    "segLeanLeftLegMass" DOUBLE PRECISION,
    "segLeanLeftLegPct" DOUBLE PRECISION,
    "segLeanLeftLegRate" TEXT,
    "segFatRightArmMass" DOUBLE PRECISION,
    "segFatRightArmPct" DOUBLE PRECISION,
    "segFatRightArmRate" TEXT,
    "segFatLeftArmMass" DOUBLE PRECISION,
    "segFatLeftArmPct" DOUBLE PRECISION,
    "segFatLeftArmRate" TEXT,
    "segFatTrunkMass" DOUBLE PRECISION,
    "segFatTrunkPct" DOUBLE PRECISION,
    "segFatTrunkRate" TEXT,
    "segFatRightLegMass" DOUBLE PRECISION,
    "segFatRightLegPct" DOUBLE PRECISION,
    "segFatRightLegRate" TEXT,
    "segFatLeftLegMass" DOUBLE PRECISION,
    "segFatLeftLegPct" DOUBLE PRECISION,
    "segFatLeftLegRate" TEXT,
    "targetWeight" DOUBLE PRECISION,
    "weightControl" DOUBLE PRECISION,
    "fatControl" DOUBLE PRECISION,
    "muscleControl" DOUBLE PRECISION,
    "waistHipRatio" DOUBLE PRECISION,
    "visceralFatLevel" DOUBLE PRECISION,
    "bmr" DOUBLE PRECISION,
    "fatFreeMass" DOUBLE PRECISION,
    "obesityDegree" DOUBLE PRECISION,
    "smi" DOUBLE PRECISION,
    "macroProtein" DOUBLE PRECISION NOT NULL,
    "macroCarbs" DOUBLE PRECISION NOT NULL,
    "macroFat" DOUBLE PRECISION NOT NULL,
    "recommendations" TEXT NOT NULL,
    "healthSummary" TEXT,
    "strengths" TEXT,
    "improvements" TEXT,
    "healthRisks" TEXT,
    "exercisePlan" TEXT,
    "shortTermGoals" TEXT,
    "longTermGoals" TEXT,

    CONSTRAINT "InBodyAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FoodEntry_date_idx" ON "FoodEntry"("date");

-- CreateIndex
CREATE INDEX "FoodEntry_date_meal_idx" ON "FoodEntry"("date", "meal");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_key_key" ON "UserSettings"("key");

-- CreateIndex
CREATE INDEX "InBodyAnalysis_uploadedAt_idx" ON "InBodyAnalysis"("uploadedAt");
