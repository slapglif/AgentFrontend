import { render, screen, act, waitFor } from '@testing-library/react';
import { LearningProgress } from '../LearningProgress';
import { mockAgents } from '@/lib/mockAgents';
import { vi } from 'vitest';

describe('LearningProgress', () => {
  const mockLearningMetrics = mockAgents[0].learningMetrics;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
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
      vi.advanceTimersByTime(100);
    });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText(/Updated:/)).toBeInTheDocument();
  });

  it('handles error states correctly', () => {
    const invalidMetrics = {
      ...mockLearningMetrics,
      skillsProficiency: null
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
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
    
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
