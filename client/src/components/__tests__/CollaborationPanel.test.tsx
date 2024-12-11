import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { CollaborationPanel } from '../CollaborationPanel';
import { mockCollaborations } from '@/lib/mockCollaborations';

// Mock modules
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn().mockImplementation(() => ({
    data: mockCollaborations,
    isLoading: false,
    error: null,
  })),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Wrap component with necessary providers
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
    jest.clearAllMocks();
  });

  it('renders collaboration list', async () => {
    renderWithQueryClient(<CollaborationPanel />);
    
    for (const collab of mockCollaborations) {
      expect(await screen.findByText(collab.title)).toBeInTheDocument();
      expect(await screen.findByText(collab.description)).toBeInTheDocument();
    }
  });

  it('shows loading state initially', () => {
    // Override query mock for loading state
    const useQueryMock = jest.requireMock('@tanstack/react-query').useQuery;
    useQueryMock.mockImplementationOnce(() => ({
      isLoading: true,
      data: null,
      error: null,
    }));

    renderWithQueryClient(<CollaborationPanel />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('handles collaboration selection', async () => {
    renderWithQueryClient(<CollaborationPanel />);
    
    const firstCollab = mockCollaborations[0];
    const collabTitle = await screen.findByText(firstCollab.title);
    fireEvent.click(collabTitle);
    
    const participantsButton = await screen.findByRole('button', { name: /participants/i });
    fireEvent.click(participantsButton);
    
    expect(await screen.findByText('Collaboration Timeline')).toBeInTheDocument();
  });

  it('displays new collaboration dialog', async () => {
    renderWithQueryClient(<CollaborationPanel />);
    
    const newButton = await screen.findByRole('button', { name: /new collaboration/i });
    fireEvent.click(newButton);
    
    expect(await screen.findByText('Create New Collaboration')).toBeInTheDocument();
    expect(await screen.findByPlaceholderText('Title')).toBeInTheDocument();
    expect(await screen.findByPlaceholderText('Description')).toBeInTheDocument();
  });

  it('shows real-time updates section', async () => {
    renderWithQueryClient(<CollaborationPanel />);
    
    expect(await screen.findByText(/active participants/i)).toBeInTheDocument();
  });
});
