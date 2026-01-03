import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { dashboardService } from '../services/dashboardService';
import { DashboardMetrics, ActivityItem } from '../types';

interface DashboardState {
  metrics: DashboardMetrics | null;
  recentActivity: ActivityItem[];
  policyDistribution: Array<{ name: string; value: number; color: string }>;
  claimsOverview: Array<{ name: string; value: number; color: string }>;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  metrics: null,
  recentActivity: [],
  policyDistribution: [],
  claimsOverview: [],
  loading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const [metrics, recentActivity, policyDistribution, claimsOverview] = await Promise.all([
        dashboardService.getMetrics(),
        dashboardService.getRecentActivity(),
        dashboardService.getPolicyDistribution(),
        dashboardService.getClaimsOverview(),
      ]);
      return { metrics, recentActivity, policyDistribution, claimsOverview };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load dashboard');
    }
  },
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload.metrics;
        state.recentActivity = action.payload.recentActivity;
        state.policyDistribution = action.payload.policyDistribution;
        state.claimsOverview = action.payload.claimsOverview;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export default dashboardSlice.reducer;
