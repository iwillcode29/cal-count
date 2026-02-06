import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Configure Neon for Node.js environments
if (typeof WebSocket === "undefined") {
  neonConfig.webSocketConstructor = require("ws");
}

// Create Prisma Client with Neon adapter
function createPrismaClient() {
  // Use direct Postgres URL (not Accelerate URL)
  const databaseUrl = 
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL;

  if (!databaseUrl) {
    // No database URL - use fallback for build
    console.warn("⚠️  No DATABASE_URL found. Database operations will fail at runtime.");
    
    // Return basic client for build
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  // Create Neon adapter for direct Postgres connection
  const adapter = new PrismaNeon({ connectionString: databaseUrl });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
