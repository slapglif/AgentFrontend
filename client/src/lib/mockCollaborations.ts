import type { 
  collaborations, 
  collaborationParticipants, 
  messages 
} from "@db/schema";

export const mockCollaborations: Partial<typeof collaborations.$inferSelect>[] = [
  {
    id: 1,
    title: "Research Analysis Project",
    description: "Analyzing patterns in multi-agent systems",
    status: "active",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    metadata: {
      priority: "high",
      tags: ["research", "analysis", "patterns"]
    }
  },
  {
    id: 2,
    title: "Data Synthesis Initiative",
    description: "Synthesizing research findings across multiple domains",
    status: "in_progress",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
    metadata: {
      priority: "medium",
      tags: ["synthesis", "cross-domain"]
    }
  },
  {
    id: 3,
    title: "Documentation Review",
    description: "Comprehensive review of research documentation",
    status: "pending",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    metadata: {
      priority: "low",
      tags: ["documentation", "review"]
    }
  }
];

export const mockParticipants: Partial<CollaborationParticipant>[] = [
  {
    id: 1,
    collaborationId: 1,
    agentId: 7,
    role: "lead",
    joinedAt: new Date(Date.now() - 7200000).toISOString(),
    metadata: { expertise: ["data_analysis", "pattern_recognition"] }
  },
  {
    id: 2,
    collaborationId: 1,
    agentId: 8,
    role: "contributor",
    joinedAt: new Date(Date.now() - 3600000).toISOString(),
    metadata: { expertise: ["synthesis", "integration"] }
  },
  {
    id: 3,
    collaborationId: 1,
    agentId: 9,
    role: "reviewer",
    joinedAt: new Date(Date.now() - 1800000).toISOString(),
    metadata: { expertise: ["documentation", "quality_assurance"] }
  }
];

export const mockMessages: Partial<CollaborationMessage>[] = [
  {
    id: 1,
    fromAgentId: 7,
    content: "Initial analysis patterns identified",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    type: "update"
  },
  {
    id: 2,
    fromAgentId: 8,
    content: "Cross-referencing patterns with existing research",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    type: "progress"
  },
  {
    id: 3,
    fromAgentId: 9,
    content: "Documentation framework prepared",
    timestamp: new Date(Date.now() - 900000).toISOString(),
    type: "status"
  }
];

// Simulate real-time events
export function simulateRealTimeEvents(callback: (event: any) => void) {
  const events = [
    {
      type: "participant_joined",
      data: {
        collaborationId: 1,
        participant: {
          id: 4,
          agentId: 10,
          role: "observer",
          joinedAt: new Date().toISOString()
        }
      }
    },
    {
      type: "new_message",
      data: {
        collaborationId: 1,
        message: {
          id: 4,
          fromAgentId: 7,
          content: "New pattern discovered in dataset",
          timestamp: new Date().toISOString(),
          type: "discovery"
        }
      }
    },
    {
      type: "status_update",
      data: {
        collaborationId: 1,
        status: "progressing",
        timestamp: new Date().toISOString()
      }
    }
  ];

  let eventIndex = 0;
  const interval = setInterval(() => {
    if (eventIndex < events.length) {
      callback(events[eventIndex]);
      eventIndex++;
    } else {
      clearInterval(interval);
    }
  }, 3000);

  return () => clearInterval(interval);
}
