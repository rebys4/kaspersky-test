// scripts/restore.ts
import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "../backend/src/db/schema";

const dbPath = path.resolve("backend/db.sqlite");
const migrationsFolder = path.resolve("backend/migrations");
const backupFile = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.resolve("backup.jsonl");

function main() {
    const sqlite = new Database(dbPath);
    const db = drizzle(sqlite, { schema });

    migrate(db, { migrationsFolder });
    console.log("Migrations applied");

    const raw = fs.readFileSync(backupFile, "utf-8").trim();
    if (!raw) {
        console.error("Backup file is empty:", backupFile);
        process.exit(1);
    }
    const lines = raw.split("\n").filter(Boolean).map((l) => JSON.parse(l));

    db.transaction((tx) => {
        tx.delete(schema.userGroups);
        tx.delete(schema.users);
        tx.delete(schema.groups);

        for (const rec of lines) {
            if (rec.type === "groups" && Array.isArray(rec.data)) {
                tx.insert(schema.groups).values(rec.data);
            }
        }
        for (const rec of lines) {
            if (rec.type === "users" && Array.isArray(rec.data)) {
                tx.insert(schema.users).values(rec.data);
            }
        }
        for (const rec of lines) {
            if (rec.type === "user_groups" && Array.isArray(rec.data)) {
                tx.insert(schema.userGroups).values(rec.data);
            }
        }
    });


    console.log("Restore complete from", backupFile);
}

main();
