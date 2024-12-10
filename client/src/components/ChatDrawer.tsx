import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronRight, ChevronLeft } from "lucide-react";
import { ChatInterface } from "@/components/ChatInterface";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  role: string;
  content: string;
  timestamp: Date;
  metadata?: {
    type?: string;
    goalId?: string;
    suggestedAction?: string;
  };
}

interface ChatDrawerProps {
  className?: string;
  messages?: Message[];
  onSendMessage?: (message: string) => void;
}

export function ChatDrawer({ className, messages = [], onSendMessage }: ChatDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue.trim());
      setInputValue("");
      
      // Add a temporary processing message
      const processingMessage = {
        id: Date.now(),
        role: 'system',
        content: '⌛ Processing your request...',
        timestamp: new Date(),
        metadata: { type: 'processing' }
      };
      messages.push(processingMessage);
    }
  };

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
          <Card className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${message.role === 'assistant' ? 'bg-primary/10' : 'bg-muted'}`}>
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-muted p-2 rounded-md"
                  placeholder="Type a message..."
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
