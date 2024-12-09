import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AlertCircle, Clock, CheckCircle2, Circle, Plus, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  assignedTo?: string;
  dueDate?: Date;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "completed";
  dueDate: Date;
  progress: number;
  tasks: Task[];
}

interface GoalKanbanBoardProps {
  goals: Goal[];
  onGoalsUpdate: (goals: Goal[]) => void;
  onDragEnd: (result: any) => void;
}

export function GoalKanbanBoard({ goals, onGoalsUpdate, onDragEnd }: GoalKanbanBoardProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "in_progress", title: "In Progress" },
    { id: "completed", title: "Completed" }
  ];

  const handleTaskDragEnd = (result: any) => {
    if (!result.destination) return;

    const updatedGoals = [...goals];
    const sourceGoal = updatedGoals.find(g => g.id === result.source.droppableId);
    const destGoal = updatedGoals.find(g => g.id === result.destination.droppableId);

    if (sourceGoal && destGoal) {
      const [removed] = sourceGoal.tasks.splice(result.source.index, 1);
      destGoal.tasks.splice(result.destination.index, 0, removed);
      
      // Update progress for both goals
      const updateGoalProgress = (goal: Goal) => {
        const completedTasks = goal.tasks.filter(t => t.completed).length;
        goal.progress = goal.tasks.length > 0 
          ? Math.round((completedTasks / goal.tasks.length) * 100)
          : 0;
      };

      updateGoalProgress(sourceGoal);
      updateGoalProgress(destGoal);
      
      onGoalsUpdate(updatedGoals);
    }
  };

  const addTask = () => {
    if (!selectedGoal || !newTask.title) return;

    const updatedGoals = goals.map(goal => {
      if (goal.id === selectedGoal.id) {
        const newTasks = [
          ...goal.tasks,
          {
            id: `${goal.id}-${goal.tasks.length + 1}`,
            title: newTask.title,
            description: newTask.description,
            completed: false,
            dueDate: selectedDate
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

  return (
    <ErrorBoundary>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex h-full gap-4">
          <div className="flex-1">
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
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                          <Clock className="h-4 w-4" />
                                          <span>Due {format(goal.dueDate, 'MMM dd, yyyy')}</span>
                                        </div>
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
                      Due {format(goal.dueDate, 'MMM dd, yyyy')}
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </DragDropContext>

      <Dialog open={!!selectedGoal} onOpenChange={(open) => !open && setSelectedGoal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedGoal?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{selectedGoal?.description}</p>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span className="text-sm">
                Due {selectedGoal?.dueDate.toLocaleDateString()}
              </span>
            </div>
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
