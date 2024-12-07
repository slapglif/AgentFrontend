import { useQuery } from "@tanstack/react-query";
import { AgentTimeline } from "@/components/AgentTimeline";
import { ChatInterface } from "@/components/ChatInterface";
import { AgentCard } from "@/components/AgentCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();
  const { data: agents, isLoading } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const res = await fetch("/api/agents");
      if (!res.ok) {
        toast({
          title: "Error",
          description: "Failed to load agents",
          variant: "destructive",
        });
        throw new Error("Failed to load agents");
      }
      return res.json();
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 border-r">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Agents</h2>
            <Separator />
            {agents?.map((agent: any) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </ScrollArea>
      </aside>
      
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-6">
          <AgentTimeline />
        </div>
        <div className="h-1/3 border-t">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
}
