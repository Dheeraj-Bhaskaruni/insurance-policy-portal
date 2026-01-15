import { createSelector } from '@reduxjs/toolkit';

import { RootState } from './index';

// Auth selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectUserRole = createSelector(selectCurrentUser, (user) => user?.role ?? null);

// Policy selectors
export const selectPolicies = (state: RootState) => state.policies;
export const selectPolicyItems = (state: RootState) => state.policies.items;
export const selectSelectedPolicy = (state: RootState) => state.policies.selectedPolicy;
export const selectPoliciesLoading = (state: RootState) => state.policies.loading;
export const selectPolicyFilters = (state: RootState) => state.policies.filters;

export const selectActivePolicies = createSelector(selectPolicyItems, (policies) =>
  policies.filter((p) => p.status === 'active'),
);

export const selectPoliciesByType = createSelector(selectPolicyItems, (policies) => {
  const grouped: Record<string, number> = {};
  policies.forEach((p) => {
    grouped[p.type] = (grouped[p.type] || 0) + 1;
  });
  return grouped;
});

export const selectTotalPremium = createSelector(selectActivePolicies, (policies) =>
  policies.reduce((sum, p) => sum + p.premiumAmount, 0),
);

// Claims selectors
export const selectClaims = (state: RootState) => state.claims;
export const selectClaimItems = (state: RootState) => state.claims.items;
export const selectSelectedClaim = (state: RootState) => state.claims.selectedClaim;
export const selectClaimsLoading = (state: RootState) => state.claims.loading;
export const selectClaimFilters = (state: RootState) => state.claims.filters;

export const selectPendingClaims = createSelector(selectClaimItems, (claims) =>
  claims.filter((c) => c.status === 'submitted' || c.status === 'under_review'),
);

export const selectClaimsByStatus = createSelector(selectClaimItems, (claims) => {
  const grouped: Record<string, number> = {};
  claims.forEach((c) => {
    grouped[c.status] = (grouped[c.status] || 0) + 1;
  });
  return grouped;
});

// Customer selectors
export const selectCustomers = (state: RootState) => state.customers;
export const selectCustomerItems = (state: RootState) => state.customers.items;
export const selectSelectedCustomer = (state: RootState) => state.customers.selectedCustomer;

// Dashboard selectors
export const selectDashboard = (state: RootState) => state.dashboard;
export const selectDashboardMetrics = (state: RootState) => state.dashboard.metrics;
export const selectDashboardLoading = (state: RootState) => state.dashboard.loading;
