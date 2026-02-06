import { vi, beforeEach, describe, it, expect } from 'vitest';

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
import authReducer, { logoutUser, clearError, login } from '../authSlice';

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

  it('handles logoutUser.fulfilled', () => {
    const loggedInState = {
      ...initialState,
      user: {
        id: '1',
        email: 'test@test.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'admin' as const,
        createdAt: '',
      },
      token: 'abc',
      isAuthenticated: true,
    };

    const state = authReducer(loggedInState, logoutUser.fulfilled(undefined, ''));
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('handles clearError', () => {
    const errorState = { ...initialState, error: 'Something went wrong' };
    const state = authReducer(errorState, clearError());
    expect(state.error).toBeNull();
  });

  it('sets loading on login.pending', () => {
    const state = authReducer(initialState, login.pending('', { email: '', password: '' }));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('sets user and token on login.fulfilled', () => {
    const user = {
      id: '1',
      email: 'admin@test.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin' as const,
      createdAt: '',
    };
    const state = authReducer(
      initialState,
      login.fulfilled({ user, token: 'jwt-token' }, '', { email: '', password: '' }),
    );
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(user);
    expect(state.token).toBe('jwt-token');
    expect(state.loading).toBe(false);
  });

  it('sets error on login.rejected', () => {
    const state = authReducer(
      initialState,
      login.rejected(null, '', { email: '', password: '' }, 'Invalid credentials'),
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Invalid credentials');
    expect(state.isAuthenticated).toBe(false);
  });
});
