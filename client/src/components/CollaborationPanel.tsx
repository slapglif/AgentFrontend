import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Users, MessageSquare, Plus, Loader2 } from "lucide-react";
import type { collaborations, collaborationParticipants, messages } from "@db/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { mockCollaborations, mockParticipants, mockMessages, simulateRealTimeEvents } from "@/lib/mockCollaborations";

interface CollaborationParticipant {
  id: number;
  collaborationId: number;
  agentId: number;
  role: string;
  joinedAt: Date;
  metadata: {
    expertise: string[];
  };
}

interface MessageReply {
  id: number;
  fromAgentId: number;
  content: string;
  timestamp: Date;
}

interface CollaborationMessage {
  id: number;
  fromAgentId: number;
  content: string;
  timestamp: Date;
  type: string;
  metadata: {
    replies?: MessageReply[];
    context?: Record<string, unknown>;
  };
  isTyping?: boolean;
}

interface Collaboration {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    priority?: string;
    tags?: string[];
  } | null;
}

export function CollaborationPanel() {
  const [newCollaboration, setNewCollaboration] = useState({
    title: "",
    description: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedCollaboration, setSelectedCollaboration] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [participants, setParticipants] = useState(mockParticipants);
  const [messages, setMessages] = useState(mockMessages);
  const [collaborations, setCollaborations] = useState(mockCollaborations);
  const [agentStatus, setAgentStatus] = useState<Record<number, { isOnline: boolean; lastSeen: Date }>>({})
  const [expandedMessage, setExpandedMessage] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        // Initialize agent status
        const initialAgentStatus: Record<number, { isOnline: boolean; lastSeen: Date }> = {};
        mockParticipants.forEach(participant => {
          initialAgentStatus[participant.agentId] = {
            isOnline: true,
            lastSeen: new Date()
          };
        });
        setAgentStatus(initialAgentStatus);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    loadData();
    
    // Simulate real-time events
    return simulateRealTimeEvents((event) => {
      switch (event.type) {
        case 'participant_joined':
          setParticipants(prev => [...prev, event.data.participant]);
          toast({
            title: "New Participant",
            description: `Agent ${event.data.participant.agentId} joined as ${event.data.participant.role}`
          });
          break;
        case 'new_message':
          setMessages(prev => [...prev, event.data.message]);
          break;
        case 'status_update':
          setCollaborations(prev => 
            prev.map(collab => 
              collab.id === event.data.collaborationId
                ? { ...collab, status: event.data.status }
                : collab
            )
          );
          break;
      }
    });
  }, []);

  useEffect(() => {
    if (selectedCollaboration) {
      const selectedParticipants = mockParticipants.filter(p => p.collaborationId === selectedCollaboration);
      setParticipants(selectedParticipants);
    }
  }, [selectedCollaboration]);

  // Using mock data directly instead of fetching from API
  useEffect(() => {
    setLoading(false);
  }, []);

  const createCollaboration = useMutation({
    mutationFn: async (data: typeof newCollaboration) => {
      const res = await fetch("/api/collaborations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create collaboration");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborations"] });
      toast({
        title: "Success",
        description: "Collaboration created successfully",
      });
      setNewCollaboration({ title: "", description: "" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create collaboration",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Collaborations</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Collaboration
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Collaboration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input
                  placeholder="Title"
                  value={newCollaboration.title}
                  onChange={(e) =>
                    setNewCollaboration((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Description"
                  value={newCollaboration.description}
                  onChange={(e) =>
                    setNewCollaboration((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <Button
                className="w-full"
                onClick={() => createCollaboration.mutate(newCollaboration)}
                disabled={createCollaboration.isPending}
              >
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="flex-1">
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
              {error}
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground">Loading collaborations...</span>
          </div>
        ) : (
        <div className="space-y-4">
          {collaborations.map((collab) => (
            <Card
              key={collab.id}
              className="p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{collab.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {collab.description}
                  </p>
                </div>
                <Badge>{collab.status}</Badge>
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-4 mb-4">
                  <Button 
                    variant={selectedCollaboration === collab.id ? "secondary" : "outline"} 
                    size="sm" 
                    className="gap-2"
                    onClick={() => setSelectedCollaboration(collab.id)}
                  >
                    <Users className="h-4 w-4" />
                    Participants
                  </Button>
                  <Button 
                    variant={selectedCollaboration === collab.id ? "secondary" : "outline"} 
                    size="sm" 
                    className="gap-2"
                    onClick={() => setSelectedCollaboration(collab.id)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Messages
                  </Button>
                </div>
                {selectedCollaboration === collab.id && (
                  <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Collaboration Timeline</h4>
                      <Badge variant="outline">{new Date(collab.updatedAt).toLocaleDateString()}</Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Active participants will appear here in real-time
                      </p>
                      <div className="flex items-center gap-2">
                        {participants.map((participant) => (
                          <div 
                            key={participant.id}
                            onClick={() => {
                              toast({
                                title: `Agent ${participant.agentId}`,
                                description: `Role: ${participant.role}\nExpertise: ${participant.metadata?.expertise?.join(", ") ?? "None"}`,
                              });
                            }}
                            className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors"
                          >
                            👤
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 space-y-2">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className="p-2 rounded-lg bg-background hover:bg-muted transition-colors cursor-pointer"
                            onClick={() => {
                              if (message.metadata?.replies?.length) {
                                setExpandedMessage(expandedMessage === message.id ? null : message.id ?? null);
                              }
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="text-sm font-medium">Agent {message.fromAgentId}</span>
                                <p className="text-sm">{message.content}</p>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(message.timestamp || Date.now()).toLocaleTimeString()}
                              </span>
                            </div>
                            {message.isTyping && (
                              <div className="flex items-center gap-1 mt-1">
                                <div className="w-1 h-1 rounded-full bg-primary animate-bounce" />
                                <div className="w-1 h-1 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                                <div className="w-1 h-1 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                              </div>
                            )}
                            {expandedMessage === message.id && message.metadata?.replies && (
                              <div className="mt-2 pl-4 space-y-2 border-l">
                                {message.metadata.replies.map((reply: MessageReply) => (
                                  <div key={reply.id} className="p-2 rounded-lg bg-muted">
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <span className="text-sm font-medium">Agent {reply.fromAgentId}</span>
                                        <p className="text-sm">{reply.content}</p>
                                      </div>
                                      <span className="text-xs text-muted-foreground">
                                        {(reply.timestamp instanceof Date ? reply.timestamp : new Date(reply.timestamp)).toLocaleTimeString()}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
        )}
      </ScrollArea>
    </div>
  );
}
