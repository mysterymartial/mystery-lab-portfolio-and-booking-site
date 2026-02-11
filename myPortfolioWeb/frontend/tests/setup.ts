import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  usePathname() {
    return '/'
  },
}))

// Mock Firebase only when imported - use a function to avoid hoisting issues
jest.mock('@/lib/firebase', () => ({
  auth: {},
  useAuth: () => ({
    user: null,
    loading: false,
    signIn: jest.fn(),
    logout: jest.fn(),
    getIdToken: jest.fn(() => Promise.resolve('mock-token')),
  }),
  AuthProvider: ({ children }: { children: unknown }) => children,
}))

// Mock scrollIntoView (JSDOM doesn't implement it)
Element.prototype.scrollIntoView = jest.fn()

// Mock API calls
global.fetch = jest.fn()

// Setup global test utilities
// NOTE: We do NOT call jest.clearAllMocks() here because it can interfere with
// mock implementations set up in jest.mock() factories and beforeEach hooks.
// Individual test files should handle mock cleanup as needed.
