import { Kysely, PostgresDialect, sql } from "kysely";
import { Pool } from "pg";
import { configDotenv } from "dotenv";

// Load test environment
configDotenv({ path: ".env.test" });

const DATABASE_URL = process.env.DATABASE_URL;

/**
 * Creates the test database if it doesn't exist
 */
async function createTestDatabase() {
  const dbName = "deeporigin_test";
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in .env.test");
  }

  // Connect to postgres database to create our test database
  const adminUrl = DATABASE_URL.replace(/\/[^/]+$/, "/postgres");
  const adminPool = new Pool({ connectionString: adminUrl });
  const adminDb = new Kysely({
    dialect: new PostgresDialect({ pool: adminPool }),
  });

  try {
    // Check if database exists
    const result = await sql<{ exists: boolean }>`
      SELECT EXISTS(
        SELECT 1 FROM pg_database WHERE datname = ${dbName}
      ) as exists
    `.execute(adminDb);

    if (!result.rows[0].exists) {
      console.log(`Creating test database: ${dbName}`);
      await sql`CREATE DATABASE ${sql.raw(dbName)}`.execute(adminDb);
      console.log("Test database created successfully");
    } else {
      console.log("Test database already exists");
    }
  } finally {
    await adminDb.destroy();
    await adminPool.end();
  }
}

/**
 * Drops and recreates the test database (clean slate)
 */
async function resetTestDatabase() {
  const dbName = "deeporigin_test";
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in .env.test");
  }
  const adminUrl = DATABASE_URL.replace(/\/[^/]+$/, "/postgres");
  const adminPool = new Pool({ connectionString: adminUrl });
  const adminDb = new Kysely({
    dialect: new PostgresDialect({ pool: adminPool }),
  });

  try {
    console.log(`Resetting test database: ${dbName}`);

    // Terminate existing connections
    await sql`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = ${dbName}
        AND pid <> pg_backend_pid()
    `.execute(adminDb);

    // Drop and recreate
    await sql`DROP DATABASE IF EXISTS ${sql.raw(dbName)}`.execute(adminDb);
    await sql`CREATE DATABASE ${sql.raw(dbName)}`.execute(adminDb);

    console.log("Test database reset successfully");
  } finally {
    await adminDb.destroy();
    await adminPool.end();
  }
}

// Run the appropriate function based on command line argument
const command = process.argv[2];

if (command === "reset") {
  resetTestDatabase().catch(console.error);
} else {
  createTestDatabase().catch(console.error);
}
