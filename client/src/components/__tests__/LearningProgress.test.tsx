import { render, screen, act, waitFor } from '@testing-library/react';
import { LearningProgress } from '../LearningProgress';

const mockDate = new Date('2024-12-10T12:00:00Z');

const mockLearningMetrics = {
  skillsProficiency: {
    'Research': 85,
    'Analysis': 78,
    'Synthesis': 92
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
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
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
    
    const initialLearningRate = screen.getByText(`${mockLearningMetrics.learningRate.toFixed(1)}%`);
    expect(initialLearningRate).toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    await waitFor(() => {
      const headerText = screen.getByText('Learning Progress');
      const header = headerText.closest('div');
      const updateText = header?.nextElementSibling?.querySelector('.text-xs.text-muted-foreground');
      expect(updateText).toHaveTextContent(/Updated:/);
    }, { timeout: 10000 });
  });

  it('cleans up interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    const { unmount } = render(<LearningProgress metrics={mockLearningMetrics} />);
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
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