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

// Mock ResizeObserver
class MockResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

window.ResizeObserver = MockResizeObserver;

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds = [];
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = () => [];
  readonly _callback: IntersectionObserverCallback = () => {};
  readonly _options: IntersectionObserverInit = {};

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this._callback = callback;
    this._options = options || {};
  }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver
});

// Mock canvas
HTMLCanvasElement.prototype.getContext = jest.fn();

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

// Mock SVG elements
const createElementNSOrig = global.document.createElementNS;
Object.defineProperty(global.document, 'createElementNS', {
  value: function(namespaceURI: string, qualifiedName: string) {
    const element = createElementNSOrig.call(document, namespaceURI, qualifiedName);
    if (namespaceURI === 'http://www.w3.org/2000/svg') {
      Object.defineProperty(element, 'createSVGRect', {
        value: jest.fn()
      });
    }
    return element;
  }
});

// Suppress React 18 console warnings about act()
const originalError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) return;
  originalError.call(console, ...args);
};
