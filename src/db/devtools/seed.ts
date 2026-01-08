import { dbTypesafe } from "../dbTypesafe";

async function seedDatabase(): Promise<void> {
  try {
    console.log("🌱 Starting database seeding...");

    const existingUrls = await dbTypesafe
      .selectFrom("urls")
      .select("id")
      .limit(1)
      .execute();

    if (existingUrls.length > 0) {
      console.log("📍 Locations already seeded, skipping...");
    } else {
      await dbTypesafe
        .insertInto("urls")
        .values([
          {
            userId: "dummy-id",
            originalURL: "https://www.tommysullivan.codes",
            shortURL: "sdof239fu",
          },
        ])
        .execute();

      console.log(`📍 Seeded sample urls`);
    }
    console.log("✅ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();
