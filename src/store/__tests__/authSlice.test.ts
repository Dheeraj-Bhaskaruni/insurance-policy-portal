import authReducer, { logout, clearError } from '../authSlice';

describe('authSlice', () => {
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
