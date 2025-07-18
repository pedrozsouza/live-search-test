import '@testing-library/jest-dom';

(global as unknown as { IntersectionObserver: unknown }).IntersectionObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

Object.defineProperty(window, 'open', {
  value: jest.fn(),
});

Element.prototype.scrollIntoView = jest.fn(); 