import { render, screen, fireEvent } from '@testing-library/react';
import { CodeBlock } from '../CodeBlock';

describe('CodeBlock', () => {
  const mockCode = 'console.log("test")';
  
  beforeEach(() => {
    // Mock clipboard API
    const mockClipboard = {
      writeText: jest.fn().mockImplementation(() => Promise.resolve()),
    };
    Object.assign(navigator, { clipboard: mockClipboard });
  });

  it('renders code with syntax highlighting', () => {
    render(<CodeBlock code={mockCode} language="javascript" />);
    const codeElement = screen.getByText(mockCode);
    expect(codeElement).toBeInTheDocument();
    expect(codeElement.closest('code')).toHaveClass('language-javascript');
  });

  it('handles code copy functionality', async () => {
    render(<CodeBlock code={mockCode} language="javascript" />);
    const copyButton = screen.getByRole('button', { name: /copy/i });
    
    fireEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockCode);
  });

  it('toggles collapse state', () => {
    render(<CodeBlock code={mockCode} language="javascript" />);
    const collapseButton = screen.getByRole('button', { name: /chevron/i });
    
    fireEvent.click(collapseButton);
    expect(screen.getByText(mockCode).closest('div')).toHaveClass('max-h-16');
    
    fireEvent.click(collapseButton);
    expect(screen.getByText(mockCode).closest('div')).toHaveClass('max-h-[2000px]');
  });

  it('shows language label', () => {
    render(<CodeBlock code={mockCode} language="javascript" />);
    expect(screen.getByText('javascript')).toBeInTheDocument();
  });
});
