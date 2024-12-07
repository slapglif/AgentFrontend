export interface Agent {
  id: number;
  name: string;
  type: string;
  description: string;
  capabilities: string[];
  status: "idle" | "active" | "error";
}

export const DEFAULT_AGENTS: Agent[] = [
  {
    id: 1,
    name: "Research Lead",
    type: "coordinator",
    description: "Coordinates research activities and delegates tasks",
    capabilities: ["task_delegation", "synthesis", "evaluation"],
    status: "idle",
  },
  {
    id: 2,
    name: "Bioinformatics Agent",
    type: "specialist",
    description: "Analyzes biological data and literature",
    capabilities: ["data_analysis", "literature_review"],
    status: "idle",
  },
  {
    id: 3,
    name: "Chemoinformatics Agent",
    type: "specialist",
    description: "Handles chemical information and analysis",
    capabilities: ["structure_analysis", "property_prediction"],
    status: "idle",
  },
];
