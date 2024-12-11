import { render, screen } from '@testing-library/react';
import { AgentBehaviorPatterns } from '../AgentBehaviorPatterns';
import { mockAnalytics } from '@/lib/mockAnalytics';

describe('AgentBehaviorPatterns', () => {
  it('renders without crashing', () => {
    render(<AgentBehaviorPatterns />);
    expect(screen.getByText('Agent Behavior Analysis')).toBeInTheDocument();
  });

  it('displays behavior analysis for each agent', () => {
    render(<AgentBehaviorPatterns />);
    mockAnalytics.agentPerformance.forEach((agent) => {
      expect(screen.getByText(agent.agent)).toBeInTheDocument();
      expect(screen.getByText(`Level ${agent.level}`)).toBeInTheDocument();
      expect(screen.getByText(`XP: ${agent.xp}`)).toBeInTheDocument();
    });
  });

  it('shows research pattern analysis', () => {
    render(<AgentBehaviorPatterns />);
    ['Research Pattern Analysis', 'Knowledge Graph Growth', 'Research Milestone Completion'].forEach(text => {
      try {
        expect(screen.getByText(text)).toBeInTheDocument();
      } catch (error) {
        throw new Error(`Could not find text "${text}" in the document. Available text: ${document.body.textContent}`);
      }
    });
  });

  it('calculates behavior scores correctly', () => {
    render(<AgentBehaviorPatterns />);
    
    mockAnalytics.agentPerformance.forEach((agent) => {
      // Calculate expected scores
      const researchDepth = Math.round((agent.researchContributions * agent.taskComplexity) / 200);
      const learningEfficiency = Math.round((agent.xp / agent.researchContributions) * 10);
      const collaborationImpact = Math.round(agent.collaborationScore);
      
      // Verify scores are displayed using a more flexible text matching
      expect(screen.getByText((content) => content.includes(`${researchDepth}%`))).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes(`${learningEfficiency}%`))).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes(`${collaborationImpact}%`))).toBeInTheDocument();
    });
  });

  it('displays agent specialization information', () => {
    render(<AgentBehaviorPatterns />);
    expect(screen.getByText('Agent Specialization')).toBeInTheDocument();
    mockAnalytics.agentPerformance.forEach((agent) => {
      const focus = agent.taskComplexity > 80 ? 'Research' : 
                   agent.collaborationScore > 80 ? 'Collaboration' : 
                   'Balanced';
      // Use a more flexible approach to find the text which might be split across elements
      expect(screen.getByText((content) => content.includes(focus))).toBeInTheDocument();
    });
  });

  it('shows knowledge graph timeline with correct data', () => {
    render(<AgentBehaviorPatterns />);
    expect(screen.getByText('7 days ago')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    
    // Verify knowledge synthesis data points
    const graphs = screen.getAllByTestId('knowledge-graph');
    expect(graphs).toHaveLength(7); // Last 7 days of data

    mockAnalytics.realtimeMetrics.knowledgeSynthesis.slice(-7).forEach((value, index) => {
      const graph = graphs[index];
      expect(graph).toBeInTheDocument();
      
      // Check if height percentage matches the expected value
      const heightStyle = graph.style.height;
      const heightValue = parseFloat(heightStyle);
      expect(heightValue).toBeDefined();
      expect(typeof heightValue).toBe('number');
      // Allow for minor rounding differences
      expect(Math.abs(heightValue - value)).toBeLessThanOrEqual(1);
    });
  });

  it('displays research milestone completion data', () => {
    render(<AgentBehaviorPatterns />);
    
    mockAnalytics.collaborationStats.forEach((stat) => {
      expect(screen.getByText(stat.date)).toBeInTheDocument();
      // Look for the progress percentage
      expect(screen.getByText(`${stat.researchProgress}%`)).toBeInTheDocument();
      // Look for the tasks count
      expect(screen.getByText(stat.activeResearchTasks.toString())).toBeInTheDocument();
    });
  });

  it('shows progress bars for all metrics', () => {
    render(<AgentBehaviorPatterns />);
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars.length).toBeGreaterThan(0); // Should have at least one progress bar
    
    // Verify each progress bar has valid percentage
    progressBars.forEach(bar => {
      // Verify presence of value attribute
      expect(bar).toHaveAttribute('value');
      // Parse and validate the value
      const value = parseFloat(bar.getAttribute('value') || '0');
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    });
  });
});
