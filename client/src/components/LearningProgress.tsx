import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Brain, BookOpen, Target, Zap, GraduationCap } from "lucide-react";
import type { LearningMetrics } from "@/lib/mockAgents";

interface LearningProgressProps {
  metrics: LearningMetrics;
  className?: string;
}

interface MetricsState extends LearningMetrics {
  isLoading: boolean;
  lastUpdated: string;
  error: string | null;
}

export function LearningProgress({ metrics, className }: LearningProgressProps) {
  const [metricsState, setMetricsState] = useState<MetricsState>({
    ...metrics,
    isLoading: false,
    lastUpdated: new Date().toISOString(),
    error: null
  });

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;

    const updateMetrics = async () => {
      try {
        setMetricsState(prev => ({ ...prev, isLoading: true, error: null }));

        // Simulate real-time updates with error handling
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (!mounted) return;

        setMetricsState(prev => ({
          ...prev,
          skillsProficiency: Object.fromEntries(
            Object.entries(prev.skillsProficiency).map(([key, value]) => [
              key,
              Math.min(100, Math.max(0, value + (Math.random() - 0.5) * 2))
            ])
          ),
          learningRate: Math.min(100, Math.max(0, prev.learningRate + (Math.random() - 0.5) * 2)),
          adaptabilityScore: Math.min(100, Math.max(0, prev.adaptabilityScore + (Math.random() - 0.5))),
          isLoading: false,
          lastUpdated: new Date().toISOString(),
          error: null
        }));
      } catch (err) {
        if (!mounted) return;
        setMetricsState(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to update learning progress'
        }));

        // Retry after error with exponential backoff
        setTimeout(() => {
          if (mounted) updateMetrics();
        }, 5000);
      }
    };

    // Initial update
    updateMetrics();

    // Set up interval for subsequent updates
    const interval = setInterval(updateMetrics, 5000);
    setIntervalId(interval);

    return () => {
      mounted = false;
      if (interval) clearInterval(interval);
    };
  }, []);
  const getProgressColor = (value: number) => {
    if (value >= 90) return "text-green-500";
    if (value >= 75) return "text-blue-500";
    if (value >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  if (metricsState.error) {
    return (
      <Card className={cn("p-4", className)}>
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{metricsState.error}</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          <h3 className="font-medium">Learning Progress</h3>
        </div>
        <div className="flex items-center gap-2">
          {metricsState.isLoading && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          <span className="text-xs text-muted-foreground">
            Updated: {new Date(metricsState.lastUpdated).toLocaleTimeString()}
          </span>
        </div>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-6">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm font-medium">Course Progress</span>
              </div>
              <span className="text-sm">
                {metricsState.completedLessons} / {metricsState.totalLessons} Lessons
              </span>
            </div>
            <div className="relative group">
              <Progress 
                value={(metricsState.completedLessons / metricsState.totalLessons) * 100} 
                className="h-2 transition-all duration-300 ease-in-out" 
              />
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-popover p-2 rounded-md shadow-md text-xs">
                {((metricsState.completedLessons / metricsState.totalLessons) * 100).toFixed(1)}% Complete
              </div>
            </div>
          </div>

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4" />
                <span className="text-sm">Learning Rate</span>
              </div>
              <div className={`text-lg font-semibold ${getProgressColor(metricsState.learningRate)}`}>
                {metricsState.learningRate.toFixed(1)}%
              </div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4" />
                <span className="text-sm">Adaptability</span>
              </div>
              <div className={`text-lg font-semibold ${getProgressColor(metricsState.adaptabilityScore)}`}>
                {metricsState.adaptabilityScore.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Skills Proficiency */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4" />
              <h4 className="text-sm font-medium">Skills Proficiency</h4>
            </div>
            <div className="space-y-3">
              {Object.entries(metricsState.skillsProficiency).map(([skill, level]) => (
                <div key={skill} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{skill}</span>
                    <span className={getProgressColor(level)}>{level}%</span>
                  </div>
                  <Progress value={level} className="h-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Knowledge Areas */}
          <div>
            <h4 className="text-sm font-medium mb-3">Knowledge Areas</h4>
            <div className="space-y-3">
              {metricsState.knowledgeAreas.map((area) => (
                <div key={area.name} className="p-3 bg-muted rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">{area.name}</span>
                    <Badge variant="outline" className={getProgressColor(area.progress)}>
                      {area.progress}%
                    </Badge>
                  </div>
                  <Progress value={area.progress} className="h-1 mb-2" />
                  <span className="text-xs text-muted-foreground">
                    Updated: {new Date(area.lastUpdated).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
}
