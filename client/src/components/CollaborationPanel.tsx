import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Users, MessageSquare, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Collaboration {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  metadata?: any;
}

export function CollaborationPanel() {
  const [newCollaboration, setNewCollaboration] = useState({
    title: "",
    description: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: collaborations } = useQuery<Collaboration[]>({
    queryKey: ["collaborations"],
    queryFn: async () => {
      const res = await fetch("/api/collaborations");
      if (!res.ok) throw new Error("Failed to load collaborations");
      return res.json();
    },
  });

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
        <div className="space-y-4">
          {collaborations?.map((collab) => (
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
              <div className="mt-4 flex items-center gap-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <Users className="h-4 w-4" />
                  Participants
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Messages
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
