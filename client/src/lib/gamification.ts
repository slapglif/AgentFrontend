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
