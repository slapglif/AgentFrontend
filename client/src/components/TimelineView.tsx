import { ScrollArea } from "@/components/ui/scroll-area";
import { differenceInMinutes } from "date-fns";

// Timeline-specific interfaces

interface TaskBase {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

interface Task extends TaskBase {
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
  const hourWidth = 100;
  const rowHeight = 40;
  const headerHeight = 50;
  const hoursToShow = 24;

  const getPositionForTime = (time: Date) => {
    const minutes = time.getHours() * 60 + time.getMinutes();
    return (minutes / 60) * hourWidth;
  };

  const getWidthForDuration = (startTime: Date, endTime: Date) => {
    const durationMinutes = Math.max(differenceInMinutes(endTime, startTime), 30); // Minimum 30 minutes width
    return Math.max((durationMinutes / 60) * hourWidth, 50); // Minimum 50px width
  };

  return (
    <div className="border rounded-lg bg-background h-[calc(100vh-12rem)] flex flex-col">
      <ScrollArea className="flex-1">
        <div className="relative min-w-fit" style={{ width: `${hourWidth * hoursToShow + 200}px` }}>
          {/* Timeline header */}
          <div 
            className="sticky top-0 z-10 bg-background border-b flex"
            style={{ height: headerHeight }}
          >
            <div className="flex-none w-48 border-r px-4 py-2">
              Tasks
            </div>
            <div className="flex">
              {Array.from({ length: hoursToShow }, (_, i) => (
                <div
                  key={i}
                  className="flex-none border-r px-2 py-2 text-center"
                  style={{ width: hourWidth }}
                >
                  {i.toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>
          </div>

          {/* Goals and tasks */}
          <div className="relative">
            {goals.map((goal) => (
              <div key={goal.id} className="border-b">
                <div className="flex items-center h-12">
                  <div className="flex-none w-48 px-4 py-2">
                    <span className="font-medium">{goal.title}</span>
                  </div>
                  <div className="relative flex-1" style={{ height: rowHeight }}>
                    <div
                      className="absolute h-6 rounded-md"
                      style={{
                        left: getPositionForTime(goal.startTime),
                        width: getWidthForDuration(goal.startTime, goal.endTime),
                        top: '8px',
                        background: 'linear-gradient(180deg, var(--primary), var(--primary-50), transparent)',
                        backgroundSize: '200% 200%',
                        animation: 'gradientShift 3s ease infinite',
                        boxShadow: '0 0 8px var(--primary), 0 0 12px var(--primary)'
                      }}
                    >
                      <div 
                        className="absolute inset-0 bg-primary/20"
                        style={{
                          width: `${goal.progress}%`,
                          background: 'linear-gradient(90deg, transparent, var(--primary-50), transparent)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 3s linear infinite'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {goal.tasks.map((task) => (
                  <div key={task.id} className="flex items-center h-10">
                    <div className="flex-none w-48 px-4 py-2 pl-8">
                      <span className="text-sm text-muted-foreground">
                        {task.title}
                      </span>
                    </div>
                    <div className="relative flex-1" style={{ height: rowHeight }}>
                      {task.dependencies?.map((depId) => {
                        const dependentTask = goal.tasks.find(t => t.id === depId);
                        if (!dependentTask) return null;
                        
                        const startX = getPositionForTime(dependentTask.endTime);
                        const endX = getPositionForTime(task.startTime);
                        const width = endX - startX;
                        
                        return (
                          <svg
                            key={`${task.id}-${depId}`}
                            className="absolute top-0 left-0 w-full h-full pointer-events-none"
                            style={{ overflow: 'visible' }}
                          >
                            <path
                              d={`M ${startX} 10 C ${startX + width/2} 10, ${startX + width/2} 10, ${endX} 10`}
                              stroke="var(--primary)"
                              strokeWidth="1"
                              fill="none"
                              strokeDasharray="4"
                              className="animate-dash"
                            />
                            <circle
                              cx={endX}
                              cy="10"
                              r="3"
                              fill="var(--primary)"
                              className="animate-pulse"
                            />
                          </svg>
                        );
                      })}
                      <div
                        className={`absolute h-4 rounded-full group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                          task.completed ? 'bg-primary shadow-glow' : 'border-2 border-primary bg-background hover:border-primary/80 hover:bg-primary/5'
                        }`}
                        style={{
                          left: getPositionForTime(task.startTime),
                          width: getWidthForDuration(task.startTime, task.endTime),
                          top: '8px',
                          boxShadow: task.completed ? '0 0 8px var(--primary)' : 'none'
                        }}
                        title={`${task.title} (${task.completed ? 'Completed' : 'In Progress'})`}
                      >
                        <div 
                          className="absolute inset-0 bg-primary/20 rounded-full transition-all duration-300"
                          style={{
                            width: task.completed ? '100%' : '0%',
                            opacity: task.completed ? 0.5 : 0
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}