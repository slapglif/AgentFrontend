import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DotPattern } from "@/components/DotPattern";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { mockAnalytics } from "@/lib/mockAnalytics";

interface MetricPoint {
  timestamp: string;
  value: number;
  tooltip?: string;
}

export function PerformanceMetrics() {
  const [tokenUsage, setTokenUsage] = useState<MetricPoint[]>([]);
  const [researchProgress, setResearchProgress] = useState<MetricPoint[]>([]);
  const [knowledgeSynthesis, setKnowledgeSynthesis] = useState<MetricPoint[]>([]);
  const [collaborationEffectiveness, setCollaborationEffectiveness] = useState<MetricPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate real-time data updates
  useEffect(() => {
    const updateMetrics = () => {
      const now = new Date();
      const timestamp = now.toISOString();

      // Calculate cumulative token usage
      const baseTokens = mockAnalytics.systemMetrics.tokenMetrics.tokensUsed;
      const newTokens = Math.floor(Math.random() * 1000);
      
      // Calculate research progress
      const progress = mockAnalytics.systemMetrics.researchMetrics.goalsCompleted;
      const total = mockAnalytics.systemMetrics.researchMetrics.totalGoals;
      const progressPercentage = (progress / total) * 100;

      // Calculate knowledge synthesis rate
      const patterns = mockAnalytics.systemMetrics.researchMetrics.patternsDiscovered;
      const synthesisRate = (patterns / mockAnalytics.systemMetrics.researchMetrics.knowledgeNodes) * 100;

      // Calculate collaboration effectiveness
      const avgCollabScore = mockAnalytics.agentPerformance.reduce(
        (acc, agent) => acc + agent.collaborationScore, 
        0
      ) / mockAnalytics.agentPerformance.length;

      // Add new data points with tooltips
      setTokenUsage(prev => [...prev.slice(-20), {
        timestamp,
        value: baseTokens + newTokens,
        tooltip: `Tokens Used: ${baseTokens + newTokens}\nCost Efficiency: ${((baseTokens + newTokens) / 1000000 * 0.002).toFixed(2)}$`
      }]);

      setResearchProgress(prev => [...prev.slice(-20), {
        timestamp,
        value: progressPercentage,
        tooltip: `Goals: ${progress}/${total}\nCompletion Rate: ${progressPercentage.toFixed(1)}%`
      }]);

      setKnowledgeSynthesis(prev => [...prev.slice(-20), {
        timestamp,
        value: synthesisRate,
        tooltip: `Patterns: ${patterns}\nSynthesis Rate: ${synthesisRate.toFixed(1)}%`
      }]);

      setCollaborationEffectiveness(prev => [...prev.slice(-20), {
        timestamp,
        value: avgCollabScore,
        tooltip: `Avg Score: ${avgCollabScore.toFixed(1)}%\nActive Agents: ${mockAnalytics.systemMetrics.agentMetrics.activeResearchTasks}`
      }]);
    };

    // Initial loading state
    setIsLoading(true);

    // Initial update
    updateMetrics();
    setIsLoading(false);

    // Set up interval for real-time updates
    const interval = setInterval(updateMetrics, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  };

  const CustomTooltip = ({ active, payload, label, tooltipKey = "tooltip" }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-2 rounded-lg shadow-lg">
          <p className="text-sm font-medium">{formatTime(label)}</p>
          <p className="text-sm whitespace-pre-line">{payload[0].payload[tooltipKey]}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="loading-grid">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4" data-testid="loading-card">
            <div className="h-[200px] animate-pulse bg-muted rounded-lg" style={{ minHeight: "200px" }} />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative overflow-hidden">
      <DotPattern 
        width={24}
        height={24}
        className="opacity-60"
        svgClassName="transform -rotate-12 scale-125"
      />
      <Card className="p-4 relative">
        <h3 className="font-medium mb-4">Token Usage Trend</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
            <AreaChart data={tokenUsage} data-testid="token-usage-chart">
              <defs>
                <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTime}
                className="text-xs"
              />
              <YAxis className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="url(#tokenGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-medium mb-4">Research Progress</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
            <AreaChart data={researchProgress} data-testid="research-progress-chart">
              <defs>
                <linearGradient id="researchGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTime}
                className="text-xs"
              />
              <YAxis className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="url(#researchGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-medium mb-4">Knowledge Synthesis Rate</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
            <LineChart data={knowledgeSynthesis} data-testid="knowledge-synthesis-chart">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTime}
                className="text-xs"
              />
              <YAxis className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-medium mb-4">Collaboration Effectiveness</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={200} minHeight={200}>
            <LineChart data={collaborationEffectiveness} data-testid="collaboration-effectiveness-chart">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTime}
                className="text-xs"
              />
              <YAxis className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
