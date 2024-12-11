import React from 'react';
import { render, screen } from '@testing-library/react';
import { AgentBehaviorPatterns } from '../AgentBehaviorPatterns';
import { mockAnalytics } from '@/lib/mockAnalytics';

// Mock the mockAnalytics data
jest.mock('@/lib/mockAnalytics', () => ({
  mockAnalytics: {
    agentPerformance: [
      {
        agent: 'Test Agent 1',
        level: 5,
        xp: 1000,
        researchContributions: 50,
        taskComplexity: 75,
        collaborationScore: 85
      }
    ],
    realtimeMetrics: {
      knowledgeSynthesis: [60, 65, 70, 75, 80, 85, 90]
    },
    collaborationStats: [
      {
        date: '2024-12-10',
        activeResearchTasks: 3,
        researchProgress: 75,
      }
    ]
  }
}));

describe('AgentBehaviorPatterns', () => {
  it('renders without crashing', () => {
    render(<AgentBehaviorPatterns />);
    expect(screen.getByText('Agent Behavior Analysis')).toBeInTheDocument();
  });

  it('displays behavior analysis for each agent', () => {
    render(<AgentBehaviorPatterns />);
    const agent = mockAnalytics.agentPerformance[0];
    expect(screen.getByText(agent.agent)).toBeInTheDocument();
    expect(screen.getByText(`Level ${agent.level}`)).toBeInTheDocument();
    expect(screen.getByText(`XP: ${agent.xp}`)).toBeInTheDocument();
  });

  it('shows research pattern analysis', () => {
    render(<AgentBehaviorPatterns />);
    expect(screen.getByText('Research Pattern Analysis')).toBeInTheDocument();
    expect(screen.getByText('Knowledge Graph Growth')).toBeInTheDocument();
    expect(screen.getByText('Research Milestone Completion')).toBeInTheDocument();
  });

  it('calculates behavior scores correctly', () => {
    render(<AgentBehaviorPatterns />);
    const agent = mockAnalytics.agentPerformance[0];
    
    // Calculate expected scores
    const researchDepth = Math.round((agent.researchContributions * agent.taskComplexity) / 200);
    const learningEfficiency = Math.round((agent.xp / agent.researchContributions) * 10);
    const collaborationImpact = Math.round(agent.collaborationScore);
    
    // Verify scores are displayed
    expect(screen.getByText(`${researchDepth}%`)).toBeInTheDocument();
    expect(screen.getByText(`${learningEfficiency}%`)).toBeInTheDocument();
    expect(screen.getByText(`${collaborationImpact}%`)).toBeInTheDocument();
  });

  it('displays agent specialization information', () => {
    render(<AgentBehaviorPatterns />);
    expect(screen.getByText('Agent Specialization')).toBeInTheDocument();
    
    const agent = mockAnalytics.agentPerformance[0];
    const focus = agent.taskComplexity > 80 ? 'Research' : 
                 agent.collaborationScore > 80 ? 'Collaboration' : 
                 'Balanced';
    expect(screen.getByText((content) => content.includes(focus))).toBeInTheDocument();
  });

  it('shows knowledge graph timeline', () => {
    render(<AgentBehaviorPatterns />);
    expect(screen.getByText('7 days ago')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    
    const graphs = screen.getAllByTestId('knowledge-graph');
    expect(graphs).toHaveLength(7);
  });

  it('displays research milestone completion data', () => {
    render(<AgentBehaviorPatterns />);
    const stat = mockAnalytics.collaborationStats[0];
    
    expect(screen.getByText(stat.date)).toBeInTheDocument();
    expect(screen.getByText(`${stat.researchProgress}%`)).toBeInTheDocument();
    expect(screen.getByTestId('active-tasks')).toHaveTextContent(
      `Active Tasks: ${stat.activeResearchTasks}`
    );
  });

  it('shows progress bars for all metrics', () => {
    render(<AgentBehaviorPatterns />);
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars.length).toBeGreaterThan(0);
    
    progressBars.forEach(bar => {
      expect(bar).toHaveAttribute('value');
      const value = parseFloat(bar.getAttribute('value') || '0');
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    });
  });
});
