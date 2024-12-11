import { render, screen, waitFor, act } from '@testing-library/react';
import { PerformanceMetrics } from '../PerformanceMetrics';
import { mockAnalytics } from '@/lib/mockAnalytics';
import { Card } from '@/components/ui/card';

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <svg data-testid="line-chart">{children}</svg>
  ),
  AreaChart: ({ children }: { children: React.ReactNode }) => (
    <svg data-testid="area-chart">
      <defs>
        <linearGradient id="tokenGradient">
          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="researchGradient">
          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
        </linearGradient>
      </defs>
      {children}
    </svg>
  ),
  Line: () => <path data-testid="line" />,
  Area: () => <path data-testid="area" />,
  XAxis: () => <g data-testid="x-axis" />,
  YAxis: () => <g data-testid="y-axis" />,
  CartesianGrid: () => <g data-testid="cartesian-grid" />,
  Tooltip: () => <g data-testid="tooltip" />,
}));

// Wrapper component for fixed dimensions
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <div 
    style={{ 
      width: '800px', 
      height: '600px',
      position: 'relative',
      display: 'block'
    }}
    data-testid="chart-container"
  >
    {children}
  </div>
);

describe('PerformanceMetrics', () => {
  beforeAll(() => {
    // Mock date and random for consistent values
    jest.setSystemTime(new Date('2024-01-01T12:00:00Z'));
    jest.spyOn(Math, 'random').mockImplementation(() => 0.5);
  });

  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('renders without crashing and shows loading state', async () => {
    render(<PerformanceMetrics />, { wrapper: TestWrapper });
    
    // Verify initial loading state
    const loadingElements = screen.getAllByTestId('loading-card');
    expect(loadingElements).toHaveLength(4);
    expect(loadingElements[0].parentElement).toHaveClass('animate-pulse');
    
    // Fast-forward past loading
    await act(async () => {
      jest.advanceTimersByTime(2000);
      await Promise.resolve();
    });
    
    // Verify content is rendered
    await waitFor(() => {
      expect(screen.getByText('Token Usage Trend')).toBeInTheDocument();
      expect(screen.getAllByTestId('responsive-container')).toHaveLength(4);
    });
  });

  it('displays all chart sections after loading', async () => {
    render(<PerformanceMetrics />, { wrapper: TestWrapper });
    
    await act(async () => {
      jest.advanceTimersByTime(2000);
      await Promise.resolve();
    });
    
    const chartTitles = [
      'Token Usage Trend',
      'Research Progress',
      'Knowledge Synthesis Rate',
      'Collaboration Effectiveness'
    ];
    
    for (const title of chartTitles) {
      await waitFor(() => {
        const titleElement = screen.getByText(title);
        expect(titleElement).toBeInTheDocument();
        expect(titleElement.closest(Card)).toBeInTheDocument();
      });
    }
    
    await waitFor(() => {
      expect(screen.getAllByTestId('responsive-container')).toHaveLength(4);
      expect(screen.getAllByTestId('area-chart')).toHaveLength(2);
      expect(screen.getAllByTestId('line-chart')).toHaveLength(2);
    });
  });

  it('updates metrics in real-time', async () => {
    render(<PerformanceMetrics />, { wrapper: TestWrapper });
    
    // Wait for initial render
    await act(async () => {
      jest.advanceTimersByTime(2000);
      await Promise.resolve();
    });

    // Verify initial state
    await waitFor(() => {
      expect(screen.getAllByTestId('area-chart')).toHaveLength(2);
      expect(screen.getAllByTestId('line-chart')).toHaveLength(2);
    });

    // Simulate update cycle
    await act(async () => {
      jest.advanceTimersByTime(2000);
      await Promise.resolve();
    });

    // Verify charts remain after update
    await waitFor(() => {
      expect(screen.getAllByTestId('area-chart')).toHaveLength(2);
      expect(screen.getAllByTestId('line-chart')).toHaveLength(2);
    });
  });

  it('formats time correctly', async () => {
    render(<PerformanceMetrics />, { wrapper: TestWrapper });
    
    await act(async () => {
      jest.advanceTimersByTime(2000);
      await Promise.resolve();
    });
    
    const timeFormat = new RegExp('12:00');
    await waitFor(() => {
      expect(screen.getByText(timeFormat)).toBeInTheDocument();
    });
  });

  it('cleans up interval on unmount', async () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    const { unmount } = render(<PerformanceMetrics />, { wrapper: TestWrapper });
    
    await act(async () => {
      jest.advanceTimersByTime(2000);
      await Promise.resolve();
    });
    
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});