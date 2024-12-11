
};
// Define global clipboard mock as writable property
const mockClipboard = {
  writeText: jest.fn(() => Promise.resolve()),
  readText: jest.fn(() => Promise.resolve('')),
};

if (!navigator.clipboard) {
  Object.defineProperty(window.navigator, 'clipboard', {
    writable: true,
    enumerable: true,
    value: mockClipboard,
  });
}

beforeEach(() => {
  // Reset mock functions
  mockClipboard.writeText.mockClear();
  mockClipboard.readText.mockClear();
});

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
