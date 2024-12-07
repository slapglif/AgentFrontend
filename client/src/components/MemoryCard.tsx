import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDistance } from "date-fns";
import { CodeBlock } from "./CodeBlock";

interface MemoryCardProps {
  memory: {
    id: number;
    type: string;
    content: any;
    timestamp: string;
    confidence: number;
    metadata: any;
  };
}

export function MemoryCard({ memory }: MemoryCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "research":
        return "bg-blue-500";
      case "analysis":
        return "bg-green-500";
      case "conclusion":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-background to-muted/50 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01] border-l-4 border-l-primary/50">
      <div className="flex items-start justify-between">
        <Badge className={getTypeColor(memory.type)}>{memory.type}</Badge>
        <span className="text-sm text-muted-foreground">
          {formatDistance(new Date(memory.timestamp), new Date(), {
            addSuffix: true,
          })}
        </span>
      </div>
      <div className="mt-2">
        <p className="text-sm">{memory.content.text}</p>
        {memory.content.code && (
          <div className="mt-2">
            <CodeBlock
              code={memory.content.code}
              language={memory.content.language || "text"}
            />
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Confidence</span>
          <Progress value={memory.confidence} className="flex-1" />
          <span className="text-sm">{memory.confidence}%</span>
        </div>
      </div>
    </Card>
  );
}
