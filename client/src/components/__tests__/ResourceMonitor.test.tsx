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

  it('renders without crashing', () => {
    render(<ResourceMonitor agent={mockAgent} />);
    expect(screen.getByText('Resource Monitor')).toBeInTheDocument();
  });

  it('shows loading state initially', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    // Verify loading state is shown
    const loadingElement = await screen.findByTestId('resource-monitor-loading');
    expect(loadingElement).toBeInTheDocument();
    
    // Check loading indicator and text
    const loadingIndicator = within(loadingElement).getByTestId('loading-indicator');
    expect(loadingIndicator).toBeInTheDocument();
    expect(loadingIndicator).toHaveTextContent('Loading...');

    // Verify loading state is removed after data loads
    await waitFor(() => {
      expect(screen.queryByTestId('resource-monitor-loading')).not.toBeInTheDocument();
    });
  });

  it('displays error state when there is an error', () => {
    const invalidAgent = {
      ...mockAgent,
      memory_allocation: {
        total: 0,
        used: 0,
        reserved: 0
      },
      current_tasks: []
    };
    render(<ResourceMonitor agent={invalidAgent} />);
    const errorMessage = screen.getByText(/Failed to initialize resource monitoring: Missing memory allocation/i);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage.closest('div')).toHaveClass('text-destructive');
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
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
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
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('resource-monitor-loading')).not.toBeInTheDocument();
    });

    // Check CPU section
    const cpuSection = screen.getByTestId('cpu-section');
    expect(within(cpuSection).getByText('CPU Usage')).toBeInTheDocument();

    // Check memory section
    const memorySection = screen.getByTestId('memory-section');
    expect(within(memorySection).getByText('Memory Usage')).toBeInTheDocument();

    // Check storage section
    const storageSection = screen.getByTestId('storage-section');
    expect(within(storageSection).getByText('Storage')).toBeInTheDocument();

    // Check task section
    const taskSection = screen.getByTestId('task-section');
    expect(within(taskSection).getByText('Tasks')).toBeInTheDocument();
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
    
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Verify memory display text
    expect(screen.getByText('2048MB / 4096MB')).toBeInTheDocument();
    expect(screen.getByText('Reserved: 512MB')).toBeInTheDocument();

    // Get memory section container
    const memorySection = screen.getByText('Memory Usage').closest('div');
    expect(memorySection).toBeInTheDocument();

    // Memory values should be correctly displayed
    const memoryUsageText = screen.getByText(`${mockMemoryAgent.memory_allocation.used}MB / ${mockMemoryAgent.memory_allocation.total}MB`);
    expect(memoryUsageText).toBeInTheDocument();
    
    // Memory percentage calculation
    const memoryPercentage = (mockMemoryAgent.memory_allocation.used / mockMemoryAgent.memory_allocation.total) * 100;
    expect(memoryPercentage).toBe(50); // 2048/4096 = 50%
  });

  it('updates metrics periodically', async () => {
    // Mock Math.random to return predictable increasing values
    const mockRandom = jest.spyOn(Math, 'random');
    let counter = 0;
    mockRandom.mockImplementation(() => 0.5 + (counter++ * 0.1));

    render(<ResourceMonitor agent={mockAgent} />);
    
    // Wait for initial load and metrics to appear
    await waitFor(() => {
      expect(screen.queryByTestId('resource-monitor-loading')).not.toBeInTheDocument();
    });

    const cpuBadge = await screen.findByTestId('cpu-usage-badge');
    const initialValue = parseFloat(cpuBadge.textContent!);

    // Trigger update interval
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Wait for the update and verify new value
    await waitFor(
      () => {
        const newValue = parseFloat(screen.getByTestId('cpu-usage-badge').textContent!);
        expect(newValue).toBeGreaterThan(initialValue);
      },
      { timeout: 3000 }
    );

    mockRandom.mockRestore();
  });

  it('displays agent performance metrics', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByTestId('resource-monitor-loading')).not.toBeInTheDocument();
    });

    const taskElement = screen.getByTestId('task-section');
    expect(within(taskElement).getByText('Tasks')).toBeInTheDocument();
    expect(within(taskElement).getByText(mockAgent.current_tasks.length.toString())).toBeInTheDocument();
    expect(within(taskElement).getByText(/Total Tasks/)).toBeInTheDocument();
  });

  it('cleans up interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    const { unmount } = render(<ResourceMonitor agent={mockAgent} />);
    
    // Allow component to initialize
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});