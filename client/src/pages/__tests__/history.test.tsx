import { render, screen } from '@testing-library/react';
import History from '../History';

describe('History Page', () => {
  it('renders activity history heading', () => {
    render(<History />);
    expect(screen.getByRole('heading', { name: /activity history/i })).toBeInTheDocument();
  });

  it('renders activity section', () => {
    render(<History />);
    const activitySection = screen.getByRole('region', { name: /activity history/i });
    expect(activitySection).toBeInTheDocument();
  });
});
