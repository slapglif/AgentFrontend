import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@/components/ThemeProvider';
import Settings from '../Settings';

// Mock the useLocalStorage hook
jest.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: () => [true, jest.fn()],
}));

// Mock the toast component
jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

describe('Settings Page', () => {
  const renderSettings = () => {
    return render(
      <ThemeProvider defaultTheme="light" storageKey="app-theme">
        <Settings />
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-12-10T12:00:00Z'));
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });

  it('renders main settings sections', async () => {
    renderSettings();
    
    // Initially shows loading skeletons
    const skeletons = screen.getAllByRole('presentation').filter(el => 
      el.className.includes('animate-pulse')
    );
    expect(skeletons).toHaveLength(2);

    // After loading
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Interface Preferences')).toBeInTheDocument();
      expect(screen.getByText('Agent Behavior')).toBeInTheDocument();
      expect(screen.getByText('System Performance')).toBeInTheDocument();
      expect(screen.getByText('Error Handling')).toBeInTheDocument();
    });
  });

  it('renders all preference toggles', async () => {
    renderSettings();
    
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.getByText('Dark Mode')).toBeInTheDocument();
      expect(screen.getByText('Auto-save Changes')).toBeInTheDocument();
      expect(screen.getByText('Desktop Notifications')).toBeInTheDocument();
      expect(screen.getByText('Resource Monitoring')).toBeInTheDocument();
      expect(screen.getByText('Detailed Error Logging')).toBeInTheDocument();
    });
  });

  it('renders select inputs with correct options', async () => {
    renderSettings();
    
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.getByText('Update Frequency')).toBeInTheDocument();
      expect(screen.getByText('Verbosity Level')).toBeInTheDocument();
      expect(screen.getByText('Learning Rate')).toBeInTheDocument();
      expect(screen.getByText('Memory Retention')).toBeInTheDocument();
    });
  });

  it('handles reset functionality correctly', async () => {
    const { toast } = require('@/components/ui/use-toast');
    renderSettings();
    
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    const resetButton = screen.getByText('Reset to Defaults');
    await act(async () => {
      fireEvent.click(resetButton);
    });

    expect(toast).toHaveBeenCalledWith({
      title: "Settings Reset",
      description: "All settings have been restored to their default values.",
    });
  });

  it('disables controls during loading state', async () => {
    renderSettings();
    
    const switches = screen.getAllByRole('switch');
    const selects = screen.getAllByRole('combobox');
    const resetButton = screen.getByText('Reset to Defaults');

    // Check initial disabled state during loading
    await waitFor(() => {
      switches.forEach(switchEl => {
        expect(switchEl).toBeDisabled();
      });

      selects.forEach(select => {
        expect(select).toBeDisabled();
      });

      expect(resetButton).toBeDisabled();
    });
    
    // Advance timer to trigger loading completion
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    // Check enabled state after loading
    await waitFor(() => {
      switches.forEach(switchEl => {
        expect(switchEl).not.toBeDisabled();
      });

      selects.forEach(select => {
        expect(select).not.toBeDisabled();
      });

      expect(resetButton).not.toBeDisabled();
    });
  });
});
