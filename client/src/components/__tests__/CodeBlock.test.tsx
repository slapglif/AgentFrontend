import { render, screen } from '@testing-library/react';
import { CodeBlock } from '../CodeBlock';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

// Mock Prism
jest.mock('prismjs', () => ({
  highlight: jest.fn((code: string) => code),
  languages: {
    javascript: {},
    typescript: {},
    python: {},
    text: {}
  }
}), { virtual: true });

// Mock Prism CSS imports
jest.mock('prismjs/themes/prism-tomorrow.css', () => ({}), { virtual: true });
jest.mock('prismjs/components/prism-typescript', () => ({}), { virtual: true });
jest.mock('prismjs/components/prism-python', () => ({}), { virtual: true });

describe('CodeBlock', () => {
  const mockCode = 'console.log("test")';
  
  let originalClipboard: any;
  
  beforeEach(() => {
    // Mock clipboard API
    const mockClipboard = {
      writeText: jest.fn(() => Promise.resolve())
    };
    
    // Safely define clipboard if it doesn't exist
    if (!global.navigator.clipboard) {
      global.navigator.clipboard = mockClipboard;
    } else {
      // Otherwise just mock the writeText method
      global.navigator.clipboard.writeText = mockClipboard.writeText;
    }
    
    originalClipboard = mockClipboard;
    
    // Mock Prism highlight function
    const prismMock = require('prismjs');
    prismMock.highlight.mockImplementation((code: string) => `<span>${code}</span>`);
  });

  afterEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Restore original clipboard functionality
    if (originalClipboard && global.navigator.clipboard) {
      global.navigator.clipboard.writeText = originalClipboard.writeText;
    }
  });

  it('renders code with syntax highlighting', () => {
    render(<CodeBlock code={mockCode} language="javascript" />);
    const codeContainer = screen.getByTestId('code-container');
    expect(codeContainer).toBeInTheDocument();
    expect(codeContainer.querySelector('code.language-javascript')).toBeInTheDocument();
    expect(codeContainer.textContent).toContain(mockCode);
  });

  it('handles code copy functionality', async () => {
    render(<CodeBlock code={mockCode} language="javascript" />);
    const copyButton = screen.getByRole('button', { name: /copy/i });
    await userEvent.click(copyButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockCode);
  });

  it('toggles collapse state', async () => {
    render(<CodeBlock code={mockCode} language="javascript" />);
    const codeContainer = screen.getByTestId('code-container');
    const collapseButton = screen.getByRole('button', { name: /collapse/i });
    
    expect(codeContainer).toHaveClass('max-h-[2000px]');
    await userEvent.click(collapseButton);
    expect(codeContainer).toHaveClass('max-h-16');
    
    const expandButton = screen.getByRole('button', { name: /expand/i });
    await userEvent.click(expandButton);
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
    expect(screen.getByText(/Hello World/)).toBeInTheDocument();
  });
});
