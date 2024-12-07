import { Agent } from "@/lib/agents";

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
