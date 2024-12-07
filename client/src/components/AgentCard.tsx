import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Progress } from "@/components/ui/progress";
import { Trophy, Database, Atom, Brain } from "lucide-react";
import type { Agent } from "@/lib/agents";

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "idle":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getAchievementIcon = (icon: string) => {
    switch (icon) {
      case "trophy":
        return <Trophy className="h-4 w-4" />;
      case "database":
        return <Database className="h-4 w-4" />;
      case "atom":
        return <Atom className="h-4 w-4" />;
      case "brain":
        return <Brain className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{agent.name}</h3>
          <p className="text-sm text-muted-foreground">{agent.type}</p>
        </div>
        <Badge className={getStatusColor(agent.status)}>{agent.status}</Badge>
      </div>
      <p className="mt-2 text-sm">{agent.description}</p>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Level {agent.level}</span>
          <span className="text-sm text-muted-foreground">{agent.experience}%</span>
        </div>
        <Progress value={agent.experience} />
      </div>

      <div className="mt-4">
        <div className="text-sm font-medium mb-2">Achievements</div>
        <div className="flex gap-2">
          {agent.achievements.map((achievement) => (
            <Badge
              key={achievement.id}
              variant="outline"
              className="flex items-center gap-1"
              title={achievement.description}
            >
              {getAchievementIcon(achievement.icon)}
              {achievement.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Confidence</span>
          <span className="text-sm">{agent.confidence}%</span>
        </div>
        <Progress value={agent.confidence} className="mt-2" />
      </div>
    </Card>
  );
}
