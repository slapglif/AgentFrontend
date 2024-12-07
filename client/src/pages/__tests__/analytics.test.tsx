import { render, screen, waitFor } from '@testing-library/react';
import Analytics from '../Analytics';
import { mockAnalytics } from '@/lib/mockAnalytics';

describe('Analytics Page', () => {
  it('renders performance metrics', async () => {
    render(<Analytics />);
    await waitFor(() => {
      expect(screen.getByText('System Metrics')).toBeInTheDocument();
      expect(screen.getByText('Agent Performance')).toBeInTheDocument();
      expect(screen.getByText('Collaboration Stats')).toBeInTheDocument();
    });
  });

  it('displays correct agent performance data', async () => {
    render(<Analytics />);
    await waitFor(() => {
      mockAnalytics.agentPerformance.forEach(agent => {
        expect(screen.getByText(agent.agent)).toBeInTheDocument();
        expect(screen.getByText(`${agent.success}%`)).toBeInTheDocument();
      });
    });
  });

  it('shows system metrics', () => {
    render(<Analytics />);
    expect(screen.getByText(`${mockAnalytics.systemMetrics.uptime}%`)).toBeInTheDocument();
    expect(screen.getByText(`${mockAnalytics.systemMetrics.responseTime}ms`)).toBeInTheDocument();
  });

  it('displays collaboration statistics', () => {
    render(<Analytics />);
    mockAnalytics.collaborationStats.forEach(stat => {
      expect(screen.getByText(stat.date)).toBeInTheDocument();
      expect(screen.getByText(`Active Users: ${stat.activeUsers}`)).toBeInTheDocument();
    });
  });
});
