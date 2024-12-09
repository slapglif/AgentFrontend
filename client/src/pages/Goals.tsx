import React, { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatDrawer } from "@/components/ChatDrawer";
import { GoalKanbanBoard } from "@/components/GoalKanbanBoard";
import { TimelineView } from "@/components/TimelineView";
import { Plus } from "lucide-react";
import { addDays, differenceInDays } from "date-fns";
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
  startDate: Date;
  endDate: Date;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "completed";
  startDate: Date;
  endDate: Date;
  progress: number;
  tasks: Task[];
}

// Mock initial goals data
const today = new Date();
const twoWeeksFromNow = new Date();
twoWeeksFromNow.setDate(today.getDate() + 14);

// Ensure dates are properly instantiated
const initialGoals: Goal[] = [
  {
    id: "1",
    title: "Research Data Analysis",
    description: "Analyze research data for patterns and insights",
    status: "in_progress",
    startDate: new Date(today.getTime()),
    endDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    progress: 60,
    tasks: [
      {
        id: "1-1",
        title: "Data preprocessing",
        description: "Clean and prepare data for analysis",
        completed: true,
        startDate: today,
        endDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      },
      {
        id: "1-2",
        title: "Feature selection",
        description: "Select relevant features for analysis",
        completed: true,
        startDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
        endDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        id: "1-3",
        title: "Model selection",
        description: "Choose appropriate models for analysis",
        completed: false,
        startDate: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000),
        endDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
      }
    ]
  },
  {
    id: "2",
    title: "Implement Machine Learning Pipeline",
    description: "Create end-to-end ML pipeline",
    status: "todo",
    startDate: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000),
    endDate: twoWeeksFromNow,
    progress: 0,
    tasks: [
      {
        id: "2-1",
        title: "Data ingestion",
        description: "Set up data ingestion pipeline",
        completed: false,
        startDate: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000),
        endDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
      },
      {
        id: "2-2",
        title: "Model training",
        description: "Implement model training pipeline",
        completed: false,
        startDate: new Date(today.getTime() + 11 * 24 * 60 * 60 * 1000),
        endDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
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
    timestamp: new Date("2024-12-09T10:00:00"),
    metadata: {
      type: "welcome"
    }
  },
  {
    id: 2,
    role: "assistant",
    content: "I noticed that the 'Research Data Analysis' goal is approaching its deadline. The current progress is at 60%. Based on the task dependencies, here's what I suggest:\n\n1. 🎯 Prioritize 'Model Selection' as it's blocking other tasks\n2. 🔄 Parallelize Feature Selection with Data Preprocessing\n3. ⏰ Consider extending the deadline by 2 days\n\nWould you like me to help adjust the timeline?",
    timestamp: new Date("2024-12-09T10:01:00"),
    metadata: {
      goalId: "1",
      type: "timeline_optimization",
      suggestedAction: "adjust_timeline"
    }
  },
  {
    id: 3,
    role: "user",
    content: "Yes, please help optimize the timeline. Can you also suggest ways to speed up the model selection process?",
    timestamp: new Date("2024-12-09T10:02:00")
  },
  {
    id: 4,
    role: "assistant",
    content: "I've analyzed your model selection requirements. Here's a plan to accelerate the process:\n\n1. 📊 Use automated model selection techniques\n2. 🔍 Focus on top 3 performing algorithms\n3. 🤝 Leverage parallel processing for evaluation\n\nI've updated the timeline to reflect these optimizations. Would you like me to create subtasks for each of these steps?",
    timestamp: new Date("2024-12-09T10:03:00"),
    metadata: {
      type: "optimization_suggestion",
      taskId: "1-3",
      suggestedActions: ["create_subtasks", "update_timeline"]
    }
  },
  {
    id: 5,
    role: "system",
    content: "✨ Task 'Data preprocessing' has been completed! The goal 'Research Data Analysis' is now 60% complete.",
    timestamp: new Date("2024-12-09T10:04:00"),
    metadata: {
      type: "task_completion",
      taskId: "1-1",
      goalId: "1",
      progress: 60
    }
  },
  {
    id: 6,
    role: "assistant",
    content: "Great progress! 🎉 I see you've completed the data preprocessing. Based on the results, the feature selection process could be simplified. Would you like me to:\n\n1. 🔄 Update the feature selection criteria\n2. 📋 Generate a summary of key features\n3. 📊 Create a feature importance visualization",
    timestamp: new Date("2024-12-09T10:05:00"),
    metadata: {
      type: "task_suggestion",
      relatedTasks: ["1-2"],
      suggestedActions: ["update_criteria", "generate_summary", "create_visualization"]
    }
  }
];

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
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
    if (!newGoal.title || !newGoal.startDate || !newGoal.endDate) return;

    const startDate = new Date(newGoal.startDate);
    const endDate = new Date(newGoal.endDate);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return;
    
    const goal: Goal = {
      id: `goal-${goals.length + 1}`,
      title: newGoal.title,
      description: newGoal.description,
      status: "todo",
      startDate,
      endDate,
      progress: 0,
      tasks: []
    };

    setGoals([...goals, goal]);
    setIsAddingGoal(false);
    setNewGoal({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      priority: "medium"
    });
  };

  const updateGoalProgress = (goalId: string, progress: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, progress } : goal
    ));
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
                    <label className="text-sm font-medium">Start Date</label>
                    <Input
                      type="date"
                      value={newGoal.startDate}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, startDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Date</label>
                    <Input
                      type="date"
                      value={newGoal.endDate}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, endDate: e.target.value })
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
            <TimelineView 
              goals={goals}
              onTaskUpdate={(taskData) => {
                const updatedGoals = goals.map(goal => {
                  if (goal.id === taskData.goalId) {
                    const daysDiff = differenceInDays(
                      taskData.destinationDate,
                      taskData.sourceDate
                    );
                    return {
                      ...goal,
                      startDate: addDays(goal.startDate, daysDiff),
                      endDate: addDays(goal.endDate, daysDiff)
                    };
                  }
                  return goal;
                });
                setGoals(updatedGoals);
              }}
            />
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
            // Handle new message
          }}
        />
      </Suspense>
    </div>
  );
}
