import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Users, MessageSquare, Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { mockCollaborations, mockParticipants, mockMessages, simulateRealTimeEvents } from "@/lib/mockCollaborations";
import type { CollaborationMessage, CollaborationParticipant, Collaboration } from "@/types/schema";

interface MessageReply {
  id: number;
  fromAgentId: number;
  content: string;
  timestamp: string;
}

// Extend the CollaborationMessage type to include isTyping
interface ExtendedCollaborationMessage extends Omit<CollaborationMessage, 'metadata'> {
  metadata?: {
    replies?: MessageReply[];
    context?: Record<string, unknown>;
  };
  isTyping?: boolean;
  fromAgentId?: number;
  content: string;
  timestamp: string;
  type?: string;
}

export function CollaborationPanel() {
  const [newCollaboration, setNewCollaboration] = useState({
    title: "",
    description: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCollaboration, setSelectedCollaboration] = useState<number | null>(null);
  
  const { data: collaborationsData, isLoading, error: queryError } = useQuery({
    queryKey: ['collaborations'],
    queryFn: () => Promise.resolve(mockCollaborations),
  });

  const [participants, setParticipants] = useState(mockParticipants);
  const [messages, setMessages] = useState<ExtendedCollaborationMessage[]>(
    mockMessages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp?.toISOString() || new Date().toISOString(),
    })) as ExtendedCollaborationMessage[]
  );
  const [expandedMessage, setExpandedMessage] = useState<number | null>(null);
  
  const [onlineAgents, setOnlineAgents] = useState<Record<number, { isOnline: boolean; lastSeen: string }>>(() => {
    const initialStatus: Record<number, { isOnline: boolean; lastSeen: string }> = {};
    mockParticipants.forEach(participant => {
      initialStatus[participant.agentId] = {
        isOnline: true,
        lastSeen: new Date().toISOString()
      };
    });
    return initialStatus;
  });

  useEffect(() => {
    if (selectedCollaboration) {
      const selectedParticipants = mockParticipants.filter(p => p.collaborationId === selectedCollaboration);
      setParticipants(selectedParticipants);
    }
  }, [selectedCollaboration]);

  useEffect(() => {
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
          setMessages(prev => [...prev, {
            ...event.data.message,
            timestamp: new Date(event.data.message.timestamp).toISOString()
          }]);
          break;
        case 'status_update':
          queryClient.setQueryData(['collaborations'], (oldData: typeof collaborationsData) => {
            if (!oldData) return oldData;
            return oldData.map((collab) =>
              collab.id === event.data.collaborationId
                ? { ...collab, status: event.data.status }
                : collab
            );
          });
          break;
      }
    });
  }, [queryClient, toast]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-sm text-muted-foreground">Loading collaborations...</span>
        </div>
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg max-w-md text-center">
          {queryError instanceof Error ? queryError.message : 'An error occurred'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
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
                {createCollaboration.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 animate-staggered-fade-in">
          {(collaborationsData || []).map((collab) => (
            <Card
              key={collab.id}
              className="p-4 hover:bg-muted/50 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
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
                  <div className="border rounded-lg p-4 space-y-4 bg-muted/30 animate-staggered-fade-in">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Collaboration Timeline</h4>
                      <Badge variant="outline">
                        {new Date(collab.updatedAt).toLocaleDateString()}
                      </Badge>
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
                            className="p-3 rounded-lg bg-background hover:bg-muted/80 transition-all duration-300 cursor-pointer hover:shadow-sm"
                            onClick={() => {
                              if (message.metadata?.replies?.length) {
                                setExpandedMessage(
                                  expandedMessage === message.id ? null : message.id
                                );
                              }
                            }}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium">
                                    Agent {message.fromAgentId}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                  </span>
                                </div>
                                <p className="text-sm text-foreground/90 break-words">{message.content}</p>
                              </div>
                            </div>
                            {message.isTyping && (
                              <div className="flex items-center gap-1 mt-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-pulse" />
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-pulse [animation-delay:0.2s]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-pulse [animation-delay:0.4s]" />
                              </div>
                            )}
                            {expandedMessage === message.id && message.metadata?.replies && (
                              <div className="mt-3 pl-4 space-y-3 border-l-2 border-primary/20 animate-staggered-fade-in">
                                {message.metadata.replies.map((reply) => (
                                  <div
                                    key={reply.id}
                                    className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200"
                                  >
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-sm font-medium text-primary/90">
                                            Agent {reply.fromAgentId}
                                          </span>
                                          <span className="text-xs text-muted-foreground">
                                            {new Date(reply.timestamp).toLocaleTimeString()}
                                          </span>
                                        </div>
                                        <p className="text-sm text-foreground/80 break-words">{reply.content}</p>
                                      </div>
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
      </div>
    </div>
  );
}
