import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CollaborationPanel } from '../CollaborationPanel';
import { mockCollaborations } from '@/lib/mockCollaborations';

jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithQueryClient = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('CollaborationPanel', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it('renders collaboration list', async () => {
    renderWithQueryClient(<CollaborationPanel />);
    
    await waitFor(() => {
      mockCollaborations.forEach(collab => {
        expect(screen.getByText(collab.title)).toBeInTheDocument();
        expect(screen.getByText(collab.description)).toBeInTheDocument();
      });
    }, { timeout: 10000 });
  });

  it('shows loading state initially', () => {
    renderWithQueryClient(<CollaborationPanel />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('handles collaboration selection', async () => {
    renderWithQueryClient(<CollaborationPanel />);
    
    await waitFor(() => {
      const participantsButton = screen.getAllByText('Participants')[0];
      fireEvent.click(participantsButton);
      expect(screen.getByText('Collaboration Timeline')).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('displays new collaboration dialog', async () => {
    renderWithQueryClient(<CollaborationPanel />);
    const newButton = screen.getByText('New Collaboration');
    fireEvent.click(newButton);
    
    await waitFor(() => {
      expect(screen.getByText('Create New Collaboration')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('shows real-time updates', async () => {
    renderWithQueryClient(<CollaborationPanel />);
    
    await waitFor(() => {
      expect(screen.getByText('Active participants will appear here in real-time')).toBeInTheDocument();
    }, { timeout: 10000 });
  });
});
