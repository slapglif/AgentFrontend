import { formatDistance } from "date-fns";

// Helper to generate random dates within a range
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper to generate realistic confidence scores
const generateConfidence = () => {
  return Math.floor(70 + Math.random() * 30); // Generate scores between 70-100
};

export const mockMemoryData = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  type: ["research", "analysis", "conclusion", "interaction"][Math.floor(Math.random() * 4)],
  content: {
    text: [
      "Analyzed dataset structure and identified optimal clustering parameters",
      "Completed research on advanced NLP techniques for sentiment analysis",
      "Collaborated with Agent-2 on feature engineering tasks",
      "Generated comprehensive documentation for the ML pipeline",
      "Optimized model performance through hyperparameter tuning",
      "Implemented new data validation checks",
      "Reviewed and validated test results with 98% accuracy",
      "Updated knowledge base with recent findings"
    ][Math.floor(Math.random() * 8)],
    code: Math.random() > 0.7 ? `def process_data(data):
    return data.transform()` : null,
    language: "python"
  },
  timestamp: randomDate(new Date('2024-12-01'), new Date()).toISOString(),
  confidence: generateConfidence(),
  metadata: {
    duration: Math.floor(Math.random() * 120) + 30,
    resourceUsage: Math.floor(Math.random() * 40) + 20,
    relatedAgents: [`Agent-${Math.floor(Math.random() * 3) + 1}`]
  }
}));

export const mockPerformanceData = {
  daily_metrics: Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
    success_rate: 0.85 + Math.random() * 0.15,
    tasks_completed: Math.floor(Math.random() * 50) + 30,
    avg_response_time: Math.floor(Math.random() * 200) + 100,
    memory_usage: Math.floor(Math.random() * 30) + 60
  })),
  current_tasks: Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    type: ["Data Analysis", "Model Training", "Documentation", "Code Review", "Research"][i],
    status: ["pending", "in_progress", "completed"][Math.floor(Math.random() * 3)],
    priority: Math.random() > 0.7 ? "high" : "medium"
  })),
  resource_usage: {
    cpu: Math.floor(Math.random() * 40) + 20,
    memory: Math.floor(Math.random() * 30) + 40,
    storage: Math.floor(Math.random() * 20) + 30
  }
};

export const mockLearningMetrics = {
  skills: [
    { name: "Natural Language Processing", proficiency: 85 },
    { name: "Data Analysis", proficiency: 92 },
    { name: "Machine Learning", proficiency: 78 },
    { name: "Problem Solving", proficiency: 88 }
  ],
  recent_achievements: [
    { id: 1, name: "Performance Milestone", description: "Achieved 95% accuracy in sentiment analysis" },
    { id: 2, name: "Efficiency Award", description: "Reduced processing time by 40%" }
  ],
  learning_progress: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
    progress: Math.min(100, Math.floor((i / 29) * 100 + Math.random() * 10))
  }))
};
