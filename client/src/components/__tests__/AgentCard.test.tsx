import React from 'react';
import { render, screen } from '@testing-library/react';
import { AgentCard } from '../AgentCard';

// Mock wouter's Link component
jest.mock('wouter', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="mock-link">{children}</a>
  ),
}));

describe('AgentCard', () => {
  const mockAgent = {
    id: 1,
    name: 'Test Agent',
    type: 'Research Assistant',
    status: 'active' as const,
    skillLevel: 5,
    successRate: 0.85,
    currentTasks: 3,
    specializations: ['data_analysis', 'machine_learning'],
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
      priority: 'medium' as const
    }
  };

  it('renders agent information correctly', () => {
    render(<AgentCard agent={mockAgent} />);
    expect(screen.getByText(mockAgent.name)).toBeInTheDocument();
    expect(screen.getByText(mockAgent.type)).toBeInTheDocument();
  });

  it('displays correct status badge', () => {
    render(<AgentCard agent={mockAgent} />);
    const statusBadges = screen.getAllByText(mockAgent.status, { exact: false });
    expect(statusBadges.length).toBeGreaterThan(0);
    const statusBadge = statusBadges[0];
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
    expect(screen.getByText(`Level ${mockAgent.skillLevel}`)).toBeInTheDocument();
    expect(screen.getByText(`${(mockAgent.successRate * 100).toFixed(1)}% Success Rate`)).toBeInTheDocument();
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  it('shows current task information', () => {
    render(<AgentCard agent={mockAgent} />);
    expect(screen.getByText(mockAgent.current_task.summary)).toBeInTheDocument();
    expect(screen.getByText(`${mockAgent.current_task.progress}%`)).toBeInTheDocument();
  });
});
