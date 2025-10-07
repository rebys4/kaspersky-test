import { sqliteTable, integer, text, primaryKey } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull().unique(),
    phone: text("phone"),
    position: text("position"),
    createdAt: integer("created_at").notNull().default(sql`(unixepoch())`)
});

export const groups = sqliteTable("groups", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull().unique()
});

export const userGroups = sqliteTable(
    "user_groups",
    {
        userId: integer("user_id")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        groupId: integer("group_id")
            .notNull()
            .references(() => groups.id, { onDelete: "cascade" })
    },
    (t) => ({
        pk: primaryKey({ columns: [t.userId, t.groupId] })
    })
);
