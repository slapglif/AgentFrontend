import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Tasks() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Task Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Task columns */}
        <Card className="p-4">
          <h3 className="font-medium mb-4">To Do</h3>
          {/* Task items */}
        </Card>
      </div>
    </div>
  );
}
