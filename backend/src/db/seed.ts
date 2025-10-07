// backend/src/db/seed.ts
import { db } from "./drizzle";
import { users, groups, userGroups } from "./schema";
import { faker } from "@faker-js/faker";

async function run() {
    const groupNames = ["Руководство", "Бухгалтерия", "Отдел кадров", "Разработка", "Продажи"];
    const insertedGroups = [];
    for (const name of groupNames) {
        const [g] = await db.insert(groups).values({ name }).returning();
        insertedGroups.push(g);
    }

    const batch: any[] = [];
    for (let i = 0; i < 320; i++) {
        batch.push({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email().toLowerCase(),
            phone: faker.phone.number(),
            position: faker.person.jobTitle()
        });
    }
    const inserted = await db.insert(users).values(batch).returning();

    const linkRows: any[] = [];
    for (const u of inserted) {
        const choice = faker.number.int({ min: 0, max: 3 });
        const pick = faker.helpers.arrayElements(insertedGroups, choice);
        for (const g of pick) linkRows.push({ userId: u.id!, groupId: g.id! });
    }
    if (linkRows.length) await db.insert(userGroups).values(linkRows);
}

run();
