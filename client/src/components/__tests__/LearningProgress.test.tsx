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
  retentionRate: 88
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
    let mockRandomValue = 0.5;
    jest.spyOn(Math, 'random').mockImplementation(() => {
      mockRandomValue += 0.1;
      return mockRandomValue;
    });

    render(<LearningProgress metrics={mockLearningMetrics} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('metrics-last-updated')).toBeInTheDocument();
    });

    // Get initial learning rate value
    const initialValue = parseFloat(screen.getByTestId('learning-rate-value').textContent!);
    
    // Advance time to trigger update
    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    // Verify updates using data-testid
    await waitFor(() => {
      const knowledgeArea = mockLearningMetrics.knowledgeAreas[0];
      const updatedElement = screen.getByTestId(`knowledge-area-${knowledgeArea.name}-updated`);
      expect(updatedElement).toBeInTheDocument();
      expect(updatedElement.textContent).toMatch(/Updated:/);
    });

    // Get updated learning rate value
    const updatedValue = parseFloat(screen.getByTestId('learning-rate-value').textContent!);
    expect(updatedValue).not.toBe(initialValue);
  });

  it('cleans up interval on unmount', async () => {
    const setIntervalSpy = jest.spyOn(window, 'setInterval');
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    
    const { unmount } = render(<LearningProgress metrics={mockLearningMetrics} />);
    
    // Wait for the component to mount and set up interval
    await act(async () => {
      jest.advanceTimersByTime(0);
    });
    
    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 5000);
    
    // Unmount and verify cleanup
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    
    // Clean up spies
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
