import * as schema from "./schemas";
import { Pool } from "pg";
// import { neon } from '@neondatabase/serverless';
import { drizzle } from "drizzle-orm/node-postgres";
import config from "src/config";
const sql = new Pool({ connectionString: config.DB_URL });

export const DB = drizzle(sql, { schema });
