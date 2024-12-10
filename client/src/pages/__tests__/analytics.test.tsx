import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Analytics from '../Analytics';
import { mockAnalytics } from '@/lib/mockAnalytics';

describe('Analytics Page', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    const mockDate = new Date('2024-12-10T12:00:00Z');
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('renders analytics dashboard title and initial state', () => {
    render(<Analytics />);
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
  });

  it('renders all tab navigation options', () => {
    render(<Analytics />);
    const tabs = ['Overview', 'Behavior Patterns', 'Real-time'];
    tabs.forEach(tab => {
      expect(screen.getByRole('tab', { name: tab })).toBeInTheDocument();
    });
  });

  it('displays research metrics with correct calculations', async () => {
    render(<Analytics />);
    await waitFor(() => {
      // Check goals progress
      const goalsProgress = `${mockAnalytics.systemMetrics.researchMetrics.goalsCompleted} / ${mockAnalytics.systemMetrics.researchMetrics.totalGoals}`;
      expect(screen.getByText(goalsProgress)).toBeInTheDocument();
      
      // Check progress percentage
      const progressPercentage = Math.round((mockAnalytics.systemMetrics.researchMetrics.goalsCompleted / mockAnalytics.systemMetrics.researchMetrics.totalGoals) * 100);
      expect(screen.getByText(`${progressPercentage}%`)).toBeInTheDocument();
      
      // Verify knowledge nodes
      expect(screen.getByText(mockAnalytics.systemMetrics.researchMetrics.knowledgeNodes.toString())).toBeInTheDocument();
    });
  });

  it('displays agent performance metrics with correct calculations', async () => {
    render(<Analytics />);
    await waitFor(() => {
      mockAnalytics.agentPerformance.forEach(agent => {
        // Basic agent info
        expect(screen.getByText(agent.agent)).toBeInTheDocument();
        expect(screen.getByText(`Level ${agent.level}`)).toBeInTheDocument();
        
        // Performance metrics
        const researchImpact = `${agent.taskComplexity}%`;
        const collaborationScore = `${agent.collaborationScore}%`;
        expect(screen.getByText(researchImpact)).toBeInTheDocument();
        expect(screen.getByText(collaborationScore)).toBeInTheDocument();
      });
    });
  });

  it('displays knowledge synthesis with correct timeline', async () => {
    render(<Analytics />);
    await waitFor(() => {
      mockAnalytics.collaborationStats.forEach(stat => {
        // Date and basic info
        expect(screen.getByText(stat.date)).toBeInTheDocument();
        expect(screen.getByText(`Active Tasks: ${stat.activeResearchTasks}`)).toBeInTheDocument();
        
        // Detailed metrics
        expect(screen.getByText(`Knowledge Gen: ${stat.knowledgeGenerationRate}%`)).toBeInTheDocument();
        expect(screen.getByText(`Synthesis: ${stat.knowledgeSynthesis}%`)).toBeInTheDocument();
        expect(screen.getByText(`Research: ${stat.researchProgress}%`)).toBeInTheDocument();
      });
    });
  });

  it('handles tab switching with correct content rendering', async () => {
    render(<Analytics />);
    const user = userEvent.setup();

    // Initial state
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');

    // Switch to Behavior Patterns
    await user.click(screen.getByRole('tab', { name: 'Behavior Patterns' }));
    expect(screen.getByRole('tab', { name: 'Behavior Patterns' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Agent Behavior Analysis')).toBeInTheDocument();

    // Switch to Real-time
    await user.click(screen.getByRole('tab', { name: 'Real-time' }));
    expect(screen.getByRole('tab', { name: 'Real-time' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Token Usage Trend')).toBeInTheDocument();

    // Switch back to Overview
    await user.click(screen.getByRole('tab', { name: 'Overview' }));
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Research Metrics')).toBeInTheDocument();
  });

  it('handles error states gracefully using ErrorBoundary', async () => {
    // Mock a component error
    console.error = jest.fn();
    const ThrowError = () => { throw new Error('Test error'); };
    
    console.error = jest.fn();
    render(
      <div>
        <Analytics />
        <ThrowError />
      </div>
    );

    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    });
  });

  it('updates real-time metrics periodically', async () => {
    const user = userEvent.setup();
    render(<Analytics />);
    await user.click(screen.getByRole('tab', { name: 'Real-time' }));
    
    // Initial state
    expect(screen.getByText('Token Usage Trend')).toBeInTheDocument();
    
    // Advance timers to trigger updates
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });
    
    // Verify charts are updated
    const charts = screen.getAllByRole('presentation');
    expect(charts).toHaveLength(4);
    
    // Verify specific metrics are displayed
    expect(screen.getByText('Research Progress')).toBeInTheDocument();
    expect(screen.getByText('Knowledge Synthesis Rate')).toBeInTheDocument();
    expect(screen.getByText('Collaboration Effectiveness')).toBeInTheDocument();
  });

  it('displays correct research metrics calculations', async () => {
    render(<Analytics />);
    
    const completedGoals = mockAnalytics.systemMetrics.researchMetrics.goalsCompleted;
    const totalGoals = mockAnalytics.systemMetrics.researchMetrics.totalGoals;
    const progressPercentage = Math.round((completedGoals / totalGoals) * 100);
    
    expect(screen.getByText(`${completedGoals} / ${totalGoals}`)).toBeInTheDocument();
    expect(screen.getByText(`${progressPercentage}%`)).toBeInTheDocument();
  });

  it('renders agent performance metrics correctly', async () => {
    render(<Analytics />);
    
    mockAnalytics.agentPerformance.forEach(agent => {
      expect(screen.getByText(agent.agent)).toBeInTheDocument();
      expect(screen.getByText(`Level ${agent.level}`)).toBeInTheDocument();
      
      // Verify research impact and collaboration scores
      expect(screen.getByText(`${agent.taskComplexity}%`)).toBeInTheDocument();
      expect(screen.getByText(`${agent.collaborationScore}%`)).toBeInTheDocument();
    });
  });
});
