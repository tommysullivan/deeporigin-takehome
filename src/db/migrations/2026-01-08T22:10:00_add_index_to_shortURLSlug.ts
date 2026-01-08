import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createIndex("urls_short_url_slug_idx")
    .on("urls")
    .column("shortURLSlug")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex("urls_short_url_slug_idx").execute();
}
