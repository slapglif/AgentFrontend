import { render, screen } from '@testing-library/react';
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
  });

  it('renders main settings sections', () => {
    renderSettings();
    expect(screen.getByText('Settings')).toBeTruthy();
    expect(screen.getByText('System Preferences')).toBeTruthy();
    expect(screen.getByText('Agent Settings')).toBeTruthy();
    expect(screen.getByText('Error Handling')).toBeTruthy();
  });

  it('renders all preference toggles', () => {
    renderSettings();
    expect(screen.getByText('Auto-save Changes')).toBeTruthy();
    expect(screen.getByText('Desktop Notifications')).toBeTruthy();
    expect(screen.getByText('Detailed Error Logging')).toBeTruthy();
  });

  it('renders select inputs', () => {
    renderSettings();
    expect(screen.getByText('Update Frequency')).toBeTruthy();
    expect(screen.getByText('Agent Verbosity')).toBeTruthy();
  });

  it('renders reset button', () => {
    renderSettings();
    const resetButton = screen.getByText('Reset to Defaults');
    expect(resetButton).toBeTruthy();
  });
});
