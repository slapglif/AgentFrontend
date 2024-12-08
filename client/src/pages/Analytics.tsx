import { BarChart2, TrendingUp, Users, Activity, Server } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockAnalytics } from "@/lib/mockAnalytics";
import { PerformanceMetrics } from "@/components/PerformanceMetrics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Analytics() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
      
      <Tabs defaultValue="overview">
        <TabsList className="w-[400px] mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="real-time">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">System Metrics</h3>
                <Server className="h-4 w-4" />
              </div>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Active Agents</p>
                    <p className="text-lg font-semibold">
                      {mockAnalytics.systemMetrics.activeAgents} / {mockAnalytics.systemMetrics.totalAgents}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Token Usage</p>
                    <p className="text-lg font-semibold">
                      {Math.round((mockAnalytics.systemMetrics.tokenUsage.current / mockAnalytics.systemMetrics.tokenUsage.limit) * 100)}%
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Tasks Status</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Queued: {mockAnalytics.systemMetrics.taskMetrics.queued}</span>
                      <span>Processing: {mockAnalytics.systemMetrics.taskMetrics.processing}</span>
                      <span>Completed: {mockAnalytics.systemMetrics.taskMetrics.completed}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Goals Progress</span>
                    <span className="text-sm font-medium">{mockAnalytics.systemMetrics.goalProgress}%</span>
                  </div>
                  <Progress value={mockAnalytics.systemMetrics.goalProgress} className="w-full" />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Agent Performance</h3>
                <Activity className="h-4 w-4" />
              </div>
              <div className="mt-4 space-y-4">
                {mockAnalytics.agentPerformance.map((agent) => (
                  <div key={agent.agent} className="space-y-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{agent.agent}</span>
                    </div>
                    <div className="space-y-1">
                      <div>
                        <div className="flex justify-between text-xs">
                          <span>Communication</span>
                          <span>{agent.communicationSuccessRate}%</span>
                        </div>
                        <Progress value={agent.communicationSuccessRate} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs">
                          <span>Research Tasks</span>
                          <span>{agent.researchTaskCompletion}%</span>
                        </div>
                        <Progress value={agent.researchTaskCompletion} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs">
                          <span>Knowledge Sharing</span>
                          <span>{agent.knowledgeSharing}%</span>
                        </div>
                        <Progress value={agent.knowledgeSharing} className="h-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Collaboration Trends</h3>
                <Users className="h-4 w-4" />
              </div>
              <div className="mt-4 space-y-4">
                {mockAnalytics.collaborationStats.map((stat) => (
                  <div key={stat.date} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.date}</p>
                      <p className="text-sm">Active Agents: {stat.activeAgents}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{stat.interactions}</p>
                      <p className="text-xs text-muted-foreground">interactions</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="real-time" className="mt-0">
          <ErrorBoundary>
            <PerformanceMetrics />
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
}
