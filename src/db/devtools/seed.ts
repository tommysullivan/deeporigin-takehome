import { loadOrCreateURLRow } from "@/data/loadOrCreateURLRow";

async function seedDatabase(): Promise<void> {
  try {
    await loadOrCreateURLRow("https://www.tommysullivan.codes", null);
    await loadOrCreateURLRow("https://www.tommysullivan.me", null);
    await loadOrCreateURLRow("https://www.deeporigin.com/", null);
    console.log(`📍 Seeded sample urls`);
    console.log("✅ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();
