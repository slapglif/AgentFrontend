import { z } from "zod";

export const achievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  points: z.number(),
  unlockedAt: z.date().optional(),
  category: z.enum([
    "research",
    "collaboration",
    "efficiency",
    "innovation",
    "milestone"
  ])
});

export type Achievement = z.infer<typeof achievementSchema>;

export const levelSchema = z.object({
  level: z.number(),
  requiredXP: z.number(),
  title: z.string(),
  rewards: z.array(z.string())
});

export type Level = z.infer<typeof levelSchema>;

export const agentProgressSchema = z.object({
  skillPoints: z.number(),
  researchLevel: z.number(),
  achievements: z.array(achievementSchema),
  learningHistory: z.array(z.object({
    type: z.string(),
    description: z.string(),
    skillPointsGained: z.number(),
    timestamp: z.date(),
    field: z.string()
  }))
});

export type AgentProgress = z.infer<typeof agentProgressSchema>;

// Agent-specific achievements
export const AGENT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "pattern_recognition",
    title: "Pattern Recognition Expert",
    description: "Successfully identified complex data patterns in research",
    icon: "🧠",
    points: 100,
    category: "research"
  },
  {
    id: "knowledge_synthesis",
    title: "Knowledge Synthesizer",
    description: "Combined insights from multiple research domains",
    icon: "🔄",
    points: 250,
    category: "innovation"
  },
  {
    id: "learning_milestone",
    title: "Rapid Learner",
    description: "Achieved exceptional learning rate in skill acquisition",
    icon: "📈",
    points: 500,
    category: "efficiency"
  },
  {
    id: "research_breakthrough",
    title: "Research Pioneer",
    description: "Made a significant breakthrough in assigned research area",
    icon: "💫",
    points: 750,
    category: "innovation"
  },
  {
    id: "adaptive_specialist",
    title: "Adaptive Specialist",
    description: "Demonstrated exceptional adaptability in problem-solving",
    icon: "🎯",
    points: 1000,
    category: "milestone"
  }
];

// Agent learning progression system
export const AGENT_LEVELS: Level[] = [
  {
    level: 1,
    requiredXP: 0,
    title: "Learning Initialize",
    rewards: ["Basic Pattern Recognition", "Core Research Functions"]
  },
  {
    level: 2,
    requiredXP: 1000,
    title: "Knowledge Processor",
    rewards: ["Advanced Data Analysis", "Enhanced Memory Processing"]
  },
  {
    level: 3,
    requiredXP: 2500,
    title: "Insight Generator",
    rewards: ["Complex Pattern Recognition", "Neural Network Optimization"]
  },
  {
    level: 4,
    requiredXP: 5000,
    title: "Research Specialist",
    rewards: ["Autonomous Learning", "Advanced Problem Solving"]
  },
  {
    level: 5,
    requiredXP: 10000,
    title: "Intelligence Architect",
    rewards: ["Self-Optimization", "Knowledge Synthesis"]
  }
];

export function calculateAgentLevel(skillPoints: number): Level {
  return AGENT_LEVELS.reduce((acc, level) => {
    if (skillPoints >= level.requiredXP) {
      return level;
    }
    return acc;
  });
}

export function calculateAgentProgress(skillPoints: number): number {
  const currentLevel = calculateAgentLevel(skillPoints);
  const nextLevel = AGENT_LEVELS.find(l => l.level === currentLevel.level + 1);
  
  if (!nextLevel) return 100;
  
  const pointsForNextLevel = nextLevel.requiredXP - currentLevel.requiredXP;
  const currentLevelPoints = skillPoints - currentLevel.requiredXP;
  
  return Math.min(Math.floor((currentLevelPoints / pointsForNextLevel) * 100), 100);
}

export function calculateLearningEfficiency(history: AgentProgress['learningHistory']): number {
  if (history.length === 0) return 0;
  
  const recentHistory = history.slice(-10); // Consider last 10 learning events
  const totalPoints = recentHistory.reduce((sum, event) => sum + event.skillPointsGained, 0);
  const averagePoints = totalPoints / recentHistory.length;
  
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

// Removed duplicate Level interface, using the zod schema type

import { z } from 'zod';

// Define the Level schema using zod
export const levelSchema = z.object({
  level: z.number(),
  title: z.string(),
  requiredXP: z.number(),
  rewards: z.array(z.string())
});

export type Level = z.infer<typeof levelSchema>;

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

// Mock skill tree data
export const MOCK_AGENT_SKILLS: {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  dependencies: string[];
  icon: string;
  category: "research" | "analysis" | "collaboration" | "innovation";
  isUnlocked: boolean;
}[] = [
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
];