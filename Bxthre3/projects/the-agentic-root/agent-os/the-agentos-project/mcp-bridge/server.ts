import { Hono } from "hono";
import { cors } from "hono/cors";
import { randomUUID } from "crypto";

const PORT = parseInt(process.env.BRIDGE_PORT || "8888");

const app = new Hono();
app.use("*", cors());

app.get("/health", () => new Response("OK"));
app.get("/version", () => Response.json({ version: "3.0.0", phases: ["1","2","3","5"] }));

Bun.serve({ port: PORT, fetch: app.fetch });
console.log(`v3 on :${PORT}`);
