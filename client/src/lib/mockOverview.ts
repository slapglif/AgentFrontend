import { DEFAULT_AGENTS } from "./agents";

export const mockOverview = {
  systemStats: {
    totalAgents: DEFAULT_AGENTS.length,
    activeAgents: DEFAULT_AGENTS.filter(a => a.status === "active").length,
    totalTasks: DEFAULT_AGENTS.reduce((acc, agent) => acc + agent.current_tasks.length, 0),
    systemLoad: Math.random() * 100
  },
  recentActivities: DEFAULT_AGENTS.map(agent => ({
    id: agent.id,
    agentName: agent.name,
    action: "task_completed",
    timestamp: new Date().toISOString(),
    details: `Completed ${agent.performance_metrics.tasks_completed} tasks`
  })),
  performanceMetrics: {
    systemUptime: 99.9,
    avgResponseTime: 1200,
    successRate: 0.95
  }
};
