import { FastifyPluginAsync } from "fastify";
import { db } from "../db/drizzle";
import { users, groups, userGroups } from "../db/schema";
import { and, desc, eq, like, or, sql } from "drizzle-orm";
import z from "zod";

const listQuery = z.object({
    q: z.string().optional(),
    groupId: z.coerce.number().optional(),
    sort: z.enum(["name", "email", "createdAt"]).optional().default("createdAt"),
    order: z.enum(["asc", "desc"]).optional().default("desc"),
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().optional().default(20)
});

const upsertBody = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    position: z.string().optional(),
    groupIds: z.array(z.number()).optional().default([])
});

const plugin: FastifyPluginAsync = async (app) => {
    app.get("/", async (req) => {
        const { q, groupId, sort, order, page, limit } = listQuery.parse(req.query);
        const offset = (page - 1) * limit;

        const where = [];
        if (q) {
            const pattern = `%${q}%`;
            where.push(or(like(users.firstName, pattern), like(users.lastName, pattern), like(users.email, pattern)));
        }

        let base: any = db
            .select({
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
                phone: users.phone,
                position: users.position,
                createdAt: users.createdAt
            })
            .from(users);

        if (groupId) {
            base = base
                .leftJoin(userGroups, eq(userGroups.userId, users.id))
                .where(and(...where.filter(Boolean), eq(userGroups.groupId, groupId)));
        } else if (where.length) {
            base = base.where(and(...where));
        }

        const orderBy =
            sort === "name" ? [users.lastName, users.firstName] :
                sort === "email" ? [users.email] : [users.createdAt];

        const rows = await base
            .orderBy(...orderBy.map((c) => order === "desc" ? desc(c as any) : (c as any)))
            .limit(limit).offset(offset);

        const [{ count }] = await db
            .select({ count: sql<number>`count(1)` })
            .from(users);

        return { items: rows, page, limit, total: count };
    });

    app.get("/:id", async (req, reply) => {
        const id = Number((req.params as any).id);
        const [u] = await db.select().from(users).where(eq(users.id, id));
        if (!u) return reply.code(404).send({ message: "Not found" });

        const g = await db.select({ groupId: userGroups.groupId, name: groups.name })
            .from(userGroups)
            .leftJoin(groups, eq(groups.id, userGroups.groupId))
            .where(eq(userGroups.userId, id));

        return { ...u, groups: g };
    });

    app.post("/", async (req, reply) => {
        const body = upsertBody.parse(req.body);
        const [inserted] = await db.insert(users).values({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            phone: body.phone,
            position: body.position
        }).returning();

        if (body.groupIds.length) {
            await db.insert(userGroups).values(body.groupIds.map((gid) => ({ userId: inserted.id!, groupId: gid })));
        }
        reply.code(201);
        return inserted;
    });

    app.patch("/:id", async (req, reply) => {
        const id = Number((req.params as any).id);
        const body = upsertBody.partial().parse(req.body);

        if (Object.keys(body).length) {
            const { groupIds, ...fields } = body as any;
            if (Object.keys(fields).length) {
                await db.update(users).set(fields).where(eq(users.id, id));
            }
            if (groupIds) {
                await db.delete(userGroups).where(eq(userGroups.userId, id));
                if (groupIds.length) {
                    await db.insert(userGroups).values(groupIds.map((gid: number) => ({ userId: id, groupId: gid })));
                }
            }
        }
        const [u] = await db.select().from(users).where(eq(users.id, id));
        return u ?? reply.code(404).send({ message: "Not found" });
    });

    app.delete("/:id", async (req, reply) => {
        const id = Number((req.params as any).id);
        await db.delete(users).where(eq(users.id, id));
        reply.code(204).send();
    });
};

export default plugin;
