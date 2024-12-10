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

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ResourceMonitor agent={mockAgent} />);
    expect(screen.getByText('Resource Monitor')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(<ResourceMonitor agent={mockAgent} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays error state when there is an error', async () => {
    const invalidAgent = {
      ...mockAgent,
      memory_allocation: {
        total: 0,
        used: 0,
        reserved: 0
      }
    };
    render(<ResourceMonitor agent={invalidAgent} />);
    const errorMessage = await screen.findByText(/Failed to initialize/i);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage.closest('div')).toHaveClass('bg-destructive/10');
  });

  it('tracks real-time memory allocation changes', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const memorySection = screen.getByText(/Memory Usage/).closest('div');
    expect(memorySection).toBeInTheDocument();
    
    const content = memorySection?.textContent || '';
    expect(content).toMatch(/Memory Usage/);
    expect(content).toMatch(/Used/);
    expect(content).toMatch(/Total/);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
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
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const memorySection = screen.getByText(/Memory Usage/i).closest('div');
    expect(memorySection).toBeInTheDocument();
    
    // Verify all memory values are displayed
    const values = [4096, 2048, 512];
    values.forEach(value => {
      expect(memorySection?.textContent).toContain(value.toString());
    });
    
    // Verify progress bar exists and has correct value
    const progressBar = within(memorySection as HTMLElement).getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('value', '50'); // 2048/4096 * 100
  });

  it('updates metrics periodically', async () => {
    const { container } = render(<ResourceMonitor agent={mockAgent} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Get initial state
    const initialProgressElement = container.querySelector('[role="progressbar"]');
    expect(initialProgressElement).toBeDefined();
    
    // Advance time and check for updates
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      const updatedProgressElement = container.querySelector('[role="progressbar"]');
      expect(updatedProgressElement).toBeDefined();
      expect(updatedProgressElement?.getAttribute('value')).not.toBe(initialProgressElement?.getAttribute('value'));
    });
  });

  it('displays agent performance metrics', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText(/Tasks/)).toBeInTheDocument();
      expect(screen.getByText(mockAgent.current_tasks.length.toString())).toBeInTheDocument();
    });
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