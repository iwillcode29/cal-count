import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma Client
// Supports both Prisma Accelerate and direct connections
function createPrismaClient() {
  // Check if we have a database URL (production/preview)
  const databaseUrl = 
    process.env.PRISMA_DATABASE_URL || 
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL;

  if (!databaseUrl) {
    // No database URL - use fallback for build
    console.warn("⚠️  No DATABASE_URL found. Database operations will fail at runtime.");
    
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  // Prisma Accelerate URL (prisma+postgres://)
  if (databaseUrl.startsWith("prisma+postgres://")) {
    return new PrismaClient({
      datasourceUrl: databaseUrl,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  }

  // Direct Postgres connection
  return new PrismaClient({
    datasourceUrl: databaseUrl,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
