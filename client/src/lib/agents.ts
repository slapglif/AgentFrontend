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
  confidence: number;
  achievements: Achievement[];
  configuration: {
    decision_threshold: number;
    response_time_limit: number;
    coordination_strategy?: string;
    analysis_depth?: string;
    integration_mode?: string;
  };
  performance_metrics: {
    tasks_completed: number;
    success_rate: number;
    avg_response_time: number;
  };
  memory_allocation: {
    total: number;
    used: number;
    reserved: number;
  };
  specializations: string[];
  current_tasks: {
    id: number;
    type: string;
    status: string;
    priority: string;
  }[];
}

export const DEFAULT_AGENTS: Agent[] = [
  // Data Analysis Agent
  {
    id: 7,
    name: "Data Analysis Agent",
    type: "analytics",
    description: "Specializes in analyzing research data and extracting meaningful patterns",
    capabilities: [
      "statistical_analysis",
      "pattern_recognition",
      "data_visualization",
      "hypothesis_testing",
      "anomaly_detection"
    ],
    status: "active",
    level: 5,
    experience: 85,
    confidence: 93,
    achievements: [
      {
        id: 13,
        name: "Pattern Master",
        description: "Discovered 50 significant patterns in research data",
        icon: "bar-chart"
      },
      {
        id: 14,
        name: "Insight Oracle",
        description: "Generated 100 actionable insights from complex datasets",
        icon: "brain"
      }
    ]
  },
  // Research Synthesis Agent
  {
    id: 8,
    name: "Research Synthesis Agent",
    type: "synthesis",
    description: "Combines and synthesizes research findings from multiple sources",
    capabilities: [
      "cross_reference_analysis",
      "knowledge_integration",
      "contradiction_resolution",
      "gap_analysis",
      "recommendation_generation"
    ],
    status: "active",
    level: 4,
    experience: 72,
    confidence: 88,
    achievements: [
      {
        id: 15,
        name: "Synthesis Sage",
        description: "Successfully integrated findings from 200 research sources",
        icon: "git-merge"
      },
      {
        id: 16,
        name: "Knowledge Weaver",
        description: "Created 30 comprehensive research summaries",
        icon: "book"
      }
    ]
  },
  // Documentation Agent
  {
    id: 9,
    name: "Documentation Agent",
    type: "documentation",
    description: "Maintains comprehensive documentation of research processes and findings",
    capabilities: [
      "technical_writing",
      "process_documentation",
      "version_control",
      "metadata_management",
      "documentation_automation"
    ],
    status: "active",
    level: 4,
    experience: 78,
    confidence: 91,
    achievements: [
      {
        id: 17,
        name: "Documentation Maestro",
        description: "Created 1000 pages of detailed technical documentation",
        icon: "file-text"
      },
      {
        id: 18,
        name: "Process Chronicler",
        description: "Documented 50 complex research workflows",
        icon: "clipboard"
      }
    ]
  },
  {
    id: 1,
    name: "Research Lead",
    type: "coordinator",
    description: "Coordinates research activities and delegates tasks",
    capabilities: ["task_delegation", "synthesis", "evaluation", "resource_optimization"],
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
      },
      {
        id: 2,
        name: "Efficiency Expert",
        description: "Optimized resource allocation by 40%",
        icon: "zap"
      }
    ]
  },
  {
    id: 2,
    name: "DevOps Agent",
    type: "infrastructure",
    description: "Manages deployment pipelines and infrastructure",
    capabilities: ["ci_cd", "infrastructure_as_code", "monitoring", "kubernetes_orchestration"],
    status: "active",
    level: 4,
    experience: 80,
    confidence: 92,
    achievements: [
      {
        id: 3,
        name: "Pipeline Pioneer",
        description: "Automated 50 deployment pipelines",
        icon: "git-branch"
      },
      {
        id: 4,
        name: "Cloud Champion",
        description: "Achieved 99.9% uptime across services",
        icon: "cloud"
      }
    ]
  },
  {
    id: 3,
    name: "Security Agent",
    type: "security",
    description: "Ensures system security and performs vulnerability assessments",
    capabilities: ["threat_detection", "vulnerability_scanning", "penetration_testing", "audit_logging"],
    status: "active",
    level: 5,
    experience: 85,
    confidence: 94,
    achievements: [
      {
        id: 5,
        name: "Breach Blocker",
        description: "Prevented 100 security threats",
        icon: "shield"
      },
      {
        id: 6,
        name: "Code Guardian",
        description: "Identified and fixed 50 critical vulnerabilities",
        icon: "lock"
      }
    ]
  },
  {
    id: 4,
    name: "Testing Agent",
    type: "quality",
    description: "Performs automated testing and quality assurance",
    capabilities: ["unit_testing", "integration_testing", "performance_testing", "test_automation"],
    status: "active",
    level: 4,
    experience: 70,
    confidence: 88,
    achievements: [
      {
        id: 7,
        name: "Test Master",
        description: "Created 1000+ automated test cases",
        icon: "check-circle"
      },
      {
        id: 8,
        name: "Bug Hunter",
        description: "Identified and resolved 200 critical bugs",
        icon: "bug"
      }
    ]
  },
  {
    id: 5,
    name: "Performance Agent",
    type: "optimization",
    description: "Monitors and optimizes system performance",
    capabilities: ["performance_profiling", "resource_monitoring", "optimization", "bottleneck_analysis"],
    status: "active",
    level: 4,
    experience: 75,
    confidence: 90,
    achievements: [
      {
        id: 9,
        name: "Speed Demon",
        description: "Improved system performance by 60%",
        icon: "zap-fast"
      },
      {
        id: 10,
        name: "Resource Ranger",
        description: "Reduced resource usage by 40%",
        icon: "gauge"
      }
    ]
  },
  {
    id: 6,
    name: "API Integration Agent",
    type: "integration",
    description: "Manages API integrations and data flow",
    capabilities: ["api_development", "data_transformation", "service_integration", "protocol_optimization"],
    status: "idle",
    level: 3,
    experience: 65,
    confidence: 85,
    achievements: [
      {
        id: 11,
        name: "Integration Master",
        description: "Successfully integrated 30 external services",
        icon: "plug"
      },
      {
        id: 12,
        name: "Protocol Pioneer",
        description: "Optimized 20 API endpoints for better performance",
        icon: "activity"
      }
    ]
  }
];
