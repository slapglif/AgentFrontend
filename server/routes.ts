import { eq } from "drizzle-orm";
import { db } from "../db";
import { Express } from "express";
import {
  agents,
  memories,
  messages,
  collaborations,
  collaborationParticipants,
} from "@db/schema";

export function configureRoutes(app: Express) {
  app.get("/api/agents", async (req, res) => {
    try {
      const result = await db.select().from(agents);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agents" });
    }
  });

  app.get("/api/agents/:id", async (req, res) => {
    try {
      const result = await db
        .select()
        .from(agents)
        .where(eq(agents.id, parseInt(req.params.id)));
      if (result.length === 0) {
        res.status(404).json({ error: "Agent not found" });
        return;
      }
      res.json(result[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agent" });
    }
  });

  app.get("/api/memories", async (req, res) => {
    try {
      const { agentId } = req.query;
      const result = await db.select()
        .from(memories)
        .where(agentId ? eq(memories.agentId, parseInt(agentId as string)) : undefined);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch memories" });
    }
  });

  app.get("/api/messages", async (req, res) => {
    try {
      const result = await db.select().from(messages);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Collaboration routes
  app.get("/api/collaborations", async (req, res) => {
    try {
      const result = await db.select().from(collaborations);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch collaborations" });
    }
  });

  app.post("/api/collaborations", async (req, res) => {
    try {
      const { title, description, metadata } = req.body;
      const result = await db.insert(collaborations).values({
        title,
        description,
        metadata,
      }).returning();
      res.json(result[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to create collaboration" });
    }
  });

  app.get("/api/collaborations/:id/participants", async (req, res) => {
    try {
      const result = await db.select()
        .from(collaborationParticipants)
        .where(eq(collaborationParticipants.collaborationId, parseInt(req.params.id)));
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch collaboration participants" });
    }
  });

  app.get("/api/collaborations/:id/messages", async (req, res) => {
    try {
      const result = await db.select()
        .from(messages)
        .where(eq(messages.collaborationId, parseInt(req.params.id)))
        .orderBy(messages.timestamp);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch collaboration messages" });
    }
  });
}
