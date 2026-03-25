import db from "../lib/db";
import { prisma } from "../lib/db/prisma";



export default async function main() {
  console.log("Starting cleanUp process...");
  const date = new Date("2026-03-18T00:00:00Z");
  const result = await prisma.chart.deleteMany({ where: { createdAt: { gte: new Date(date) } } });
  console.log(`✅ Deleted ${result?.count} charts created on or after ${date.toISOString()}`);
  console.log(`🎉 cleanUp complete! `);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ cleanup failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
