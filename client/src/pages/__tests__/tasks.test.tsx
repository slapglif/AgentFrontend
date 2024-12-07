import { render, screen, fireEvent } from '@testing-library/react';
import Tasks from '../Tasks';
import { mockTasks } from '@/lib/mockTasks';

describe('Tasks Page', () => {
  it('renders all task columns', () => {
    render(<Tasks />);
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('displays tasks in correct columns', () => {
    render(<Tasks />);
    mockTasks.todo.forEach(task => {
      expect(screen.getByText(task.title)).toBeInTheDocument();
      expect(screen.getByText(task.assignee)).toBeInTheDocument();
      expect(screen.getByText(task.priority)).toBeInTheDocument();
    });
  });

  it('shows tasks with correct priority badges', () => {
    render(<Tasks />);
    const highPriorityTasks = [...mockTasks.todo, ...mockTasks.inProgress, ...mockTasks.completed]
      .filter(task => task.priority === 'high');
    
    highPriorityTasks.forEach(task => {
      const badge = screen.getByText(task.priority);
      expect(badge).toHaveClass('destructive');
    });
  });
});
