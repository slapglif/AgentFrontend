import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronRight, ChevronLeft } from "lucide-react";
import { ChatInterface } from "@/components/ChatInterface";
import { cn } from "@/lib/utils";

interface ChatDrawerProps {
  className?: string;
}

export function ChatDrawer({ className }: ChatDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={cn(
        "fixed right-0 bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ease-in-out border-l h-screen",
        isExpanded ? "w-[400px]" : "w-12",
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-background border shadow-md"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      {!isExpanded && (
        <div className="h-full flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(true)}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      )}

      {isExpanded && (
        <div className="p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Agent Orchestration</h2>
          </div>
          <Card className="h-[calc(100vh-8rem)]">
            <ChatInterface />
          </Card>
        </div>
      )}
    </div>
  );
}
