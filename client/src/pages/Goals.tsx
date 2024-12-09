import React, { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatDrawer } from "@/components/ChatDrawer";
import { GoalKanbanBoard } from "@/components/GoalKanbanBoard";
import { TimelineView } from "@/components/TimelineView";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  assignedTo?: string;
  startTime: Date;
  endTime: Date;
  dependencies?: string[];
}

interface Goal {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "completed";
  startTime: Date;
  endTime: Date;
  progress: number;
  tasks: Task[];
}

// Mock initial goals data
const today = new Date();
const makeTime = (hours: number, minutes: number = 0) => {
  const date = new Date(today);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const initialGoals: Goal[] = [
  {
    id: "1",
    title: "Research Data Analysis",
    description: "Analyze research data for patterns and insights",
    status: "in_progress",
    startTime: makeTime(9), // 9 AM
    endTime: makeTime(16), // 4 PM
    progress: 60,
    tasks: [
      {
        id: "1-1",
        title: "Data preprocessing",
        description: "Clean and prepare data for analysis",
        completed: true,
        startTime: makeTime(9), // 9 AM
        endTime: makeTime(11), // 11 AM
      },
      {
        id: "1-2",
        title: "Feature selection",
        description: "Select relevant features for analysis",
        completed: true,
        dependencies: ["1-1"],
        startTime: makeTime(11), // 11 AM
        endTime: makeTime(13), // 1 PM
      },
      {
        id: "1-3",
        title: "Model selection",
        description: "Choose appropriate models for analysis",
        completed: false,
        dependencies: ["1-2"],
        startTime: makeTime(14), // 2 PM
        endTime: makeTime(16), // 4 PM
      }
    ]
  },
  {
    id: "2",
    title: "Implement Machine Learning Pipeline",
    description: "Create end-to-end ML pipeline",
    status: "todo",
    startTime: makeTime(10), // 10 AM
    endTime: makeTime(17), // 5 PM
    progress: 0,
    tasks: [
      {
        id: "2-1",
        title: "Data ingestion",
        description: "Set up data ingestion pipeline",
        completed: false,
        startTime: makeTime(10), // 10 AM
        endTime: makeTime(13), // 1 PM
      },
      {
        id: "2-2",
        title: "Model training",
        description: "Implement model training pipeline",
        completed: false,
        dependencies: ["2-1"],
        startTime: makeTime(14), // 2 PM
        endTime: makeTime(17), // 5 PM
      }
    ]
  }
];

// Mock chat messages with rich interactions
const mockChatMessages = [
  {
    id: 1,
    role: "assistant",
    content: "👋 I'm your research assistant. I'll help you manage your goals and optimize your research timeline. What would you like to focus on today?",
    timestamp: new Date(),
    metadata: {
      type: "welcome"
    }
  },
  {
    id: 2,
    role: "assistant",
    content: "I noticed that the 'Research Data Analysis' goal is approaching its deadline. The current progress is at 60%. Based on the task dependencies, here's what I suggest:\n\n1. 🎯 Prioritize 'Model Selection' as it's blocking other tasks\n2. 🔄 Parallelize Feature Selection with Data Preprocessing\n3. ⏰ Consider extending the timeline\n\nWould you like me to help adjust the timeline?",
    timestamp: new Date(),
    metadata: {
      goalId: "1",
      type: "timeline_optimization",
      suggestedAction: "adjust_timeline"
    }
  }
];

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    priority: "medium"
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    if (result.type === "GOAL") {
      const updatedGoals = [...goals];
      const [removed] = updatedGoals.splice(result.source.index, 1);
      updatedGoals.splice(result.destination.index, 0, removed);
      setGoals(updatedGoals);
    } else {
      const updatedGoals = [...goals];
      const sourceGoal = updatedGoals.find(g => g.id === result.source.droppableId);
      const destGoal = updatedGoals.find(g => g.id === result.destination.droppableId);

      if (sourceGoal && destGoal) {
        const [removed] = sourceGoal.tasks.splice(result.source.index, 1);
        destGoal.tasks.splice(result.destination.index, 0, removed);
        
        // Update progress for both goals
        const updateProgress = (goal: Goal) => {
          const completedTasks = goal.tasks.filter(t => t.completed).length;
          goal.progress = goal.tasks.length > 0 
            ? Math.round((completedTasks / goal.tasks.length) * 100)
            : 0;
        };
        
        updateProgress(sourceGoal);
        if (sourceGoal.id !== destGoal.id) {
          updateProgress(destGoal);
        }
        
        setGoals(updatedGoals);
      }
    }
  };

  const addNewGoal = () => {
    if (!newGoal.title || !newGoal.startTime || !newGoal.endTime) return;

    const startTime = new Date(newGoal.startTime);
    const endTime = new Date(newGoal.endTime);
    
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) return;
    
    const goal: Goal = {
      id: `goal-${goals.length + 1}`,
      title: newGoal.title,
      description: newGoal.description,
      status: "todo",
      startTime,
      endTime,
      progress: 0,
      tasks: []
    };

    setGoals([...goals, goal]);
    setIsAddingGoal(false);
    setNewGoal({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      priority: "medium"
    });
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Goal Management</h1>
          <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newGoal.title}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, title: e.target.value })
                    }
                    placeholder="Enter goal title"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newGoal.description}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, description: e.target.value })
                    }
                    placeholder="Enter goal description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Time</label>
                    <Input
                      type="time"
                      value={newGoal.startTime}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, startTime: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Time</label>
                    <Input
                      type="time"
                      value={newGoal.endTime}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, endTime: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={newGoal.priority}
                    onValueChange={(value) =>
                      setNewGoal({ ...newGoal, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingGoal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addNewGoal}>Create Goal</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="kanban" className="w-full">
          <TabsList className="justify-end mb-4">
            <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban">
            <GoalKanbanBoard 
              goals={goals} 
              onGoalsUpdate={setGoals}
              onDragEnd={handleDragEnd}
            />
          </TabsContent>

          <TabsContent value="timeline">
            <TimelineView goals={goals} />
          </TabsContent>
        </Tabs>
      </main>

      <Suspense
        fallback={
          <div className="w-[400px] border-l bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
            <div className="p-4">Loading chat...</div>
          </div>
        }
      >
        <ChatDrawer
          className="border-l sticky top-0"
          messages={mockChatMessages}
          onSendMessage={(message) => {
            console.log("Sending message:", message);
          }}
        />
      </Suspense>
    </div>
  );
}