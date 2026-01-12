import { vi, beforeEach } from 'vitest';

// Mock localStorage before importing the slice
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// eslint-disable-next-line import/order
import authReducer, { logout, clearError } from '../authSlice';

describe('authSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };

  it('returns initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(
      expect.objectContaining({
        user: null,
        isAuthenticated: expect.any(Boolean),
        loading: false,
        error: null,
      }),
    );
  });

  it('handles logout', () => {
    const loggedInState = {
      ...initialState,
      user: { id: '1', email: 'test@test.com', firstName: 'Test', lastName: 'User', role: 'admin' as const, createdAt: '' },
      token: 'abc',
      isAuthenticated: true,
    };

    const state = authReducer(loggedInState, logout());
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('handles clearError', () => {
    const errorState = { ...initialState, error: 'Something went wrong' };
    const state = authReducer(errorState, clearError());
    expect(state.error).toBeNull();
  });
});
