export const mockAnalytics = {
  systemMetrics: {
    activeAgents: 8,
    totalAgents: 10,
    tokenUsage: {
      current: 850000,
      limit: 1000000
    },
    taskMetrics: {
      queued: 15,
      processing: 8,
      completed: 42
    },
    goalProgress: 78,
    uptime: 99.9,
    responseTime: 42,
    throughput: 1250,
    errorRate: 0.5
  },
  agentPerformance: [
    {
      agent: "Research Lead",
      tasks: 150,
      communicationSuccessRate: 95,
      researchTaskCompletion: 88,
      knowledgeSharing: 92,
      goalAlignment: 90,
      response: 45
    },
    {
      agent: "Data Analysis Agent",
      tasks: 180,
      communicationSuccessRate: 92,
      researchTaskCompletion: 94,
      knowledgeSharing: 88,
      goalAlignment: 89,
      response: 38
    },
    {
      agent: "Documentation Agent",
      tasks: 120,
      communicationSuccessRate: 90,
      researchTaskCompletion: 92,
      knowledgeSharing: 95,
      goalAlignment: 87,
      response: 42
    }
  ],
  collaborationStats: [
    { date: "2024-12-06", activeAgents: 7, interactions: 320, goalProgress: 72 },
    { date: "2024-12-07", activeAgents: 8, interactions: 410, goalProgress: 75 },
    { date: "2024-12-08", activeAgents: 8, interactions: 380, goalProgress: 78 }
  ],
  realtimeMetrics: {
    lastUpdated: new Date().toISOString(),
    agentUtilization: 82,
    systemLoad: 65,
    memoryUsage: 78,
    activeCollaborations: 5
  }
};
