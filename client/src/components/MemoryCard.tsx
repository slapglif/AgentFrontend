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
    <Card 
      className="p-4 bg-gradient-to-br from-background to-muted/50 shadow-lg transition-all duration-500 hover:shadow-xl hover:scale-[1.02] hover:translate-y-[-2px] border-l-4 border-l-primary/50 group"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      onMouseMove={(e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'rotateX(0deg) rotateY(0deg)';
      }}
    >
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
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Confidence</span>
          <Progress 
            value={memory.confidence} 
            className="flex-1 transition-all duration-500" 
            style={{
              background: 'linear-gradient(90deg, var(--primary-50), var(--primary))',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s linear infinite'
            }}
          />
          <span className="text-sm font-medium">{memory.confidence}%</span>
        </div>

        {memory.metadata && (
          <div className="space-y-2 pt-2 border-t border-primary/10">
            <div className="text-sm font-medium">Metadata</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(memory.metadata).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 p-1 rounded bg-primary/5">
                  <span className="text-muted-foreground">{key}:</span>
                  <span className="font-medium">{JSON.stringify(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
