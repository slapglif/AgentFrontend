import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MemoryCard } from "@/components/MemoryCard";
import { 
  Settings, 
  Activity, 
  Clock, 
  Database,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Agent } from "@/lib/agents";

export default function AgentDetails() {
  const { id } = useParams();
  const { data: agent } = useQuery<Agent>({
    queryKey: ["agent", id],
    queryFn: async () => {
      const res = await fetch(`/api/agents/${id}`);
      if (!res.ok) throw new Error("Failed to load agent");
      return res.json();
    },
  });

  const { data: memories } = useQuery({
    queryKey: ["memories", id],
    queryFn: async () => {
      const res = await fetch(`/api/memories?agentId=${id}`);
      if (!res.ok) throw new Error("Failed to load memories");
      return res.json();
    },
  });

  if (!agent) return null;

  return (
    <div className="h-full flex flex-col">
      <header className="border-b p-4 bg-muted/30 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{agent.name}</h1>
            <p className="text-sm text-muted-foreground">{agent.type}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6 overflow-hidden">
        <Tabs defaultValue="overview" className="h-full flex flex-col">
          <TabsList>
            <TabsTrigger value="overview" className="gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="configuration" className="gap-2">
              <Settings className="h-4 w-4" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="memory" className="gap-2">
              <Database className="h-4 w-4" />
              Memory
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="flex-1 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-medium mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Success Rate</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <Progress value={92} className="animate-progress" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Response Time</span>
                      <span className="text-sm font-medium">45ms</span>
                    </div>
                    <Progress value={85} className="animate-progress" />
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-medium mb-4">Capabilities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {agent.capabilities.map((capability) => (
                    <div key={capability} className="p-2 bg-muted rounded-lg text-sm">
                      {capability}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="configuration" className="flex-1 mt-4">
            <Card className="p-4">
              <h3 className="font-medium mb-4">Agent Configuration</h3>
              {/* Configuration form will be added here */}
            </Card>
          </TabsContent>

          <TabsContent value="history" className="flex-1 mt-4">
            <Card className="p-4">
              <h3 className="font-medium mb-4">Activity History</h3>
              {/* Activity timeline will be added here */}
            </Card>
          </TabsContent>

          <TabsContent value="memory" className="flex-1 mt-4">
            <ScrollArea className="h-full">
              <div className="space-y-4 p-4">
                {memories?.map((memory: any) => (
                  <MemoryCard key={memory.id} memory={memory} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
