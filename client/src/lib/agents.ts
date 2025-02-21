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
  learningMetrics?: {
    skills: Array<{
      name: string;
      proficiency: number;
    }>;
    level: {
      current: number;
      xp: number;
      nextLevelXp: number;
    };
    achievements: any[];
  };
}

export const DEFAULT_AGENTS: Agent[] = [
  // Ayurvedic Research Agent
  {
    id: 7,
    name: "Ayurvedic Research Agent",
    type: "traditional_medicine",
    description: "Specializes in analyzing and synthesizing Ayurvedic medical knowledge and practices",
    capabilities: [
      "ayurvedic_analysis",
      "herbal_knowledge",
      "traditional_practices",
      "holistic_healing",
      "dosha_analysis"
    ],
    status: "active",
    level: 5,
    experience: 85,
    confidence: 93,
    achievements: [
      {
        id: 13,
        name: "Vaidya Scholar",
        description: "Mastered 100 traditional Ayurvedic formulations",
        icon: "leaf"
      },
      {
        id: 14,
        name: "Dosha Expert",
        description: "Analyzed 1000+ constitutional profiles",
        icon: "zap"
      }
    ],
    learningMetrics: {
      skills: [
        { name: "Ayurvedic Analysis", proficiency: 95 },
        { name: "Herbal Knowledge", proficiency: 88 },
        { name: "Traditional Practices", proficiency: 92 }
      ],
      level: {
        current: 5,
        xp: 850,
        nextLevelXp: 1000
      },
      achievements: []
    },
    configuration: {
      decision_threshold: 0.92,
      response_time_limit: 2000,
      analysis_depth: "comprehensive"
    },
    performance_metrics: {
      tasks_completed: 350,
      success_rate: 0.96,
      avg_response_time: 1200
    },
    memory_allocation: {
      total: 4096,
      used: 2560,
      reserved: 512
    },
    specializations: ["ayurvedic_medicine", "herbal_formulation", "dosha_assessment", "traditional_healing"],
    current_tasks: [
      { id: 7, type: "data_analysis", status: "active", priority: "high" }
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
    ],
    configuration: {
      decision_threshold: 0.88,
      response_time_limit: 4000,
      analysis_depth: "deep"
    },
    performance_metrics: {
      tasks_completed: 280,
      success_rate: 0.92,
      avg_response_time: 2500
    },
    memory_allocation: {
      total: 3072,
      used: 2048,
      reserved: 384
    },
    specializations: ["research_synthesis", "knowledge_integration", "gap_analysis"],
    current_tasks: [
      { id: 8, type: "synthesis", status: "active", priority: "medium" }
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
    ],
    configuration: {
      decision_threshold: 0.90,
      response_time_limit: 3000,
      analysis_depth: "detailed"
    },
    performance_metrics: {
      tasks_completed: 420,
      success_rate: 0.95,
      avg_response_time: 1800
    },
    memory_allocation: {
      total: 2048,
      used: 1536,
      reserved: 256
    },
    specializations: ["technical_documentation", "process_mapping", "metadata_management"],
    current_tasks: [
      { id: 9, type: "documentation", status: "active", priority: "medium" }
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
    ],
    configuration: {
      decision_threshold: 0.85,
      response_time_limit: 3000,
      coordination_strategy: "hierarchical"
    },
    performance_metrics: {
      tasks_completed: 245,
      success_rate: 0.95,
      avg_response_time: 1500
    },
    memory_allocation: {
      total: 2048,
      used: 1536,
      reserved: 256
    },
    specializations: ["workflow_optimization", "team_coordination", "resource_management"],
    current_tasks: [
      { id: 1, type: "coordination", status: "active", priority: "high" }
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
    ],
    configuration: {
      decision_threshold: 0.90,
      response_time_limit: 2500,
      coordination_strategy: "automated"
    },
    performance_metrics: {
      tasks_completed: 380,
      success_rate: 0.97,
      avg_response_time: 1000
    },
    memory_allocation: {
      total: 4096,
      used: 2816,
      reserved: 512
    },
    specializations: ["pipeline_automation", "infrastructure_management", "monitoring"],
    current_tasks: [
      { id: 2, type: "deployment", status: "active", priority: "high" }
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
    ],
    configuration: {
      decision_threshold: 0.95,
      response_time_limit: 2000,
      analysis_depth: "deep"
    },
    performance_metrics: {
      tasks_completed: 320,
      success_rate: 0.98,
      avg_response_time: 800
    },
    memory_allocation: {
      total: 4096,
      used: 2048,
      reserved: 512
    },
    specializations: ["security_audit", "threat_prevention", "vulnerability_assessment"],
    current_tasks: [
      { id: 3, type: "security_scan", status: "active", priority: "high" }
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
    ],
    configuration: {
      decision_threshold: 0.90,
      response_time_limit: 5000,
      analysis_depth: "comprehensive"
    },
    performance_metrics: {
      tasks_completed: 450,
      success_rate: 0.92,
      avg_response_time: 2000
    },
    memory_allocation: {
      total: 3072,
      used: 2048,
      reserved: 512
    },
    specializations: ["automated_testing", "regression_testing", "load_testing"],
    current_tasks: [
      { id: 4, type: "integration_test", status: "active", priority: "medium" }
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
    ],
    configuration: {
      decision_threshold: 0.88,
      response_time_limit: 1000,
      analysis_depth: "realtime"
    },
    performance_metrics: {
      tasks_completed: 280,
      success_rate: 0.94,
      avg_response_time: 500
    },
    memory_allocation: {
      total: 4096,
      used: 3072,
      reserved: 512
    },
    specializations: ["performance_optimization", "resource_management", "bottleneck_detection"],
    current_tasks: [
      { id: 5, type: "performance_monitoring", status: "active", priority: "high" }
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
    ],
    configuration: {
      decision_threshold: 0.85,
      response_time_limit: 3000,
      integration_mode: "async"
    },
    performance_metrics: {
      tasks_completed: 180,
      success_rate: 0.89,
      avg_response_time: 1500
    },
    memory_allocation: {
      total: 2048,
      used: 1536,
      reserved: 256
    },
    specializations: ["api_integration", "protocol_design", "data_transformation"],
    current_tasks: [
      { id: 6, type: "api_optimization", status: "pending", priority: "medium" }
    ]
  }
];
