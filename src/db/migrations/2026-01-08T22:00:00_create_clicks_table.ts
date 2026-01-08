import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("clicks")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("url_id", "integer", (col) =>
      col.notNull().references("urls.id").onDelete("cascade")
    )
    .addColumn("timestamp", "timestamp", (col) =>
      col.notNull().defaultTo(db.fn("now"))
    )
    .execute();

  // Add index on url_id for efficient lookups
  await db.schema
    .createIndex("clicks_url_id_idx")
    .on("clicks")
    .column("url_id")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("clicks").execute();
}
