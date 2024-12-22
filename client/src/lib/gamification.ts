import { z } from "zod";

// Achievement schema and type
export const achievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  unlockedAt: z.date().optional(),
  points: z.number(),
  icon: z.string(),
});

export type Achievement = z.infer<typeof achievementSchema>;

// Level schema and type
export const levelSchema = z.object({
  level: z.number(),
  title: z.string(),
  requiredXP: z.number(),
  rewards: z.array(z.string())
});

export type Level = z.infer<typeof levelSchema>;

// Agent Progress schema and type
export const agentProgressSchema = z.object({
  skillPoints: z.number(),
  level: z.number(),
  experience: z.number(),
  achievements: z.array(achievementSchema),
});

export type AgentProgress = z.infer<typeof agentProgressSchema>;

// Calculate skill proficiency percentage
export function calculateSkillProficiency(points: number[]): number {
  if (!points || points.length === 0) {
    return 0;
  }

  const totalPoints = points.reduce((sum, p) => sum + p, 0);
  const averagePoints = totalPoints / points.length;

  return Math.min(Math.floor((averagePoints / 100) * 100), 100);
}

// User progress and level calculation types and functions
export interface UserProgress {
  currentXP: number;
  achievements: Array<{
    id: number;
    title: string;
    description: string;
    points: number;
    icon: string;
    unlockedAt?: Date;
  }>;
}

// Mock skill tree data
export const MOCK_AGENT_SKILLS: Array<{
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  dependencies: string[];
  icon: string;
  category: "research" | "analysis" | "collaboration" | "innovation";
  isUnlocked: boolean;
}> = [
  {
    id: "basic_research",
    name: "Basic Research",
    description: "Fundamental research methodologies and data collection",
    level: 3,
    maxLevel: 5,
    dependencies: [],
    icon: "🔬",
    category: "research",
    isUnlocked: true
  },
  {
    id: "pattern_recognition",
    name: "Pattern Recognition",
    description: "Identify and analyze complex data patterns",
    level: 2,
    maxLevel: 4,
    dependencies: ["basic_research"],
    icon: "🧩",
    category: "analysis",
    isUnlocked: true
  },
  {
    id: "advanced_analysis",
    name: "Advanced Analysis",
    description: "Complex data analysis and interpretation techniques",
    level: 1,
    maxLevel: 5,
    dependencies: ["pattern_recognition"],
    icon: "📊",
    category: "analysis",
    isUnlocked: true
  },
  {
    id: "collaboration",
    name: "Agent Collaboration",
    description: "Work effectively with other research agents",
    level: 2,
    maxLevel: 3,
    dependencies: ["basic_research"],
    icon: "🤝",
    category: "collaboration",
    isUnlocked: true
  },
  {
    id: "innovation",
    name: "Research Innovation",
    description: "Develop novel research approaches and methodologies",
    level: 0,
    maxLevel: 5,
    dependencies: ["advanced_analysis", "collaboration"],
    icon: "💡",
    category: "innovation",
    isUnlocked: false
  }
] as const;

// Calculate levels and track progress
export const LEVELS: Level[] = [
  { level: 1, title: "Novice Researcher", requiredXP: 0, rewards: ["Basic Research Access"] },
  { level: 2, title: "Junior Analyst", requiredXP: 1000, rewards: ["Advanced Analysis Tools"] },
  { level: 3, title: "Research Associate", requiredXP: 2500, rewards: ["Collaboration Features"] },
  { level: 4, title: "Senior Researcher", requiredXP: 5000, rewards: ["Custom Analysis Tools"] },
  { level: 5, title: "Research Expert", requiredXP: 10000, rewards: ["Advanced Integration"] },
];

export const calculateLevel = (xp: number): Level => {
  const level = LEVELS.reduce((prev, curr) => 
    xp >= curr.requiredXP ? curr : prev
  , LEVELS[0]);
  return level;
};

export const calculateProgress = (xp: number): number => {
  const currentLevel = calculateLevel(xp);
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);

  if (!nextLevel) return 100;

  const xpInCurrentLevel = xp - currentLevel.requiredXP;
  const xpRequiredForNextLevel = nextLevel.requiredXP - currentLevel.requiredXP;

  return Math.min(Math.floor((xpInCurrentLevel / xpRequiredForNextLevel) * 100), 100);
};