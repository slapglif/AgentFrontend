import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Code, MessageSquare, Database, FileText, Clock } from "lucide-react";
import { mockHistory, type HistoryEntry } from "@/lib/mockHistory";
import { format } from "date-fns";

const getIconForType = (type: HistoryEntry['type']) => {
  switch (type) {
    case 'task':
      return <Code className="h-4 w-4" />;
    case 'communication':
      return <MessageSquare className="h-4 w-4" />;
    case 'system':
      return <Activity className="h-4 w-4" />;
    case 'analysis':
      return <FileText className="h-4 w-4" />;
    case 'memory':
      return <Database className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const getBadgeVariant = (status: HistoryEntry['status']) => {
  switch (status) {
    case 'completed':
      return 'default';
    case 'failed':
      return 'destructive';
    case 'pending':
      return 'secondary';
    default:
      return 'outline';
  }
};

export default function History() {
  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Activity History</h1>
        <Badge variant="outline" className="text-sm w-fit">
          {mockHistory.length} Events
        </Badge>
      </div>

      <div 
        className="h-[calc(100vh-180px)] md:h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-secondary"
        role="region"
        aria-label="Activity History"
      >
        <div className="space-y-4">
          {mockHistory.map((entry) => (
            <Card 
              key={entry.id} 
              className="p-3 md:p-4 transition-all hover:shadow-md hover:-translate-y-0.5 animate-staggered-fade-in"
              style={{ 
                animationDelay: `${parseInt(entry.id) * 50}ms`,
                transform: 'translate3d(0, 0, 0)'
              }}
            >
              <div className="flex flex-col sm:flex-row items-start gap-3 md:gap-4">
                <div className="shrink-0">
                  <div className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors">
                    {getIconForType(entry.type)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="font-medium truncate">{entry.title}</h3>
                    <Badge 
                      variant={getBadgeVariant(entry.status)}
                      className="w-fit transition-colors"
                    >
                      {entry.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-none">
                    {entry.description}
                  </p>
                  
                  {entry.metadata && (
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                      {entry.metadata.duration && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{entry.metadata.duration}s</span>
                        </div>
                      )}
                      {entry.metadata.resourceUsage && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Activity className="h-3 w-3" />
                          <span>{entry.metadata.resourceUsage}% resources</span>
                        </div>
                      )}
                      {entry.metadata.relatedAgents && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MessageSquare className="h-3 w-3" />
                          <span>{entry.metadata.relatedAgents.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {format(new Date(entry.timestamp), 'MMM dd, HH:mm')}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
