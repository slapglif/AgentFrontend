import { Agent } from "./agents";

export interface CommunicationLog {
  id: number;
  fromAgentId: number;
  toAgentId: number;
  type: "request" | "response" | "broadcast" | "error";
  content: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read" | "failed";
  metadata?: {
    latency?: number;
    priority?: string;
    context?: string;
    relatedTaskId?: number;
  };
}

export const mockCommunicationLogs: CommunicationLog[] = [
  {
    id: 1,
    fromAgentId: 7,
    toAgentId: 8,
    type: "request",
    content: "Requesting pattern analysis on recent research data",
    timestamp: new Date(Date.now() - 3600000),
    status: "delivered",
    metadata: {
      latency: 120,
      priority: "high",
      context: "research_analysis",
      relatedTaskId: 1
    }
  },
  {
    id: 2,
    fromAgentId: 8,
    toAgentId: 7,
    type: "response",
    content: "Analysis complete: Found 3 significant patterns in dataset",
    timestamp: new Date(Date.now() - 3300000),
    status: "read",
    metadata: {
      latency: 150,
      context: "research_analysis",
      relatedTaskId: 1
    }
  },
  {
    id: 3,
    fromAgentId: 9,
    toAgentId: 7,
    type: "broadcast",
    content: "Documentation update: New research findings documented",
    timestamp: new Date(Date.now() - 1800000),
    status: "delivered",
    metadata: {
      priority: "medium",
      context: "documentation"
    }
  },
  {
    id: 4,
    fromAgentId: 7,
    toAgentId: 9,
    type: "response",
    content: "Acknowledged documentation update. Reviewing changes.",
    timestamp: new Date(Date.now() - 1500000),
    status: "read",
    metadata: {
      latency: 90,
      context: "documentation"
    }
  }
];

export function simulateRealtimeCommunication(callback: (log: CommunicationLog) => void) {
  const generateNewLog = () => {
    const agents = [7, 8, 9];
    const fromAgentId = agents[Math.floor(Math.random() * agents.length)];
    let toAgentId;
    do {
      toAgentId = agents[Math.floor(Math.random() * agents.length)];
    } while (toAgentId === fromAgentId);

    return {
      id: Math.floor(Math.random() * 1000) + 100,
      fromAgentId,
      toAgentId,
      type: ["request", "response", "broadcast"][Math.floor(Math.random() * 3)] as CommunicationLog["type"],
      content: `Simulated communication message ${Date.now()}`,
      timestamp: new Date(),
      status: "sent",
      metadata: {
        latency: Math.floor(Math.random() * 200) + 50,
        priority: Math.random() > 0.5 ? "high" : "medium"
      }
    };
  };

  const interval = setInterval(() => {
    callback(generateNewLog());
  }, 5000);

  return () => clearInterval(interval);
}
