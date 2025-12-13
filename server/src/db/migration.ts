import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL!, max: 1,
});

const db = drizzle({ client: pool, casing: "snake_case" });

const runMigrations = async () => {
    try {
        console.log("Running migrations...");
        await migrate(db, { migrationsFolder: "./drizzle" });
        console.log("Migrations complete!");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
    await pool.end();
}

runMigrations();