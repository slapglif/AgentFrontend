import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

export default function History() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Activity History</h1>
      <ScrollArea className="h-[calc(100vh-200px)]">
        {/* Timeline items */}
      </ScrollArea>
    </div>
  );
}
