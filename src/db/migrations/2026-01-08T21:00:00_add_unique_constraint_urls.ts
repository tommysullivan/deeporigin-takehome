import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // Create a unique constraint on (userId, originalURL)
  // This allows multiple NULL userId values (anonymous users can have the same URL)
  // But enforces uniqueness for non-NULL userId values (authenticated users can only have one of each URL)
  await db.schema
    .createIndex("urls_userId_originalURL_unique")
    .on("urls")
    .columns(["userId", "originalURL"])
    .unique()
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex("urls_userId_originalURL_unique").execute();
}
