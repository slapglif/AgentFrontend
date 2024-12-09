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

interface AgentStats {
  id: number;
  name: string;
  status: 'active' | 'idle' | 'learning';
  currentTasks: number;
  successRate: number;
  skillLevel: number;
  recentAchievements: {
    id: number;
    name: string;
    description: string;
    unlockedAt: string;
    tier: 'bronze' | 'silver' | 'gold' | 'platinum';
    xpGained: number;
  }[];
  collaborationScore: number;
  resourceUtilization: {
    cpu: number;
    memory: number;
    network: number;
    historical: {
      timestamp: string;
      cpu: number;
      memory: number;
      network: number;
    }[];
  };
  skillProgression: {
    skillName: string;
    currentLevel: number;
    maxLevel: number;
    experience: number;
    nextLevelExperience: number;
    subskills: {
      name: string;
      proficiency: number;
      unlocked: boolean;
    }[];
  }[];
  interactionHistory: {
    id: string;
    timestamp: string;
    type: 'task' | 'collaboration' | 'learning' | 'achievement';
    description: string;
    impact: number;
    relatedAgents?: number[];
  }[];
}

export interface SystemOverview {
  systemStats: SystemStats;
  recentActivities: Activity[];
  performanceMetrics: PerformanceMetrics;
  agents: AgentStats[];
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
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    details: `${agent.name} ${agent.performance_metrics.tasks_completed} tasks processed`,
    severity: ['info', 'warning', 'error'][Math.floor(Math.random() * 3)] as Activity['severity'],
    relatedTaskId: Math.floor(Math.random() * 1000) + 1
  })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
  performanceMetrics: {
    systemUptime: 99.9,
    avgResponseTime: Math.floor(Math.random() * 1000) + 200,
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
  },
  agents: DEFAULT_AGENTS.map(agent => ({
    id: agent.id,
    name: agent.name,
    status: ['active', 'idle', 'learning'][Math.floor(Math.random() * 3)] as 'active' | 'idle' | 'learning',
    currentTasks: Math.floor(Math.random() * 5) + 1,
    successRate: 0.7 + Math.random() * 0.3,
    skillLevel: Math.floor(Math.random() * 10) + 1,
    recentAchievements: Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      name: ['Task Master', 'Collaboration Expert', 'Quick Learner'][i],
      description: ['Completed 100 tasks', 'Collaborated with 10 agents', 'Learned 5 new skills'][i],
      unlockedAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      tier: ['bronze', 'silver', 'gold', 'platinum'][Math.floor(Math.random() * 4)] as 'bronze' | 'silver' | 'gold' | 'platinum',
      xpGained: Math.floor(Math.random() * 500) + 100
    })),
    collaborationScore: Math.floor(Math.random() * 100),
    resourceUtilization: {
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      network: Math.floor(Math.random() * 100),
      historical: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        network: Math.floor(Math.random() * 100)
      }))
    },
    skillProgression: [
      'Machine Learning',
      'Natural Language Processing',
      'Data Analysis',
      'Problem Solving'
    ].map(skill => ({
      skillName: skill,
      currentLevel: Math.floor(Math.random() * 5) + 1,
      maxLevel: 10,
      experience: Math.floor(Math.random() * 1000),
      nextLevelExperience: 1000,
      subskills: Array.from({ length: 3 }, (_, i) => ({
        name: ['Basic', 'Intermediate', 'Advanced'][i],
        proficiency: Math.floor(Math.random() * 100),
        unlocked: Math.random() > 0.3
      }))
    })),
    interactionHistory: Array.from({ length: 10 }, (_, i) => ({
      id: `${agent.id}-${i}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      type: ['task', 'collaboration', 'learning', 'achievement'][Math.floor(Math.random() * 4)] as 'task' | 'collaboration' | 'learning' | 'achievement',
      description: [
        'Completed data analysis task',
        'Collaborated on research project',
        'Learned new ML technique',
        'Achieved performance milestone'
      ][Math.floor(Math.random() * 4)],
      impact: Math.floor(Math.random() * 100),
      relatedAgents: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
        Math.floor(Math.random() * DEFAULT_AGENTS.length) + 1
      )
    }))
  }))
};
