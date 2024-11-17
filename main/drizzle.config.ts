import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
config();
export default defineConfig({
  schema: "./src/database/schemas/*.ts",
  out: "./src/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DB_URL ||
      "postgresql://maiphuonglam:mpl08092002@localhost:5432/store",
  },
  verbose: true,
  strict: true,
});
