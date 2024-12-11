import '@testing-library/jest-dom';

// Define clipboard mock only if it doesn't exist
if (!navigator.clipboard) {
  Object.defineProperty(window.navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      readText: jest.fn().mockImplementation(() => Promise.resolve('')),
    },
  });
}

// Mock window.ResizeObserver
window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

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

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
