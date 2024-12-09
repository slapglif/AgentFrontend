import { useState, useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { differenceInMinutes } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronRight as ChevronRightIcon } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  startTime: Date;
  endTime: Date;
  dependencies?: string[];
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

interface TimelineViewProps {
  goals: Goal[];
}

export function TimelineView({ goals }: TimelineViewProps) {
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(new Set(goals.map(g => g.id)));
  const timelineRef = useRef<HTMLDivElement>(null);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  
  const hourWidth = 100; // Width for each hour in pixels
  const rowHeight = 40; // Height for each row
  const headerHeight = 50; // Height for the timeline header
  const hoursToShow = 24; // Show full 24-hour period

  const toggleGoal = (goalId: string) => {
    setExpandedGoals(prev => {
      const next = new Set(prev);
      if (next.has(goalId)) {
        next.delete(goalId);
      } else {
        next.add(goalId);
      }
      return next;
    });
  };

  const getPositionForTime = (time: Date) => {
    const minutes = time.getHours() * 60 + time.getMinutes();
    return (minutes / 60) * hourWidth;
  };

  const getWidthForDuration = (startTime: Date, endTime: Date) => {
    const durationMinutes = differenceInMinutes(endTime, startTime);
    return (durationMinutes / 60) * hourWidth;
  };

  // Calculate dependencies lines
  const getDependencyPath = (
    sourceTask: Task,
    targetTask: Task,
    sourceY: number,
    targetY: number
  ) => {
    const startX = getPositionForTime(sourceTask.endTime);
    const endX = getPositionForTime(targetTask.startTime);
    const midX = (startX + endX) / 2;
    
    return `M ${startX} ${sourceY} 
            C ${midX} ${sourceY} ${midX} ${targetY} ${endX} ${targetY}`;
  };

  // Update current hour periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border rounded-lg bg-background h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (timelineRef.current) {
                timelineRef.current.scrollLeft -= 4 * hourWidth;
              }
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (timelineRef.current) {
                timelineRef.current.scrollLeft += 4 * hourWidth;
              }
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="relative min-w-fit" ref={timelineRef}>
          {/* Timeline header */}
          <div 
            className="sticky top-0 z-10 bg-background border-b flex"
            style={{ height: headerHeight }}
          >
            <div className="flex-none w-48 border-r px-4 py-2">
              Tasks
            </div>
            <div className="flex" style={{ width: `${hourWidth * hoursToShow}px` }}>
              {Array.from({ length: hoursToShow }, (_, i) => (
                <div
                  key={i}
                  className={`flex-none border-r px-2 py-2 text-center ${
                    i === currentHour ? 'bg-primary/10' : ''
                  }`}
                  style={{ width: hourWidth }}
                >
                  {i.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>
          </div>

          {/* Goals and tasks */}
          <div>
            {goals.map((goal) => (
              <div key={goal.id} className="border-b">
                {/* Goal row */}
                <div 
                  className="flex items-center h-12 hover:bg-muted/50 cursor-pointer"
                  onClick={() => toggleGoal(goal.id)}
                >
                  <div className="flex-none w-48 px-4 py-2 flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="p-0 h-6 w-6">
                      {expandedGoals.has(goal.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRightIcon className="h-4 w-4" />
                      )}
                    </Button>
                    <span className="font-medium truncate">{goal.title}</span>
                  </div>
                  <div className="relative flex-1" style={{ height: rowHeight }}>
                    <div
                      className="absolute h-6 rounded-md bg-primary/20"
                      style={{
                        left: getPositionForTime(goal.startTime),
                        width: getWidthForDuration(goal.startTime, goal.endTime),
                        top: '8px',
                      }}
                    >
                      <Progress value={goal.progress} className="h-full rounded-md" />
                    </div>
                  </div>
                </div>

                {/* Task rows */}
                {expandedGoals.has(goal.id) && (
                  <div className="relative">
                    {/* Dependency lines */}
                    <svg
                      className="absolute top-0 left-48 w-full h-full pointer-events-none"
                      style={{ overflow: 'visible' }}
                    >
                      {goal.tasks.map((task) => {
                        if (task.dependencies) {
                          return task.dependencies.map(depId => {
                            const sourceTask = goal.tasks.find(t => t.id === depId);
                            if (sourceTask) {
                              const sourceY = rowHeight / 2;
                              const targetY = (rowHeight / 2) + rowHeight;
                              return (
                                <path
                                  key={`${depId}-${task.id}`}
                                  d={getDependencyPath(sourceTask, task, sourceY, targetY)}
                                  className="stroke-primary stroke-[2px] fill-none"
                                  strokeDasharray="4 4"
                                />
                              );
                            }
                            return null;
                          });
                        }
                        return null;
                      })}
                    </svg>

                    {/* Tasks */}
                    {goal.tasks.map((task) => (
                      <div key={task.id} className="flex items-center h-10 hover:bg-muted/50">
                        <div className="flex-none w-48 px-4 py-2 pl-10">
                          <span className="text-sm text-muted-foreground truncate">
                            {task.title}
                          </span>
                        </div>
                        <div className="relative flex-1" style={{ height: rowHeight }}>
                          <div
                            className={`absolute h-4 rounded-full ${
                              task.completed ? 'bg-primary' : 'border-2 border-primary bg-background'
                            }`}
                            style={{
                              left: getPositionForTime(task.startTime),
                              width: getWidthForDuration(task.startTime, task.endTime),
                              top: '12px',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
