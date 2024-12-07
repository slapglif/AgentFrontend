import type { Memory } from "@db/schema";

export const DEFAULT_MEMORIES: Partial<Memory>[] = [
  {
    id: 1,
    agentId: 2,
    type: "infrastructure",
    content: {
      text: "Deploying microservices infrastructure with Kubernetes",
      code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: research-system
  namespace: ai-agents
spec:
  replicas: 3
  selector:
    matchLabels:
      app: research-system
  template:
    metadata:
      labels:
        app: research-system
    spec:
      containers:
      - name: research-api
        image: research-system:latest
        resources:
          limits:
            cpu: "1"
            memory: "2Gi"
        readinessProbe:
          httpGet:
            path: /health
            port: 8080`,
      language: "yaml"
    },
    timestamp: new Date(Date.now() - 3600000),
    confidence: 95,
    metadata: {
      deployment_type: "kubernetes",
      services_deployed: ["research-api", "agent-orchestrator", "memory-store"],
      resource_utilization: {
        cpu_usage: "65%",
        memory_usage: "1.2GB",
        network_io: "150MB/s"
      },
      deployment_duration: "245s"
    }
  },
  {
    id: 2,
    agentId: 3,
    type: "security",
    content: {
      text: "Security vulnerability scan results and remediation",
      code: `async function performSecurityAudit(config: SecurityConfig): Promise<AuditResult> {
  const vulnerabilities = await scanSystem({
    endpoints: config.endpoints,
    authentication: config.authMethods,
    dataEncryption: config.encryptionConfig
  });

  const criticalIssues = vulnerabilities.filter(v => v.severity === 'CRITICAL');
  
  await Promise.all(criticalIssues.map(async issue => {
    await applySecurityPatch({
      issueId: issue.id,
      patch: generatePatch(issue),
      rollbackPlan: createRollbackStrategy(issue)
    });
    await verifyPatch(issue.id);
  }));

  return {
    totalIssues: vulnerabilities.length,
    criticalIssues: criticalIssues.length,
    patchedIssues: criticalIssues.length,
    remainingIssues: vulnerabilities.length - criticalIssues.length
  };
}`,
      language: "typescript"
    },
    timestamp: new Date(Date.now() - 7200000),
    confidence: 92,
    metadata: {
      scan_duration: "1856s",
      vulnerabilities_found: 23,
      critical_issues: 3,
      patched_issues: 3,
      affected_components: ["api-gateway", "auth-service", "data-store"],
      cve_references: ["CVE-2023-1234", "CVE-2023-5678"]
    }
  },
  {
    id: 3,
    agentId: 4,
    type: "testing",
    content: {
      text: "Integration testing suite for agent communication system",
      code: `import pytest
from typing import List, Dict
from unittest.mock import patch
from agents.communication import AgentCommunicationSystem
from agents.models import Message, Agent

class TestAgentCommunication:
    @pytest.fixture
    def comm_system(self):
        return AgentCommunicationSystem(
            config={"retry_attempts": 3, "timeout": 30}
        )
    
    @pytest.mark.asyncio
    async def test_message_broadcast(
        self,
        comm_system: AgentCommunicationSystem,
        agents: List[Agent]
    ):
        test_message = Message(
            content="Test broadcast",
            priority="HIGH",
            recipients=["all"]
        )
        
        with patch('agents.metrics.MetricsCollector') as mock_metrics:
            result = await comm_system.broadcast_message(
                message=test_message,
                agents=agents
            )
            
            assert result.delivery_status == "SUCCESS"
            assert result.received_by == len(agents)
            assert mock_metrics.record_latency.called
            
            for agent in agents:
                assert test_message.id in agent.message_queue`,
      language: "python"
    },
    timestamp: new Date(Date.now() - 1800000),
    confidence: 96,
    metadata: {
      test_suite: "integration_tests",
      total_tests: 156,
      passed_tests: 153,
      failed_tests: 3,
      skipped_tests: 0,
      coverage: {
        statements: "94%",
        branches: "89%",
        functions: "92%",
        lines: "94%"
      },
      execution_time: "45.3s"
    }
  },
  {
    id: 4,
    agentId: 5,
    type: "performance",
    content: {
      text: "Performance optimization of agent memory retrieval system",
      code: `class MemoryIndexOptimizer:
    def __init__(self, config: Dict[str, Any]):
        self.vector_store = VectorStore(
            dimension=config["embedding_dim"],
            metric="cosine",
            index_type="HNSW"
        )
        self.cache = LRUCache(
            maxsize=config["cache_size"],
            ttl=config["cache_ttl"]
        )
    
    async def optimize_memory_access(
        self,
        query_patterns: List[QueryPattern],
        access_logs: List[AccessLog]
    ) -> OptimizationResult:
        # Analyze query patterns
        hot_queries = self.identify_hot_queries(query_patterns)
        
        # Build optimized index
        index_config = self.generate_index_config(hot_queries)
        await self.vector_store.reindex(config=index_config)
        
        # Optimize cache
        cache_config = self.optimize_cache_config(access_logs)
        self.cache.reconfigure(cache_config)
        
        return OptimizationResult(
            index_improvements=self.measure_index_performance(),
            cache_hit_rate=self.measure_cache_performance(),
            latency_reduction=self.calculate_latency_improvement()
        )`,
      language: "python"
    },
    timestamp: new Date(Date.now() - 900000),
    confidence: 88,
    metadata: {
      optimization_metrics: {
        before: {
          avg_query_time: "150ms",
          cache_hit_rate: "65%",
          memory_usage: "2.1GB"
        },
        after: {
          avg_query_time: "45ms",
          cache_hit_rate: "89%",
          memory_usage: "1.8GB"
        }
      },
      optimization_scope: ["vector_store", "cache_layer", "query_planner"],
      affected_components: ["memory_service", "query_optimizer", "cache_manager"]
    }
  },
  {
    id: 5,
    agentId: 6,
    type: "integration",
    content: {
      text: "Implementation of GraphQL API for agent interaction",
      code: `import { 
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt
} from 'graphql';
import { Agent, Memory, Message } from '@/types';
import { agentService, memoryService } from '@/services';

const AgentType = new GraphQLObjectType({
  name: 'Agent',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    capabilities: { type: new GraphQLList(GraphQLString) },
    memories: {
      type: new GraphQLList(MemoryType),
      resolve: (agent) => memoryService.getAgentMemories(agent.id)
    },
    performance: {
      type: PerformanceMetricsType,
      resolve: (agent) => agentService.getPerformanceMetrics(agent.id)
    }
  })
});

const MemoryType = new GraphQLObjectType({
  name: 'Memory',
  fields: () => ({
    id: { type: GraphQLString },
    content: { type: GraphQLString },
    type: { type: GraphQLString },
    confidence: { type: GraphQLInt },
    metadata: { type: GraphQLString }
  })
});

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      agent: {
        type: AgentType,
        args: { id: { type: GraphQLString } },
        resolve: (_, { id }) => agentService.getAgent(id)
      },
      agents: {
        type: new GraphQLList(AgentType),
        resolve: () => agentService.getAllAgents()
      }
    }
  })
});`,
      language: "typescript"
    },
    timestamp: new Date(Date.now() - 300000),
    confidence: 90,
    metadata: {
      api_version: "v1",
      endpoints: {
        queries: ["agent", "agents", "memories", "messages"],
        mutations: ["createAgent", "updateAgent", "sendMessage"]
      },
      performance_metrics: {
        avg_response_time: "75ms",
        requests_per_second: 150,
        error_rate: "0.1%"
      },
      documentation: {
        schema_url: "/graphql/schema",
        playground_url: "/graphql/playground"
      }
    }
  }
];
