import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // Add index on userId for efficient lookups by user
  await db.schema
    .createIndex("urls_userId_idx")
    .on("urls")
    .column("userId")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex("urls_userId_idx").execute();
}
