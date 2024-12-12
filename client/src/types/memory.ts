import { z } from 'zod';

export const memoryContentSchema = z.object({
  text: z.string(),
  code: z.string().nullable(),
  language: z.string().optional()
});

export const memoryMetadataSchema = z.object({
  detailedAnalysis: z.record(z.number()).optional(),
  relatedMemories: z.array(
    z.object({
      id: z.union([z.string(), z.number()]),
      type: z.string(),
      relevanceScore: z.number()
    })
  ).optional(),
  interactionHistory: z.array(
    z.object({
      id: z.union([z.string(), z.number()]).optional(),
      action: z.string(),
      timestamp: z.string(),
      context: z.string(),
      doshaType: z.string().optional()
    })
  ).optional(),
  xpGained: z.number().optional(),
  duration: z.number().optional()
});

export const memorySchema = z.object({
  id: z.number(),
  type: z.string(),
  content: memoryContentSchema,
  timestamp: z.string(),
  confidence: z.number(),
  metadata: memoryMetadataSchema
});

export type MemoryContent = z.infer<typeof memoryContentSchema>;
export type MemoryMetadata = z.infer<typeof memoryMetadataSchema>;
export type MemoryEntry = z.infer<typeof memorySchema>;
