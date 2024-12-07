import { render, screen } from '@testing-library/react';
import History from '../History';

describe('History Page', () => {
  it('renders activity history', () => {
    render(<History />);
    expect(screen.getByText('Activity History')).toBeInTheDocument();
  });
});
