import { render, screen } from '@testing-library/react';
import Analytics from '../Analytics';

describe('Analytics Page', () => {
  it('renders analytics dashboard', () => {
    render(<Analytics />);
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Agent Performance')).toBeInTheDocument();
  });
});
