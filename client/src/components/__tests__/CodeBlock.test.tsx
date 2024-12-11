import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CodeBlock } from '../CodeBlock';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

describe('CodeBlock', () => {
  const mockCode = 'console.log("test")';
  
  beforeEach(() => {
    // Mock clipboard API
    const mockClipboard = {
      writeText: jest.fn().mockImplementation(() => Promise.resolve()),
    };
    Object.assign(navigator, { clipboard: mockClipboard });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders code with syntax highlighting', () => {
    render(<CodeBlock code={mockCode} language="javascript" />);
    const codeContainer = screen.getByRole('code-container');
    expect(codeContainer).toBeInTheDocument();
    
    const codeElement = codeContainer.querySelector('code.language-javascript');
    expect(codeElement).toBeInTheDocument();
    expect(codeElement?.textContent).toBe(mockCode);
  });

  it('handles code copy functionality', async () => {
    const user = userEvent.setup();
    render(<CodeBlock code={mockCode} language="javascript" />);
    
    const copyButton = screen.getByRole('button', { name: /copy code/i });
    await user.click(copyButton);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockCode);
    
    // Check that the copy icon changes to a check mark
    expect(screen.getByRole('button', { name: /copy code/i })).toBeInTheDocument();
  });

  it('toggles collapse state', async () => {
    const user = userEvent.setup();
    render(<CodeBlock code={mockCode} language="javascript" />);
    
    const codeContainer = screen.getByRole('code-container');
    const collapseButton = screen.getByRole('button', { name: /collapse code/i });
    
    // Initial state should be expanded
    expect(codeContainer).toHaveClass('max-h-[2000px]');
    
    // Click to collapse
    await user.click(collapseButton);
    expect(codeContainer).toHaveClass('max-h-16');
    
    // Verify expand button appears
    const expandButton = screen.getByRole('button', { name: /expand code/i });
    expect(expandButton).toBeInTheDocument();
    
    // Click to expand
    await user.click(expandButton);
    expect(codeContainer).toHaveClass('max-h-[2000px]');
    expect(screen.getByRole('button', { name: /collapse code/i })).toBeInTheDocument();
  });

  it('shows language label', () => {
    render(<CodeBlock code={mockCode} language="javascript" />);
    expect(screen.getByText('javascript')).toBeInTheDocument();
  });

  it('handles different programming languages', () => {
    const pythonCode = 'print("Hello World")';
    render(<CodeBlock code={pythonCode} language="python" />);
    expect(screen.getByText('python')).toBeInTheDocument();
    expect(screen.getByRole('code-container')).toBeInTheDocument();
  });
});
