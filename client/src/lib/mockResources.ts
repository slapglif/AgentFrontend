import type { Agent } from './agents';

export interface ResourceMetrics {
  cpu: number;
  memory: number;
  storage: number;
  tasks: number;
  taskQueue: number;
  memoryTrend: number[];
  cpuTrend: number[];
}

export const defaultTrendData = Array.from({ length: 10 }, () => Math.random() * 50);

export const getInitialResourceMetrics = (agent: Agent): ResourceMetrics => ({
  cpu: Math.random() * 60,
  memory: agent.memory_allocation?.total > 0 
    ? (agent.memory_allocation.used / agent.memory_allocation.total) * 100 
    : 0,
  storage: Math.random() * 40,
  tasks: agent.current_tasks?.length || 0,
  taskQueue: agent.current_tasks?.filter(task => task.status === 'active')?.length || 0,
  memoryTrend: [...defaultTrendData],
  cpuTrend: [...defaultTrendData]
});
