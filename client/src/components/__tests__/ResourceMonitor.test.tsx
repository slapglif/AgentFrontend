import { render, screen, act, waitFor } from '@testing-library/react';
import { ResourceMonitor } from '../ResourceMonitor';
import { DEFAULT_AGENTS } from '@/lib/agents';

describe('ResourceMonitor', () => {
  const mockAgent = DEFAULT_AGENTS[0];

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders without crashing', () => {
    render(<ResourceMonitor agent={mockAgent} />);
    expect(screen.getByText('Resource Monitor')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(<ResourceMonitor agent={mockAgent} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays error state when there is an error', () => {
    const invalidAgent = {
      ...mockAgent,
      memory_allocation: {
        total: 0,
        used: 0,
        reserved: 0
      }
    };
    render(<ResourceMonitor agent={invalidAgent} />);
    expect(screen.getByText(/Failed to initialize/)).toBeInTheDocument();
  });

  it('tracks real-time memory allocation changes', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    await waitFor(() => {
      const memoryUsage = screen.getByText(/Memory Usage/);
      expect(memoryUsage).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('simulates CPU usage correctly', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    await waitFor(() => {
      const cpuUsage = screen.getByText(/CPU Usage/);
      expect(cpuUsage).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('monitors task queue status', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Tasks/)).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('displays resource metrics correctly', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText(/CPU Usage/)).toBeInTheDocument();
      expect(screen.getByText(/Memory Usage/)).toBeInTheDocument();
      expect(screen.getByText(/Storage Usage/)).toBeInTheDocument();
      expect(screen.getByText(/Tasks/)).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('displays memory allocation details correctly', async () => {
    const mockMemoryAgent = {
      ...mockAgent,
      memory_allocation: {
        total: 4096,
        used: 2048,
        reserved: 512
      }
    };
    render(<ResourceMonitor agent={mockMemoryAgent} />);
    
    await waitFor(() => {
      expect(screen.getByText(/4096/)).toBeInTheDocument();
      expect(screen.getByText(/2048/)).toBeInTheDocument();
      expect(screen.getByText(/512/)).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('updates metrics periodically', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    }, { timeout: 10000 });

    act(() => {
      jest.advanceTimersByTime(2000);
    });
  });

  it('displays agent performance metrics', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Tasks/)).toBeInTheDocument();
      expect(screen.getByText(mockAgent.current_tasks.length.toString())).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('handles agent research metrics display', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    await waitFor(() => {
      const tasksCompleted = mockAgent.performance_metrics.tasks_completed;
      const successRate = (mockAgent.performance_metrics.success_rate * 100).toFixed(1);
      
      expect(screen.getByText(tasksCompleted.toString())).toBeInTheDocument();
      expect(screen.getByText(`${successRate}%`)).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('cleans up interval on unmount', () => {
    const { unmount } = render(<ResourceMonitor agent={mockAgent} />);
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it('handles error state gracefully', () => {
    const errorAgent = {
      ...mockAgent,
      memory_allocation: null as any
    };
    
    render(<ResourceMonitor agent={errorAgent} />);
    expect(screen.getByText(/Failed to initialize/)).toBeInTheDocument();
  });
});