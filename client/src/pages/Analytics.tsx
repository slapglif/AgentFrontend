import { BarChart2, TrendingUp, Users, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockAnalytics } from "@/lib/mockAnalytics";
import { PerformanceMetrics } from "@/components/PerformanceMetrics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Analytics() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-[400px] mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="real-time">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Agent Performance</h3>
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="mt-4 space-y-4">
                {mockAnalytics.agentPerformance.map((agent) => (
                  <div key={agent.agent}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">{agent.agent}</span>
                      <span className="text-sm font-medium">{agent.success}%</span>
                    </div>
                    <Progress value={agent.success} className="mb-2" />
                  </div>
                ))}
              </div>
            </Card>

            {/* System Metrics */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">System Metrics</h3>
                <Activity className="h-4 w-4" />
              </div>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Uptime</p>
                    <p className="text-lg font-semibold">{mockAnalytics.systemMetrics.uptime}%</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Response Time</p>
                    <p className="text-lg font-semibold">{mockAnalytics.systemMetrics.responseTime}ms</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Throughput</p>
                    <p className="text-lg font-semibold">{mockAnalytics.systemMetrics.throughput}/h</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Error Rate</p>
                    <p className="text-lg font-semibold">{mockAnalytics.systemMetrics.errorRate}%</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Collaboration Stats */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Collaboration Stats</h3>
                <Users className="h-4 w-4" />
              </div>
              <div className="mt-4 space-y-4">
                {mockAnalytics.collaborationStats.map((stat) => (
                  <div key={stat.date} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.date}</p>
                      <p className="text-sm">Active Users: {stat.activeUsers}</p>
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

        <TabsContent value="real-time">
          <PerformanceMetrics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
