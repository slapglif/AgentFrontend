import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
// Removed unused import
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MemoryCard } from "@/components/MemoryCard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LearningProgress } from "@/components/LearningProgress";
import { ResourceMonitor } from "@/components/ResourceMonitor";
import { DEFAULT_AGENTS } from "@/lib/agents";
import { mockPerformanceData, mockLearningMetrics, mockMemoryData } from "@/lib/mockData";
import { mockOverview } from "@/lib/mockOverview";
import type { Agent } from "@/lib/agents";
import {
  Activity,
  Database,
  Monitor,
  GraduationCap,
  ChevronLeft,
  AlertCircle,
  Loader2,
  ListTodo
} from "lucide-react";

export default function AgentDetails() {
  const { id } = useParams();

  const { data: agent, isLoading, isError, error } = useQuery<Agent>({
    queryKey: ["agent", id],
    queryFn: async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockAgent = DEFAULT_AGENTS.find(a => a.id === Number(id));
        if (!mockAgent) {
          throw new Error(`Agent with ID ${id} not found`);
        }

        const latestMetrics = {
          success_rate: mockOverview.performanceMetrics.successRate,
          tasks_completed: mockOverview.performanceMetrics.taskCompletion.successful,
          avg_response_time: mockOverview.performanceMetrics.avgResponseTime,
          memory_usage: mockOverview.performanceMetrics.resourceUtilization.memory
        };

        return {
          ...mockAgent,
          lastUpdated: new Date().toISOString(),
          performance_metrics: latestMetrics,
          current_tasks: mockPerformanceData.current_tasks.map(task => ({
            ...task,
            priority: Math.random() > 0.7 ? "high" : "medium",
            status: ["pending", "in_progress", "completed"][Math.floor(Math.random() * 3)]
          })),
          learningMetrics: mockLearningMetrics,
          resource_usage: {
            cpu: mockOverview.performanceMetrics.resourceUtilization.cpu,
            memory: mockOverview.performanceMetrics.resourceUtilization.memory,
            network: mockOverview.performanceMetrics.resourceUtilization.network
          }
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
    staleTime: 30000,
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
    <div className="flex flex-col min-h-screen">
      <header className="border-b p-4 bg-muted/30 backdrop-blur-sm sticky top-0 z-10">
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

      <div className="flex-1 p-6">
        <Tabs defaultValue="overview" className="w-full">
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

          <div className="mt-4">
            <TabsContent value="overview">
              <div className="grid grid-cols-2 gap-4 pb-6">
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
              <div className="space-y-4 pb-6">
                {isLoadingMemories ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : memories && memories.length > 0 ? (
                  memories.map((memory) => (
                    <MemoryCard 
                      key={memory.id}
                      memory={memory} 
                    />
                  ))
                ) : (
                  <div className="text-center text-muted-foreground">
                    No memories found
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="resources">
              <div className="grid grid-cols-2 gap-4 pb-6">
                <ResourceMonitor agent={agent} />
              </div>
            </TabsContent>

            <TabsContent value="learning">
              <div className="grid grid-cols-1 gap-4 pb-6">
                <ErrorBoundary>
                  <LearningProgress 
                    metrics={{
                      skillsProficiency: agent.learningMetrics?.skills?.map(s => s.proficiency) ?? [],
                      knowledgeAreas: agent.learningMetrics?.skills?.map(s => s.name) ?? [],
                      learningRate: agent.learningMetrics?.level ? 
                        agent.learningMetrics.level.xp / agent.learningMetrics.level.nextLevelXp : 0,
                      completedLessons: agent.learningMetrics?.achievements?.length ?? 0,
                      currentLevel: agent.learningMetrics?.level?.current ?? 1,
                      experiencePoints: agent.learningMetrics?.level?.xp ?? 0,
                      nextLevelAt: agent.learningMetrics?.level?.nextLevelXp ?? 100,
                      totalSkills: agent.learningMetrics?.skills?.length ?? 0,
                      skillsProgress: agent.learningMetrics?.skills?.length ? 
                        agent.learningMetrics.skills.reduce((acc, skill) => acc + skill.proficiency, 0) / agent.learningMetrics.skills.length : 0
                    }} 
                  />
                </ErrorBoundary>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
