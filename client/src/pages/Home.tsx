import { useQuery } from "@tanstack/react-query";
import { AgentTimeline } from "@/components/AgentTimeline";
import { AgentCard } from "@/components/AgentCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { mockOverview } from "@/lib/mockOverview";

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
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="w-64 border-r flex-shrink-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Agents</h2>
            <Separator />
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
        </ScrollArea>
      </aside>
      
      <main className="flex-1 overflow-hidden">
        <div className="h-full p-6">
          <AgentTimeline />
        </div>
      </main>
    </div>
  );
}
