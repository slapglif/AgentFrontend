import { render, screen } from '@testing-library/react';
import Settings from '../Settings';

describe('Settings Page', () => {
  it('renders settings interface', () => {
    render(<Settings />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Preferences')).toBeInTheDocument();
  });
});
