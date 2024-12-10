import '@testing-library/jest-dom';
import 'jest-environment-jsdom';
import { vi } from 'vitest';

// Mock window properties and methods
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
  callback: IntersectionObserverCallback;
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn();
}
window.IntersectionObserver = MockIntersectionObserver as any;

// Mock ResizeObserver
class MockResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  callback: ResizeObserverCallback;
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
window.ResizeObserver = MockResizeObserver as any;

// Mock animations and timers
window.requestAnimationFrame = (callback: FrameRequestCallback) => {
  callback(Date.now());
  return 0;
};

window.cancelAnimationFrame = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock SVG elements that might not be in jsdom
document.createElementNS = vi.fn().mockImplementation((namespace, tagName) => {
  return document.createElement(tagName);
});

// Enable fake timers
vi.useFakeTimers();

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
