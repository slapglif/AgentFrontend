import type { Memory } from "@db/schema";

export const DEFAULT_MEMORIES: Partial<Memory>[] = [
  {
    id: 1,
    agentId: 1,
    type: "research",
    content: {
      text: "Analyzing potential neuroprotective compounds in traditional medicine",
      code: `def analyze_compounds(compounds: List[str]) -> Dict[str, float]:
    results = {}
    for compound in compounds:
        score = predict_neuroprotective_potential(compound)
        results[compound] = score
    return results`,
      language: "python"
    },
    timestamp: new Date(Date.now() - 3600000),
    confidence: 85,
    metadata: {
      sources: ["PubMed", "ChEMBL"],
      compounds_analyzed: 15
    }
  },
  {
    id: 2,
    agentId: 2,
    type: "analysis",
    content: {
      text: "Identified key protein interactions in neurodegeneration pathway",
      code: `const pathwayAnalysis = {
  primary_targets: ['BDNF', 'NGF', 'GDNF'],
  interaction_score: 0.85,
  pathway_significance: 'p < 0.001'
};`,
      language: "typescript"
    },
    timestamp: new Date(Date.now() - 7200000),
    confidence: 92,
    metadata: {
      proteins_analyzed: 50,
      significant_interactions: 12
    }
  },
  {
    id: 3,
    agentId: 3,
    type: "conclusion",
    content: {
      text: "Synthesized findings suggest compound X-123 shows promising neuroprotective properties",
      code: `// Compound X-123 Properties
{
  molecular_weight: 325.47,
  logP: 2.3,
  hydrogen_bond_donors: 2,
  hydrogen_bond_acceptors: 5,
  rotatable_bonds: 3
}`,
      language: "javascript"
    },
    timestamp: new Date(Date.now() - 1800000),
    confidence: 88,
    metadata: {
      conclusion_type: "compound_recommendation",
      supporting_evidence: 8
    }
  }
];
