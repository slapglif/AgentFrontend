import * as React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { CollaborationPanel } from '../CollaborationPanel';
import { mockCollaborations } from '@/lib/mockCollaborations';

// Create a new QueryClient for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      cacheTime: 0,
      staleTime: 0,
    },
  },
  logger: {
    log: console.log,
    warn: console.warn,
    error: () => {},
  },
});

// Mock UI components and hooks
const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

// Mock tanstack query hooks and client
const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
});

const mockQueryData = {
  data: mockCollaborations,
  isLoading: false,
  error: null,
};

// Create mocks before using them
const mockUseQuery = jest.fn().mockReturnValue(mockQueryData);
const mockMutate = jest.fn();
const mockUseMutation = jest.fn().mockReturnValue({
  mutate: mockMutate,
  isPending: false,
});
const mockInvalidateQueries = jest.fn();
const mockSetQueryData = jest.fn();

// Mock the entire module
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: (options: any) => mockUseQuery(options),
  useMutation: (options: any) => mockUseMutation(options),
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
    setQueryData: mockSetQueryData,
  }),
}));

// Mock collaboration events
jest.mock('@/lib/mockCollaborations', () => ({
  ...jest.requireActual('@/lib/mockCollaborations'),
  simulateRealTimeEvents: (callback) => {
    // Return cleanup function
    return () => {};
  },
}));

// Wrap component with necessary providers
const renderWithQueryClient = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={mockQueryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('CollaborationPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockToast = jest.fn();
  jest.mock('@/hooks/use-toast', () => ({
    useToast: () => ({ toast: mockToast })
  }));

  it('renders collaboration list', async () => {
    renderWithQueryClient(<CollaborationPanel />);
    
    for (const collab of mockCollaborations) {
      expect(await screen.findByText(collab.title)).toBeInTheDocument();
      expect(await screen.findByText(collab.description)).toBeInTheDocument();
    }
  });

  it('shows loading state', async () => {
    const useQueryMock = jest.requireMock('@tanstack/react-query').useQuery;
    useQueryMock.mockImplementationOnce(() => ({
      isLoading: true,
      data: null,
      error: null,
    }));

    renderWithQueryClient(<CollaborationPanel />);
    expect(await screen.findByText(/loading collaborations/i)).toBeInTheDocument();
  });

  it('handles collaboration selection', async () => {
    renderWithQueryClient(<CollaborationPanel />);
    
    const firstCollab = mockCollaborations[0];
    const collabTitle = await screen.findByText(firstCollab.title);
    fireEvent.click(collabTitle);
    
    const participantsButton = await screen.findByRole('button', { name: /participants/i });
    expect(participantsButton).toBeInTheDocument();
    fireEvent.click(participantsButton);
    
    const timelineHeading = await screen.findByText('Collaboration Timeline');
    expect(timelineHeading).toBeInTheDocument();
  });

  it('displays new collaboration dialog', async () => {
    renderWithQueryClient(<CollaborationPanel />);
    
    const newButton = await screen.findByRole('button', { name: /new collaboration/i });
    fireEvent.click(newButton);
    
    const dialogTitle = await screen.findByText('Create New Collaboration');
    expect(dialogTitle).toBeInTheDocument();
    
    const titleInput = await screen.findByPlaceholderText('Title');
    const descInput = await screen.findByPlaceholderText('Description');
    
    expect(titleInput).toBeInTheDocument();
    expect(descInput).toBeInTheDocument();
  });

  it('shows error state correctly', async () => {
    const useQueryMock = jest.requireMock('@tanstack/react-query').useQuery;
    useQueryMock.mockImplementationOnce(() => ({
      isLoading: false,
      error: new Error('Failed to fetch collaborations'),
      data: null,
    }));
    
    renderWithQueryClient(<CollaborationPanel />);
    expect(await screen.findByText(/an error occurred/i)).toBeInTheDocument();
  });

  it('handles real-time updates', async () => {
    renderWithQueryClient(<CollaborationPanel />);
    
    // Initial render
    const firstCollab = await screen.findByText(mockCollaborations[0].title);
    expect(firstCollab).toBeInTheDocument();
    
    // Select a collaboration
    fireEvent.click(firstCollab);
    
    // Verify participants section is shown
    const participantsText = await screen.findByText(/participants/i);
    expect(participantsText).toBeInTheDocument();
  });
});
