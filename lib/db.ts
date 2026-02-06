import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Configure Neon for Node.js environments (not Edge)
if (process.env.NODE_ENV !== "production") {
  // Dynamic import for ws in development
  neonConfig.webSocketConstructor = require("ws");
}

// Create Prisma Client with Neon adapter for Prisma v7
function createPrismaClient() {
  // Check if we have a database URL (production/preview)
  const databaseUrl = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

  if (!databaseUrl) {
    // No database URL - use a dummy connection string for build
    // This allows the build to succeed, but database operations will fail at runtime
    console.warn("⚠️  No DATABASE_URL found. Database operations will fail at runtime.");
    console.warn("   Add Vercel Postgres in Vercel Dashboard → Storage → Create Database");
    
    // Use a dummy postgres connection string with Neon adapter
    // This satisfies Prisma v7's requirement for an adapter during build
    const dummyUrl = "postgresql://user:pass@localhost:5432/db";
    const adapter = new PrismaNeon({ connectionString: dummyUrl });
    
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  // Production/Preview with Vercel Postgres
  // PrismaNeon expects config object with connectionString
  const adapter = new PrismaNeon({ connectionString: databaseUrl });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
