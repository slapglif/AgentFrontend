import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CheckCircle2, Circle, Plus } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  assignedTo?: string;
  startTime: Date;
  endTime: Date;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "completed";
  startTime: Date;
  endTime: Date;
  progress: number;
  tasks: Task[];
}

interface GoalKanbanBoardProps {
  goals: Goal[];
  onGoalsUpdate: (goals: Goal[]) => void;
  onDragEnd: (result: any) => void;
}

export function GoalKanbanBoard({ goals, onGoalsUpdate, onDragEnd }: GoalKanbanBoardProps) {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "in_progress", title: "In Progress" },
    { id: "completed", title: "Completed" }
  ];

  const toggleTaskCompletion = (goalId: string, taskId: string) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updatedTasks = goal.tasks.map(task => {
          if (task.id === taskId) {
            return { ...task, completed: !task.completed };
          }
          return task;
        });
        const completedTasks = updatedTasks.filter(t => t.completed).length;
        const progress = Math.round((completedTasks / updatedTasks.length) * 100);
        return { ...goal, tasks: updatedTasks, progress };
      }
      return goal;
    });
    onGoalsUpdate(updatedGoals);
  };

  const addTask = () => {
    if (!selectedGoal || !newTask.title) return;

    const now = new Date();
    const updatedGoals = goals.map(goal => {
      if (goal.id === selectedGoal.id) {
        const newTasks = [
          ...goal.tasks,
          {
            id: `${goal.id}-${goal.tasks.length + 1}`,
            title: newTask.title,
            description: newTask.description,
            completed: false,
            startTime: now,
            endTime: new Date(now.getTime() + 60 * 60 * 1000) // 1 hour later by default
          }
        ];
        return {
          ...goal,
          tasks: newTasks,
          progress: Math.round((newTasks.filter(t => t.completed).length / newTasks.length) * 100)
        };
      }
      return goal;
    });

    onGoalsUpdate(updatedGoals);
    setNewTask({ title: "", description: "" });
    setIsAddingTask(false);
  };

  return (
    <ErrorBoundary>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-4 h-full">
          {columns.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-col h-full"
                >
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
                        .map((goal, index) => (
                          <Draggable
                            key={goal.id}
                            draggableId={goal.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Card 
                                  className="p-4 cursor-pointer hover:bg-muted/50"
                                  onClick={() => setSelectedGoal(goal)}
                                >
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
                                    <Progress value={goal.progress} className="h-2" />
                                    <div className="flex flex-wrap gap-2">
                                      {goal.tasks.map((task) => (
                                        <Badge
                                          key={task.id}
                                          variant={task.completed ? "default" : "outline"}
                                          className="cursor-pointer"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleTaskCompletion(goal.id, task.id);
                                          }}
                                        >
                                          {task.title}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <Dialog open={!!selectedGoal} onOpenChange={(open) => !open && setSelectedGoal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedGoal?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{selectedGoal?.description}</p>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Tasks</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingTask(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Task
                </Button>
              </div>
              <div className="space-y-2">
                {selectedGoal?.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(selectedGoal.id, task.id)}
                      className="h-4 w-4"
                    />
                    <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Enter task description"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                Cancel
              </Button>
              <Button onClick={addTask}>Add Task</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  );
}