import { PrismaClient } from "@/app/generated/prisma/client";
import path from "path";

const dbFileName = process.env.DB_FILE_NAME || "dev.db";
const dbPath = path.join(process.cwd(), "prisma", dbFileName);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: `file:${dbPath}`,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}