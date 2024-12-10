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
    expect(screen.getByText('Research Pattern Analysis')).toBeInTheDocument();
    expect(screen.getByText('Knowledge Graph Growth')).toBeInTheDocument();
    expect(screen.getByText('Research Milestone Completion')).toBeInTheDocument();
  });

  it('calculates behavior scores correctly', () => {
    render(<AgentBehaviorPatterns />);
    
    mockAnalytics.agentPerformance.forEach((agent) => {
      // Calculate expected scores
      const researchDepth = Math.round((agent.researchContributions * agent.taskComplexity) / 200);
      const learningEfficiency = Math.round((agent.xp / agent.researchContributions) * 10);
      const collaborationImpact = Math.round(agent.collaborationScore);
      
      // Verify scores are displayed
      expect(screen.getByText(`${researchDepth}%`)).toBeInTheDocument();
      expect(screen.getByText(`${learningEfficiency}%`)).toBeInTheDocument();
      expect(screen.getByText(`${collaborationImpact}%`)).toBeInTheDocument();
    });
  });

  it('displays agent specialization information', () => {
    render(<AgentBehaviorPatterns />);
    expect(screen.getByText('Agent Specialization')).toBeInTheDocument();
    mockAnalytics.agentPerformance.forEach((agent) => {
      const focus = agent.taskComplexity > 80 ? 'Research' : 
                   agent.collaborationScore > 80 ? 'Collaboration' : 
                   'Balanced';
      expect(screen.getByText(`Focus: ${focus}`)).toBeInTheDocument();
    });
  });

  it('shows knowledge graph timeline with correct data', () => {
    render(<AgentBehaviorPatterns />);
    expect(screen.getByText('7 days ago')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    
    // Verify knowledge synthesis data points
    const graphs = screen.getAllByTestId('knowledge-graph');
    mockAnalytics.realtimeMetrics.knowledgeSynthesis.slice(-7).forEach((value, index) => {
      expect(graphs[index]).toBeInTheDocument();
      const height = graphs[index].style.height;
      const heightStyle = window.getComputedStyle(graphs[index]).height;
      const actualHeight = parseInt(heightStyle) || graphs[index].style.height.replace('%', '');
      const expectedHeight = value;
      expect(Math.abs(actualHeight - expectedHeight)).toBeLessThanOrEqual(1);
    });
  });

  it('displays research milestone completion data', () => {
    render(<AgentBehaviorPatterns />);
    
    mockAnalytics.collaborationStats.forEach((stat) => {
      expect(screen.getByText(stat.date)).toBeInTheDocument();
      // Find progress text using a more flexible approach
      expect(
        screen.getByText((content) => {
          return content.includes(`${stat.researchProgress}%`) && content.includes('Progress');
        })
      ).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes(`${stat.activeResearchTasks}`))).toBeInTheDocument();
    });
  });

  it('shows progress bars for all metrics', () => {
    render(<AgentBehaviorPatterns />);
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars.length).toBeGreaterThan(0);
    
    // Verify each progress bar has correct value
    progressBars.forEach(bar => {
      expect(bar).toHaveAttribute('value');
      const value = parseInt(bar.getAttribute('value') || '0');
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    });
  });
});
