import React, { useState, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Calendar, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Goal {
  id: number;
  title: string;
  description: string;
  status: "planning" | "in_progress" | "reviewing" | "completed";
  priority: "low" | "medium" | "high";
  deadline: string;
  assignedAgents: number[];
  progress: number;
}

const mockGoals: Goal[] = [
  {
    id: 1,
    title: "Research Data Analysis",
    description: "Analyze research data using ML algorithms",
    status: "in_progress",
    priority: "high",
    deadline: "2024-12-31",
    assignedAgents: [1, 2],
    progress: 45
  },
  {
    id: 2,
    title: "Documentation Generation",
    description: "Generate comprehensive documentation",
    status: "planning",
    priority: "medium",
    deadline: "2024-12-15",
    assignedAgents: [3],
    progress: 0
  },
  {
    id: 3,
    title: "Model Training",
    description: "Train and validate ML models",
    status: "reviewing",
    priority: "high",
    deadline: "2024-12-20",
    assignedAgents: [1, 4],
    progress: 85
  }
];

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [view, setView] = useState<"kanban" | "timeline">("kanban");
  
  // Add ChatDrawer to handle agent orchestration
  const ChatDrawer = React.lazy(() => import("@/components/ChatDrawer"));

  const goalsByStatus = {
    planning: goals.filter(goal => goal.status === "planning"),
    in_progress: goals.filter(goal => goal.status === "in_progress"),
    reviewing: goals.filter(goal => goal.status === "reviewing"),
    completed: goals.filter(goal => goal.status === "completed")
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 p-6 space-y-6 overflow-hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Goal Management</h1>
        </div>

        <Tabs defaultValue="kanban" className="w-full">
          <TabsList className="justify-end mb-4">
            <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban">
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(goalsByStatus).map(([status, statusGoals]) => (
                <Card key={status} className="p-4">
                  <h3 className="font-medium mb-4 capitalize">{status.replace("_", " ")}</h3>
                  <ScrollArea className="h-[calc(100vh-250px)]">
                    <div className="space-y-2">
                      {statusGoals.map((goal) => (
                        <Card key={goal.id} className="p-3">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{goal.title}</h4>
                                <p className="text-sm text-muted-foreground">{goal.description}</p>
                              </div>
                              <Badge variant={
                                goal.priority === 'high' ? 'destructive' : 
                                goal.priority === 'medium' ? 'default' : 
                                'secondary'
                              }>
                                {goal.priority}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>Due {new Date(goal.deadline).toLocaleDateString()}</span>
                            </div>
                            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: `${goal.progress}%` }}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="timeline">
            <Card className="p-4">
              <div className="flex items-center justify-center h-[400px]">
                <div className="text-center text-muted-foreground">
                  <BarChart2 className="h-12 w-12 mx-auto mb-4" />
                  <p>Timeline view will be implemented here</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Suspense fallback={<div className="p-4 border-l">Loading chat...</div>}>
        <ChatDrawer className="border-l w-[400px] h-screen" />
      </Suspense>
    </div>
  );
}
