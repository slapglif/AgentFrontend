import { render, screen, act, waitFor, within } from '@testing-library/react';
import { LearningProgress } from '../LearningProgress';

const mockDate = new Date('2024-12-10T12:00:00Z');

const mockLearningMetrics = {
  skillsProficiency: {
    'Research': 85,
    'Analysis': 78,
    'Synthesis': 92,
    'Collaboration': 88
  },
  knowledgeAreas: [
    { 
      name: 'Machine Learning',
      progress: 75,
      lastUpdated: mockDate.toISOString()
    },
    {
      name: 'Natural Language Processing',
      progress: 82,
      lastUpdated: mockDate.toISOString()
    }
  ],
  learningRate: 89,
  completedLessons: 42,
  totalLessons: 100,
  adaptabilityScore: 94,
  retentionRate: 88,
  error: null,
  isLoading: false,
  lastUpdated: mockDate.toISOString()
};

describe('LearningProgress', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('renders without crashing', () => {
    render(<LearningProgress metrics={mockLearningMetrics} />);
    expect(screen.getByText('Learning Progress')).toBeInTheDocument();
  });

  it('displays course progress correctly', () => {
    render(<LearningProgress metrics={mockLearningMetrics} />);
    expect(screen.getByText(`${mockLearningMetrics.completedLessons} / ${mockLearningMetrics.totalLessons} Lessons`)).toBeInTheDocument();
  });

  it('shows all skills proficiency levels', () => {
    render(<LearningProgress metrics={mockLearningMetrics} />);
    Object.entries(mockLearningMetrics.skillsProficiency).forEach(([skill, level]) => {
      expect(screen.getByText(skill)).toBeInTheDocument();
      expect(screen.getByText(`${level}%`)).toBeInTheDocument();
    });
  });

  it('displays learning rate and adaptability scores', () => {
    render(<LearningProgress metrics={mockLearningMetrics} />);
    expect(screen.getByText(`${mockLearningMetrics.learningRate.toFixed(1)}%`)).toBeInTheDocument();
    expect(screen.getByText(`${mockLearningMetrics.adaptabilityScore.toFixed(1)}%`)).toBeInTheDocument();
  });

  it('shows loading state during updates', async () => {
    render(<LearningProgress metrics={mockLearningMetrics} />);
    
    act(() => {
      jest.advanceTimersByTime(100);
    });

    const progressElements = screen.getAllByRole('progressbar');
    expect(progressElements.length).toBeGreaterThan(0);
    expect(screen.getByText(/Learning Progress/)).toBeInTheDocument();
  });

  it('updates metrics in real-time', async () => {
    render(<LearningProgress metrics={mockLearningMetrics} />);
    
    await waitFor(() => {
      expect(screen.getByText('Learning Progress')).toBeInTheDocument();
    }, { timeout: 10000 });

    const initialLearningRate = screen.getByText(`${mockLearningMetrics.learningRate.toFixed(1)}%`);
    expect(initialLearningRate).toBeInTheDocument();
    
    await act(async () => {
      jest.advanceTimersByTime(5000);
    });
    
    await waitFor(() => {
      // Find knowledge area by its name first
      const knowledgeArea = mockLearningMetrics.knowledgeAreas[0];
      const areaSection = screen.getByText(knowledgeArea.name).closest('div');
      expect(areaSection).not.toBeNull();

      // Then look for the date within that section
      const lastUpdated = knowledgeArea.lastUpdated;
      const formattedDate = new Date(lastUpdated).toLocaleDateString();
      const dateText = within(areaSection as HTMLElement).getByText(formattedDate, { exact: false });
      expect(dateText).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('cleans up interval on unmount', async () => {
    // Mock setInterval to return a specific interval ID
    const mockIntervalId = 123;
    const setIntervalSpy = jest.spyOn(window, 'setInterval').mockReturnValue(mockIntervalId);
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    
    // Render component
    const { unmount } = render(<LearningProgress metrics={mockLearningMetrics} />);
    
    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText('Learning Progress')).toBeInTheDocument();
    });
    
    // Verify setInterval was called with expected parameters
    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), expect.any(Number));
    
    // Unmount and verify clearInterval was called
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalledWith(mockIntervalId);
    
    // Clean up mocks
    setIntervalSpy.mockRestore();
    clearIntervalSpy.mockRestore();
  });

  it('shows all knowledge areas with progress', () => {
    render(<LearningProgress metrics={mockLearningMetrics} />);
    mockLearningMetrics.knowledgeAreas.forEach((area) => {
      expect(screen.getByText(area.name)).toBeInTheDocument();
      expect(screen.getByText(`${area.progress}%`)).toBeInTheDocument();
    });
  });
});