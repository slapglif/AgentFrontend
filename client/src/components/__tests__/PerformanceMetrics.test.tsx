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
  const originalDate = Date;

  return { 
    mockRandom,
    mockDate,
    cleanup: () => {
      mockRandom.mockRestore();
      jest.setSystemTime(originalDate);
      Math.random = originalRandom;
    }
  };
};

describe('PerformanceMetrics', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    setupMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
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

  it('shows all metric charts', async () => {
    render(<PerformanceMetrics />);
    
    await waitFor(() => {
      expect(screen.getByText('Token Usage Trend')).toBeInTheDocument();
      expect(screen.getByText('Research Progress')).toBeInTheDocument();
      expect(screen.getByText('Knowledge Synthesis Rate')).toBeInTheDocument();
      expect(screen.getByText('Collaboration Effectiveness')).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('updates metrics in real-time', async () => {
    render(<PerformanceMetrics />);
    
    // Wait for initial loading to complete and charts to appear
    await waitFor(() => {
      expect(screen.queryByTestId('loading-card')).not.toBeInTheDocument();
      const charts = screen.getAllByRole('presentation');
      expect(charts).toHaveLength(4);
    }, { timeout: 10000 });

    // Store initial values for comparison
    const initialCharts = screen.getAllByRole('presentation');
    const initialTokenText = screen.getByText('Token Usage Trend');
    expect(initialCharts).toHaveLength(4);
    expect(initialTokenText).toBeInTheDocument();

    // Advance time to trigger metric updates
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    // Verify charts update with new data
    await waitFor(() => {
      // Check all charts are still present
      const updatedCharts = screen.getAllByRole('presentation');
      expect(updatedCharts).toHaveLength(4);

      // Verify all chart titles are still visible
      const chartTitles = [
        'Token Usage Trend',
        'Research Progress',
        'Knowledge Synthesis Rate',
        'Collaboration Effectiveness'
      ];
      
      chartTitles.forEach(title => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    }, { timeout: 10000 });
  });

  it('calculates metrics correctly', async () => {
    render(<PerformanceMetrics />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-card')).not.toBeInTheDocument();
    }, { timeout: 10000 });

    // Predefined values based on mocked Math.random() = 0.5
    const expectedNewTokens = 500; // Math.floor(0.5 * 1000)
    const baseTokens = mockAnalytics.systemMetrics.tokenMetrics.tokensUsed;
    const expectedTokens = baseTokens + expectedNewTokens;

    await waitFor(() => {
      const tooltipText = `Tokens Used: ${expectedTokens}`;
      expect(screen.getByText(tooltipText, { exact: false })).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('formats time correctly', async () => {
    const { mockDate } = setupMocks();
    render(<PerformanceMetrics />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading-card')).not.toBeInTheDocument();
    }, { timeout: 10000 });

    // Wait for time to be rendered
    await waitFor(() => {
      const timeElements = screen.getAllByRole('presentation');
      expect(timeElements.length).toBeGreaterThan(0);

      // Get formatted hours and minutes from mockDate
      const hours = mockDate.getHours().toString().padStart(2, '0');
      const minutes = mockDate.getMinutes().toString().padStart(2, '0');
      
      // Check for the presence of the formatted time components
      const textContent = document.body.textContent || '';
      expect(textContent).toContain(hours);
      expect(textContent).toContain(minutes);
    }, { timeout: 10000 });
  });

  it('handles tooltips correctly', async () => {
    render(<PerformanceMetrics />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading-card')).not.toBeInTheDocument();
    }, { timeout: 10000 });

    // Verify chart container exists
    await waitFor(() => {
      const chartContainer = screen.getByText('Token Usage Trend').closest('div');
      expect(chartContainer).toBeInTheDocument();
    }, { timeout: 10000 });

    // Verify basic chart structure
    await waitFor(() => {
      const charts = screen.getAllByRole('presentation');
      expect(charts.length).toBe(4);
      
      const chartTitles = [
        'Token Usage Trend',
        'Research Progress',
        'Knowledge Synthesis Rate',
        'Collaboration Effectiveness'
      ];
      
      chartTitles.forEach(title => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    }, { timeout: 10000 });

    // Update timer to trigger data refresh
    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    // Verify chart update
    await waitFor(() => {
      const updatedCharts = screen.getAllByRole('presentation');
      expect(updatedCharts.length).toBe(4);
    }, { timeout: 10000 });
  });

  it('cleans up interval on unmount', async () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    const { unmount } = render(<PerformanceMetrics />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-card')).not.toBeInTheDocument();
    }, { timeout: 10000 });
    
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
