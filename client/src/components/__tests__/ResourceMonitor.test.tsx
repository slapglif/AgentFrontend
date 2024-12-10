import { render, screen, act, waitFor } from '@testing-library/react';
import { ResourceMonitor } from '../ResourceMonitor';
import { mockAgents } from '@/lib/mockAgents';

describe('ResourceMonitor', () => {
  const mockAgent = mockAgents[0];

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
    expect(screen.queryByText(/Failed to initialize/)).toBeInTheDocument();
  });

  it('tracks real-time memory allocation changes', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    await waitFor(() => {
      const memoryUsage = screen.getByText(/Memory Usage/);
      expect(memoryUsage).toBeInTheDocument();
      const memoryValue = screen.getByText(/\d+\.\d+%/);
      expect(memoryValue).toBeInTheDocument();
    });
  });

  it('simulates CPU usage correctly', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    await waitFor(() => {
      const cpuUsage = screen.getByText(/CPU Usage/);
      expect(cpuUsage).toBeInTheDocument();
      const cpuValue = screen.getByText(/\d+\.\d+%/);
      expect(cpuValue).toBeInTheDocument();
    });
  });

  it('monitors task queue status', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    await waitFor(() => {
      // Check if task count is displayed
      expect(screen.getByText(mockAgent.current_tasks.length.toString())).toBeInTheDocument();
      // Check for task-related content
      expect(screen.getByText(/Tasks/)).toBeInTheDocument();
    });
  });

  it('displays resource metrics correctly', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Core resource metrics
    expect(screen.getByText('CPU Usage')).toBeInTheDocument();
    expect(screen.getByText('Memory Usage')).toBeInTheDocument();
    expect(screen.getByText('Storage Usage')).toBeInTheDocument();
    
    // Resource details
    expect(screen.getByText('Active Tasks')).toBeInTheDocument();
    expect(screen.getByText('Reserved Memory')).toBeInTheDocument();
  });

  it('displays memory allocation details correctly', () => {
    const mockMemoryAgent = {
      ...mockAgent,
      memory_allocation: {
        total: 4096,
        used: 2048,
        reserved: 512
      }
    };
    render(<ResourceMonitor agent={mockMemoryAgent} />);
    
    const usedMemory = screen.getByText(/2048/);
    const totalMemory = screen.getByText(/4096/);
    const reservedMemory = screen.getByText(/512/);
    
    expect(usedMemory).toBeInTheDocument();
    expect(totalMemory).toBeInTheDocument();
    expect(reservedMemory).toBeInTheDocument();
  });

  it('updates metrics periodically', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Verify metrics are updated
    expect(screen.getByText(/\d+\.\d+%/)).toBeInTheDocument();
  });

  it('displays agent performance metrics', () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    expect(screen.getByText('Active Tasks')).toBeInTheDocument();
    expect(screen.getByText(mockAgent.current_tasks.length.toString())).toBeInTheDocument();
  });

  it('handles agent research metrics display', () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    const tasksCompleted = mockAgent.performance_metrics.tasks_completed;
    const successRate = (mockAgent.performance_metrics.success_rate * 100).toFixed(1);
    
    expect(screen.getByText(tasksCompleted.toString())).toBeInTheDocument();
    expect(screen.getByText(`${successRate}%`)).toBeInTheDocument();
  });

  it('displays correct utilization colors based on thresholds', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const metrics = screen.getAllByText(/\d+\.\d+%/);
    metrics.forEach(metric => {
      const value = parseFloat(metric.textContent!);
      if (value > 80) {
        expect(metric.closest('div')?.className).toContain('text-red-500');
      } else if (value > 60) {
        expect(metric.closest('div')?.className).toContain('text-yellow-500');
      } else {
        expect(metric.closest('div')?.className).toContain('text-green-500');
      }
    });
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
    expect(screen.getByText(/Failed to initialize resource monitoring/)).toBeInTheDocument();
  });
});
