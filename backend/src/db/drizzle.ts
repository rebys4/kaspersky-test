import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema"; // 👈 обязательно!

const sqlite = new Database("db.sqlite");
export const db = drizzle(sqlite, { schema }); // 👈 передаём schema
