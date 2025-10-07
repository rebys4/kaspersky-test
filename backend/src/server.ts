import Fastify from "fastify";
import cors from "@fastify/cors";
import usersRoutes from "./routes/users";
import groupsRoutes from "./routes/groups";

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });

app.register(usersRoutes, { prefix: "/api/users" });
app.register(groupsRoutes, { prefix: "/api/groups" });

app.listen({ port: 3001, host: "0.0.0.0" });
