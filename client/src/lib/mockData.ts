import { formatDistance } from "date-fns";

// Helper to generate random dates within a range
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper to generate realistic confidence scores
const generateConfidence = () => {
  return Math.floor(70 + Math.random() * 30); // Generate scores between 70-100
};

export const mockMemoryData = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  type: ["research", "analysis", "conclusion", "interaction"][Math.floor(Math.random() * 4)],
  content: {
    text: [
      "Analyzed dataset structure and identified optimal clustering parameters",
      "Completed research on advanced NLP techniques for sentiment analysis",
      "Collaborated with Agent-2 on feature engineering tasks",
      "Generated comprehensive documentation for the ML pipeline",
      "Optimized model performance through hyperparameter tuning",
      "Implemented new data validation checks",
      "Reviewed and validated test results with 98% accuracy",
      "Updated knowledge base with recent findings"
    ][Math.floor(Math.random() * 8)],
    code: Math.random() > 0.7 ? `def process_data(data):
    return data.transform()` : null,
    language: "python"
  },
  timestamp: randomDate(new Date('2024-12-01'), new Date()).toISOString(),
  confidence: generateConfidence(),
  metadata: {
    duration: Math.floor(Math.random() * 120) + 30,
    resourceUsage: Math.floor(Math.random() * 40) + 20,
    relatedAgents: [`Agent-${Math.floor(Math.random() * 3) + 1}`],
    xpGained: Math.floor(Math.random() * 50) + 10,
    detailedAnalysis: {
      accuracy: Math.floor(Math.random() * 20) + 80,
      complexity: Math.floor(Math.random() * 100),
      innovation: Math.floor(Math.random() * 100),
      impact: Math.floor(Math.random() * 100)
    },
    relatedMemories: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
      id: Math.floor(Math.random() * 100),
      relevanceScore: Math.random(),
      type: ["prerequisite", "outcome", "related"][Math.floor(Math.random() * 3)]
    })),
    interactionHistory: Array.from({ length: Math.floor(Math.random() * 5) + 2 }, () => ({
      timestamp: randomDate(new Date('2024-12-01'), new Date()).toISOString(),
      agentId: Math.floor(Math.random() * 5) + 1,
      action: ["viewed", "modified", "referenced", "analyzed"][Math.floor(Math.random() * 4)],
      context: ["task completion", "knowledge synthesis", "error analysis"][Math.floor(Math.random() * 3)]
    }))
  }
}));

export const mockPerformanceData = {
  daily_metrics: Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
    success_rate: 0.85 + Math.random() * 0.15,
    tasks_completed: Math.floor(Math.random() * 50) + 30,
    avg_response_time: Math.floor(Math.random() * 200) + 100,
    memory_usage: Math.floor(Math.random() * 30) + 60,
    detailed_metrics: {
      error_rate: Math.random() * 0.1,
      optimization_score: Math.floor(Math.random() * 100),
      knowledge_retention: Math.floor(Math.random() * 100),
      learning_rate: Math.floor(Math.random() * 100)
    },
    historical_trends: Array.from({ length: 24 }, () => ({
      timestamp: randomDate(new Date('2024-12-01'), new Date()).toISOString(),
      value: Math.random()
    }))
  })),
  current_tasks: Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    type: ["Data Analysis", "Model Training", "Documentation", "Code Review", "Research"][i],
    status: ["pending", "in_progress", "completed"][Math.floor(Math.random() * 3)],
    priority: Math.random() > 0.7 ? "high" : "medium",
    progress: Math.floor(Math.random() * 100),
    xp_reward: Math.floor(Math.random() * 100) + 50,
    subtasks: Array.from({ length: Math.floor(Math.random() * 3) + 2 }, (_, j) => ({
      id: `${i + 1}-${j + 1}`,
      description: `Subtask ${j + 1} for ${["Data Analysis", "Model Training", "Documentation", "Code Review", "Research"][i]}`,
      status: ["pending", "in_progress", "completed"][Math.floor(Math.random() * 3)],
      progress: Math.floor(Math.random() * 100)
    })),
    dependencies: Array.from({ length: Math.floor(Math.random() * 2) }, () => ({
      taskId: Math.floor(Math.random() * 5) + 1,
      type: ["blocks", "requires", "enhances"][Math.floor(Math.random() * 3)]
    })),
    milestones: Array.from({ length: 3 }, (_, j) => ({
      id: `${i + 1}-m${j + 1}`,
      description: `Milestone ${j + 1}`,
      progress: Math.floor(Math.random() * 100),
      reward: Math.floor(Math.random() * 50) + 25
    }))
  })),
  resource_usage: {
    cpu: Math.floor(Math.random() * 40) + 20,
    memory: Math.floor(Math.random() * 30) + 40,
    storage: Math.floor(Math.random() * 20) + 30,
    detailed_stats: {
      cpu: {
        cores: Array.from({ length: 4 }, () => Math.floor(Math.random() * 100)),
        temperature: Math.floor(Math.random() * 30) + 40,
        frequency: Math.floor(Math.random() * 1000) + 2000
      },
      memory: {
        used: Math.floor(Math.random() * 8192),
        total: 16384,
        swap: Math.floor(Math.random() * 1024),
        cached: Math.floor(Math.random() * 2048)
      },
      network: {
        incoming: Math.floor(Math.random() * 100),
        outgoing: Math.floor(Math.random() * 100),
        latency: Math.floor(Math.random() * 50)
      }
    },
    historical_data: Array.from({ length: 60 }, () => ({
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      network: Math.floor(Math.random() * 100)
    }))
  }
};

export const mockLearningMetrics = {
  level: {
    current: 15,
    xp: 7500,
    nextLevelXp: 10000,
    title: "Senior Research Agent"
  },
  skills: [
    { 
      name: "Natural Language Processing", 
      proficiency: 85,
      xp: 2500,
      subskills: [
        { name: "Sentiment Analysis", level: 4, progress: 75 },
        { name: "Named Entity Recognition", level: 3, progress: 45 },
        { name: "Text Generation", level: 5, progress: 90 }
      ],
      unlockable_abilities: [
        { name: "Advanced Context Understanding", requiredLevel: 5, unlocked: true },
        { name: "Multi-language Processing", requiredLevel: 8, unlocked: false }
      ]
    },
    { 
      name: "Data Analysis", 
      proficiency: 92,
      xp: 3000,
      subskills: [
        { name: "Statistical Analysis", level: 5, progress: 95 },
        { name: "Data Visualization", level: 4, progress: 80 },
        { name: "Feature Engineering", level: 4, progress: 70 }
      ],
      unlockable_abilities: [
        { name: "Real-time Analysis", requiredLevel: 4, unlocked: true },
        { name: "Predictive Modeling", requiredLevel: 6, unlocked: false }
      ]
    },
    { 
      name: "Machine Learning", 
      proficiency: 78,
      xp: 2000,
      subskills: [
        { name: "Supervised Learning", level: 3, progress: 65 },
        { name: "Neural Networks", level: 4, progress: 85 },
        { name: "Reinforcement Learning", level: 2, progress: 40 }
      ],
      unlockable_abilities: [
        { name: "Model Optimization", requiredLevel: 3, unlocked: true },
        { name: "Advanced Architecture Design", requiredLevel: 5, unlocked: false }
      ]
    },
    { 
      name: "Problem Solving", 
      proficiency: 88,
      xp: 2800,
      subskills: [
        { name: "Algorithm Design", level: 4, progress: 88 },
        { name: "System Architecture", level: 3, progress: 60 },
        { name: "Optimization", level: 5, progress: 92 }
      ],
      unlockable_abilities: [
        { name: "Complex Problem Decomposition", requiredLevel: 4, unlocked: true },
        { name: "Parallel Solution Design", requiredLevel: 7, unlocked: false }
      ]
    }
  ],
  achievements: [
    { 
      id: 1, 
      name: "Performance Master", 
      description: "Achieved 95% accuracy in sentiment analysis",
      rarity: "legendary",
      xp_bonus: 500,
      unlocked_at: "2024-12-05T10:30:00Z",
      progress: 100
    },
    { 
      id: 2, 
      name: "Efficiency Expert", 
      description: "Reduced processing time by 40%",
      rarity: "epic",
      xp_bonus: 300,
      unlocked_at: "2024-12-06T15:45:00Z",
      progress: 100
    },
    { 
      id: 3, 
      name: "Collaboration Champion", 
      description: "Complete 100 multi-agent tasks",
      rarity: "rare",
      xp_bonus: 200,
      progress: 85,
      requirements: {
        total_tasks: 100,
        completed: 85
      }
    }
  ],
  collaboration_multipliers: [
    { type: "duo", multiplier: 1.5, active: true },
    { type: "trio", multiplier: 2.0, active: false },
    { type: "quad", multiplier: 2.5, active: false }
  ],
  learning_progress: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
    progress: Math.min(100, Math.floor((i / 29) * 100 + Math.random() * 10)),
    metrics: {
      tasks_completed: Math.floor(Math.random() * 20) + 10,
      xp_gained: Math.floor(Math.random() * 500) + 100,
      skills_improved: Math.floor(Math.random() * 3) + 1
    }
  })),
  skill_tree: {
    nodes: [
      { id: 1, name: "Basic NLP", level: 5, children: [2, 3] },
      { id: 2, name: "Advanced NLP", level: 3, children: [4] },
      { id: 3, name: "Text Analysis", level: 4, children: [4, 5] },
      { id: 4, name: "Semantic Understanding", level: 2, children: [6] },
      { id: 5, name: "Pattern Recognition", level: 3, children: [6] },
      { id: 6, name: "Context Mastery", level: 1, children: [] }
    ],
    connections: [
      { source: 1, target: 2, strength: 0.8 },
      { source: 1, target: 3, strength: 0.9 },
      { source: 2, target: 4, strength: 0.7 },
      { source: 3, target: 4, strength: 0.6 },
      { source: 3, target: 5, strength: 0.8 },
      { source: 4, target: 6, strength: 0.5 },
      { source: 5, target: 6, strength: 0.7 }
    ]
  }
};
