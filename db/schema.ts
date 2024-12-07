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
  priority: text("priority").notNull().default("normal"),
  status: text("status").notNull().default("pending"),
  collaborationId: integer("collaboration_id").references(() => collaborations.id),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  metadata: jsonb("metadata"),
});

export const collaborations = pgTable("collaborations", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  metadata: jsonb("metadata"),
});

export const collaborationParticipants = pgTable("collaboration_participants", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  collaborationId: integer("collaboration_id").notNull().references(() => collaborations.id),
  agentId: integer("agent_id").notNull().references(() => agents.id),
  role: text("role").notNull(),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
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
export type Collaboration = typeof collaborations.$inferSelect;
export type CollaborationParticipant = typeof collaborationParticipants.$inferSelect;
export type CollaborationMessage = typeof messages.$inferSelect;
