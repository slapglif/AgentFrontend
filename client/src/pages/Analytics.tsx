import { Activity, Brain, GitMerge } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockAnalytics } from "@/lib/mockAnalytics";
import { PerformanceMetrics } from "@/components/PerformanceMetrics";
import { AgentBehaviorPatterns } from "@/components/AgentBehaviorPatterns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRef, useEffect } from "react";

export default function Analytics() {
  const chartRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  if (!chartRef.current && mounted.current) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
      
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="behavior">Behavior Patterns</TabsTrigger>
          <TabsTrigger value="real-time">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Research Metrics</h3>
                <Brain className="h-4 w-4" />
              </div>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Goals Progress</p>
                    <p className="text-lg font-semibold">
                      {mockAnalytics.systemMetrics?.researchMetrics?.goalsCompleted || 0} / {mockAnalytics.systemMetrics?.researchMetrics?.totalGoals || 1}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Knowledge Nodes</p>
                    <p className="text-lg font-semibold">
                      {mockAnalytics.systemMetrics.researchMetrics.knowledgeNodes}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Research Progress</span>
                    <span className="text-sm font-medium">
                      {Math.round((mockAnalytics.systemMetrics.researchMetrics.goalsCompleted / mockAnalytics.systemMetrics.researchMetrics.totalGoals) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(mockAnalytics.systemMetrics.researchMetrics.goalsCompleted / mockAnalytics.systemMetrics.researchMetrics.totalGoals) * 100} 
                    className="w-full" 
                  />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Agent Performance</h3>
                <Activity className="h-4 w-4" />
              </div>
              <div className="mt-4 space-y-4">
                {mockAnalytics.agentPerformance.slice(0, 3).map((agent) => (
                  <div key={agent.agent} className="space-y-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{agent.agent}</span>
                      <span className="text-xs">Level {agent.level}</span>
                    </div>
                    <div className="space-y-1">
                      <div>
                        <div className="flex justify-between text-xs">
                          <span>Research Impact</span>
                          <span>{agent.taskComplexity}%</span>
                        </div>
                        <Progress value={agent.taskComplexity} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs">
                          <span>Collaboration</span>
                          <span>{agent.collaborationScore}%</span>
                        </div>
                        <Progress value={agent.collaborationScore} className="h-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Knowledge Synthesis</h3>
                <GitMerge className="h-4 w-4" />
              </div>
              <div className="mt-4 space-y-4">
                {mockAnalytics.collaborationStats.map((stat) => (
                  <div key={stat.date} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.date}</p>
                      <div className="space-y-1">
                        <p className="text-sm">Active Tasks: {stat.activeResearchTasks}</p>
                        <p className="text-sm">Interactions: {stat.agentInteractions}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Knowledge Gen: {stat.knowledgeGenerationRate}%</p>
                      <p className="text-sm font-medium">Synthesis: {stat.knowledgeSynthesis}%</p>
                      <p className="text-xs text-muted-foreground">Research: {stat.researchProgress}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="real-time">
          <ErrorBoundary>
            <PerformanceMetrics />
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="behavior">
          <ErrorBoundary>
            <AgentBehaviorPatterns />
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
}
