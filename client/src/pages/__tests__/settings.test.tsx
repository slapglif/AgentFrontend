import { render, screen, act, fireEvent } from '@testing-library/react';
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
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders main settings sections', () => {
    renderSettings();
    
    // Initially shows loading skeletons
    expect(screen.getAllByTestId('skeleton')).toHaveLength(2);

    // After loading
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Interface Preferences')).toBeInTheDocument();
    expect(screen.getByText('Agent Behavior')).toBeInTheDocument();
    expect(screen.getByText('System Performance')).toBeInTheDocument();
    expect(screen.getByText('Error Handling')).toBeInTheDocument();
  });

  it('renders all preference toggles', async () => {
    renderSettings();
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    expect(screen.getByText('Auto-save Changes')).toBeInTheDocument();
    expect(screen.getByText('Desktop Notifications')).toBeInTheDocument();
    expect(screen.getByText('Resource Monitoring')).toBeInTheDocument();
    expect(screen.getByText('Detailed Error Logging')).toBeInTheDocument();
  });

  it('renders select inputs with correct options', async () => {
    renderSettings();
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(screen.getByText('Update Frequency')).toBeInTheDocument();
    expect(screen.getByText('Verbosity Level')).toBeInTheDocument();
    expect(screen.getByText('Learning Rate')).toBeInTheDocument();
    expect(screen.getByText('Memory Retention')).toBeInTheDocument();
  });

  it('handles reset functionality correctly', async () => {
    const { toast } = require('@/components/ui/use-toast');
    renderSettings();
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const resetButton = screen.getByText('Reset to Defaults');
    fireEvent.click(resetButton);

    expect(toast).toHaveBeenCalledWith({
      title: "Settings Reset",
      description: "All settings have been restored to their default values.",
    });
  });

  it('disables controls during loading state', () => {
    renderSettings();
    
    const switches = screen.getAllByRole('switch');
    const selects = screen.getAllByRole('combobox');
    const resetButton = screen.getByText('Reset to Defaults');

    switches.forEach(switchEl => {
      expect(switchEl).toBeDisabled();
    });

    selects.forEach(select => {
      expect(select).toBeDisabled();
    });

    expect(resetButton).toBeDisabled();
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    switches.forEach(switchEl => {
      expect(switchEl).not.toBeDisabled();
    });

    selects.forEach(select => {
      expect(select).not.toBeDisabled();
    });

    expect(resetButton).not.toBeDisabled();
  });
});
