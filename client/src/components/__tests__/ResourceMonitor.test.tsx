import { render, screen, act, waitFor } from '@testing-library/react';
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

  it('shows loading state initially', () => {
    render(<ResourceMonitor agent={mockAgent} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays error state when there is an error', () => {
    const invalidAgent = {
      ...mockAgent,
      memory_allocation: undefined,
      current_tasks: undefined
    };
    render(<ResourceMonitor agent={invalidAgent} />);
    const errorMessage = screen.getByText(/Failed to initialize resource monitoring: Missing memory allocation/i);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage.closest('div')).toHaveClass('text-destructive');
  });

  it('tracks real-time memory allocation changes', () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Check memory usage section
    const memorySection = screen.getByText('Memory Usage').closest('div');
    expect(memorySection).toBeInTheDocument();
    
    // Verify memory values are displayed
    expect(screen.getByText(`${mockAgent.memory_allocation.used}MB / ${mockAgent.memory_allocation.total}MB`)).toBeInTheDocument();
    
    // Check progress bar
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars.length).toBeGreaterThan(0);
    progressBars.forEach(bar => {
      expect(bar).toBeInTheDocument();
    });
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
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Tasks/)).toBeInTheDocument();
  });

  it('displays resource metrics correctly', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/CPU Usage/)).toBeInTheDocument();
    expect(screen.getByText(/Memory Usage/)).toBeInTheDocument();
    expect(screen.getByText(/Storage/)).toBeInTheDocument();
    
    // Check for tasks in a more flexible way
    const content = document.body.textContent;
    expect(content).toMatch(/Task/);
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
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.5;
    global.Math = mockMath;

    render(<ResourceMonitor agent={mockAgent} />);
    
    // Wait for initial render and get initial values
    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    const initialProgressBars = screen.getAllByRole('progressbar');
    const initialValues = initialProgressBars.map(bar => 
      parseFloat(bar.getAttribute('aria-valuenow') || '0')
    );

    // Advance time to trigger update
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    const updatedProgressBars = screen.getAllByRole('progressbar');
    const updatedValues = updatedProgressBars.map(bar => 
      parseFloat(bar.getAttribute('aria-valuenow') || '0')
    );

    // Verify that at least one value has changed by comparing arrays
    expect(updatedValues).not.toEqual(initialValues);

    // Restore original Math
    global.Math = Object.create(global.Math);
  });

  it('displays agent performance metrics', () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.getByText(/Tasks/)).toBeInTheDocument();
    expect(screen.getByText(mockAgent.current_tasks.length.toString())).toBeInTheDocument();
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