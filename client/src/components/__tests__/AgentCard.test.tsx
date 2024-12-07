import { render, screen } from '@testing-library/react';
import { AgentCard } from '../AgentCard';
import { DEFAULT_AGENTS } from '@/lib/agents';

// Mock wouter's Link component
jest.mock('wouter', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

describe('AgentCard', () => {
  it('renders agent information correctly', () => {
    render(<AgentCard agent={DEFAULT_AGENTS[0]} />);
    expect(screen.getByText(DEFAULT_AGENTS[0].name)).toBeInTheDocument();
    expect(screen.getByText(DEFAULT_AGENTS[0].type)).toBeInTheDocument();
  });

  it('displays correct status badge', () => {
    render(<AgentCard agent={DEFAULT_AGENTS[0]} />);
    const badge = screen.getByText(DEFAULT_AGENTS[0].status);
    expect(badge).toHaveClass(DEFAULT_AGENTS[0].status === 'active' ? 'bg-green-500' : 'bg-yellow-500');
  });

  it('shows achievements', () => {
    render(<AgentCard agent={DEFAULT_AGENTS[0]} />);
    DEFAULT_AGENTS[0].achievements.forEach(achievement => {
      expect(screen.getByText(achievement.name)).toBeInTheDocument();
    });
  });

  it('displays experience progress', () => {
    render(<AgentCard agent={DEFAULT_AGENTS[0]} />);
    expect(screen.getByText(`Level ${DEFAULT_AGENTS[0].level}`)).toBeInTheDocument();
    expect(screen.getByText(`${DEFAULT_AGENTS[0].experience}%`)).toBeInTheDocument();
  });
});
