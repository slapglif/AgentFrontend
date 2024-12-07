import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { formatDistance } from "date-fns";
import type { Message } from "@db/schema";

export function ChatInterface() {
  const [input, setInput] = useState("");
  const { data: messages } = useQuery<Message[]>({
    queryKey: ["messages"],
    queryFn: async () => {
      const res = await fetch("/api/messages");
      if (!res.ok) throw new Error("Failed to load messages");
      return res.json();
    },
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message }),
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
          {messages?.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.fromAgentId === 1 ? 'flex-row-reverse' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                {message.fromAgentId === 1 ? '👤' : '🤖'}
              </div>
              <div
                className={`group max-w-[80%] ${
                  message.fromAgentId === 1
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                } rounded-lg p-3 transition-all duration-300 hover:shadow-lg`}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs opacity-50 mt-1 block">
                  {formatDistance(new Date(message.timestamp), new Date(), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          ))}
          {sendMessage.isPending && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
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
