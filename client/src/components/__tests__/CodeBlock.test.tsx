import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { CodeBlock } from '../CodeBlock';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

// Mock Prism.highlight
jest.mock('prismjs', () => ({
  highlight: jest.fn((code) => code),
  languages: {
    javascript: {},
    typescript: {},
    python: {},
    text: {}
  }
}));

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
    expect(codeContainer.querySelector('code.language-javascript')).toBeInTheDocument();
    expect(screen.getByText(mockCode)).toBeInTheDocument();
  });

  it('handles code copy functionality', async () => {
    const user = userEvent.setup();
    render(<CodeBlock code={mockCode} language="javascript" />);
    const copyButton = screen.getByRole('button', { name: /copy code/i });
    await user.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockCode);
  });

  it('toggles collapse state', async () => {
    const user = userEvent.setup();
    render(<CodeBlock code={mockCode} language="javascript" />);
    const collapseButton = screen.getByRole('button', { name: /collapse code/i });
    const codeContainer = screen.getByRole('code-container');
    
    expect(codeContainer).toHaveClass('max-h-[2000px]');
    await user.click(collapseButton);
    expect(codeContainer).toHaveClass('max-h-16');
    
    const expandButton = screen.getByRole('button', { name: /expand code/i });
    await user.click(expandButton);
    expect(codeContainer).toHaveClass('max-h-[2000px]');
  });

  it('shows language label', () => {
    render(<CodeBlock code={mockCode} language="javascript" />);
    expect(screen.getByText('javascript')).toBeInTheDocument();
  });

  it('handles different programming languages', () => {
    const pythonCode = 'print("Hello World")';
    render(<CodeBlock code={pythonCode} language="python" />);
    expect(screen.getByText('python')).toBeInTheDocument();
    expect(screen.getByText(pythonCode)).toBeInTheDocument();
  });
});
