import { FastifyPluginAsync } from "fastify";
import { db } from "../db/drizzle";
import { groups } from "../db/schema";
import { eq } from "drizzle-orm";
import z from "zod";

const upsert = z.object({ name: z.string().min(1) });

const plugin: FastifyPluginAsync = async (app) => {
    app.get("/", async () => db.select().from(groups));
    app.post("/", async (req) => {
        const { name } = upsert.parse(req.body);
        const [g] = await db.insert(groups).values({ name }).returning();
        return g;
    });
    app.patch("/:id", async (req) => {
        const id = Number((req.params as any).id);
        const { name } = upsert.parse(req.body);
        const [g] = await db.update(groups).set({ name }).where(eq(groups.id, id)).returning();
        return g;
    });
};

export default plugin;
