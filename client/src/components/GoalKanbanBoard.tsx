import React from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "completed";
  tasks: Task[];
}

interface GoalKanbanBoardProps {
  goals: Goal[];
  onGoalsUpdate: (goals: Goal[]) => void;
  onDragEnd?: (result: DropResult) => void;
}

export function GoalKanbanBoard({ goals, onGoalsUpdate, onDragEnd }: GoalKanbanBoardProps) {
  const columns = [
    { id: "todo", title: "To Do" },
    { id: "in_progress", title: "In Progress" },
    { id: "completed", title: "Completed" }
  ];

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || 
        (result.destination.droppableId === result.source.droppableId && 
         result.destination.index === result.source.index)) {
      return;
    }

    const updatedGoals = Array.from(goals);
    const [reorderedGoal] = updatedGoals.splice(result.source.index, 1);
    reorderedGoal.status = result.destination.droppableId as "todo" | "in_progress" | "completed";
    updatedGoals.splice(result.destination.index, 0, reorderedGoal);
    
    onGoalsUpdate(updatedGoals);
    onDragEnd?.(result);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col bg-muted/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{column.title}</h3>
              <Badge variant="secondary">
                {goals.filter((goal) => goal.status === column.id).length}
              </Badge>
            </div>
            
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <ScrollArea className="h-[calc(100vh-15rem)]">
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-4 min-h-[200px] ${
                      snapshot.isDraggingOver ? "bg-muted/50" : ""
                    }`}
                  >
                    {goals
                      .filter((goal) => goal.status === column.id)
                      .map((goal, index) => (
                        <Draggable key={goal.id} draggableId={goal.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={snapshot.isDragging ? "opacity-50" : ""}
                            >
                              <Card className="p-4 hover:bg-muted/50 cursor-pointer transform transition-all duration-200 hover:scale-105">
                                <h4 className="font-medium mb-2 flex items-center justify-between">
                                  {goal.title}
                                  <Badge variant={goal.status === 'completed' ? "default" : "secondary"}>
                                    {goal.tasks.filter(t => t.completed).length}/{goal.tasks.length}
                                  </Badge>
                                </h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {goal.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {goal.tasks.map((task) => (
                                    <Badge
                                      key={task.id}
                                      variant={task.completed ? "default" : "outline"}
                                      className="cursor-pointer hover:bg-primary/20 transition-colors"
                                    >
                                      {task.title}
                                    </Badge>
                                  ))}
                                </div>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </ScrollArea>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
