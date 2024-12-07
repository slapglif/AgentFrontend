import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AlertCircle, Clock, CheckCircle2, Circle } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "completed";
  dueDate: Date;
  progress: number;
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  assignedTo?: string;
}

export function GoalKanbanBoard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "in_progress", title: "In Progress" },
    { id: "completed", title: "Completed" }
  ];

  return (
    <ErrorBoundary>
      <div className="flex h-full gap-4">
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-4 h-full">
            {columns.map((column) => (
              <div key={column.id} className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{column.title}</h3>
                  <Badge variant="secondary">
                    {goals.filter((goal) => goal.status === column.id).length}
                  </Badge>
                </div>
                <ScrollArea className="flex-1">
                  <div className="space-y-4 p-1">
                    {goals
                      .filter((goal) => goal.status === column.id)
                      .map((goal) => (
                        <Card key={goal.id} className="p-4 cursor-pointer hover:bg-muted/50">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium">{goal.title}</h4>
                              {goal.status === "completed" ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>Due {goal.dueDate.toLocaleDateString()}</span>
                            </div>
                            <Progress value={goal.progress} className="h-2" />
                            <div className="flex flex-wrap gap-2">
                              {goal.tasks.map((task) => (
                                <Badge key={task.id} variant={task.completed ? "default" : "outline"}>
                                  {task.title}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                </ScrollArea>
              </div>
            ))}
          </div>
        </div>
        <div className="w-[350px] border-l p-4">
          <h3 className="font-semibold mb-4">Timeline</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="mb-4"
          />
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Upcoming Goals</h4>
            {goals
              .filter(
                (goal) =>
                  goal.status !== "completed" &&
                  goal.dueDate > new Date()
              )
              .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
              .slice(0, 5)
              .map((goal) => (
                <Card key={goal.id} className="p-2">
                  <div className="text-sm">{goal.title}</div>
                  <div className="text-xs text-muted-foreground">
                    Due {goal.dueDate.toLocaleDateString()}
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
