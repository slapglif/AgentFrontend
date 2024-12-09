import { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { format, addDays, differenceInDays, isSameDay, isWithinInterval } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  assignedTo?: string;
  startDate?: Date;
  endDate?: Date;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "completed";
  startDate: Date;
  endDate: Date;
  progress: number;
  tasks: Task[];
}

interface TimelineViewProps {
  goals: Goal[];
  onTaskUpdate?: (taskData: {
    goalId: string;
    sourceDate: Date;
    destinationDate: Date;
  }) => void;
}

export function TimelineView({ goals, onTaskUpdate }: TimelineViewProps) {
  const [viewStartDate, setViewStartDate] = useState(new Date());
  const [draggingGoalId, setDraggingGoalId] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const daysToShow = 14; // Show 2 weeks by default

  useEffect(() => {
    const handleScroll = () => {
      if (timelineRef.current) {
        const headers = timelineRef.current.querySelector('.timeline-headers');
        if (headers) {
          headers.scrollLeft = timelineRef.current.scrollLeft;
        }
      }
    };

    timelineRef.current?.addEventListener('scroll', handleScroll);
    return () => timelineRef.current?.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDragEnd = (result: any) => {
    if (!result.destination || !onTaskUpdate) return;

    const { draggableId, destination, source } = result;
    const dropDate = new Date(destination.droppableId);
    const sourceDate = new Date(source.droppableId);
    
    onTaskUpdate({
      goalId: draggableId,
      sourceDate,
      destinationDate: dropDate,
    });

    setDraggingGoalId(null);
  };

  const handleDragStart = (initial: any) => {
    setDraggingGoalId(initial.draggableId);
  };

  const getDayColumn = (date: Date) => {
    const dayGoals = goals.filter(goal => {
      return isWithinInterval(date, { start: goal.startDate, end: goal.endDate });
    });

    return (
      <Droppable droppableId={format(date, 'yyyy-MM-dd')} key={format(date, 'yyyy-MM-dd')}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-none w-[200px] border-r border-border ${
              snapshot.isDraggingOver ? 'bg-muted/50' : ''
            }`}
          >
            <div className="min-h-[600px] p-2 space-y-2">
              {dayGoals.map((goal, index) => (
                <Draggable key={goal.id} draggableId={goal.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${snapshot.isDragging ? 'opacity-50' : ''}`}
                    >
                      <Card className="p-3 bg-background shadow-sm hover:shadow-md transition-shadow">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm">{goal.title}</h4>
                            <Badge variant={goal.status === 'completed' ? 'default' : 'secondary'}>
                              {goal.status}
                            </Badge>
                          </div>
                          <Progress value={goal.progress} className="h-1" />
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>
                              {differenceInDays(goal.endDate, goal.startDate)} days
                            </span>
                          </div>
                          {goal.tasks.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {goal.tasks.map(task => (
                                <Badge
                                  key={task.id}
                                  variant={task.completed ? "default" : "outline"}
                                  className="text-xs"
                                >
                                  {task.title}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    );
  };

  const moveTimelineBack = () => {
    setViewStartDate(date => addDays(date, -7));
  };

  const moveTimelineForward = () => {
    setViewStartDate(date => addDays(date, 7));
  };

  const days = Array.from({ length: daysToShow }, (_, i) => addDays(viewStartDate, i));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={moveTimelineBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={moveTimelineForward}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {format(viewStartDate, 'MMM dd')} - {format(addDays(viewStartDate, daysToShow - 1), 'MMM dd')}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="sticky top-0 z-10 bg-background border-b">
          <div className="flex timeline-headers">
            {days.map(date => (
              <div key={date.toISOString()} className="flex-none w-[200px] p-2 border-r border-border">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{format(date, 'EEE')}</span>
                  <span className="text-muted-foreground">{format(date, 'MMM dd')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <ScrollArea>
          <div ref={timelineRef} className="overflow-x-auto">
            <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
              <div className="flex">
                {days.map(date => getDayColumn(date))}
              </div>
            </DragDropContext>
          </div>
        </ScrollArea>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold mb-4">Upcoming Goals</h3>
        <div className="space-y-4">
          {goals
            .filter(goal => goal.status !== "completed" && goal.endDate > new Date())
            .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
            .slice(0, 5)
            .map(goal => (
              <Card key={goal.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{goal.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-muted-foreground">
                      {format(goal.startDate, 'MMM dd')} - {format(goal.endDate, 'MMM dd')}
                    </div>
                    <div className="mt-1">
                      <Progress value={goal.progress} className="h-1 w-20" />
                    </div>
                    <div className="mt-1 font-medium">
                      {differenceInDays(goal.endDate, goal.startDate)} days
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
