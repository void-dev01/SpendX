import '@testing-library/jest-dom';

// Ensure localStorage mock is available
if (typeof window !== 'undefined' && !window.localStorage) {
  const store: Record<string, string> = {};
  const mockStorage = {
    getItem: (key: string): string | null => store[key] || null,
    setItem: (key: string, value: string): void => {
      store[key] = value.toString();
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      Object.keys(store).forEach((k) => delete store[k]);
    },
    get length(): number {
      return Object.keys(store).length;
    },
    key: (index: number): string | null => Object.keys(store)[index] || null,
  };

  Object.defineProperty(window, 'localStorage', {
    value: mockStorage,
    writable: true,
  });
}

// Mock window.matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});
