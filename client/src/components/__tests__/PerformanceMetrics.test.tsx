import { render, screen, act, waitFor } from '@testing-library/react';
import { PerformanceMetrics } from '../PerformanceMetrics';
import { mockAnalytics } from '@/lib/mockAnalytics';

const setupMocks = () => {
  // Mock random for consistent values
  const mockRandom = jest.spyOn(Math, 'random');
  mockRandom.mockImplementation(() => 0.5);

  // Mock date for consistent timestamps
  const mockDate = new Date('2024-01-01T12:00:00Z');
  jest.setSystemTime(mockDate);

  // Store originals for cleanup
  const originalRandom = Math.random;

  return { 
    mockRandom,
    mockDate,
    cleanup: () => {
      mockRandom.mockRestore();
      jest.useRealTimers();
      Math.random = originalRandom;
      jest.clearAllMocks();
    }
  };
};

describe('PerformanceMetrics', () => {
  let mocks: ReturnType<typeof setupMocks>;
  
  beforeEach(() => {
    jest.useFakeTimers();
    mocks = setupMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
    mocks.cleanup();
  });

  it('renders without crashing', () => {
    render(<PerformanceMetrics />);
    expect(screen.getByText('Token Usage Trend')).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    render(<PerformanceMetrics />);
    const loadingElements = screen.getAllByTestId('loading-card');
    expect(loadingElements).toHaveLength(4);
  });

  it('shows all metric charts', () => {
    render(<PerformanceMetrics />);
    
    // Handle initial loading state
    expect(screen.getAllByTestId('loading-card')).toHaveLength(4);
    
    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    // Verify all charts are rendered
    expect(screen.getByText('Token Usage Trend')).toBeInTheDocument();
    expect(screen.getByText('Knowledge Synthesis Rate')).toBeInTheDocument();
    expect(screen.getByText('Research Progress')).toBeInTheDocument();
    expect(screen.getByText('Collaboration Effectiveness')).toBeInTheDocument();
  });

  it('updates metrics in real-time', () => {
    const { mockRandom } = setupMocks();
    
    render(<PerformanceMetrics />);
    
    // Fast-forward initial load
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Verify initial state
    const chartTitles = [
      'Token Usage Trend',
      'Research Progress',
      'Knowledge Synthesis Rate',
      'Collaboration Effectiveness'
    ];
    
    chartTitles.forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    // Predefined values based on mocked Math.random() = 0.5
    const expectedNewTokens = 500; // Math.floor(0.5 * 1000)
    const baseTokens = mockAnalytics.systemMetrics.tokenMetrics.tokensUsed;
    const expectedTokens = baseTokens + expectedNewTokens;
    
    // Simulate data update
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Verify updated state
    const tooltipText = `Tokens Used: ${expectedTokens}`;
    expect(screen.getByText(tooltipText, { exact: false })).toBeInTheDocument();

    // Cleanup mocks
    mockRandom.mockRestore();
  });

  it('calculates metrics correctly', () => {
    render(<PerformanceMetrics />);
    
    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Predefined values based on mocked Math.random() = 0.5
    const expectedNewTokens = 500;
    const baseTokens = mockAnalytics.systemMetrics.tokenMetrics.tokensUsed;
    const expectedTokens = baseTokens + expectedNewTokens;

    const tooltipText = `Tokens Used: ${expectedTokens}`;
    expect(screen.getByText(tooltipText, { exact: false })).toBeInTheDocument();
  });

  it('formats time correctly', () => {
    const mockDate = new Date('2024-12-10T12:00:00Z');
    jest.setSystemTime(mockDate);
    
    render(<PerformanceMetrics />);
    
    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    // Format expected time
    const hours = '12';
    const minutes = '00';
    const timeText = `${hours}:${minutes}`;
    expect(screen.getByText(new RegExp(timeText))).toBeInTheDocument();
  });

  it('handles tooltips correctly', () => {
    render(<PerformanceMetrics />);
    
    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Verify all chart titles and containers
    const chartTitles = [
      'Token Usage Trend',
      'Research Progress',
      'Knowledge Synthesis Rate',
      'Collaboration Effectiveness'
    ];
    
    chartTitles.forEach(title => {
      const container = screen.getByText(title).closest('div');
      expect(container).toBeInTheDocument();
      expect(container).toHaveAttribute('role', 'presentation');
    });

    // Verify tooltips
    const tooltipText = `Tokens Used: ${mockAnalytics.systemMetrics.tokenMetrics.tokensUsed}`;
    expect(screen.getByText(tooltipText, { exact: false })).toBeInTheDocument();

    // Simulate data update
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Verify charts are updated
    const charts = screen.getAllByRole('presentation');
    expect(charts).toHaveLength(4);
  });

  it('cleans up interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    const { unmount } = render(<PerformanceMetrics />);
    
    // Fast-forward initial load
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    // Verify cleanup
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();

    // Cleanup
    clearIntervalSpy.mockRestore();
  });
});
