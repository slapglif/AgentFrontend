import { render, screen, act, waitFor, within } from '@testing-library/react';
import { ResourceMonitor } from '../ResourceMonitor';
import { DEFAULT_AGENTS } from '@/lib/agents';

describe('ResourceMonitor', () => {
  const mockAgent = {
    ...DEFAULT_AGENTS[0],
    memory_allocation: {
      total: 1024,
      used: 512,
      reserved: 128
    },
    current_tasks: [
      { id: 1, type: "research", status: "active", priority: "high" }
    ],
    performance_metrics: {
      tasks_completed: 100,
      success_rate: 0.95,
      avg_response_time: 1000
    }
  };

  const setupMocks = () => {
    jest.useFakeTimers();
    // Mock Math.random for consistent test values
    const mockRandom = jest.spyOn(Math, 'random');
    mockRandom.mockImplementation(() => 0.5);
    
    return {
      cleanup: () => {
        jest.clearAllTimers();
        jest.useRealTimers();
        mockRandom.mockRestore();
        jest.clearAllMocks();
      }
    };
  };

  beforeEach(() => {
    const mocks = setupMocks();
    return () => mocks.cleanup();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('renders without crashing', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    await waitFor(() => {
      expect(screen.getByText('Resource Monitor')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    // Verify loading state is shown
    expect(screen.getByTestId('resource-monitor-loading')).toBeInTheDocument();
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByTestId('resource-monitor-loading')).not.toBeInTheDocument();
    });
  });

  it('displays error state when there is an error', async () => {
    const invalidAgent = {
      ...mockAgent,
      memory_allocation: { total: 0, used: 0, reserved: 0 }
    };
    render(<ResourceMonitor agent={invalidAgent} />);
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByTestId('resource-monitor-error')).toBeInTheDocument();
      expect(screen.getByText(/Failed to initialize resource monitoring/)).toBeInTheDocument();
    });
  });

  it('tracks real-time memory allocation changes', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('resource-monitor-loading')).not.toBeInTheDocument();
    });

    // Check memory usage section
    const memorySection = screen.getByTestId('memory-section');
    expect(memorySection).toBeInTheDocument();
    
    // Verify memory values are displayed correctly
    expect(screen.getByText(`${mockAgent.memory_allocation.used}MB / ${mockAgent.memory_allocation.total}MB`)).toBeInTheDocument();
    expect(screen.getByTestId('memory-progress')).toBeInTheDocument();
    
    // Verify reserved memory is displayed
    expect(screen.getByTestId('reserved-memory')).toHaveTextContent(
      `Reserved: ${mockAgent.memory_allocation.reserved}MB`
    );
  });

  it('simulates CPU usage correctly', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('resource-monitor-loading')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/CPU Usage/)).toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars.length).toBeGreaterThan(0);
  });

  it('monitors task queue status', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('resource-monitor-loading')).not.toBeInTheDocument();
    });

    const taskSection = screen.getByTestId('task-section');
    expect(taskSection).toBeInTheDocument();
    expect(within(taskSection).getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText(mockAgent.current_tasks.length.toString())).toBeInTheDocument();
  });

  it('displays resource metrics correctly', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('resource-monitor-loading')).not.toBeInTheDocument();
    });

    // Check all sections
    const cpuSection = screen.getByTestId('cpu-section');
    expect(within(cpuSection).getByText('CPU Usage')).toBeInTheDocument();

    const memorySection = screen.getByTestId('memory-section');
    expect(within(memorySection).getByText('Memory Usage')).toBeInTheDocument();

    const storageSection = screen.getByTestId('storage-section');
    expect(within(storageSection).getByText('Storage')).toBeInTheDocument();

    const taskSection = screen.getByTestId('task-section');
    expect(within(taskSection).getByText('Tasks')).toBeInTheDocument();
  });

  it('updates metrics in real-time', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.queryByTestId('resource-monitor-loading')).not.toBeInTheDocument();
    });

    // Get initial value
    const initialValue = parseFloat(screen.getByTestId('cpu-usage-badge').textContent!);

    // Advance time to trigger multiple updates
    act(() => {
      jest.advanceTimersByTime(4000); // Wait for 2 update cycles
    });

    // Wait for the update and verify
    await waitFor(() => {
      const updatedValue = parseFloat(screen.getByTestId('cpu-usage-badge').textContent!);
      expect(updatedValue).toBeGreaterThan(initialValue);
    });
  });

  it('cleans up interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    const { unmount } = render(<ResourceMonitor agent={mockAgent} />);
    
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});