import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Analytics from '../Analytics';
import { mockAnalytics } from '@/lib/mockAnalytics';
import { ErrorBoundary } from '@/components/ErrorBoundary';

describe('Analytics Page', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    const mockDate = new Date('2024-12-10T12:00:00Z');
    jest.setSystemTime(mockDate);
    // Mock window.ResizeObserver
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.restoreAllMocks();
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
    render(<Analytics />);
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    // Initial state
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');

    // Switch to Behavior Patterns
    await act(async () => {
      await user.click(screen.getByRole('tab', { name: 'Behavior Patterns' }));
      jest.advanceTimersByTime(1000);
    });
    
    expect(screen.getByRole('tab', { name: 'Behavior Patterns' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Agent Behavior Analysis')).toBeInTheDocument();

    // Switch to Real-time
    await act(async () => {
      await user.click(screen.getByRole('tab', { name: 'Real-time' }));
      jest.advanceTimersByTime(2000);
    });
    
    await waitFor(() => {
      expect(screen.getByRole('tab', { name: 'Real-time' })).toHaveAttribute('aria-selected', 'true');
    });

    await waitFor(() => {
      expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
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
    render(<Analytics />);
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    await act(async () => {
      await user.click(screen.getByRole('tab', { name: 'Real-time' }));
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
    }, { timeout: 10000 });

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.getByText('Research Progress')).toBeInTheDocument();
      expect(screen.getByText('Knowledge Generation')).toBeInTheDocument();
      expect(screen.getByText('Collaboration Impact')).toBeInTheDocument();
    }, { timeout: 10000 });
  });
});