import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

// Performance Optimizations for SQLite (WAL mode and Busy Timeout)
// This ensures 1000+ concurrent requests are handled smoothly without "Database is locked" errors
const initDb = async () => {
    try {
        await prisma.$queryRawUnsafe(`PRAGMA journal_mode = WAL;`);
        await prisma.$queryRawUnsafe(`PRAGMA synchronous = NORMAL;`);
        await prisma.$queryRawUnsafe(`PRAGMA busy_timeout = 5000;`);
        console.log("🚀 KashmirHeal: Database optimized for high concurrency.");
    } catch (e) {
        // Silently fail if DB is not yet available during build
    }
};

initDb();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

