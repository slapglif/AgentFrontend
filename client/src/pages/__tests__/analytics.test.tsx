import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Analytics from '../Analytics';
import { mockAnalytics } from '@/lib/mockAnalytics';
import { ErrorBoundary } from '@/components/ErrorBoundary';

describe('Analytics Page', () => {
  beforeAll(() => {
    // Mock window.ResizeObserver
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  beforeEach(() => {
    jest.useFakeTimers();
    const mockDate = new Date('2024-12-10T12:00:00Z');
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('renders analytics dashboard title and initial state', async () => {
    render(<Analytics />);
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
  });

  it('renders all tab navigation options', async () => {
    render(<Analytics />);
    const tabs = ['Overview', 'Behavior Patterns', 'Real-time'];
    tabs.forEach(tab => {
      expect(screen.getByRole('tab', { name: tab })).toBeInTheDocument();
    });
  });

  it('displays research metrics with correct calculations', async () => {
    render(<Analytics />);
    await waitFor(() => {
      const goalsProgress = `${mockAnalytics.systemMetrics.researchMetrics.goalsCompleted} / ${mockAnalytics.systemMetrics.researchMetrics.totalGoals}`;
      expect(screen.getByText(goalsProgress)).toBeInTheDocument();
      
      const progressPercentage = Math.round((mockAnalytics.systemMetrics.researchMetrics.goalsCompleted / mockAnalytics.systemMetrics.researchMetrics.totalGoals) * 100);
      expect(screen.getByText(`${progressPercentage}%`)).toBeInTheDocument();
      
      expect(screen.getByText(mockAnalytics.systemMetrics.researchMetrics.knowledgeNodes.toString())).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('displays agent performance metrics with correct calculations', async () => {
    render(<Analytics />);
    
    await waitFor(() => {
      mockAnalytics.agentPerformance.slice(0, 1).forEach(agent => {
        expect(screen.getByText(agent.agent)).toBeInTheDocument();
        const levelText = `Level ${agent.level}`;
        expect(screen.getAllByText(levelText)[0]).toBeInTheDocument();
        
        const researchImpact = `${agent.taskComplexity}%`;
        const collaborationScore = `${agent.collaborationScore}%`;
        expect(screen.getByText(researchImpact)).toBeInTheDocument();
        expect(screen.getByText(collaborationScore)).toBeInTheDocument();
      });
    }, { timeout: 10000 });
  });

  it('handles tab switching with correct content rendering', async () => {
    const user = userEvent.setup();
    render(<Analytics />);

    // Initial state
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    });

    // Switch to Behavior Patterns tab
    await act(async () => {
      await user.click(screen.getByRole('tab', { name: 'Behavior Patterns' }));
      jest.runOnlyPendingTimers();
    });

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Behavior Patterns' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('Agent Behavior Analysis')).toBeInTheDocument();
    });

    // Switch to Real-time tab
    await act(async () => {
      await user.click(screen.getByRole('tab', { name: 'Real-time' }));
      jest.runOnlyPendingTimers();
    });

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Real-time' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('Token Usage Trend')).toBeInTheDocument();
    });
  });

  it('handles error states gracefully', async () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };
    
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    
    consoleErrorSpy.mockRestore();
  });

  it('displays correct research metrics calculations', async () => {
    render(<Analytics />);
    
    await waitFor(() => {
      const completedGoals = mockAnalytics.systemMetrics.researchMetrics.goalsCompleted;
      const totalGoals = mockAnalytics.systemMetrics.researchMetrics.totalGoals;
      const progressPercentage = Math.round((completedGoals / totalGoals) * 100);
      
      expect(screen.getByText(`${completedGoals} / ${totalGoals}`)).toBeInTheDocument();
      expect(screen.getByText(`${progressPercentage}%`)).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('updates real-time metrics periodically', async () => {
    const user = userEvent.setup();
    render(<Analytics />);

    await act(async () => {
      await user.click(screen.getByRole('tab', { name: 'Real-time' }));
      // Run all pending timers for initial render
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.getByText('Token Usage Trend')).toBeInTheDocument();
      expect(screen.getByText('Research Progress')).toBeInTheDocument();
      expect(screen.getByText('Knowledge Synthesis Rate')).toBeInTheDocument();
      expect(screen.getByText('Collaboration Effectiveness')).toBeInTheDocument();
    });

    // Simulate metrics update cycle
    await act(async () => {
      jest.advanceTimersByTime(2000); // Advance past the update interval
      jest.runAllTimers(); // Run any pending timers from the update
    });

    // Verify charts remain present after update
    await waitFor(() => {
      expect(screen.getByTestId('token-usage-chart')).toBeInTheDocument();
      expect(screen.getByTestId('research-progress-chart')).toBeInTheDocument();
      expect(screen.getByTestId('knowledge-synthesis-chart')).toBeInTheDocument();
      expect(screen.getByTestId('collaboration-effectiveness-chart')).toBeInTheDocument();
    });
  });
});