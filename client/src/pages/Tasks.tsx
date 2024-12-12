import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockTasks } from "@/lib/mockTasks";

export default function Tasks() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Task Management</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-background/50 backdrop-blur">
            {mockTasks.todo.length + mockTasks.inProgress.length + mockTasks.completed.length} Total Tasks
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* To Do Column */}
        <Card className="p-4 backdrop-blur bg-card/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center gap-2">
              To Do
              <Badge variant="secondary" className="ml-2">
                {mockTasks.todo.length}
              </Badge>
            </h3>
          </div>
          <ScrollArea 
            className="h-[calc(100vh-250px)]"
            role="region"
            aria-label="Todo tasks list"
          >
            <div className="space-y-3">
              {mockTasks.todo.map((task, index) => (
                <Card 
                  key={task.id} 
                  className="p-4 hover:shadow-md transition-all duration-200 hover:translate-y-[-2px] cursor-pointer backdrop-blur bg-background/50"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    opacity: 0,
                    animation: 'fadeInSlide 0.5s ease forwards'
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-medium line-clamp-1">{task.title}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        {task.assignee}
                      </p>
                    </div>
                    <Badge 
                      variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                      className="capitalize shrink-0"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* In Progress Column */}
        <Card className="p-4 backdrop-blur bg-card/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center gap-2">
              In Progress
              <Badge variant="secondary" className="ml-2">
                {mockTasks.inProgress.length}
              </Badge>
            </h3>
          </div>
          <ScrollArea 
            className="h-[calc(100vh-250px)]"
            role="region"
            aria-label="In progress tasks list"
          >
            <div className="space-y-3">
              {mockTasks.inProgress.map((task, index) => (
                <Card 
                  key={task.id} 
                  className="p-4 hover:shadow-md transition-all duration-200 hover:translate-y-[-2px] cursor-pointer backdrop-blur bg-background/50"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    opacity: 0,
                    animation: 'fadeInSlide 0.5s ease forwards'
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-medium line-clamp-1">{task.title}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        {task.assignee}
                      </p>
                    </div>
                    <Badge 
                      variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                      className="capitalize shrink-0"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Completed Column */}
        <Card className="p-4 backdrop-blur bg-card/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center gap-2">
              Completed
              <Badge variant="secondary" className="ml-2">
                {mockTasks.completed.length}
              </Badge>
            </h3>
          </div>
          <ScrollArea 
            className="h-[calc(100vh-250px)]"
            role="region"
            aria-label="Completed tasks list"
          >
            <div className="space-y-3">
              {mockTasks.completed.map((task, index) => (
                <Card 
                  key={task.id} 
                  className="p-4 hover:shadow-md transition-all duration-200 hover:translate-y-[-2px] cursor-pointer backdrop-blur bg-background/50 opacity-80"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    opacity: 0,
                    animation: 'fadeInSlide 0.5s ease forwards'
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-medium line-clamp-1">{task.title}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        {task.assignee}
                      </p>
                    </div>
                    <Badge 
                      variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                      className="capitalize shrink-0"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
