import { useState, useEffect, useRef } from "react";
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
  const [isConnected, setIsConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const mountedRef = useRef(true);
  const maxRetries = 3;

  useEffect(() => {
    let cleanupFunction: (() => void) | undefined;
    let retryTimeout: NodeJS.Timeout;

    const setupCommunication = () => {
      try {
        setIsConnected(true);
        cleanupFunction = simulateRealtimeCommunication((newLog) => {
          if (mountedRef.current) {
            setLogs(prev => {
              const updatedLogs = [...prev, newLog];
              // Keep last 50 messages for performance and memory management
              return updatedLogs.slice(-50);
            });
          }
        });
        // Reset retry count on successful connection
        setRetryCount(0);
      } catch (error) {
        console.error('Failed to setup communication:', error);
        setIsConnected(false);
        
        // Implement retry logic
        if (retryCount < maxRetries) {
          retryTimeout = setTimeout(() => {
            setRetryCount(prev => prev + 1);
            setupCommunication();
          }, Math.min(1000 * Math.pow(2, retryCount), 10000)); // Exponential backoff
        }
      }
    };

    setupCommunication();

    // Enhanced cleanup function
    return () => {
      mountedRef.current = false;
      if (cleanupFunction) {
        cleanupFunction();
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      setIsConnected(false);
    };
  }, [retryCount]);

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
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Communication Log</h3>
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isConnected ? "bg-green-500" : "bg-red-500"
          )} />
          <span className="text-xs text-muted-foreground">
            {isConnected ? "Connected" : retryCount < maxRetries ? `Reconnecting (${retryCount}/${maxRetries})` : "Disconnected"}
          </span>
        </div>
      </div>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-2">
          {filteredLogs.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              No communication logs available
            </div>
          ) : filteredLogs.map((log) => (
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
      {retryCount >= maxRetries && !isConnected && (
        <div className="mt-4 p-2 bg-destructive/10 text-destructive rounded-lg text-sm">
          Failed to establish connection. Please try refreshing the page.
        </div>
      )}
    </Card>
  );
}
