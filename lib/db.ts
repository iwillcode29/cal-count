import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma Client with Neon adapter for Prisma v7
function createPrismaClient() {
  // Check if we have a database URL (production/preview)
  const databaseUrl = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

  if (!databaseUrl) {
    // Local development without database - return a mock client
    console.warn("⚠️  No DATABASE_URL found. Database operations will fail.");
    console.warn("   Set DATABASE_URL in .env.local or use Vercel Postgres.");
    
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  // Production/Preview with Vercel Postgres
  const pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaNeon(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
