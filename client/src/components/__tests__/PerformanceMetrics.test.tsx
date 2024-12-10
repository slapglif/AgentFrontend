import { render, screen, act, waitFor } from '@testing-library/react';
import { PerformanceMetrics } from '../PerformanceMetrics';
import { mockAnalytics } from '@/lib/mockAnalytics';
import { vi } from 'vitest';

describe('PerformanceMetrics', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock Math.random to return consistent values
    vi.spyOn(Math, 'random').mockImplementation(() => 0.5);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
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
    });
  });

  it('updates metrics in real-time', async () => {
    render(<PerformanceMetrics />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-card')).not.toBeInTheDocument();
    });

    // Initial metrics
    const initialCharts = screen.getAllByRole('presentation');
    expect(initialCharts).toHaveLength(4);

    // Advance time to trigger update
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Verify charts are updated with new data points
    const updatedCharts = screen.getAllByRole('presentation');
    expect(updatedCharts).toHaveLength(4);
  });

  it('calculates metrics correctly', async () => {
    render(<PerformanceMetrics />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-card')).not.toBeInTheDocument();
    });

    // With Math.random mocked to 0.5, we can predict metric values
    const expectedNewTokens = Math.floor(0.5 * 1000);
    const baseTokens = mockAnalytics.systemMetrics.tokenMetrics.tokensUsed;
    const expectedTokens = baseTokens + expectedNewTokens;

    // Verify token usage calculation
    expect(screen.getByText(expectedTokens.toString(), { exact: false })).toBeInTheDocument();
  });

  it('formats time correctly', async () => {
    const now = new Date('2024-01-01T12:00:00');
    vi.setSystemTime(now);

    render(<PerformanceMetrics />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-card')).not.toBeInTheDocument();
    });

    // Check time formatting
    const expectedTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    expect(screen.getByText(expectedTime, { exact: false })).toBeInTheDocument();
  });

  it('handles tooltips correctly', async () => {
    render(<PerformanceMetrics />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading-card')).not.toBeInTheDocument();
    });

    const tokenChart = screen.getByText('Token Usage Trend').closest('div');
    expect(tokenChart).toBeInTheDocument();

    // Verify tooltip content structure
    const tooltipContent = screen.getByText(/Tokens Used:/, { exact: false });
    expect(tooltipContent).toBeInTheDocument();
  });

  it('cleans up interval on unmount', () => {
    const { unmount } = render(<PerformanceMetrics />);
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
