import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { mockAnalytics } from "@/lib/mockAnalytics";
import { DEFAULT_AGENTS } from "@/lib/agents";

import { Brain, GitMerge, Target, Zap } from "lucide-react";

export function AgentBehaviorPatterns() {
  const getBehaviorScore = (agent: any) => {
    const scores = {
      researchDepth: Math.round((agent.researchContributions * agent.taskComplexity) / 200),
      learningEfficiency: Math.round((agent.xp / agent.researchContributions) * 10),
      collaborationImpact: Math.round((agent.collaborationScore * agent.knowledgeGenerationRate) / 100),
      problemSolvingScore: Math.round((agent.taskComplexity + agent.researchContributions) / 2),
      knowledgeSynthesis: agent.collaborationScore,
    };
    return scores;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Individual Agent Behavior Analysis */}
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
                        <Progress value={scores.researchDepth} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Learning Efficiency</span>
                          <span>{scores.learningEfficiency}%</span>
                        </div>
                        <Progress value={scores.learningEfficiency} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Collaboration Impact</span>
                          <span>{scores.collaborationImpact}%</span>
                        </div>
                        <Progress value={scores.collaborationImpact} className="h-1" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Knowledge Synthesis</span>
                          <span>{scores.knowledgeSynthesis}%</span>
                        </div>
                        <Progress value={scores.knowledgeSynthesis} className="h-1" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
        </Card>

        {/* Research Pattern Analysis */}
        <Card className="p-4">
          <h3 className="font-medium mb-4">Research Pattern Analysis</h3>
          <div className="space-y-6">
            {/* Knowledge Graph Growth */}
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

            {/* Research Milestone Completion */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4" />
                <h4 className="text-sm font-medium">Research Milestone Completion</h4>
              </div>
              <div className="space-y-2">
                {mockAnalytics.collaborationStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <span className="text-sm">{stat.date}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Progress:</span>
                      <Progress value={stat.researchProgress} className="w-24 h-2" />
                      <span className="text-sm font-medium">{stat.researchProgress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Specialization Development */}
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
