import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { mockCommunicationLogs, simulateRealtimeCommunication, type CommunicationLog } from "@/lib/mockCommunications";
import { DEFAULT_AGENTS } from "@/lib/agents";
import { cn } from "@/lib/utils";

interface AgentCommunicationLogProps {
  agentId?: number;
  className?: string;
}

export function AgentCommunicationLog({ agentId, className }: AgentCommunicationLogProps) {
  const [logs, setLogs] = useState<CommunicationLog[]>(mockCommunicationLogs);

  useEffect(() => {
    // Set up realtime communication simulation
    const cleanup = simulateRealtimeCommunication((newLog) => {
      setLogs(prev => [...prev, newLog].slice(-50)); // Keep last 50 messages
    });

    return () => cleanup();
  }, []);

  const filteredLogs = agentId
    ? logs.filter(log => log.fromAgentId === agentId || log.toAgentId === agentId)
    : logs;

  const getAgentName = (id: number) => {
    return DEFAULT_AGENTS.find(agent => agent.id === id)?.name || `Agent ${id}`;
  };

  const getStatusColor = (status: CommunicationLog["status"]) => {
    switch (status) {
      case "sent":
        return "bg-blue-500";
      case "delivered":
        return "bg-green-500";
      case "read":
        return "bg-purple-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: CommunicationLog["type"]) => {
    switch (type) {
      case "request":
        return "→";
      case "response":
        return "←";
      case "broadcast":
        return "⇒";
      case "error":
        return "⚠";
      default:
        return "•";
    }
  };

  return (
    <Card className={cn("p-4", className)}>
      <h3 className="font-medium mb-4">Communication Log</h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-2">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className={cn(
                "p-3 rounded-lg border",
                "transition-colors duration-200",
                log.type === "error" ? "bg-destructive/10 border-destructive/20" : "bg-muted"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg" title={log.type}>
                      {getTypeIcon(log.type)}
                    </span>
                    <span className="text-sm font-medium">
                      {getAgentName(log.fromAgentId)} → {getAgentName(log.toAgentId)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{log.content}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className={cn("text-xs", getStatusColor(log.status))}>
                    {log.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              {log.metadata && (
                <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                  {log.metadata.latency && <span>Latency: {log.metadata.latency}ms</span>}
                  {log.metadata.priority && (
                    <Badge variant="secondary" className="ml-2">
                      {log.metadata.priority}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
