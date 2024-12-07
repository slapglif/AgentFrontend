import { BarChart2, TrendingUp, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Analytics() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Agent Performance</h3>
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="mt-4">
            <Progress value={85} className="mb-2" />
            <span className="text-sm text-muted-foreground">85% efficiency</span>
          </div>
        </Card>
        {/* Add more analytics cards */}
      </div>
    </div>
  );
}
