import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("urls")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("userId", "varchar(255)")
    .addColumn("originalURL", "varchar(4096)", (col) => col.notNull())
    .addColumn("shortURL", "varchar(100)", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("urls").execute();
}
