import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { MemoryCard } from "@/components/MemoryCard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Loader2 } from "lucide-react";
import { AlertCircle, Settings, Activity, Clock, Database, ChevronLeft, Users, BarChart2, ListTodo } from "lucide-react";
import { DEFAULT_AGENTS } from "@/lib/agents";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Agent } from "@/lib/agents";

export default function AgentDetails() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { id } = useParams();

  const { data: agent, isLoading, isError, error } = useQuery<Agent>({
    queryKey: ["agent", id],
    queryFn: async () => {
      try {
        // First try to get from mock data
        const mockAgent = DEFAULT_AGENTS.find(a => a.id === Number(id));
        if (mockAgent) return mockAgent;

        // If no mock data, then try API
        const res = await fetch(`/api/agents/${id}`);
        if (!res.ok) throw new Error("Failed to load agent");
        return res.json();
      } catch (err) {
        console.error('Error loading agent:', err);
        throw new Error("Failed to load agent details");
      }
    },
  });

  const { data: memories, isLoading: isLoadingMemories } = useQuery({
    queryKey: ["memories", id],
    queryFn: async () => {
      const res = await fetch(`/api/memories?agentId=${id}`);
      if (!res.ok) return []; // Return empty array if API fails
      return res.json();
    },
    enabled: !!agent, // Only fetch memories if we have an agent
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading agent details...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="max-w-md p-4 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-lg font-semibold mb-2">Error Loading Agent</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {error instanceof Error ? error.message : "Failed to load agent details"}
          </p>
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="max-w-md p-4 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-lg font-semibold mb-2">Agent Not Found</h2>
          <p className="text-sm text-muted-foreground mb-4">
            The requested agent could not be found.
          </p>
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <header className="border-b p-4 bg-muted/30 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{agent.name}</h1>
            <p className="text-sm text-muted-foreground">{agent.type}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 overflow-hidden">
        <Tabs defaultValue="overview" className="h-full flex flex-col">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="configuration" className="gap-2">
              <Settings className="h-4 w-4" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="memory" className="gap-2">
              <Database className="h-4 w-4" />
              Memory
            </TabsTrigger>
            <TabsTrigger value="collaboration" className="gap-2">
              <Users className="h-4 w-4" />
              Collaboration
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 mt-4">
            <TabsContent value="overview">
              <div className="grid grid-cols-2 gap-4">
                {/* Performance Metrics Card */}
                <Card className="p-4">
                  <h3 className="font-medium mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Success Rate</span>
                        <span className="text-sm font-medium">
                          {(agent.performance_metrics.success_rate * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={agent.performance_metrics.success_rate * 100} 
                        className="animate-progress" 
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Response Time</span>
                        <span className="text-sm font-medium">
                          {agent.performance_metrics.avg_response_time}ms
                        </span>
                      </div>
                      <Progress 
                        value={100 - (agent.performance_metrics.avg_response_time / 5000) * 100} 
                        className="animate-progress" 
                      />
                    </div>
                  </div>
                </Card>

                {/* Capabilities Card */}
                <Card className="p-4">
                  <h3 className="font-medium mb-4">Capabilities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {agent.capabilities.map((capability) => (
                      <div key={capability} className="p-2 bg-muted rounded-lg text-sm">
                        {capability}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="configuration">
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-medium mb-4">Agent Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm mb-2 block">Decision Threshold</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={agent.configuration.decision_threshold}
                          className="flex-1"
                          onChange={(e) => {
                            toast({
                              title: "Configuration Updated",
                              description: `Decision threshold set to ${e.target.value}`,
                            });
                          }}
                        />
                        <span className="text-sm font-mono w-16">
                          {agent.configuration.decision_threshold}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="memory">
              <ScrollArea className="h-full">
                <div className="space-y-4 p-4">
                  {isLoadingMemories ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : memories?.length > 0 ? (
                    memories.map((memory: any) => (
                      <MemoryCard key={memory.id} memory={memory} />
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground">
                      No memories found
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="history">
              <Card className="p-4">
                <h3 className="font-medium mb-4">Activity History</h3>
                <div className="space-y-4">
                  {agent.current_tasks.map((task) => (
                    <div 
                      key={task.id}
                      className="flex items-center justify-between p-2 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <ListTodo className="h-4 w-4" />
                        <span className="text-sm">{task.type}</span>
                      </div>
                      <Badge>{task.status}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="collaboration">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="font-medium mb-4">Collaboration Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Team Contribution</span>
                        <span className="text-sm font-medium">
                          {(agent.performance_metrics.success_rate * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={agent.performance_metrics.success_rate * 100} 
                        className="animate-progress" 
                      />
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}