import { useQuery } from "@tanstack/react-query";
import { AgentTimeline } from "@/components/AgentTimeline";
import { AgentCard } from "@/components/AgentCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { mockOverview } from "@/lib/mockOverview";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import "./styles.css";

export default function Home() {
  const { toast } = useToast();
  const { data: agents, isLoading } = useQuery({
    queryKey: ["agents"],
    queryFn: () => Promise.resolve(mockOverview.agents),
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4 p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading agents...</p>
        </div>
      </div>
    );
  }

  if (!agents || agents.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center p-6">
          <h2 className="text-lg font-semibold mb-2">No Agents Found</h2>
          <p className="text-sm text-muted-foreground">There are currently no agents available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden">
      <PanelGroup direction="horizontal" className="h-full">
        <Panel defaultSize={25} minSize={20} maxSize={40} className="bg-muted/30 backdrop-blur-sm border-primary/10">
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Active Agents</h2>
                <Badge variant="outline">{agents?.length || 0}</Badge>
              </div>
              <Separator className="my-4" />
              <div className="space-y-3">
                {agents?.map((agent) => (
                  <AgentCard 
                    key={agent.id} 
                    agent={{
                      id: agent.id,
                      name: agent.name,
                      type: agent.type,
                      status: agent.status,
                      current_task: agent.current_task,
                      currentTasks: agent.currentTasks,
                      successRate: agent.successRate,
                      skillLevel: agent.skillLevel
                    }} 
                  />
                ))}
              </div>
            </div>
          </ScrollArea>
        </Panel>
        
        <PanelResizeHandle className="bg-border hover:bg-primary transition-all duration-300" />
        
        <Panel defaultSize={75} className="bg-background">
          <div className="h-full px-6 py-4">
            <AgentTimeline />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
