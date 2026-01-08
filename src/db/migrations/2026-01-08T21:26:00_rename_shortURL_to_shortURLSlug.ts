import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("urls")
    .renameColumn("shortURL", "shortURLSlug")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("urls")
    .renameColumn("shortURLSlug", "shortURL")
    .execute();
}
