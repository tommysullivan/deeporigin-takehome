import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createIndex("urls_shortURLSlug_unique")
    .on("urls")
    .column("shortURLSlug")
    .unique()
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex("urls_shortURLSlug_unique").execute();
}
