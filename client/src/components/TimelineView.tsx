import { ScrollArea } from "@/components/ui/scroll-area";
import { differenceInMinutes } from "date-fns";

interface Task {
  id: string;
  title: string;
  completed: boolean;
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
                      className="absolute h-6 rounded-md bg-primary/20"
                      style={{
                        left: getPositionForTime(goal.startTime),
                        width: getWidthForDuration(goal.startTime, goal.endTime),
                        top: '8px'
                      }}
                    />
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
                      <div
                        className={`absolute h-4 rounded-full ${
                          task.completed ? 'bg-primary' : 'border-2 border-primary bg-background'
                        }`}
                        style={{
                          left: getPositionForTime(task.startTime),
                          width: getWidthForDuration(task.startTime, task.endTime),
                          top: '8px'
                        }}
                      />
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