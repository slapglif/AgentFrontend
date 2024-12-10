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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Activity History</h1>
        <Badge variant="outline" className="text-sm">
          {mockHistory.length} Events
        </Badge>
      </div>

      <div className="h-[calc(100vh-200px)] overflow-y-auto">
        <div className="space-y-4">
          {mockHistory.map((entry) => (
            <Card key={entry.id} className="p-4 transition-all hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <div className="p-2 bg-muted rounded-full">
                    {getIconForType(entry.type)}
                  </div>
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{entry.title}</h3>
                    <Badge variant={getBadgeVariant(entry.status)}>
                      {entry.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {entry.description}
                  </p>
                  
                  {entry.metadata && (
                    <div className="flex flex-wrap gap-3 mt-2">
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
