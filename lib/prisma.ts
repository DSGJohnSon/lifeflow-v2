import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../_generated/prisma/client";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });