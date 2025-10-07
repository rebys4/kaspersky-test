import type { Config } from "drizzle-kit";

export default {
  schema: "./backend/src/db/schema.ts", 
  out: "./backend/migrations", 
  dialect: "sqlite",
  dbCredentials: { url: "./db.sqlite" }
} satisfies Config;
