import { DEFAULT_AGENTS } from "./agents";

interface SystemStats {
  totalAgents: number;
  activeAgents: number;
  totalTasks: number;
  systemLoad: number;
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  lastUpdateTime: string;
}

interface Activity {
  id: number;
  agentId: number;
  agentName: string;
  action: 'task_completed' | 'task_started' | 'error_occurred' | 'milestone_reached';
  timestamp: string;
  details: string;
  severity?: 'info' | 'warning' | 'error';
  relatedTaskId?: number;
}

interface PerformanceMetrics {
  systemUptime: number;
  avgResponseTime: number;
  successRate: number;
  taskCompletion: {
    total: number;
    successful: number;
    failed: number;
    pending: number;
  };
  resourceUtilization: {
    cpu: number;
    memory: number;
    network: number;
  };
}

export interface SystemOverview {
  systemStats: SystemStats;
  recentActivities: Activity[];
  performanceMetrics: PerformanceMetrics;
}

const calculateMemoryUsage = () => {
  const total = 16384; // 16GB in MB
  const used = Math.floor(Math.random() * 12288); // Random usage up to 12GB
  return {
    used,
    total,
    percentage: (used / total) * 100
  };
};

export const mockOverview: SystemOverview = {
  systemStats: {
    totalAgents: DEFAULT_AGENTS.length,
    activeAgents: DEFAULT_AGENTS.filter(a => a.status === "active").length,
    totalTasks: DEFAULT_AGENTS.reduce((acc, agent) => acc + agent.current_tasks.length, 0),
    systemLoad: Math.floor(Math.random() * 100),
    memoryUsage: calculateMemoryUsage(),
    lastUpdateTime: new Date().toISOString()
  },
  recentActivities: DEFAULT_AGENTS.map((agent, index) => ({
    id: index + 1,
    agentId: agent.id,
    agentName: agent.name,
    action: ['task_completed', 'task_started', 'milestone_reached', 'error_occurred'][Math.floor(Math.random() * 4)] as Activity['action'],
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(), // Random time in last 24h
    details: `${agent.name} ${agent.performance_metrics.tasks_completed} tasks processed`,
    severity: ['info', 'warning', 'error'][Math.floor(Math.random() * 3)] as Activity['severity'],
    relatedTaskId: Math.floor(Math.random() * 1000) + 1
  })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
  performanceMetrics: {
    systemUptime: 99.9,
    avgResponseTime: Math.floor(Math.random() * 1000) + 200, // 200-1200ms
    successRate: 0.95,
    taskCompletion: {
      total: 1000,
      successful: 850,
      failed: 50,
      pending: 100
    },
    resourceUtilization: {
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      network: Math.floor(Math.random() * 100)
    }
  }
};
