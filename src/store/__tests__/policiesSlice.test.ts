import { describe, it, expect } from 'vitest';

import { Policy } from '../../types';
import policiesReducer, { setFilters, clearSelectedPolicy, fetchPolicies, cancelPolicy } from '../policiesSlice';

const mockPolicy: Policy = {
  id: 'POL-001',
  policyNumber: 'INS-TEST',
  type: 'auto',
  status: 'active',
  customerId: 'CUST-001',
  customerName: 'Test User',
  premiumAmount: 1200,
  coverageAmount: 50000,
  deductible: 500,
  startDate: '2025-01-01T00:00:00Z',
  endDate: '2026-01-01T00:00:00Z',
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
  details: { description: 'Test policy' },
};

describe('policiesSlice', () => {
  const initialState = {
    items: [],
    selectedPolicy: null,
    total: 0,
    page: 1,
    totalPages: 1,
    loading: false,
    error: null,
    filters: { page: 1, pageSize: 10 },
  };

  it('returns initial state', () => {
    expect(policiesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('synchronous actions', () => {
    it('merges new filters while preserving existing ones', () => {
      const state = policiesReducer(initialState, setFilters({ search: 'test', page: 2 }));
      expect(state.filters).toEqual({ page: 2, pageSize: 10, search: 'test' });
    });

    it('clears selected policy', () => {
      const withSelected = { ...initialState, selectedPolicy: mockPolicy };
      const state = policiesReducer(withSelected, clearSelectedPolicy());
      expect(state.selectedPolicy).toBeNull();
    });
  });

  describe('fetchPolicies thunk', () => {
    it('sets loading on pending', () => {
      const state = policiesReducer(initialState, fetchPolicies.pending('', {}));
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('populates items on fulfilled', () => {
      const payload = { data: [mockPolicy], total: 1, page: 1, pageSize: 10, totalPages: 1 };
      const state = policiesReducer(initialState, fetchPolicies.fulfilled(payload, '', {}));
      expect(state.loading).toBe(false);
      expect(state.items).toEqual([mockPolicy]);
      expect(state.total).toBe(1);
      expect(state.totalPages).toBe(1);
    });

    it('sets error on rejected', () => {
      const state = policiesReducer(
        initialState,
        fetchPolicies.rejected(null, '', {}, 'Network error'),
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
    });
  });

  describe('cancelPolicy thunk', () => {
    it('updates policy status in items list', () => {
      const stateWithPolicy = { ...initialState, items: [mockPolicy] };
      const cancelledPolicy = { ...mockPolicy, status: 'cancelled' as const };
      const state = policiesReducer(
        stateWithPolicy,
        cancelPolicy.fulfilled(cancelledPolicy, '', 'POL-001'),
      );
      expect(state.items[0].status).toBe('cancelled');
    });

    it('updates selectedPolicy if it matches cancelled id', () => {
      const stateWithSelected = { ...initialState, items: [mockPolicy], selectedPolicy: mockPolicy };
      const cancelledPolicy = { ...mockPolicy, status: 'cancelled' as const };
      const state = policiesReducer(
        stateWithSelected,
        cancelPolicy.fulfilled(cancelledPolicy, '', 'POL-001'),
      );
      expect(state.selectedPolicy?.status).toBe('cancelled');
    });
  });
});
