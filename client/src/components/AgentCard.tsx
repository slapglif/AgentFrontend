import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
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
    <Link href={`/agents/${agent.id}`}>
      <Card 
        className="p-4 hover-3d interactive-hover bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm border-primary/10 overflow-hidden cursor-pointer"
        style={{
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{agent.name}</h3>
            <p className="text-sm text-muted-foreground">{agent.type}</p>
          </div>
          <Badge 
            className={`${getStatusColor(agent.status)} animate-glow relative ${
              agent.status === 'active' ? 'animate-pulse' : ''
            }`}
          >
            {agent.status}
            <span className="absolute inset-0 animate-ripple bg-current opacity-25" />
          </Badge>
        </div>
        <p className="mt-2 text-sm">{agent.description}</p>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Level {agent.level}</span>
            <span className="text-sm text-muted-foreground">{agent.experience}%</span>
          </div>
          <Progress 
            value={agent.experience} 
            className="animate-progress relative overflow-hidden"
            style={{
              background: 'linear-gradient(90deg, var(--primary-50), var(--primary))',
              backgroundSize: '200% 100%',
            }}
          />
        </div>

        <div className="mt-4">
          <div className="text-sm font-medium mb-2">Achievements</div>
          <div className="flex gap-2">
            {agent.achievements.map((achievement) => (
              <Badge
                key={achievement.id}
                variant="outline"
                className="flex items-center gap-1 animate-float animate-glow interactive-hover"
                title={achievement.description}
              >
                <span className="relative">
                  {getAchievementIcon(achievement.icon)}
                  {/* Particle effects container */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="animate-particle absolute"
                        style={{
                          '--x': `${Math.random() * 100 - 50}px`,
                          '--y': `${Math.random() * -100 - 50}px`,
                          animationDelay: `${i * 0.1}s`,
                          backgroundColor: 'var(--primary)',
                          width: '4px',
                          height: '4px',
                          borderRadius: '50%',
                        } as React.CSSProperties}
                      />
                    ))}
                  </div>
                </span>
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
          <Progress 
            value={agent.confidence} 
            className="mt-2 animate-progress relative overflow-hidden"
            style={{
              background: 'linear-gradient(90deg, var(--primary-50), var(--primary))',
              backgroundSize: '200% 100%',
            }}
          />
        </div>
      </Card>
    </Link>
  );
}
