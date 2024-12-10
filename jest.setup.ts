import '@testing-library/jest-dom';
import 'jest-environment-jsdom';

// Mock window properties and methods
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

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
  callback: IntersectionObserverCallback;
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn();
}
window.IntersectionObserver = MockIntersectionObserver as any;

// Mock ResizeObserver
class MockResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  callback: ResizeObserverCallback;
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}
window.ResizeObserver = MockResizeObserver as any;

// Mock animations and timers
window.requestAnimationFrame = (callback: FrameRequestCallback) => {
  callback(Date.now());
  return 0;
};

window.cancelAnimationFrame = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock SVG elements that might not be in jsdom
document.createElementNS = jest.fn().mockImplementation((namespace, tagName) => {
  return document.createElement(tagName);
});

// Enable fake timers
jest.useFakeTimers();

// Suppress console errors during tests
const originalError = console.error;
console.error = (...args: any[]) => {
  if (
    /Warning: ReactDOM.render is no longer supported in React 18/.test(args[0]) ||
    /Warning: The current testing environment/.test(args[0]) ||
    /Warning: You are importing createRoot/.test(args[0])
  ) {
    return;
  }
  originalError.call(console, ...args);
};

// Add missing TextEncoder/TextDecoder
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}
if (typeof TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;
}
