import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { CollaborationPanel } from '../CollaborationPanel';
import { mockCollaborations } from '@/lib/mockCollaborations';

// Mock useToast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('CollaborationPanel', () => {
  it('renders collaboration list', async () => {
    render(<CollaborationPanel />);
    
    await waitFor(() => {
      mockCollaborations.forEach(collab => {
        expect(screen.getByText(collab.title!)).toBeInTheDocument();
        expect(screen.getByText(collab.description!)).toBeInTheDocument();
      });
    });
  });

  it('shows loading state initially', () => {
    render(<CollaborationPanel />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('handles collaboration selection', async () => {
    render(<CollaborationPanel />);
    
    await waitFor(() => {
      const participantsButton = screen.getAllByText('Participants')[0];
      fireEvent.click(participantsButton);
      expect(screen.getByText('Collaboration Timeline')).toBeInTheDocument();
    });
  });

  it('displays new collaboration dialog', () => {
    render(<CollaborationPanel />);
    const newButton = screen.getByText('New Collaboration');
    fireEvent.click(newButton);
    
    expect(screen.getByText('Create New Collaboration')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
  });

  it('shows real-time updates', async () => {
    render(<CollaborationPanel />);
    
    await waitFor(() => {
      expect(screen.getByText('Active participants will appear here in real-time')).toBeInTheDocument();
    });
  });
});
