import { Agent } from "@/lib/agents";

export interface LearningMetrics {
  skillsProficiency: {
    [key: string]: number;  // 0-100 proficiency level
  };
  knowledgeAreas: {
    name: string;
    progress: number;  // 0-100 progress level
    lastUpdated: string;
  }[];
  learningRate: number;  // 0-100 learning efficiency
  completedLessons: number;
  totalLessons: number;
  adaptabilityScore: number;  // 0-100 score
  retentionRate: number;  // 0-100 percentage
}

export const mockAgents: Agent[] = [
  {
    id: 1,
    name: "Research Orchestrator",
    type: "orchestrator",
    description: "Coordinates and manages research activities across agent teams",
    status: "active",
    level: 5,
    experience: 85,
    confidence: 95,
    capabilities: ["task_delegation", "coordination", "performance_monitoring"],
    learningMetrics: {
      skillsProficiency: {
        "research": 92,
        "coordination": 88,
        "analysis": 85,
        "communication": 90
      },
      knowledgeAreas: [
        {
          name: "Research Methodology",
          progress: 95,
          lastUpdated: "2024-12-08T10:30:00Z"
        },
        {
          name: "Team Coordination",
          progress: 88,
          lastUpdated: "2024-12-08T09:15:00Z"
        },
        {
          name: "Data Analysis",
          progress: 82,
          lastUpdated: "2024-12-08T11:00:00Z"
        }
      ],
      learningRate: 92,
      completedLessons: 48,
      totalLessons: 60,
      adaptabilityScore: 94,
      retentionRate: 89
    },
    configuration: {
      decision_threshold: 0.85,
      response_time_limit: 5000,
      coordination_strategy: "consensus"
    },
    performance_metrics: {
      tasks_completed: 156,
      success_rate: 0.94,
      avg_response_time: 1200
    },
    specializations: ["research", "analysis", "synthesis"],
    current_tasks: [
      { id: 1, type: "coordination", status: "active", priority: "high" }
    ],
    memory_allocation: {
      total: 1024,
      used: 768,
      reserved: 128
    },
    achievements: [
      {
        id: 1,
        name: "Master Coordinator",
        description: "Successfully coordinated 100 research tasks",
        icon: "award"
      }
    ]
  },
  {
    id: 2,
    name: "Data Analysis Agent",
    type: "analyzer",
    description: "Specializes in complex data analysis and pattern recognition",
    status: "active",
    level: 4,
    experience: 72,
    confidence: 92,
    capabilities: ["pattern_recognition", "data_processing", "statistical_analysis"],
    configuration: {
      decision_threshold: 0.92,
      response_time_limit: 3000,
      analysis_depth: "deep"
    },
    performance_metrics: {
      tasks_completed: 234,
      success_rate: 0.96,
      avg_response_time: 800
    },
    specializations: ["data_mining", "pattern_analysis", "visualization"],
    current_tasks: [
      { id: 2, type: "analysis", status: "active", priority: "medium" }
    ],
    memory_allocation: {
      total: 2048,
      used: 1536,
      reserved: 256
    },
    achievements: [
      {
        id: 3,
        name: "Data Wizard",
        description: "Processed over 1 million data points",
        icon: "database"
      }
    ]
  },
  {
    id: 3,
    name: "Integration Specialist",
    type: "integrator",
    description: "Expert in system integration and compatibility analysis",
    status: "active",
    level: 4,
    experience: 68,
    confidence: 88,
    capabilities: ["system_integration", "protocol_management", "compatibility_analysis"],
    configuration: {
      decision_threshold: 0.88,
      response_time_limit: 4000,
      integration_mode: "adaptive"
    },
    performance_metrics: {
      tasks_completed: 178,
      success_rate: 0.91,
      avg_response_time: 1500
    },
    specializations: ["api_integration", "protocol_design", "system_architecture"],
    current_tasks: [
      { id: 3, type: "integration", status: "active", priority: "high" }
    ],
    memory_allocation: {
      total: 1536,
      used: 1024,
      reserved: 192
    },
    achievements: [
      {
        id: 4,
        name: "Integration Master",
        description: "Successfully integrated 50 different systems",
        icon: "git-merge"
      }
    ]
  }
];

export interface AgentConfiguration {
  decision_threshold: number;
  response_time_limit: number;
  coordination_strategy?: string;
  analysis_depth?: string;
  integration_mode?: string;
}

export interface PerformanceMetrics {
  tasks_completed: number;
  success_rate: number;
  avg_response_time: number;
}

export interface AgentTask {
  id: number;
  type: string;
  status: string;
  priority: string;
}

export interface MemoryAllocation {
  total: number;
  used: number;
  reserved: number;
}

// Using Agent interface from agents.ts
