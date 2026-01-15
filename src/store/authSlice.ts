import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { authService } from '../services/authService';
import { AuthState, LoginCredentials, User } from '../types';

const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem('auth_token');
  } catch {
    return null;
  }
};

const storedToken = getStoredToken();

const initialState: AuthState = {
  user: null,
  token: storedToken,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  },
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  authService.logout();
});

export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      const userJson = localStorage.getItem('auth_user');
      if (!token || !userJson) throw new Error('No session');
      return { user: JSON.parse(userJson) as User, token };
    } catch (error) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      return rejectWithValue('Session expired');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.loading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
