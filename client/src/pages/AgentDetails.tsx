import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MemoryCard } from "@/components/MemoryCard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LearningProgress } from "@/components/LearningProgress";
import { AgentCommunicationLog } from "@/components/AgentCommunicationLog";
import { ResourceMonitor } from "@/components/ResourceMonitor";
import { DEFAULT_AGENTS } from "@/lib/agents";
import { mockPerformanceData, mockLearningMetrics, mockMemoryData } from "@/lib/mockData";
import type { Agent } from "@/lib/agents";
import {
  Activity,
  Settings,
  Clock,
  Database,
  Users,
  Monitor,
  GraduationCap,
  ChevronLeft,
  AlertCircle,
  Loader2,
  ListTodo,
  BarChart2,
  HardDrive,
  Cpu
} from "lucide-react";

export default function AgentDetails() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { id } = useParams();

  const { data: agent, isLoading, isError, error } = useQuery<Agent>({
    queryKey: ["agent", id],
    queryFn: async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
        const mockAgent = DEFAULT_AGENTS.find(a => a.id === Number(id));
        if (!mockAgent) {
          throw new Error(`Agent with ID ${id} not found`);
        }
        return {
          ...mockAgent,
          lastUpdated: new Date().toISOString(),
          performance_metrics: mockPerformanceData.daily_metrics[6], // Get latest metrics
          current_tasks: mockPerformanceData.current_tasks,
          learningMetrics: mockLearningMetrics
        };
      } catch (err) {
        console.error('Error loading agent:', err);
        throw new Error(
          err instanceof Error 
            ? err.message 
            : "An unexpected error occurred while loading agent details"
        );
      }
    },
    retry: 1,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  const { data: memories, isLoading: isLoadingMemories } = useQuery({
    queryKey: ["memories", id],
    queryFn: () => Promise.resolve(mockMemoryData),
    enabled: !!agent,
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-background/50 backdrop-blur-sm transition-all duration-300">
        <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-card animate-in fade-in zoom-in duration-300">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="space-y-2 text-center">
            <h3 className="font-semibold">Loading Agent Details</h3>
            <p className="text-sm text-muted-foreground">Please wait while we fetch the agent information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full flex items-center justify-center bg-background/50 backdrop-blur-sm">
        <div className="max-w-md p-6 rounded-lg bg-card animate-in fade-in zoom-in duration-300">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-lg font-semibold">Error Loading Agent</h2>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : "Failed to load agent details"}
              </p>
            </div>
            <div className="flex gap-3 mt-2">
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
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
            <TabsTrigger value="memory" className="gap-2">
              <Database className="h-4 w-4" />
              Memory
            </TabsTrigger>
            <TabsTrigger value="resources" className="gap-2">
              <Monitor className="h-4 w-4" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="learning" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Learning
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 mt-4">
            <TabsContent value="overview" className="h-full">
              <div className="grid grid-cols-2 gap-4">
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
                        <span className="text-sm">Tasks Completed</span>
                        <span className="text-sm font-medium">
                          {agent.performance_metrics.tasks_completed}
                        </span>
                      </div>
                      <Progress 
                        value={(agent.performance_metrics.tasks_completed / 100) * 100}
                        className="animate-progress" 
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-medium mb-4">Resource Usage</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">CPU Usage</span>
                        <span className="text-sm font-medium">
                          {mockPerformanceData.resource_usage.cpu}%
                        </span>
                      </div>
                      <Progress 
                        value={mockPerformanceData.resource_usage.cpu}
                        className="animate-progress" 
                      />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Memory Usage</span>
                        <span className="text-sm font-medium">
                          {mockPerformanceData.resource_usage.memory}%
                        </span>
                      </div>
                      <Progress 
                        value={mockPerformanceData.resource_usage.memory}
                        className="animate-progress" 
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-4 col-span-2">
                  <h3 className="font-medium mb-4">Current Tasks</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {mockPerformanceData.current_tasks.map((task) => (
                      <div 
                        key={task.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <ListTodo className="h-4 w-4" />
                          <span className="text-sm font-medium">{task.type}</span>
                        </div>
                        <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>
                          {task.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="memory">
              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="space-y-4">
                  {isLoadingMemories ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : memories?.length > 0 ? (
                    memories.map((memory) => (
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

            <TabsContent value="resources">
              <div className="grid grid-cols-2 gap-4">
                <ResourceMonitor agent={agent} />
              </div>
            </TabsContent>

            <TabsContent value="learning">
              <div className="grid grid-cols-1 gap-4">
                <ErrorBoundary>
                  <LearningProgress metrics={mockLearningMetrics} />
                </ErrorBoundary>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
