import type { Express } from "express";
import { db } from "../db";
import { agents, memories, messages } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express) {
  app.get("/api/agents", async (req, res) => {
    try {
      const result = await db.select().from(agents);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agents" });
    }
  });

  app.get("/api/memories", async (req, res) => {
    try {
      const result = await db.select().from(memories).orderBy(memories.timestamp);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch memories" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const { content } = req.body;
      const result = await db.insert(messages).values({
        fromAgentId: 1, // Research Lead
        toAgentId: 2, // Default recipient
        content,
        type: "text",
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });
}
