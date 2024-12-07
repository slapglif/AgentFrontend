export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export interface Agent {
  id: number;
  name: string;
  type: string;
  description: string;
  capabilities: string[];
  status: "idle" | "active" | "error";
  level: number;
  experience: number;
  achievements: Achievement[];
  confidence: number;
}

export const DEFAULT_AGENTS: Agent[] = [
  {
    id: 1,
    name: "Research Lead",
    type: "coordinator",
    description: "Coordinates research activities and delegates tasks",
    capabilities: ["task_delegation", "synthesis", "evaluation"],
    status: "active",
    level: 5,
    experience: 75,
    confidence: 95,
    achievements: [
      {
        id: 1,
        name: "Master Coordinator",
        description: "Successfully coordinated 100 research tasks",
        icon: "trophy"
      }
    ]
  },
  {
    id: 2,
    name: "Bioinformatics Agent",
    type: "specialist",
    description: "Analyzes biological data and literature",
    capabilities: ["data_analysis", "literature_review"],
    status: "active",
    level: 4,
    experience: 60,
    confidence: 85,
    achievements: [
      {
        id: 2,
        name: "Data Maestro",
        description: "Analyzed over 1000 datasets",
        icon: "database"
      }
    ]
  },
  {
    id: 3,
    name: "Chemoinformatics Agent",
    type: "specialist",
    description: "Handles chemical information and analysis",
    capabilities: ["structure_analysis", "property_prediction"],
    status: "idle",
    level: 3,
    experience: 45,
    confidence: 80,
    achievements: [
      {
        id: 3,
        name: "Structure Savant",
        description: "Predicted properties of 500 compounds",
        icon: "atom"
      }
    ]
  },
  {
    id: 4,
    name: "Neuroprotection Agent",
    type: "specialist",
    description: "Specializes in neuroprotective strategies",
    capabilities: ["pathway_analysis", "drug_targeting"],
    status: "active",
    level: 4,
    experience: 65,
    confidence: 90,
    achievements: [
      {
        id: 4,
        name: "Neural Guardian",
        description: "Identified 50 neuroprotective compounds",
        icon: "brain"
      }
    ]
  }
];
