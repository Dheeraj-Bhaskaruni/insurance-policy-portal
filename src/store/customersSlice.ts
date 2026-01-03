import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { customerService } from '../services/customerService';
import { Customer, FilterParams } from '../types';

interface CustomersState {
  items: Customer[];
  selectedCustomer: Customer | null;
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  items: [],
  selectedCustomer: null,
  total: 0,
  page: 1,
  totalPages: 1,
  loading: false,
  error: null,
};

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (params: FilterParams, { rejectWithValue }) => {
    try {
      return await customerService.getCustomers(params);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch customers');
    }
  },
);

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchCustomerById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await customerService.getCustomerById(id);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch customer');
    }
  },
);

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearSelectedCustomer(state) {
      state.selectedCustomer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchCustomers.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchCustomerById.pending, (state) => { state.loading = true; })
      .addCase(fetchCustomerById.fulfilled, (state, action) => { state.loading = false; state.selectedCustomer = action.payload; })
      .addCase(fetchCustomerById.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export const { clearSelectedCustomer } = customersSlice.actions;
export default customersSlice.reducer;
