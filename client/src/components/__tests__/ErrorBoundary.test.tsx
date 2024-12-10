import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';
import userEvent from '@testing-library/user-event';

const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for intentional error throws
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders error UI when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const fallback = <div>Custom Error UI</div>;
    render(
      <ErrorBoundary fallback={fallback}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
  });

  it('resets error boundary when try again is clicked', async () => {
    const user = userEvent.setup();
    const onReset = jest.fn();

    render(
      <ErrorBoundary>
        <div>
          <button onClick={onReset}>Reset</button>
          <ThrowError />
        </div>
      </ErrorBoundary>
    );

    const tryAgainButton = screen.getByRole('button', { name: 'Try again' });
    await user.click(tryAgainButton);

    // After clicking try again, it should attempt to re-render children
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('logs error details to console', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
