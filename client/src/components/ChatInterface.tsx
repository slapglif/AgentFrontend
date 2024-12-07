import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { formatDistance } from "date-fns";
import type { Message } from "@db/schema";
import { useEffect } from "react";

interface OrchestratorMessage extends Omit<Message, 'metadata'> {
  metadata: {
    replies?: Array<{
      id: number;
      content: string;
      fromAgentId: number;
      timestamp: string;
    }>;
    context?: {
      timestamp: string;
      clientInfo?: {
        type: string;
        isConnected: boolean;
      };
      [key: string]: unknown;
    };
  };
}

export function ChatInterface() {
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  
  const { data: messages, refetch } = useQuery<OrchestratorMessage[]>({
    queryKey: ["messages"],
    queryFn: async () => {
      const res = await fetch("/api/messages");
      if (!res.ok) throw new Error("Failed to load messages");
      return res.json();
    },
    refetchInterval: 2000, // Poll every 2 seconds for new messages
  });

  // Connect to orchestrator
  useEffect(() => {
    const connectToOrchestrator = async () => {
      try {
        const res = await fetch("/api/orchestrator/connect");
        if (res.ok) {
          setIsConnected(true);
        }
      } catch (error) {
        console.error("Failed to connect to orchestrator:", error);
        setIsConnected(false);
      }
    };
    
    connectToOrchestrator();
    return () => setIsConnected(false);
  }, []);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      // First, notify orchestrator about incoming message
      await fetch("/api/orchestrator/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isTyping: true }),
      });

      // Send the actual message
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: message,
          type: "user_message",
          priority: "normal",
          metadata: {
            context: {
              timestamp: new Date().toISOString(),
              clientInfo: {
                type: "web",
                isConnected
              }
            }
          }
        }),
      });

      // Clear typing indicator
      await fetch("/api/orchestrator/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isTyping: false }),
      });

      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: () => {
      setInput("");
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-background to-muted/30">
      <ScrollArea className="flex-1 p-4 space-y-4">
        <div className="flex flex-col space-y-4">
          {messages?.map((message, index) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 animate-message ${
                message.fromAgentId === 1 ? 'flex-row-reverse' : ''
              }`}
              style={{
                '--slide-x': message.fromAgentId === 1 ? '20px' : '-20px',
                animationDelay: `${index * 0.1}s`
              } as React.CSSProperties}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center animate-float">
                {message.fromAgentId === 1 ? '👤' : '🤖'}
              </div>
              <div
                className={`group max-w-[80%] ${
                  message.fromAgentId === 1
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                } rounded-lg p-3 hover-3d interactive-hover relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-progress" />
                <p className="text-sm relative">{message.content}</p>
                <span className="text-xs opacity-50 mt-1 block">
                  {formatDistance(new Date(message.timestamp), new Date(), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          ))}
          {sendMessage.isPending && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center animate-float">
                🤖
              </div>
              <div className="bg-muted rounded-lg p-3 flex items-center gap-2 animate-message" style={{ '--slide-x': '-20px' } as React.CSSProperties}>
                <div className="w-2 h-2 rounded-full bg-current type-indicator" />
                <div className="w-2 h-2 rounded-full bg-current type-indicator" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full bg-current type-indicator" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-primary/10 backdrop-blur-sm flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage.mutate(input);
            }
          }}
        />
        <Button
          onClick={() => sendMessage.mutate(input)}
          disabled={sendMessage.isPending}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
