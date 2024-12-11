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
  observe = jest.fn().mockImplementation((element: Element) => {
    // Simulate an intersection observation
    const entry = {
      boundingClientRect: element.getBoundingClientRect(),
      intersectionRatio: 1,
      intersectionRect: element.getBoundingClientRect(),
      isIntersecting: true,
      rootBounds: document.documentElement.getBoundingClientRect(),
      target: element,
      time: Date.now()
    };
    this.callback([entry], this);
  });
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = jest.fn().mockReturnValue([]);
  root: Element | null = null;
  rootMargin: string = '0px';
  thresholds: ReadonlyArray<number> = [0];
}
window.IntersectionObserver = MockIntersectionObserver as any;

// Mock ResizeObserver
class MockResizeObserver implements ResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  callback: ResizeObserverCallback;
  observe = jest.fn().mockImplementation((element: Element) => {
    // Simulate a resize observation
    const entry: ResizeObserverEntry = {
      target: element,
      contentRect: element.getBoundingClientRect(),
      borderBoxSize: [{
        blockSize: 100,
        inlineSize: 100
      }],
      contentBoxSize: [{
        blockSize: 100,
        inlineSize: 100
      }],
      devicePixelContentBoxSize: [{
        blockSize: 100,
        inlineSize: 100
      }]
    } as ResizeObserverEntry;
    this.callback([entry], this);
  });
  unobserve = jest.fn();
  disconnect = jest.fn();
}
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver
});

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
// Define clipboard mock only if it doesn't exist
if (!navigator.clipboard) {
  const mockClipboard = {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
    readText: jest.fn().mockImplementation(() => Promise.resolve('')),
  };
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: mockClipboard,
  });
}

// Mock getComputedStyle
window.getComputedStyle = jest.fn().mockImplementation((element) => ({
  getPropertyValue: jest.fn().mockReturnValue(''),
  ...element,
}));

// Mock scrollTo
window.scrollTo = jest.fn();

// Add missing requestAnimationFrame polyfill
global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0);
  return 0;
};


// Add missing TextEncoder/TextDecoder
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}
if (typeof TextDecoder === 'undefined') {
  global.TextDecoder = require('util').TextDecoder;
}
