import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Filter, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_AGENTS } from "@/lib/agents";
import { mockAnalytics } from "@/lib/mockAnalytics";
import { cn } from "@/lib/utils";
import type { AgentWithStatus, OrchestratorState } from "@/types/agent";

export default function Agents() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // State declarations
  const [agents, setAgents] = useState<AgentWithStatus[]>([]);
  const [orchestratorState, setOrchestratorState] = useState<OrchestratorState>({
    status: "disconnected",
    retryCount: 0
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Orchestrator connection logic with exponential backoff
  const connectToOrchestrator = useCallback(async () => {
    try {
      setOrchestratorState(prev => ({
        ...prev,
        status: "connecting"
      }));

      // Add backoff delay based on retry count
      const backoffDelay = Math.min(1000 * Math.pow(2, orchestratorState.retryCount), 30000);
      if (orchestratorState.retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
      }

      const res = await fetch("/api/orchestrator/connect", {
        signal: AbortSignal.timeout(5000), // 5 second timeout
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error(`Failed to connect to orchestrator: ${res.statusText}`);

      const data = await res.json();
      
      setOrchestratorState({
        status: "connected",
        lastConnected: new Date(),
        retryCount: 0,
        version: data.version,
        capabilities: data.capabilities
      });

      // Initialize agents with mock data and real-time status
      if (agents.length === 0) {
        const initialAgents = DEFAULT_AGENTS.map(agent => ({
          ...agent,
          realTimeStatus: {
            isOnline: true,
            lastSeen: new Date(),
            currentLoad: Math.random() * 30, // Initial load between 0-30%
            errorCount: 0,
            memoryUsage: {
              used: Math.floor(Math.random() * 512),
              total: 1024
            }
          }
        }));
        setAgents(initialAgents);
        setIsLoading(false);

        toast({
          title: "Connected to Orchestrator",
          description: `Successfully connected to orchestrator v${data.version}`,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      
      setOrchestratorState(prev => ({
        status: "error",
        error: errorMessage,
        retryCount: prev.retryCount + 1,
        lastConnected: prev.lastConnected
      }));

      toast({
        title: "Connection Error",
        description: `Failed to connect: ${errorMessage}. Retrying in ${Math.round(backoffDelay/1000)}s...`,
        variant: "destructive",
      });
    }
  }, [agents.length, orchestratorState.retryCount, toast]);

  // Orchestrator connection effect
  useEffect(() => {
    connectToOrchestrator();
    const interval = setInterval(connectToOrchestrator, 30000);
    return () => clearInterval(interval);
  }, [connectToOrchestrator]);

  // Agent status polling effect - Moved inside component
  const pollAgentStatus = useCallback(async () => {
    try {
      setAgents(prevAgents => 
        prevAgents.map(agent => ({
          ...agent,
          realTimeStatus: {
            ...agent.realTimeStatus!,
            currentLoad: Math.random() * 100,
            lastSeen: new Date(),
            isOnline: Math.random() > 0.1,
            errorCount: (agent.realTimeStatus?.errorCount || 0) + (Math.random() > 0.95 ? 1 : 0)
          }
        }))
      );
    } catch (error) {
      console.error('Failed to update agent status:', error);
      toast({
        title: "Error",
        description: "Failed to update agent status. Retrying...",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (orchestratorState.status !== "connected") return;

    const statusInterval = setInterval(pollAgentStatus, 5000);
    pollAgentStatus(); // Initial poll

    return () => clearInterval(statusInterval);
  }, [orchestratorState.status, pollAgentStatus]);

  // Filter agents based on search query
  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ErrorBoundary>
      <div className="h-full flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold">Agent Management</h2>
            <div className="flex items-center gap-2">
              <div 
                className={cn(
                  "w-2 h-2 rounded-full",
                  orchestratorState.status === "connected" ? "bg-green-500" : 
                  orchestratorState.status === "connecting" ? "bg-yellow-500" :
                  "bg-red-500"
                )} 
              />
              <span className="text-sm text-muted-foreground">
                Orchestrator: {orchestratorState.status}
                {orchestratorState.lastConnected && ` (Last connected: ${orchestratorState.lastConnected.toLocaleTimeString()})`}
              </span>
            </div>
          </div>
        </div>

        {orchestratorState.status === "error" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to connect to orchestrator: {orchestratorState.error}
              {orchestratorState.retryCount > 0 && ` (Retry attempt: ${orchestratorState.retryCount})`}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <ScrollArea className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAgents.map((agent) => (
                <Card
                  key={agent.id}
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setLocation(`/agents/${agent.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground">{agent.description}</p>
                    </div>
                    <Badge
                      variant={agent.status === "active" ? "default" : "secondary"}
                    >
                      {agent.status}
                    </Badge>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Level {agent.level}</span>
                      <Progress value={agent.experience} className="flex-1" />
                      <span className="text-sm font-medium">{agent.experience}%</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {agent.capabilities.slice(0, 3).map((capability, index) => (
                        <Badge key={index} variant="outline">
                          {capability}
                        </Badge>
                      ))}
                      {agent.capabilities.length > 3 && (
                        <Badge variant="outline">+{agent.capabilities.length - 3}</Badge>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="text-muted-foreground">Tasks:</div>
                          <div>{agent.performance_metrics.tasks_completed}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-muted-foreground">Success Rate:</div>
                          <div>{(agent.performance_metrics.success_rate * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                      
                      {agent.realTimeStatus && (
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="text-muted-foreground">Load:</div>
                            <div>{agent.realTimeStatus.currentLoad.toFixed(1)}%</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-muted-foreground">Errors:</div>
                            <div>{agent.realTimeStatus.errorCount}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </ErrorBoundary>
  );
}
