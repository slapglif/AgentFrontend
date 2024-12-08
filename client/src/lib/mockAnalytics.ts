export const mockAnalytics = {
  systemMetrics: {
    tokenMetrics: {
      tokensUsed: 850000,
      messagesProcessed: 12500,
    },
    researchMetrics: {
      goalsCompleted: 42,
      totalGoals: 65,
      patternsDiscovered: 128,
      knowledgeNodes: 512
    },
    agentMetrics: {
      totalXP: 12500,
      averageLevel: 4.2,
      activeResearchTasks: 15
    }
  },
  agentPerformance: [
    {
      agent: "Research Lead",
      level: 5,
      xp: 4800,
      researchContributions: 156,
      taskComplexity: 85,
      collaborationScore: 92
    },
    {
      agent: "Data Analysis Agent",
      level: 4,
      xp: 3200,
      researchContributions: 142,
      taskComplexity: 78,
      collaborationScore: 88
    },
    {
      agent: "Documentation Agent",
      level: 4,
      xp: 2900,
      researchContributions: 98,
      taskComplexity: 72,
      collaborationScore: 90
    }
  ],
  collaborationStats: [
    { 
      date: "2024-12-06", 
      activeAgents: 7, 
      knowledgeSynthesis: 82,
      researchProgress: 72 
    },
    { 
      date: "2024-12-07", 
      activeAgents: 8, 
      knowledgeSynthesis: 85,
      researchProgress: 75 
    },
    { 
      date: "2024-12-08", 
      activeAgents: 8, 
      knowledgeSynthesis: 88,
      researchProgress: 78 
    }
  ],
  realtimeMetrics: {
    lastUpdated: new Date().toISOString(),
    tokenUsageTrend: Array.from({ length: 20 }, () => Math.floor(Math.random() * 100)),
    researchProgress: Array.from({ length: 20 }, () => Math.floor(Math.random() * 100)),
    knowledgeSynthesis: Array.from({ length: 20 }, () => Math.floor(Math.random() * 100)),
    collaborationEffectiveness: Array.from({ length: 20 }, () => Math.floor(Math.random() * 100))
  }
};
