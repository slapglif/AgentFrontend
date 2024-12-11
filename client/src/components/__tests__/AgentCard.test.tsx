import React from 'react';
import { render, screen } from '@testing-library/react';
import { AgentCard } from '../AgentCard';
import '@testing-library/jest-dom';

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
    const statusBadge = screen.getByText(mockAgent.status, { exact: false });
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge.className).toContain('bg-green-500');
  });

  it('shows specializations', () => {
    render(<AgentCard agent={mockAgent} />);
    mockAgent.specializations.forEach(spec => {
      expect(screen.getByText(spec.replace(/_/g, ' '))).toBeInTheDocument();
    });
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
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows current task information', () => {
    render(<AgentCard agent={mockAgent} />);
    expect(screen.getByText(mockAgent.current_task.summary)).toBeInTheDocument();
    expect(screen.getByText(`${mockAgent.current_task.progress}%`)).toBeInTheDocument();
  });

  it('shows correct task count', () => {
    render(<AgentCard agent={mockAgent} />);
    expect(screen.getByText(mockAgent.currentTasks.toString())).toBeInTheDocument();
  });

  it('renders as a link with correct href', () => {
    render(<AgentCard agent={mockAgent} />);
    const link = screen.getByTestId('mock-link');
    expect(link).toHaveAttribute('href', `/agents/${mockAgent.id}`);
  });
});
