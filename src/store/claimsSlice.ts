import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { claimService } from '../services/claimService';
import { Claim, FilterParams, CreateClaimPayload } from '../types';

interface ClaimsState {
  items: Claim[];
  selectedClaim: Claim | null;
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  filters: FilterParams;
}

const initialState: ClaimsState = {
  items: [],
  selectedClaim: null,
  total: 0,
  page: 1,
  totalPages: 1,
  loading: false,
  error: null,
  filters: { page: 1, pageSize: 10 },
};

export const fetchClaims = createAsyncThunk(
  'claims/fetchClaims',
  async (params: FilterParams, { rejectWithValue }) => {
    try {
      return await claimService.getClaims(params);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch claims');
    }
  },
);

export const fetchClaimById = createAsyncThunk(
  'claims/fetchClaimById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await claimService.getClaimById(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch claim');
    }
  },
);

export const createClaim = createAsyncThunk(
  'claims/createClaim',
  async (payload: CreateClaimPayload, { rejectWithValue }) => {
    try {
      return await claimService.createClaim(payload);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create claim');
    }
  },
);

export const updateClaimStatus = createAsyncThunk(
  'claims/updateClaimStatus',
  async ({ id, status }: { id: string; status: Claim['status'] }, { rejectWithValue }) => {
    try {
      return await claimService.updateClaimStatus(id, status);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update claim');
    }
  },
);

const claimsSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    setClaimFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedClaim(state) {
      state.selectedClaim = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClaims.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchClaims.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchClaimById.pending, (state) => { state.loading = true; })
      .addCase(fetchClaimById.fulfilled, (state, action) => { state.loading = false; state.selectedClaim = action.payload; })
      .addCase(fetchClaimById.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(createClaim.fulfilled, (state, action) => { state.items.unshift(action.payload); state.total += 1; })
      .addCase(updateClaimStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.selectedClaim?.id === action.payload.id) state.selectedClaim = action.payload;
      });
  },
});

export const { setClaimFilters, clearSelectedClaim } = claimsSlice.actions;
export default claimsSlice.reducer;
