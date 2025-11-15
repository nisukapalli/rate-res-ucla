import { prisma } from "@/lib/prisma/client";

async function testConnection() {
  try {
    // Test database connection with a simple query
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database connection successful!");
    console.log("✅ Prisma and Supabase are integrated correctly");
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

