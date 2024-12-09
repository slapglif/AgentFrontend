import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

import { Badge } from "@/components/ui/badge";
import { Brain, BookOpen, Target, Zap, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [metricsState, setMetricsState] = useState<MetricsState>(() => ({
    ...metrics,
    skillsProficiency: metrics.skillsProficiency || {},
    knowledgeAreas: metrics.knowledgeAreas || [],
    learningRate: metrics.learningRate || 0,
    adaptabilityScore: metrics.adaptabilityScore || 0,
    completedLessons: metrics.completedLessons || 0,
    totalLessons: metrics.totalLessons || 0,
    retentionRate: metrics.retentionRate || 0,
    isLoading: false,
    lastUpdated: new Date().toISOString(),
    error: null
  }));

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const updateMetrics = async () => {
      if (retryCount >= maxRetries) {
        if (mounted) {
          setMetricsState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Maximum retry attempts reached. Please refresh the page.'
          }));
        }
        return;
      }

      try {
        if (!mounted) return;
        setMetricsState(prev => ({ ...prev, isLoading: true, error: null }));

        // Simulate real-time updates
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (!mounted) return;

        // Update metrics with more stable values
        setMetricsState(prev => {
          const currentValues = { ...prev };
          
          // Update skills proficiency
          if (currentValues.skillsProficiency) {
            Object.keys(currentValues.skillsProficiency).forEach(key => {
              const currentValue = currentValues.skillsProficiency[key];
              const maxChange = 1; // Limit the change to 1% per update
              const change = (Math.random() - 0.5) * maxChange;
              currentValues.skillsProficiency[key] = Math.min(100, Math.max(0, currentValue + change));
            });
          }

          // Update other metrics with smaller variations
          return {
            ...currentValues,
            learningRate: Math.min(100, Math.max(0, currentValues.learningRate + (Math.random() - 0.5))),
            adaptabilityScore: Math.min(100, Math.max(0, currentValues.adaptabilityScore + (Math.random() - 0.5))),
            isLoading: false,
            lastUpdated: new Date().toISOString(),
            error: null
          };
        });

        // Reset retry count on successful update
        retryCount = 0;
      } catch (err) {
        if (!mounted) return;
        retryCount++;
        
        setMetricsState(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to update learning progress'
        }));

        // Retry with exponential backoff
        const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 5000);
        setTimeout(() => {
          if (mounted) updateMetrics();
        }, backoffTime);
      }
    };

    // Initial update
    updateMetrics();

    // Set up interval for subsequent updates
    const interval = setInterval(updateMetrics, 5000);
    setIntervalId(interval);

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
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
        <div className="flex flex-col items-center gap-4 p-6">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div className="text-center">
            <h3 className="font-semibold mb-1">Error Loading Learning Progress</h3>
            <p className="text-sm text-muted-foreground">{metricsState.error}</p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
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
    </Card>
  );
}
