import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
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
import { mockOverview } from "@/lib/mockOverview";

interface MetricPoint {
  timestamp: string;
  value: number;
}

interface PerformanceMetricsProps {
  agentId?: number;
}

export function PerformanceMetrics({ agentId }: PerformanceMetricsProps) {
  const [cpuData, setCpuData] = useState<MetricPoint[]>([]);
  const [memoryData, setMemoryData] = useState<MetricPoint[]>([]);
  const [responseTimeData, setResponseTimeData] = useState<MetricPoint[]>([]);

  // Simulate real-time data updates
  useEffect(() => {
    const updateMetrics = () => {
      const now = new Date();
      const timestamp = now.toISOString();

      // Add new data points
      setCpuData(prev => [...prev.slice(-20), {
        timestamp,
        value: Math.floor(Math.random() * 100)
      }]);

      setMemoryData(prev => [...prev.slice(-20), {
        timestamp,
        value: mockOverview.systemStats.memoryUsage.percentage
      }]);

      setResponseTimeData(prev => [...prev.slice(-20), {
        timestamp,
        value: Math.floor(Math.random() * 1000 + 200)
      }]);
    };

    // Initial update
    updateMetrics();

    // Set up interval for real-time updates
    const interval = setInterval(updateMetrics, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4">
        <h3 className="font-medium mb-4">CPU Usage</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cpuData}>
              <defs>
                <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
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
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                }}
                labelFormatter={formatTime}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="url(#cpuGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-medium mb-4">Memory Usage</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={memoryData}>
              <defs>
                <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
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
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                }}
                labelFormatter={formatTime}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="url(#memoryGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-medium mb-4">Response Time (ms)</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTime}
                className="text-xs"
              />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                }}
                labelFormatter={formatTime}
              />
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
