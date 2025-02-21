import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDistance } from "date-fns";
import { CodeBlock } from "./CodeBlock";

interface MemoryMetadata {
  detailedAnalysis?: Record<string, number>;
  relatedMemories?: Array<{
    id: number | string;
    type: string;
    relevanceScore: number;
  }>;
  interactionHistory?: Array<{
    id?: string | number;
    action: string;
    timestamp: string;
    context: string;
    doshaType?: string;
  }>;
  xpGained?: number;
  duration?: number;
}

interface MemoryContent {
  text: string;
  code: string | null;
  language?: string;
}

interface MemoryCardProps {
  memory: {
    id: number;
    type: string;
    content: MemoryContent;
    timestamp: string;
    confidence: number;
    metadata: MemoryMetadata;
  };
}

export function MemoryCard({ memory }: MemoryCardProps) {
  const [activeSection, setActiveSection] = React.useState<string | null>(null);
  const [transform, setTransform] = React.useState('');

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "research_analysis": return "bg-emerald-500";
      case "ayurvedic_analysis": return "bg-sage-500";
      case "dosha_assessment": return "bg-amber-500";
      case "herbal_research": return "bg-green-500";
      case "traditional_practice": return "bg-indigo-500";
      case "holistic_healing": return "bg-violet-500";
      default: return "bg-slate-500";
    }
  };

  const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / 20) * 0.5;
    const rotateY = ((centerX - x) / 20) * 0.5;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  }, []);

  const handleSectionClick = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <Card 
      className="p-3 bg-gradient-to-br from-background to-muted/50 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01] border-l-4 border-l-primary/50 group"
      style={{
        transform,
        transition: 'transform 0.3s ease-out',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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
          <Progress value={memory.confidence} className="flex-1" />
          <span className="text-sm font-medium">{memory.confidence}%</span>
        </div>

        {memory.metadata && (
          <div className="space-y-4 pt-2 border-t border-primary/10">
            <div 
              onClick={() => handleSectionClick('analysis')}
              className={`transition-all duration-300 ${
                activeSection === 'analysis' ? 'bg-primary/10' : ''
              } rounded-lg p-2 cursor-pointer hover:bg-primary/5`}
            >
              <div className="text-sm font-medium mb-2 flex items-center justify-between">
                <span>Detailed Analysis</span>
                <Badge variant="outline" className="transition-transform duration-300">
                  {activeSection === 'analysis' ? '▼' : '▶'}
                </Badge>
              </div>
              <div className={`grid grid-cols-2 gap-2 text-xs overflow-hidden transition-all duration-300 ${
                activeSection === 'analysis' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                {Object.entries(memory.metadata?.detailedAnalysis || {}).map(([key, value]) => (
                  <div 
                    key={key}
                    className="flex items-center gap-2 p-2 rounded bg-primary/5 hover:bg-primary/10 transition-colors duration-200"
                  >
                    <span className="text-muted-foreground capitalize">{key}:</span>
                    <span className="font-medium">{value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div 
              onClick={() => handleSectionClick('related')}
              className={`transition-all duration-300 ${
                activeSection === 'related' ? 'bg-primary/10' : ''
              } rounded-lg p-2 cursor-pointer hover:bg-primary/5 mt-2`}
            >
              <div className="text-sm font-medium mb-2 flex items-center justify-between">
                <span>Related Memories</span>
                <Badge variant="outline" className="transition-transform duration-300">
                  {activeSection === 'related' ? '▼' : '▶'}
                </Badge>
              </div>
              <div className={`space-y-2 overflow-hidden transition-all duration-300 ${
                activeSection === 'related' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                {memory.metadata?.relatedMemories?.map((related, idx) => (
                  <div 
                    key={`${memory.id}-${related.id}-${idx}`}
                    className="flex items-center justify-between p-2 rounded bg-primary/5 hover:bg-primary/10 transition-colors duration-200"
                  >
                    <span className="text-xs text-muted-foreground capitalize">{related.type}</span>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={related.relevanceScore * 100} 
                        className="w-20"
                      />
                      <span className="text-xs font-medium">{(related.relevanceScore * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div 
              onClick={() => handleSectionClick('history')}
              className={`transition-all duration-300 ${
                activeSection === 'history' ? 'bg-primary/10' : ''
              } rounded-lg p-2 cursor-pointer hover:bg-primary/5 mt-2`}
            >
              <div className="text-sm font-medium mb-2 flex items-center justify-between">
                <span>Interaction History</span>
                <Badge variant="outline" className="transition-transform duration-300">
                  {activeSection === 'history' ? '▼' : '▶'}
                </Badge>
              </div>
              <div className={`space-y-2 overflow-hidden transition-all duration-300 ${
                activeSection === 'history' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                {memory.metadata?.interactionHistory?.map((interaction, idx) => (
                  <div 
                    key={`${memory.id}-${interaction.id || idx}`}
                    className="flex items-center justify-between p-2 rounded bg-primary/5 hover:bg-primary/10 transition-colors duration-200"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-medium capitalize flex items-center gap-1">
                        <Badge variant="outline" className="h-4">
                          {interaction.action}
                        </Badge>
                        {interaction.doshaType && (
                          <Badge variant="secondary" className="h-4">
                            {interaction.doshaType}
                          </Badge>
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1">{interaction.context}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistance(new Date(interaction.timestamp), new Date(), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded bg-primary/5">
                <span className="text-muted-foreground">XP Gained:</span>
                <span className="font-medium">{memory.metadata.xpGained}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-primary/5">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{memory.metadata.duration}s</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}