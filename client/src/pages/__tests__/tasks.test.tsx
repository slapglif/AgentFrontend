import { render, screen } from '@testing-library/react';
import Tasks from '../Tasks';

describe('Tasks Page', () => {
  it('renders task management interface', () => {
    render(<Tasks />);
    expect(screen.getByText('Task Management')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
  });
});
