import { render, screen } from '@testing-library/react';
import { AgentCard } from '../AgentCard';

// Mock wouter's Link component
jest.mock('wouter', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

describe('AgentCard', () => {
  const mockAgent = {
    id: 1,
    name: 'Test Agent',
    type: 'research',
    status: 'active' as const,
    level: 1,
    experience: 75,
    achievements: [
      { 
        id: 1,
        name: 'First Achievement', 
        description: 'Test description',
        icon: 'trophy'
      }
    ],
    current_task: {
      id: '1',
      summary: 'Test task',
      progress: 50,
      status: 'in_progress' as const,
      priority: 'medium' as const,
      started_at: new Date().toISOString(),
      estimated_completion: new Date(Date.now() + 3600000).toISOString()
    }
  };

  it('renders agent information correctly', () => {
    render(<AgentCard agent={mockAgent} />);
    expect(screen.getByText(mockAgent.name)).toBeInTheDocument();
    expect(screen.getByText(mockAgent.type)).toBeInTheDocument();
  });

  it('displays correct status badge', () => {
    render(<AgentCard agent={mockAgent} />);
    const statusBadge = screen.getByText(mockAgent.status, { exact: false });
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge.className).toMatch(/bg-green-500/);
    expect(statusBadge.className).toMatch(/animate-glow/);
  });

  it('shows achievements', () => {
    render(<AgentCard agent={mockAgent} />);
    mockAgent.achievements.forEach(achievement => {
      expect(screen.getByText(achievement.name)).toBeInTheDocument();
    });
  });

  it('displays experience progress', () => {
    render(<AgentCard agent={mockAgent} />);
    expect(screen.getByText(`Level ${mockAgent.level}`)).toBeInTheDocument();
    
    // Check for experience progress bar
    const experienceBar = screen.getByRole('progressbar');
    expect(experienceBar).toBeInTheDocument();
    expect(experienceBar).toHaveAttribute('data-state', 'indeterminate');
  });

  it('shows current task information', () => {
    render(<AgentCard agent={mockAgent} />);
    expect(screen.getByText(mockAgent.current_task.summary)).toBeInTheDocument();
    expect(screen.getByText(`${mockAgent.current_task.progress}%`)).toBeInTheDocument();
  });
});
