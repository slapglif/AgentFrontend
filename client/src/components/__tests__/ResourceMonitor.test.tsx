import { render, screen, act, waitFor } from '@testing-library/react';
import { ResourceMonitor } from '../ResourceMonitor';
import { mockAgents } from '@/lib/mockAgents';

describe('ResourceMonitor', () => {
  const mockAgent = mockAgents[0];

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders without crashing', () => {
    render(<ResourceMonitor agent={mockAgent} />);
    expect(screen.getByText('Resource Monitor')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(<ResourceMonitor agent={mockAgent} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays error state when there is an error', () => {
    const invalidAgent = {
      ...mockAgent,
      memory_allocation: {
        total: 0,
        used: 0,
        reserved: 0
      }
    };
    render(<ResourceMonitor agent={invalidAgent} />);
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('displays resource metrics correctly', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    // Wait for initial loading state to clear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Check for resource metric headings
    expect(screen.getByText('CPU Usage')).toBeInTheDocument();
    expect(screen.getByText('Memory Usage')).toBeInTheDocument();
    expect(screen.getByText('Storage Usage')).toBeInTheDocument();
  });

  it('displays memory allocation correctly', () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    const memoryText = `${mockAgent.memory_allocation.used}MB / ${mockAgent.memory_allocation.total}MB`;
    const reservedMemory = `${mockAgent.memory_allocation.reserved}MB`;
    
    expect(screen.getByText(memoryText)).toBeInTheDocument();
    expect(screen.getByText(reservedMemory)).toBeInTheDocument();
  });

  it('updates metrics periodically', async () => {
    render(<ResourceMonitor agent={mockAgent} />);
    
    // Initial render
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Advance timers to trigger update
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Verify metrics are displayed (specific values will be random)
    expect(screen.getByText(/\d+\.\d+%/)).toBeInTheDocument();
  });

  it('cleans up interval on unmount', () => {
    const { unmount } = render(<ResourceMonitor agent={mockAgent} />);
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    
    unmount();
    
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
