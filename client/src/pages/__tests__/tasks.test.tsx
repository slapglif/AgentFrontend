import { render, screen } from '@testing-library/react';
import Tasks from '../Tasks';
import { mockTasks } from '@/lib/mockTasks';

describe('Tasks', () => {
  it('renders task columns', () => {
    render(<Tasks />);
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('shows tasks with correct priority badges', () => {
    render(<Tasks />);
    const allTasks = [...mockTasks.todo, ...mockTasks.inProgress, ...mockTasks.completed];
    
    allTasks.forEach(task => {
      const badge = screen.getByText(task.priority);
      switch (task.priority) {
        case 'high':
          expect(badge.closest('[class*="Badge"]')).toHaveClass('variant-destructive');
          break;
        case 'medium':
          expect(badge.closest('[class*="Badge"]')).toHaveClass('variant-default');
          break;
        case 'low':
          expect(badge.closest('[class*="Badge"]')).toHaveClass('variant-secondary');
          break;
      }
    });
  });

  it('renders scroll areas with correct height', () => {
    render(<Tasks />);
    const scrollAreas = screen.getAllByRole('region');
    expect(scrollAreas).toHaveLength(3); // One for each column
    scrollAreas.forEach(area => {
      expect(area).toHaveClass('h-[calc(100vh-250px)]');
    });
  });

  it('renders scroll area for task columns', () => {
    render(<Tasks />);
    const scrollAreas = screen.getAllByRole('region');
    expect(scrollAreas).toHaveLength(3); // One for each column
    scrollAreas.forEach(area => {
      expect(area).toHaveClass('h-[calc(100vh-250px)]');
    });
  });

  it('displays task titles and assignees', () => {
    render(<Tasks />);
    const allTasks = [...mockTasks.todo, ...mockTasks.inProgress, ...mockTasks.completed];
    
    allTasks.forEach(task => {
      expect(screen.getByText(task.title)).toBeInTheDocument();
      expect(screen.getByText(task.assignee)).toBeInTheDocument();
    });
  });
});
