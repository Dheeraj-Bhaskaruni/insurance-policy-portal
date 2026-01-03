import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { policyService } from '../services/policyService';
import { Policy, FilterParams, CreatePolicyPayload } from '../types';

interface PoliciesState {
  items: Policy[];
  selectedPolicy: Policy | null;
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  filters: FilterParams;
}

const initialState: PoliciesState = {
  items: [],
  selectedPolicy: null,
  total: 0,
  page: 1,
  totalPages: 1,
  loading: false,
  error: null,
  filters: { page: 1, pageSize: 10 },
};

export const fetchPolicies = createAsyncThunk(
  'policies/fetchPolicies',
  async (params: FilterParams, { rejectWithValue }) => {
    try {
      return await policyService.getPolicies(params);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch policies');
    }
  },
);

export const fetchPolicyById = createAsyncThunk(
  'policies/fetchPolicyById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await policyService.getPolicyById(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch policy');
    }
  },
);

export const createPolicy = createAsyncThunk(
  'policies/createPolicy',
  async (payload: CreatePolicyPayload, { rejectWithValue }) => {
    try {
      return await policyService.createPolicy(payload);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create policy');
    }
  },
);

export const cancelPolicy = createAsyncThunk(
  'policies/cancelPolicy',
  async (id: string, { rejectWithValue }) => {
    try {
      return await policyService.cancelPolicy(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to cancel policy');
    }
  },
);

export const renewPolicy = createAsyncThunk(
  'policies/renewPolicy',
  async (id: string, { rejectWithValue }) => {
    try {
      return await policyService.renewPolicy(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to renew policy');
    }
  },
);

const policiesSlice = createSlice({
  name: 'policies',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedPolicy(state) {
      state.selectedPolicy = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPolicies.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPolicies.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchPolicies.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchPolicyById.pending, (state) => { state.loading = true; })
      .addCase(fetchPolicyById.fulfilled, (state, action) => { state.loading = false; state.selectedPolicy = action.payload; })
      .addCase(fetchPolicyById.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(createPolicy.fulfilled, (state, action) => { state.items.unshift(action.payload); state.total += 1; })
      .addCase(cancelPolicy.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.selectedPolicy?.id === action.payload.id) state.selectedPolicy = action.payload;
      })
      .addCase(renewPolicy.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.selectedPolicy?.id === action.payload.id) state.selectedPolicy = action.payload;
      });
  },
});

export const { setFilters, clearSelectedPolicy } = policiesSlice.actions;
export default policiesSlice.reducer;
