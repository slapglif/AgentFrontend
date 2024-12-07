import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockTasks } from "@/lib/mockTasks";

export default function Tasks() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Task Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* To Do Column */}
        <Card className="p-4">
          <h3 className="font-medium mb-4">To Do</h3>
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-2">
              {mockTasks.todo.map((task) => (
                <Card key={task.id} className="p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">{task.assignee}</p>
                    </div>
                    <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                      {task.priority}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* In Progress Column */}
        <Card className="p-4">
          <h3 className="font-medium mb-4">In Progress</h3>
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-2">
              {mockTasks.inProgress.map((task) => (
                <Card key={task.id} className="p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">{task.assignee}</p>
                    </div>
                    <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                      {task.priority}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Completed Column */}
        <Card className="p-4">
          <h3 className="font-medium mb-4">Completed</h3>
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-2">
              {mockTasks.completed.map((task) => (
                <Card key={task.id} className="p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">{task.assignee}</p>
                    </div>
                    <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
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
