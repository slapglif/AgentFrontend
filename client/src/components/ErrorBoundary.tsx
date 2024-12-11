import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="h-full flex items-center justify-center">
            <div className="max-w-md p-4 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <Button 
                variant="outline" 
                onClick={() => this.setState({ hasError: false })}
              >
                Try again
              </Button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
