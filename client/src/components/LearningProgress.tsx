import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Brain, BookOpen, Target, Zap, GraduationCap } from "lucide-react";
import type { LearningMetrics } from "@/lib/mockAgents";

interface LearningProgressProps {
  metrics: LearningMetrics;
}

export function LearningProgress({ metrics }: LearningProgressProps) {
  const getProgressColor = (value: number) => {
    if (value >= 90) return "text-green-500";
    if (value >= 75) return "text-blue-500";
    if (value >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="h-5 w-5" />
        <h3 className="font-medium">Learning Progress</h3>
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
                {metrics.completedLessons} / {metrics.totalLessons} Lessons
              </span>
            </div>
            <Progress 
              value={(metrics.completedLessons / metrics.totalLessons) * 100} 
              className="h-2" 
            />
          </div>

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4" />
                <span className="text-sm">Learning Rate</span>
              </div>
              <div className={`text-lg font-semibold ${getProgressColor(metrics.learningRate)}`}>
                {metrics.learningRate}%
              </div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4" />
                <span className="text-sm">Adaptability</span>
              </div>
              <div className={`text-lg font-semibold ${getProgressColor(metrics.adaptabilityScore)}`}>
                {metrics.adaptabilityScore}%
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
              {Object.entries(metrics.skillsProficiency).map(([skill, level]) => (
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
              {metrics.knowledgeAreas.map((area) => (
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
