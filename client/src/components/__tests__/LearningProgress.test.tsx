import { render, screen, act, waitFor } from '@testing-library/react';
import { LearningProgress } from '../LearningProgress';


interface LearningMetrics {
  completedLessons: number;
  totalLessons: number;
  skillsProficiency: Record<string, number>;
  learningRate: number;
  adaptabilityScore: number;
  retentionRate: number;
  knowledgeAreas: Array<{
    name: string;
    progress: number;
    lastUpdated: string;
  }>;
}

describe('LearningProgress', () => {
  const mockLearningMetrics: LearningMetrics = {
    completedLessons: 42,
    totalLessons: 100,
    skillsProficiency: {
      'Research': 85,
      'Analysis': 78,
      'Synthesis': 92
    },
    learningRate: 89,
    adaptabilityScore: 94,
    retentionRate: 88,
    knowledgeAreas: [
      { name: 'Machine Learning', progress: 75, lastUpdated: new Date().toISOString() },
      { name: 'Natural Language Processing', progress: 82, lastUpdated: new Date().toISOString() },
      { name: 'Computer Vision', progress: 68, lastUpdated: new Date().toISOString() }
    ]
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
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
      expect(screen.getByText(skill, { exact: false })).toBeInTheDocument();
      expect(screen.getByText(`${level}%`)).toBeInTheDocument();
    });
  });

  it('displays learning rate and adaptability scores', () => {
    render(<LearningProgress metrics={mockLearningMetrics} />);
    expect(screen.getByText(`${mockLearningMetrics.learningRate}%`)).toBeInTheDocument();
    expect(screen.getByText(`${mockLearningMetrics.adaptabilityScore}%`)).toBeInTheDocument();
  });
  it('shows loading state during updates', async () => {
    render(<LearningProgress metrics={mockLearningMetrics} />);
    
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText(/Updated:/)).toBeInTheDocument();
  });

  it('handles error states correctly', () => {
    const invalidMetrics = {
      ...mockLearningMetrics,
      skillsProficiency: {} as Record<string, number> // Empty object but maintains type
    };
    
    render(<LearningProgress metrics={invalidMetrics} />);
    
    expect(screen.getByText(/Failed to update learning progress/)).toBeInTheDocument();
  });

  it('updates metrics in real-time', async () => {
    render(<LearningProgress metrics={mockLearningMetrics} />);
    
    const initialLearningRate = screen.getByText(`${mockLearningMetrics.learningRate}%`);
    expect(initialLearningRate).toBeInTheDocument();
    
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Updated:/)).toBeInTheDocument();
    });
  });

  it('cleans up interval on unmount', () => {
    const { unmount } = render(<LearningProgress metrics={mockLearningMetrics} />);
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    
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
