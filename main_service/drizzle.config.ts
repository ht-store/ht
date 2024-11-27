import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
config();
export default defineConfig({
  schema: "./src/shared/database/schemas/*.ts",
  out: "./src/shared/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DB_URL ||
      "postgresql://postgres:hoangmay24022002@localhost:5432/store",
  },
  verbose: true,
  strict: true,
});
