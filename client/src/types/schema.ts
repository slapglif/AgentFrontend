// Type definitions to replace @db/schema imports
export interface Memory {
  id: number;
  agentId: number;
  content: string | {
    text: string;
    code?: string;
    language?: string;
  };
  type: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface Collaboration {
  id: number;
  title: string;
  description: string;
  status: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CollaborationParticipant {
  id: number;
  collaborationId: number;
  agentId: number;
  role: string;
  joinedAt: Date;
  metadata?: {
    expertise?: string[];
    [key: string]: any;
  };
}

export interface CollaborationMessage {
  id: number;
  collaborationId: number;
  senderId?: number;
  fromAgentId?: number;
  content: string;
  timestamp: Date;
  type?: string;
  isTyping?: boolean;
  metadata: Record<string, any>;
}
