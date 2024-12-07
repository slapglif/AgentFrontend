import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Filter, Plus, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_AGENTS } from "@/lib/agents";
import { mockAnalytics } from "@/lib/mockAnalytics";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { OrchestratorState, AgentWithStatus } from "@/types/agent";

export default function Agents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();
  const [orchestratorState, setOrchestratorState] = useState<OrchestratorState>({
    status: "connecting",
    retryCount: 0
  });
  const [agents, setAgents] = useState<AgentWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initialize agents with mock data and connect to orchestrator
  useEffect(() => {
    const initializeAgents = () => {
      try {
        const agentsWithMetrics = DEFAULT_AGENTS.map(agent => {
          const metrics = mockAnalytics.agentPerformance.find(
            perf => perf.agent === agent.name
          );
          return {
            ...agent,
            performanceMetrics: metrics || undefined,
            realTimeStatus: {
              isOnline: agent.status === "active",
              lastSeen: new Date(),
              currentLoad: Math.random() * 100,
              errorCount: 0
            }
          };
        });
        setAgents(agentsWithMetrics);
        setError(null);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to initialize agents");
        setIsLoading(false);
      }
    };

    const connectToOrchestrator = async () => {
      try {
        setOrchestratorState(prev => ({
          ...prev,
          status: "connecting",
          error: undefined
        }));

        const res = await fetch("/api/orchestrator/connect");
        if (res.ok) {
          setOrchestratorState({
            status: "connected",
            lastConnected: new Date(),
            retryCount: 0
          });
          // In a real implementation, we would fetch real agent data here
          initializeAgents();
        } else {
          throw new Error("Failed to connect to orchestrator");
        }
      } catch (error) {
        console.error("Failed to connect to orchestrator:", error);
        setOrchestratorState(prev => ({
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
          retryCount: prev.retryCount + 1,
          lastConnected: prev.lastConnected
        }));
        // Fall back to mock data when orchestrator is unavailable
        initializeAgents();
      }
    };
    
    connectToOrchestrator();
    const interval = setInterval(connectToOrchestrator, 30000); // Reconnect every 30 seconds
    
    // Update agent status periodically
    const statusInterval = setInterval(() => {
      setAgents(prevAgents => 
        prevAgents.map(agent => ({
          ...agent,
          realTimeStatus: {
            ...agent.realTimeStatus!,
            currentLoad: Math.random() * 100,
            lastSeen: new Date(),
            isOnline: Math.random() > 0.1 // 90% chance of being online
          }
        }))
      );
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(statusInterval);
    };
  }, []);

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
        <Button 
          className="gap-2"
          disabled={orchestratorState.status !== "connected"}
          onClick={async () => {
            if (orchestratorState.status === "connected") {
              try {
                const newAgentTemplate = {
                  ...DEFAULT_AGENTS[0],
                  id: agents.length + 1,
                  name: `New Agent ${agents.length + 1}`,
                  status: "idle",
                };
                
                const res = await fetch("/api/orchestrator/agents", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ agent: newAgentTemplate })
                });

                if (!res.ok) throw new Error("Failed to create agent");

                // Add the new agent to the local state
                setAgents(prev => [...prev, {
                  ...newAgentTemplate,
                  realTimeStatus: {
                    isOnline: true,
                    lastSeen: new Date(),
                    currentLoad: 0,
                    errorCount: 0
                  }
                }]);

                toast({
                  title: "Success",
                  description: "New agent created successfully",
                });
              } catch (error) {
                console.error("Failed to create agent:", error);
                toast({
                  title: "Error",
                  description: error instanceof Error ? error.message : "Failed to create agent",
                  variant: "destructive",
                });
              }
            }
          }}
        >
          <Plus className="h-4 w-4" />
          New Agent
        </Button>
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
  );
}
