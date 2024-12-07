import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { MemoryCard } from "@/components/MemoryCard";
import { 
  Settings, 
  Activity, 
  Clock, 
  Database,
  ChevronLeft,
  Users,
  BarChart2,
  ListTodo,
  Loader2,
  AlertCircle
} from "lucide-react";
import { DEFAULT_AGENTS } from "@/lib/agents";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Agent } from "@/lib/agents";

export default function AgentDetails() {
  const { toast } = useToast();
  const { id } = useParams();
  const { data: agent, isLoading, isError, error } = useQuery<Agent>({
    queryKey: ["agent", id],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/agents/${id}`);
        if (res.status === 404) {
          // If agent not found, try to get from mock data
          const mockAgent = DEFAULT_AGENTS.find(a => a.id === Number(id));
          if (mockAgent) return mockAgent;
          throw new Error("Agent not found");
        }
        if (!res.ok) throw new Error("Failed to load agent");
        return res.json();
      } catch (err) {
        // If API fails, try to get from mock data
        const mockAgent = DEFAULT_AGENTS.find(a => a.id === Number(id));
        if (mockAgent) return mockAgent;
        throw err;
      }
    },
  });

  const { data: memories, isLoading: isLoadingMemories } = useQuery({
    queryKey: ["memories", id],
    queryFn: async () => {
      const res = await fetch(`/api/memories?agentId=${id}`);
      if (!res.ok) return []; // Return empty array if API fails
      return res.json();
    },
    enabled: !!agent, // Only fetch memories if we have an agent
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading agent details...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="max-w-md p-4 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-lg font-semibold mb-2">Error Loading Agent</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {error instanceof Error ? error.message : "Failed to load agent details"}
          </p>
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="max-w-md p-4 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-lg font-semibold mb-2">Agent Not Found</h2>
          <p className="text-sm text-muted-foreground mb-4">
            The requested agent could not be found.
          </p>
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

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
            <TabsTrigger value="collaboration" className="gap-2">
              <Users className="h-4 w-4" />
              Collaboration
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
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="font-medium mb-4">Agent Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm mb-2 block">Decision Threshold</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={agent.configuration.decision_threshold}
                        className="flex-1"
                        onChange={(e) => {
                          // Update agent configuration
                          toast({
                            title: "Configuration Updated",
                            description: `Decision threshold set to ${e.target.value}`,
                          });
                        }}
                      />
                      <span className="text-sm font-mono w-16">
                        {agent.configuration.decision_threshold}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm mb-2 block">Response Time Limit (ms)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1000"
                        max="10000"
                        step="100"
                        value={agent.configuration.response_time_limit}
                        className="flex-1"
                        onChange={(e) => {
                          // Update agent configuration
                          toast({
                            title: "Configuration Updated",
                            description: `Response time limit set to ${e.target.value}ms`,
                          });
                        }}
                      />
                      <span className="text-sm font-mono w-16">
                        {agent.configuration.response_time_limit}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-medium mb-4">Capabilities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {agent.capabilities.map((capability) => (
                    <div
                      key={capability}
                      className="flex items-center justify-between p-2 bg-muted rounded-lg"
                    >
                      <span className="text-sm">{capability}</span>
                      <Switch
                        checked={true}
                        onCheckedChange={(checked) => {
                          toast({
                            title: checked ? "Capability Enabled" : "Capability Disabled",
                            description: `${capability} has been ${checked ? "enabled" : "disabled"}`,
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-medium mb-4">Memory Allocation</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{
                            width: `${(agent.memory_allocation.used / agent.memory_allocation.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-mono">
                      {agent.memory_allocation.used}/{agent.memory_allocation.total} MB
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Reserved</p>
                      <p className="text-lg font-semibold">{agent.memory_allocation.reserved} MB</p>
                    </div>
                    <div className="p-2 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Available</p>
                      <p className="text-lg font-semibold">
                        {agent.memory_allocation.total - agent.memory_allocation.used} MB
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
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

          <TabsContent value="collaboration" className="flex-1 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-medium mb-4">Collaboration Metrics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Collaboration Success Rate</span>
                      <span className="text-sm font-medium">88%</span>
                    </div>
                    <Progress value={88} className="animate-progress" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Team Contribution</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <Progress value={92} className="animate-progress" />
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-medium mb-4">Active Collaborations</h3>
                <div className="space-y-2">
                  {[
                    { name: "Research Analysis", progress: 75 },
                    { name: "Data Synthesis", progress: 45 },
                    { name: "Documentation Review", progress: 90 }
                  ].map((collab) => (
                    <div key={collab.name} className="p-2 bg-muted rounded-lg">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{collab.name}</span>
                        <span className="text-sm font-medium">{collab.progress}%</span>
                      </div>
                      <Progress value={collab.progress} className="animate-progress" />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-medium mb-4">Task History</h3>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {[
                      { task: "Data Analysis", status: "completed", date: "2024-12-07" },
                      { task: "Research Review", status: "in_progress", date: "2024-12-07" },
                      { task: "Documentation", status: "pending", date: "2024-12-06" }
                    ].map((task) => (
                      <div key={task.task} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <ListTodo className="h-4 w-4" />
                          <span className="text-sm">{task.task}</span>
                        </div>
                        <Badge>{task.status}</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>

              <Card className="p-4">
                <h3 className="font-medium mb-4">Performance Chart</h3>
                <div className="h-[200px] flex items-center justify-center border rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    <BarChart2 className="h-8 w-8 mb-2 mx-auto" />
                    Performance metrics visualization will be implemented here
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
