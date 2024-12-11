import '@testing-library/jest-dom';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'text-encoding';

// Add React and testing utilities globally
import React from 'react';
global.React = React;

// Set up TextEncoder/Decoder
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

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
window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
window.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock SVG elements
const createElementNSOrig = document.createElementNS;
document.createElementNS = function(namespaceURI: string, qualifiedName: string) {
  if (namespaceURI === 'http://www.w3.org/2000/svg') {
    const element = createElementNSOrig.apply(this, [namespaceURI, qualifiedName]);
    element.createSVGRect = jest.fn();
    return element;
  }
  return createElementNSOrig.apply(this, [namespaceURI, qualifiedName]);
} as any;

// Mock canvas
HTMLCanvasElement.prototype.getContext = jest.fn();

// Mock Prismjs
jest.mock('prismjs', () => ({
  default: {
    highlight: (code: string) => code,
    languages: {
      javascript: {},
      typescript: {},
      python: {},
      text: {}
    }
  }
}));

// Suppress React 18 console warnings
const originalError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) return;
  originalError.call(console, ...args);
};
