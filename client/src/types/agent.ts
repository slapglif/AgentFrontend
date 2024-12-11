export interface Agent {
  id: number;
  name: string;
  type: string;
  description: string;
  status: string;
  level: number;
  experience: number;
  confidence: number;
  capabilities: string[];
  learningMetrics: {
    skills: { name: string; proficiency: number }[];
    level: {
      current: number;
      xp: number;
      nextLevelXp: number;
    };
    achievements: any[];
    skillsProficiency?: Record<string, number>;
    knowledgeAreas?: {
      name: string;
      progress: number;
      lastUpdated: string;
    }[];
    learningRate?: number;
    completedLessons?: number;
    totalLessons?: number;
    adaptabilityScore?: number;
    retentionRate?: number;
  };
  configuration: Record<string, any>;
  performance_metrics: {
    tasks_completed: number;
    success_rate: number;
    avg_response_time: number;
  };
  specializations: string[];
  current_tasks: {
    id: number;
    type: string;
    status: string;
    priority: string;
  }[];
  memory_allocation: {
    total: number;
    used: number;
    reserved: number;
  };
  achievements: {
    id: number;
    name: string;
    description: string;
    icon: string;
  }[];
}

export type OrchestratorConnectionState = "connected" | "connecting" | "disconnected" | "error";

export interface AgentPerformanceMetrics {
  tasks: number;
  success: number;
  response: number;
}

export interface AgentRealTimeStatus {
  isOnline: boolean;
  lastSeen: Date;
  currentLoad: number;
  errorCount: number;
}

export interface AgentWithStatus extends Agent {
  realTimeStatus?: AgentRealTimeStatus;
  performanceMetrics?: AgentPerformanceMetrics;
}

export interface OrchestratorState {
  status: OrchestratorConnectionState;
  lastConnected?: Date;
  error?: string;
  retryCount: number;
}
