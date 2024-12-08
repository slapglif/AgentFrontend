import { Activity, Code, MessageSquare, Database, FileText } from 'lucide-react';

export interface HistoryEntry {
  id: string;
  timestamp: string;
  type: 'task' | 'communication' | 'system' | 'analysis' | 'memory';
  title: string;
  description: string;
  status: 'completed' | 'failed' | 'pending';
  metadata?: {
    duration?: number;
    resourceUsage?: number;
    relatedAgents?: string[];
  };
}

export const mockHistory: HistoryEntry[] = [
  {
    id: '1',
    timestamp: '2024-12-08T10:00:00Z',
    type: 'task',
    title: 'Data Analysis Pipeline',
    description: 'Completed analysis of research datasets using ML algorithms',
    status: 'completed',
    metadata: {
      duration: 1200,
      resourceUsage: 85,
      relatedAgents: ['Agent-1', 'Agent-3']
    }
  },
  {
    id: '2',
    timestamp: '2024-12-08T09:30:00Z',
    type: 'communication',
    title: 'Agent Collaboration Session',
    description: 'Coordinated with research team on methodology',
    status: 'completed',
    metadata: {
      duration: 600,
      relatedAgents: ['Agent-2', 'Agent-4']
    }
  },
  {
    id: '3',
    timestamp: '2024-12-08T09:00:00Z',
    type: 'system',
    title: 'System Optimization',
    description: 'Performed memory allocation optimization',
    status: 'completed',
    metadata: {
      resourceUsage: 65
    }
  },
  {
    id: '4',
    timestamp: '2024-12-08T08:45:00Z',
    type: 'analysis',
    title: 'Pattern Recognition',
    description: 'Identified new behavior patterns in agent interactions',
    status: 'completed'
  },
  {
    id: '5',
    timestamp: '2024-12-08T08:30:00Z',
    type: 'memory',
    title: 'Memory Consolidation',
    description: 'Consolidated research findings into long-term memory',
    status: 'completed',
    metadata: {
      resourceUsage: 45
    }
  }
];
