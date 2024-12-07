import { useState } from "react";
import { useLocation } from "wouter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Filter, Plus } from "lucide-react";
import { DEFAULT_AGENTS } from "@/lib/agents";

export default function Agents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();
  const [orchestratorStatus, setOrchestratorStatus] = useState<"connected" | "disconnected" | "connecting">("connecting");
  const agents = DEFAULT_AGENTS;

  // Connect to orchestrator
  useEffect(() => {
    const connectToOrchestrator = async () => {
      try {
        setOrchestratorStatus("connecting");
        const res = await fetch("/api/orchestrator/connect");
        if (res.ok) {
          setOrchestratorStatus("connected");
        } else {
          setOrchestratorStatus("disconnected");
        }
      } catch (error) {
        console.error("Failed to connect to orchestrator:", error);
        setOrchestratorStatus("disconnected");
      }
    };
    
    connectToOrchestrator();
    const interval = setInterval(connectToOrchestrator, 30000); // Reconnect every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">Agent Management</h2>
          <div className="flex items-center gap-2">
            <div 
              className={cn(
                "w-2 h-2 rounded-full",
                orchestratorStatus === "connected" ? "bg-green-500" : 
                orchestratorStatus === "connecting" ? "bg-yellow-500" :
                "bg-red-500"
              )} 
            />
            <span className="text-sm text-muted-foreground">
              Orchestrator: {orchestratorStatus}
            </span>
          </div>
        </div>
        <Button 
          className="gap-2"
          disabled={orchestratorStatus !== "connected"}
          onClick={() => {
            if (orchestratorStatus === "connected") {
              fetch("/api/orchestrator/agents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "create" })
              });
            }
          }}
        >
          <Plus className="h-4 w-4" />
          New Agent
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAgents.map((agent) => (
            <Card
              key={agent.id}
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setLocation(`/agents/${agent.id}`)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{agent.name}</h3>
                  <p className="text-sm text-muted-foreground">{agent.description}</p>
                </div>
                <Badge
                  variant={agent.status === "active" ? "default" : "secondary"}
                >
                  {agent.status}
                </Badge>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Level {agent.level}</span>
                  <Progress value={agent.experience} className="flex-1" />
                  <span className="text-sm font-medium">{agent.experience}%</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {agent.capabilities.slice(0, 3).map((capability, index) => (
                    <Badge key={index} variant="outline">
                      {capability}
                    </Badge>
                  ))}
                  {agent.capabilities.length > 3 && (
                    <Badge variant="outline">+{agent.capabilities.length - 3}</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="text-muted-foreground">Tasks:</div>
                    <div>{agent.performance_metrics.tasks_completed}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-muted-foreground">Success Rate:</div>
                    <div>{(agent.performance_metrics.success_rate * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
