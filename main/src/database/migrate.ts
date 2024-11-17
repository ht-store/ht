import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import path from "path";
import config from "src/config";
import logger from "src/utils/logger";
// migrate db
const runMigration = async () => {
  try {
    logger.info("migration start");
    const pool = new Pool({ connectionString: config.DB_URL });
    const db = drizzle(pool);
    await migrate(db, {
      migrationsFolder: path.resolve(__dirname, "migrations"),
    });
    logger.info("migration succcessfully");
    pool.end();
  } catch (error) {
    logger.error(error);
  }
};

runMigration();
