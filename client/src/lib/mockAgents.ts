import { Agent } from "@/lib/agents";

export const mockAgents: Agent[] = [
  {
    id: 1,
    name: "Research Orchestrator",
    type: "orchestrator",
    status: "active",
    capabilities: ["task_delegation", "coordination", "performance_monitoring"],
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
    }
  },
  {
    id: 2,
    name: "Data Analysis Agent",
    type: "analyzer",
    status: "active",
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
    }
  },
  {
    id: 3,
    name: "Integration Specialist",
    type: "integrator",
    status: "active",
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
    }
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

export interface Agent {
  id: number;
  name: string;
  type: string;
  status: string;
  capabilities: string[];
  configuration: AgentConfiguration;
  performance_metrics: PerformanceMetrics;
  specializations: string[];
  current_tasks: AgentTask[];
  memory_allocation: MemoryAllocation;
}
