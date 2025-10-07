import fs from "fs";
import path from "path";
import { db } from "../backend/src/db/drizzle";
import { users, userGroups, groups } from "../backend/src/db/schema";

const out = path.resolve("backup.jsonl");
const ws = fs.createWriteStream(out);

(async () => {
    const allGroups = await db.select().from(groups);
    const allUsers = await db.select().from(users);
    const links = await db.select().from(userGroups);

    ws.write(JSON.stringify({ type: "groups", data: allGroups }) + "\n");
    ws.write(JSON.stringify({ type: "users", data: allUsers }) + "\n");
    ws.write(JSON.stringify({ type: "user_groups", data: links }) + "\n");
    ws.end();
    console.log("Backup saved to", out);
})();
