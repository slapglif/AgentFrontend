import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const agents = pgTable("agents", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  capabilities: jsonb("capabilities").notNull(),
  status: text("status").notNull().default("idle"),
});

export const memories = pgTable("memories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  agentId: integer("agent_id").notNull().references(() => agents.id),
  type: text("type").notNull(),
  content: jsonb("content").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  confidence: integer("confidence").notNull(),
  metadata: jsonb("metadata"),
});

export const messages = pgTable("messages", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fromAgentId: integer("from_agent_id").notNull().references(() => agents.id),
  toAgentId: integer("to_agent_id").notNull().references(() => agents.id),
  content: text("content").notNull(),
  type: text("type").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  metadata: jsonb("metadata"),
});

export const insertAgentSchema = createInsertSchema(agents);
export const selectAgentSchema = createSelectSchema(agents);
export const insertMemorySchema = createInsertSchema(memories);
export const selectMemorySchema = createSelectSchema(memories);
export const insertMessageSchema = createInsertSchema(messages);
export const selectMessageSchema = createSelectSchema(messages);

export type Agent = z.infer<typeof selectAgentSchema>;
export type Memory = z.infer<typeof selectMemorySchema>;
export type Message = z.infer<typeof selectMessageSchema>;
