import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Progress } from "@/components/ui/progress";
import { Trophy, Database, Atom, Brain, Leaf, Zap, type LucideIcon } from "lucide-react";

interface AgentCardProps {
  agent: {
    id: number;
    name: string;
    type: string;
    status: 'active' | 'idle' | 'learning';
    current_task?: {
      id: string;
      summary: string;
      progress: number;
      status: 'pending' | 'in_progress' | 'completed';
      priority: 'low' | 'medium' | 'high';
    };
    currentTasks?: number;
    successRate?: number;
    skillLevel?: number;
    specializations?: string[];
    achievements?: Array<{
      id: number;
      name: string;
      icon: string;
      description: string;
    }>;
  };
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
      case "leaf":
        return <Leaf className="h-4 w-4" />;
      case "zap":
        return <Zap className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <Link href={`/agents/${agent.id}`} className="block">
      <Card 
        className="p-4 hover-3d interactive-hover bg-gradient-to-br from-background to-muted/30 backdrop-blur-sm border-primary/10 overflow-hidden cursor-pointer transition-all duration-300 hover:translate-y-[-2px]"
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

        {agent.specializations && agent.specializations.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-1">
              {agent.specializations.map((spec, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {spec.replace(/_/g, ' ')}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {agent.current_task && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Current Research</span>
              <Badge variant={agent.current_task.priority === 'high' ? 'destructive' : 'secondary'}>
                {agent.current_task.priority}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{agent.current_task.summary}</p>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span>{agent.current_task.progress}%</span>
              </div>
              <Progress value={agent.current_task.progress || 0} className="h-1" />
            </div>
          </div>
        )}

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Level {agent.skillLevel || 1}</span>
            <span className="text-sm text-muted-foreground">
              {agent.successRate ? `${(agent.successRate * 100).toFixed(1)}% Success Rate` : 'New Agent'}
            </span>
          </div>
          <Progress 
            value={agent.successRate ? agent.successRate * 100 : 0} 
            className="animate-progress relative overflow-hidden"
            data-testid="success-rate-progress"
            style={{
              background: 'linear-gradient(90deg, var(--primary-50), var(--primary))',
              backgroundSize: '200% 100%',
            }}
          />
        </div>

        {agent.achievements && agent.achievements.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Research Achievements</h4>
            <div className="grid grid-cols-2 gap-2">
              {agent.achievements.slice(0, 2).map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                  {getAchievementIcon(achievement.icon)}
                  <div>
                    <div className="text-xs font-medium">{achievement.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{achievement.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span>Active Research Tasks</span>
            <span className="font-medium">{agent.currentTasks || 0}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}