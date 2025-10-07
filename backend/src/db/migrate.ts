import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { drizzle } from "drizzle-orm/better-sqlite3";

async function main() {
  const sqlite = new Database("db.sqlite");
  const db = drizzle(sqlite);
  await migrate(db, { migrationsFolder: "backend/migrations" });
  console.log("Migrations applied");
}
main();
