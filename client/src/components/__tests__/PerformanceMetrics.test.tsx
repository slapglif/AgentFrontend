import { render, screen, act } from '@testing-library/react';
import { PerformanceMetrics } from '../PerformanceMetrics';
import { mockAnalytics } from '@/lib/mockAnalytics';
import { Card } from '@/components/ui/card';

// Mock Recharts components with SVG support
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
  Tooltip: () => <g data-testid="tooltip" />
}));

// Wrapper component to provide fixed dimensions for charts
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

  it('renders without crashing', async () => {
    render(<PerformanceMetrics />, { wrapper: TestWrapper });
    
    // Initial loading state
    const loadingElements = screen.getAllByTestId('loading-card');
    expect(loadingElements).toHaveLength(4);
    
    // Fast-forward past loading state
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    // Verify container and dimensions
    const container = screen.getByTestId('chart-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveStyle({ width: '800px', height: '600px' });
    
    // Verify charts are rendered
    expect(screen.getAllByTestId('responsive-container')).toHaveLength(4);
    expect(screen.getByText('Token Usage Trend')).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    render(<PerformanceMetrics />, { wrapper: TestWrapper });
    const loadingElements = screen.getAllByTestId('loading-card');
    expect(loadingElements).toHaveLength(4);
    expect(loadingElements[0].parentElement).toHaveClass('animate-pulse');
  });

  it('shows all metric charts after loading', async () => {
    render(<PerformanceMetrics />, { wrapper: TestWrapper });
    
    // Fast-forward past loading state
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    // Verify all chart containers and titles
    const chartTitles = [
      'Token Usage Trend',
      'Research Progress',
      'Knowledge Synthesis Rate',
      'Collaboration Effectiveness'
    ];
    
    chartTitles.forEach(title => {
      const titleElement = screen.getByText(title);
      expect(titleElement).toBeInTheDocument();
      expect(titleElement.closest(Card)).toBeInTheDocument();
    });
    
    // Verify chart components are rendered
    expect(screen.getAllByTestId('responsive-container')).toHaveLength(4);
    expect(screen.getAllByTestId('area-chart')).toHaveLength(2);
    expect(screen.getAllByTestId('line-chart')).toHaveLength(2);
  });

  it('updates metrics in real-time', () => {
    const { mockRandom } = setupMocks();
    
    render(<PerformanceMetrics />, { wrapper: TestWrapper });
    
    // Fast-forward initial load
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Verify initial charts are rendered
    const areaCharts = screen.getAllByTestId('area-chart');
    const lineCharts = screen.getAllByTestId('line-chart');
    expect(areaCharts).toHaveLength(2);
    expect(lineCharts).toHaveLength(2);

    // Verify initial metrics
    const chartTitles = [
      'Token Usage Trend',
      'Research Progress',
      'Knowledge Synthesis Rate',
      'Collaboration Effectiveness'
    ];
    
    chartTitles.forEach(title => {
      const titleElement = screen.getByText(title);
      const card = titleElement.closest(Card);
      expect(card).toBeInTheDocument();
      expect(card).toContainElement(screen.getByTestId('responsive-container'));
    });

    // Simulate data update
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Verify charts remain rendered after update
    expect(screen.getAllByTestId('area-chart')).toHaveLength(2);
    expect(screen.getAllByTestId('line-chart')).toHaveLength(2);

    // Cleanup mocks
    mockRandom.mockRestore();
  });

  it('handles data updates correctly', () => {
    render(<PerformanceMetrics />, { wrapper: TestWrapper });
    
    // Fast-forward past loading
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Get all chart containers
    const chartContainers = screen.getAllByTestId('responsive-container');
    expect(chartContainers).toHaveLength(4);

    // Verify each chart has necessary components
    chartContainers.forEach(container => {
      expect(container).toContainElement(screen.getByTestId('cartesian-grid'));
      expect(container).toContainElement(screen.getByTestId('x-axis'));
      expect(container).toContainElement(screen.getByTestId('y-axis'));
      expect(container).toContainElement(screen.getByTestId('tooltip'));
    });
  });

  it('formats time correctly', () => {
    const mockDate = new Date('2024-12-10T12:00:00Z');
    jest.setSystemTime(mockDate);
    
    render(<PerformanceMetrics />, { wrapper: TestWrapper });
    
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
    render(<PerformanceMetrics />, { wrapper: TestWrapper });
    
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
    const { unmount } = render(<PerformanceMetrics />, { wrapper: TestWrapper });
    
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
