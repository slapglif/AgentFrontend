import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { mockAnalytics } from "@/lib/mockAnalytics";
import { Brain, Target, Zap } from "lucide-react";

export function AgentBehaviorPatterns() {
  const getBehaviorScore = (agent: any) => {
    const safeNumber = (value: number) => {
      if (isNaN(value) || value === null || value === undefined) return 0;
      return Math.min(100, Math.max(0, Math.round(value)));
    };
    
    const scores = {
      researchDepth: safeNumber((agent?.researchContributions ?? 0) * (agent?.taskComplexity ?? 0) / 200),
      learningEfficiency: safeNumber((agent?.xp ?? 0) / Math.max(1, agent?.researchContributions ?? 1) * 10),
      collaborationImpact: safeNumber(agent?.collaborationScore ?? 0),
      problemSolvingScore: safeNumber(((agent?.taskComplexity ?? 0) + (agent?.researchContributions ?? 0)) / 2),
      knowledgeSynthesis: safeNumber(agent?.collaborationScore ?? 0),
    };
    return scores;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="font-medium mb-4">Agent Behavior Analysis</h3>
          <div className="space-y-6">
            {mockAnalytics.agentPerformance.map((agent) => {
              const scores = getBehaviorScore(agent);
              return (
                <div key={agent.agent} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{agent.agent}</h4>
                      <p className="text-sm text-muted-foreground">Level {agent.level}</p>
                    </div>
                    <Badge variant="outline">XP: {agent.xp}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Research Depth</span>
                        <span>{scores.researchDepth}%</span>
                      </div>
                      <Progress 
                        value={scores.researchDepth} 
                        max={100} 
                        className="h-1"
                        data-testid="research-depth-progress"
                        aria-label="Research Depth Progress"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Learning Efficiency</span>
                        <span>{scores.learningEfficiency}%</span>
                      </div>
                      <Progress 
                        value={scores.learningEfficiency} 
                        max={100} 
                        className="h-1"
                        data-testid="learning-efficiency-progress"
                        aria-label="Learning Efficiency Progress"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Collaboration Impact</span>
                        <span>{scores.collaborationImpact}%</span>
                      </div>
                      <Progress 
                        value={scores.collaborationImpact} 
                        max={100} 
                        className="h-1"
                        data-testid="collaboration-impact-progress"
                        aria-label="Collaboration Impact Progress"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Knowledge Synthesis</span>
                        <span>{scores.knowledgeSynthesis}%</span>
                      </div>
                      <Progress 
                        value={scores.knowledgeSynthesis} 
                        max={100} 
                        className="h-1"
                        data-testid="knowledge-synthesis-progress"
                        aria-label="Knowledge Synthesis Progress"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium mb-4">Research Pattern Analysis</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4" />
                <h4 className="text-sm font-medium">Knowledge Graph Growth</h4>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {mockAnalytics.realtimeMetrics.knowledgeSynthesis.slice(-7).map((value, index) => (
                  <div
                    key={index}
                    className="h-16 bg-primary/10 rounded-sm relative overflow-hidden"
                  >
                    <div
                      data-testid="knowledge-graph"
                      className="absolute bottom-0 w-full bg-primary transition-all duration-500"
                      style={{ height: `${value}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>7 days ago</span>
                <span>Today</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4" />
                <h4 className="text-sm font-medium">Research Milestone Completion</h4>
              </div>
              <div className="space-y-2">
                {mockAnalytics.collaborationStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <div>
                      <span className="text-sm">{stat.date}</span>
                      <div className="text-xs text-muted-foreground mt-1" data-testid="active-tasks">
                        Active Tasks: {stat.activeResearchTasks}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Progress:</span>
                      <Progress 
                        value={stat.researchProgress} 
                        max={100} 
                        className="w-24 h-2"
                        data-testid="research-progress"
                        aria-label={`Research Progress for ${stat.date}`}
                      />
                      <span className="text-sm font-medium">{stat.researchProgress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4" />
                <h4 className="text-sm font-medium">Agent Specialization</h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {mockAnalytics.agentPerformance.map((agent) => (
                  <div key={agent.agent} className="p-2 bg-muted rounded-lg">
                    <div className="text-sm font-medium">{agent.agent}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Focus: {agent.taskComplexity > 80 ? 'Research' : agent.collaborationScore > 80 ? 'Collaboration' : 'Balanced'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
