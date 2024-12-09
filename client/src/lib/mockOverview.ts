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
  agents: DEFAULT_AGENTS.map((agent, agentIndex) => ({
    id: agent.id,
    name: agent.name,
    status: (() => {
      const r = Math.random();
      return r > 0.6 ? 'active' : r > 0.3 ? 'learning' : 'idle';
    })() as 'active' | 'idle' | 'learning',
    currentTasks: Math.floor(Math.random() * 3) + 2, // 2-5 tasks
    successRate: 0.75 + (Math.random() * 0.23), // 75-98%
    skillLevel: Math.floor(Math.random() * 10) + 1,
    activeTime: Math.floor(Math.random() * 1000) + 100, // Hours active
    recentAchievements: Array.from({ length: Math.floor(Math.random() * 2) + 3 }, (_, i) => ({ // 3-5 achievements
      id: i + 1,
      name: [
        'Task Master',
        'Collaboration Expert',
        'Quick Learner',
        'Efficiency Champion',
        'Innovation Leader'
      ][i],
      description: [
        'Completed 100 tasks with high accuracy',
        'Successfully collaborated with 10 different agents',
        'Mastered 5 new skills in record time',
        'Achieved 95% resource optimization',
        'Developed 3 novel solution approaches'
      ][i],
      unlockedAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      tier: ['bronze', 'silver', 'gold', 'platinum'][Math.floor(Math.random() * 4)] as 'bronze' | 'silver' | 'gold' | 'platinum',
      xpGained: Math.floor(Math.random() * 500) + 100,
      requirements: {
        tasksCompleted: Math.floor(Math.random() * 50) + 50,
        skillLevel: Math.floor(Math.random() * 5) + 5,
        collaborationScore: Math.floor(Math.random() * 50) + 50
      },
      progress: {
        current: Math.floor(Math.random() * 100),
        total: 100,
        milestones: Array.from({ length: 3 }, (_, j) => ({
          level: j + 1,
          requirement: `Level ${j + 1} milestone requirement`,
          achieved: Math.random() > 0.5
        }))
      }
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
        network: Math.floor(Math.random() * 100),
        tasks_processed: Math.floor(Math.random() * 50) + 20
      })),
      metrics: {
        efficiency: {
          score: Math.floor(Math.random() * 100),
          trend: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100))
        },
        reliability: {
          score: Math.floor(Math.random() * 100),
          incidents: Math.floor(Math.random() * 5),
          uptime: 95 + Math.random() * 5
        },
        optimization: {
          score: Math.floor(Math.random() * 100),
          potential_savings: Math.floor(Math.random() * 20) + 5
        }
      }
    },
    skillProgression: [
      {
        skillName: 'Machine Learning',
        currentLevel: Math.floor(Math.random() * 5) + 1,
        maxLevel: 10,
        experience: Math.floor(Math.random() * 1000),
        nextLevelExperience: 1000,
        description: 'Ability to learn and adapt from experience',
        prerequisites: ['Data Analysis Basics', 'Statistical Foundations'],
        subskills: [
          {
            name: 'Neural Networks',
            proficiency: Math.floor(Math.random() * 100),
            unlocked: true,
            requirements: ['Basic ML Understanding'],
            progressHistory: Array.from({ length: 10 }, (_, i) => ({
              date: new Date(Date.now() - (9 - i) * 86400000).toISOString(),
              level: Math.floor(Math.random() * 5) + 1
            }))
          },
          {
            name: 'Reinforcement Learning',
            proficiency: Math.floor(Math.random() * 100),
            unlocked: Math.random() > 0.3,
            requirements: ['Neural Networks Basics'],
            progressHistory: Array.from({ length: 10 }, (_, i) => ({
              date: new Date(Date.now() - (9 - i) * 86400000).toISOString(),
              level: Math.floor(Math.random() * 5) + 1
            }))
          },
          {
            name: 'Deep Learning',
            proficiency: Math.floor(Math.random() * 100),
            unlocked: Math.random() > 0.5,
            requirements: ['Advanced Neural Networks'],
            progressHistory: Array.from({ length: 10 }, (_, i) => ({
              date: new Date(Date.now() - (9 - i) * 86400000).toISOString(),
              level: Math.floor(Math.random() * 5) + 1
            }))
          }
        ],
        milestones: [
          { level: 3, name: 'ML Practitioner', reward: 'Enhanced Learning Rate' },
          { level: 5, name: 'ML Expert', reward: 'Advanced Model Access' },
          { level: 8, name: 'ML Master', reward: 'Custom Architecture Design' }
        ]
      },
      {
        skillName: 'Natural Language Processing',
        currentLevel: Math.floor(Math.random() * 5) + 1,
        maxLevel: 10,
        experience: Math.floor(Math.random() * 1000),
        nextLevelExperience: 1000,
        description: 'Processing and understanding human language',
        prerequisites: ['Basic Linguistics', 'Text Processing'],
        subskills: [
          {
            name: 'Sentiment Analysis',
            proficiency: Math.floor(Math.random() * 100),
            unlocked: true,
            requirements: ['Basic NLP'],
            progressHistory: Array.from({ length: 10 }, (_, i) => ({
              date: new Date(Date.now() - (9 - i) * 86400000).toISOString(),
              level: Math.floor(Math.random() * 5) + 1
            }))
          },
          {
            name: 'Named Entity Recognition',
            proficiency: Math.floor(Math.random() * 100),
            unlocked: Math.random() > 0.3,
            requirements: ['Text Processing'],
            progressHistory: Array.from({ length: 10 }, (_, i) => ({
              date: new Date(Date.now() - (9 - i) * 86400000).toISOString(),
              level: Math.floor(Math.random() * 5) + 1
            }))
          }
        ],
        milestones: [
          { level: 3, name: 'Language Analyst', reward: 'Enhanced Text Processing' },
          { level: 6, name: 'NLP Specialist', reward: 'Advanced Language Models' }
        ]
      }
    ],
    interactionHistory: Array.from({ length: 15 }, (_, i) => ({
      id: `${agent.id}-interaction-${i}-${Date.now()}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      type: ['task', 'collaboration', 'learning', 'achievement'][Math.floor(Math.random() * 4)] as 'task' | 'collaboration' | 'learning' | 'achievement',
      description: [
        'Optimized neural network architecture for improved performance',
        'Collaborated on cross-agent knowledge synthesis project',
        'Mastered advanced reinforcement learning techniques',
        'Achieved breakthrough in natural language understanding',
        'Developed novel approach to multi-agent coordination',
        'Completed complex data analysis with 99% accuracy',
        'Implemented innovative problem-solving strategy'
      ][Math.floor(Math.random() * 7)],
      impact: Math.floor(Math.random() * 100),
      importance: Math.floor(Math.random() * 5) + 1, // 1-5 importance scale
      performance: {
        efficiency: Math.floor(Math.random() * 100),
        quality: Math.floor(Math.random() * 100),
        innovation: Math.floor(Math.random() * 100)
      },
      learningOutcomes: [
        'Enhanced problem-solving capabilities',
        'Improved collaboration skills',
        'Developed new analytical methods'
      ],
      resourceMetrics: {
        cpuUsage: Math.floor(Math.random() * 100),
        memoryUsage: Math.floor(Math.random() * 100),
        timeSpent: Math.floor(Math.random() * 120) + 30
      },
      relatedAgents: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => ({
        agentId: Math.floor(Math.random() * DEFAULT_AGENTS.length) + 1,
        role: ['collaborator', 'mentor', 'learner'][Math.floor(Math.random() * 3)],
        contributionScore: Math.floor(Math.random() * 100)
      })),
      subTasks: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, j) => ({
        id: `${agent.id}-${i}-${j}`,
        name: `Subtask ${j + 1}`,
        status: ['completed', 'in_progress', 'pending'][Math.floor(Math.random() * 3)],
        progress: Math.floor(Math.random() * 100),
        complexity: Math.floor(Math.random() * 5) + 1
      }))
    }))
  }))
};
