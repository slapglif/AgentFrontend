import '@testing-library/jest-dom';
import * as React from 'react';

// Setup React globally for tests
Object.defineProperty(global, 'React', {
  writable: true,
  value: React
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback) => setTimeout(callback, 0);
global.cancelAnimationFrame = jest.fn();

// Mock ResizeObserver
class MockResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

global.ResizeObserver = MockResizeObserver;

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {}
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = () => [];
}

global.IntersectionObserver = MockIntersectionObserver;

// Mock Prismjs
jest.mock('prismjs', () => ({
  highlight: jest.fn((code) => code),
  languages: {
    javascript: {},
    typescript: {},
    python: {},
    text: {}
  }
}));

// Mock canvas
HTMLCanvasElement.prototype.getContext = jest.fn();
HTMLCanvasElement.prototype.toBlob = jest.fn();

// Mock SVG elements
const createElementNSOrig = global.document.createElementNS;
global.document.createElementNS = function(namespaceURI: string, qualifiedName: string) {
  const element = createElementNSOrig.call(document, namespaceURI, qualifiedName);
  if (namespaceURI === 'http://www.w3.org/2000/svg') {
    element.createSVGRect = jest.fn();
  }
  return element;
};

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  writable: true,
  value: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
    readText: jest.fn().mockImplementation(() => Promise.resolve('')),
  },
});

// Suppress specific console warnings
const originalError = console.error;
const originalWarn = console.warn;

console.error = (...args) => {
  if (
    /Warning.*not wrapped in act/.test(args[0]) ||
    /Warning.*ReactDOM.render is no longer supported/.test(args[0])
  ) {
    return;
  }
  originalError.call(console, ...args);
};

console.warn = (...args) => {
  if (/Warning.*componentWillMount/.test(args[0])) {
    return;
  }
  originalWarn.call(console, ...args);
};

// Extend Jest matchers
expect.extend({
  toHaveBeenCalledBefore(received: jest.Mock, other: jest.Mock) {
    const receivedCalls = received.mock.invocationCallOrder;
    const otherCalls = other.mock.invocationCallOrder;
    
    if (!receivedCalls.length || !otherCalls.length) {
      return {
        message: () => 'Expected both functions to have been called',
        pass: false,
      };
    }
    
    return {
      message: () => `Expected ${received.getMockName()} to have been called before ${other.getMockName()}`,
      pass: Math.min(...receivedCalls) < Math.min(...otherCalls),
    };
  },
});
