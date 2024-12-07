import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AgentCardProps {
  agent: {
    id: number;
    name: string;
    type: string;
    description: string;
    status: string;
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

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{agent.name}</h3>
          <p className="text-sm text-muted-foreground">{agent.type}</p>
        </div>
        <Badge className={getStatusColor(agent.status)}>{agent.status}</Badge>
      </div>
      <p className="mt-2 text-sm">{agent.description}</p>
    </Card>
  );
}
