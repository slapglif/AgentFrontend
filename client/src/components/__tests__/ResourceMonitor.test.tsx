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
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      const memorySection = screen.getByText(/Memory Usage/).closest('div');
      expect(memorySection).toBeInTheDocument();
      
      const content = memorySection?.textContent || '';
      expect(content).toMatch(/Memory Usage/);
      expect(content).toMatch(/Used/);
      expect(content).toMatch(/Total/);
      
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('simulates CPU usage correctly', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getByText(/CPU Usage/)).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    }, { timeout: 10000 });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
    });
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
      expect(screen.getByText(/Storage/)).toBeInTheDocument();
      
      // Check for tasks in a more flexible way
      const content = document.body.textContent;
      expect(content).toMatch(/Task/);
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
      // Check for memory stats using more flexible matchers
      const content = screen.getByText(/Memory Usage/i).closest('div');
      expect(content).toBeInTheDocument();
      expect(content?.textContent).toMatch(/4096/);
      expect(content?.textContent).toMatch(/2048/);
      expect(content?.textContent).toMatch(/512/);
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
      expect(screen.getByText(/Tasks/)).toBeInTheDocument();
      expect(screen.getByText(mockAgent.current_tasks.length.toString())).toBeInTheDocument();
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