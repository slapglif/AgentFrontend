import { z } from "zod";

export const skillSchema = z.object({
  name: z.string(),
  proficiency: z.number(),
  lastUpdated: z.string()
});

export const achievementSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  dateAchieved: z.string(),
  icon: z.string()
});

export interface LearningMetrics {
  skills: Array<{
    name: string;
    proficiency: number;
    lastUpdated: string;
  }>;
  level: {
    current: number;
    xp: number;
    nextLevelXp: number;
  };
  achievements: Array<{
    id: number;
    name: string;
    description: string;
    dateAchieved: string;
    icon: string;
  }>;
  skillsProficiency: Record<string, number>;
  knowledgeAreas: Array<{
    name: string;
    progress: number;
    lastUpdated: string;
  }>;
  learningRate: number;
  completedLessons: number;
  totalLessons: number;
  adaptabilityScore: number;
  retentionRate: number;
}

export type Skill = z.infer<typeof skillSchema>;
export type Achievement = z.infer<typeof achievementSchema>;
