import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Cpu, Database, HardDrive, AlertCircle, Clock, List } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { Agent } from "@/lib/agents";
import { type ResourceMetrics, getInitialResourceMetrics } from '@/lib/mockResources';

interface ResourceMonitorProps {
  agent: Agent;
}

export function ResourceMonitor({ agent }: ResourceMonitorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resourceMetrics, setResourceMetrics] = useState<ResourceMetrics | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let mounted = true;

    const initializeMetrics = async () => {
      try {
        if (!mounted) return;
        setIsLoading(true);
        setError(null);

        // Validate required agent data
        if (!agent?.memory_allocation?.total) {
          throw new Error('Failed to initialize resource monitoring: Missing memory allocation');
        }

        // Initialize metrics with initial values
        const initialMetrics = getInitialResourceMetrics(agent);
        if (mounted) {
          setResourceMetrics(initialMetrics);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'An unexpected error occurred');
          setIsLoading(false);
        }
      }
    };

    initializeMetrics();

    const updateMetrics = () => {
      if (!mounted || !resourceMetrics) return;
      
      setResourceMetrics(prev => {
        if (!prev) return prev;

        // Update metrics with small, consistent changes for testing
        const newMemoryValue = Math.min(100, prev.memory + (Math.random() * 2));
        const newCpuValue = Math.min(100, prev.cpu + (Math.random() * 2));
        const newStorageValue = Math.min(100, prev.storage + (Math.random() * 1));

        return {
          ...prev,
          memory: newMemoryValue,
          cpu: newCpuValue,
          storage: newStorageValue,
          memoryTrend: [...prev.memoryTrend.slice(1), newMemoryValue],
          cpuTrend: [...prev.cpuTrend.slice(1), newCpuValue],
          tasks: agent.current_tasks.length,
          taskQueue: agent.current_tasks.filter(task => task.status === 'active').length
        };
      });
    };

    // Set up interval for real-time updates
    intervalRef.current = setInterval(updateMetrics, 2000);

    return () => {
      mounted = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [agent]);

  const getUtilizationColor = (value: number) => {
    if (value > 80) return "text-red-500";
    if (value > 60) return "text-yellow-500";
    return "text-green-500";
  };

  if (error) {
    return (
      <Card className="p-4" data-testid="resource-monitor-error">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      </Card>
    );
  }

  // Show loading state immediately when component mounts
  if (isLoading || !resourceMetrics) {
    return (
      <Card className="p-4" data-testid="resource-monitor-loading">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </div>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card className="p-4 col-span-2" data-testid="resource-monitor">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Resource Monitor</h3>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </div>

        <ScrollArea className="h-[300px]">
          <div className="space-y-6">
            {/* Memory Usage */}
            <div className="space-y-2" data-testid="memory-section">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span className="text-sm font-medium">Memory Usage</span>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline" 
                    className={getUtilizationColor(resourceMetrics.memory)}
                    data-testid="memory-usage-badge"
                  >
                    {resourceMetrics.memory.toFixed(1)}%
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    {agent.memory_allocation.used}MB / {agent.memory_allocation.total}MB
                  </div>
                </div>
              </div>
              <Progress 
                value={resourceMetrics.memory} 
                className="h-2"
                data-testid="memory-progress"
              />
              <div className="text-xs text-muted-foreground" data-testid="reserved-memory">
                Reserved: {agent.memory_allocation.reserved}MB
              </div>
            </div>

            {/* CPU Usage */}
            <div className="space-y-2" data-testid="cpu-section">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  <span className="text-sm font-medium">CPU Usage</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={getUtilizationColor(resourceMetrics.cpu)}
                  data-testid="cpu-usage-badge"
                >
                  {resourceMetrics.cpu.toFixed(1)}%
                </Badge>
              </div>
              <Progress 
                value={resourceMetrics.cpu} 
                className="h-2"
                data-testid="cpu-progress"
              />
            </div>

            {/* Storage Usage */}
            <div className="space-y-2" data-testid="storage-section">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  <span className="text-sm font-medium">Storage</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={getUtilizationColor(resourceMetrics.storage)}
                  data-testid="storage-usage-badge"
                >
                  {resourceMetrics.storage.toFixed(1)}%
                </Badge>
              </div>
              <Progress 
                value={resourceMetrics.storage} 
                className="h-2"
                data-testid="storage-progress"
              />
            </div>

            {/* Tasks and Performance */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-muted rounded-lg" data-testid="task-section">
                <div className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  <span className="text-sm">Tasks</span>
                </div>
                <div className="text-lg font-semibold mt-1">
                  {resourceMetrics.taskQueue}
                </div>
                <div className="text-xs text-muted-foreground">
                  Total Tasks: {resourceMetrics.tasks}
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg" data-testid="processing-section">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <div className="text-sm text-muted-foreground">Processing Time</div>
                </div>
                <div className="text-lg font-semibold mt-1">
                  {agent.performance_metrics.avg_response_time}ms
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </Card>
    </ErrorBoundary>
  );
}
