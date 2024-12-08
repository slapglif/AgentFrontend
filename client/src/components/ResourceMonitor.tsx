import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Cpu, Database, HardDrive } from "lucide-react";
import type { Agent } from "@/lib/agents";

interface ResourceMonitorProps {
  agent: Agent;
}

export function ResourceMonitor({ agent }: ResourceMonitorProps) {
  const [resourceMetrics, setResourceMetrics] = useState({
    cpu: Math.random() * 100,
    memory: (agent.memory_allocation.used / agent.memory_allocation.total) * 100,
    storage: Math.random() * 100,
    tasks: agent.current_tasks.length,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time resource updates
      setResourceMetrics(prev => ({
        cpu: Math.min(100, Math.max(0, prev.cpu + (Math.random() - 0.5) * 20)),
        memory: Math.min(100, Math.max(0, (agent.memory_allocation.used / agent.memory_allocation.total) * 100 + (Math.random() - 0.5) * 5)),
        storage: Math.min(100, Math.max(0, prev.storage + (Math.random() - 0.5) * 10)),
        tasks: agent.current_tasks.length,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [agent]);

  const getUtilizationColor = (value: number) => {
    if (value > 80) return "text-red-500";
    if (value > 60) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Resource Monitor</h3>
        <Activity className="h-4 w-4 text-muted-foreground" />
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
  );
}
