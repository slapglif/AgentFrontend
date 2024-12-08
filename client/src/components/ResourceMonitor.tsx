import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Cpu, Database, HardDrive, AlertCircle } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { Agent } from "@/lib/agents";

interface ResourceMonitorProps {
  agent: Agent;
}

export function ResourceMonitor({ agent }: ResourceMonitorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  
  const [resourceMetrics, setResourceMetrics] = useState({
    cpu: Math.random() * 100,
    memory: agent.memory_allocation.total > 0 
      ? (agent.memory_allocation.used / agent.memory_allocation.total) * 100 
      : 0,
    storage: Math.random() * 100,
    tasks: agent.current_tasks.length,
  });

  useEffect(() => {
    try {
      setIsLoading(true);
      // Initial metrics update
      setResourceMetrics(prev => ({
        cpu: Math.random() * 100,
        memory: agent.memory_allocation.total > 0 
          ? (agent.memory_allocation.used / agent.memory_allocation.total) * 100 
          : 0,
        storage: Math.random() * 100,
        tasks: agent.current_tasks.length,
      }));

      // Set up interval for real-time updates
      intervalRef.current = setInterval(() => {
        setResourceMetrics(prev => ({
          cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() - 0.5) * 20)),
          memory: Math.min(100, Math.max(0, agent.memory_allocation.total > 0 
            ? (agent.memory_allocation.used / agent.memory_allocation.total) * 100 + (Math.random() - 0.5) * 5
            : 0)),
          storage: Math.min(100, Math.max(0, prev.storage + (Math.random() - 0.5) * 10)),
          tasks: agent.current_tasks.length,
        }));
      }, 2000);

      setIsLoading(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize resource monitoring');
      console.error('Resource monitoring error:', err);
    }

    return () => {
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
      <Card className="p-4">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Resource Monitor</h3>
          {isLoading ? (
            <span className="text-sm text-muted-foreground">Loading...</span>
          ) : (
            <Activity className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        <ScrollArea className="h-[300px]">
          <div className="space-y-6">
            {/* CPU Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  <span className="text-sm font-medium">CPU Usage</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={getUtilizationColor(resourceMetrics.cpu)}
                >
                  {resourceMetrics.cpu.toFixed(1)}%
                </Badge>
              </div>
              <Progress value={resourceMetrics.cpu} className="h-2" />
            </div>

            {/* Memory Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span className="text-sm font-medium">Memory Usage</span>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline" 
                    className={getUtilizationColor(resourceMetrics.memory)}
                  >
                    {resourceMetrics.memory.toFixed(1)}%
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    {agent.memory_allocation.used}MB / {agent.memory_allocation.total}MB
                  </div>
                </div>
              </div>
              <Progress value={resourceMetrics.memory} className="h-2" />
            </div>

            {/* Storage Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  <span className="text-sm font-medium">Storage Usage</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={getUtilizationColor(resourceMetrics.storage)}
                >
                  {resourceMetrics.storage.toFixed(1)}%
                </Badge>
              </div>
              <Progress value={resourceMetrics.storage} className="h-2" />
            </div>

            {/* Resource Details */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Active Tasks</div>
                <div className="text-lg font-semibold">{resourceMetrics.tasks}</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Reserved Memory</div>
                <div className="text-lg font-semibold">{agent.memory_allocation.reserved}MB</div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </Card>
    </ErrorBoundary>
  );
}
