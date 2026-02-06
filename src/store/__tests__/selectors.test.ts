import { describe, it, expect } from 'vitest';

import { Policy, Claim, User } from '../../types';
import { RootState } from '../index';
import {
  selectActivePolicies,
  selectTotalPremium,
  selectPendingClaims,
  selectPoliciesByType,
  selectClaimsByStatus,
  selectUserRole,
} from '../selectors';

const makePolicy = (overrides: Partial<Policy> = {}): Policy => ({
  id: 'p1',
  policyNumber: 'POL-001',
  type: 'auto',
  status: 'active',
  customerId: 'c1',
  customerName: 'Test User',
  premiumAmount: 1200,
  coverageAmount: 50000,
  deductible: 500,
  startDate: '2026-01-01T12:00:00Z',
  endDate: '2027-01-01T12:00:00Z',
  createdAt: '2026-01-01T12:00:00Z',
  updatedAt: '2026-01-01T12:00:00Z',
  details: { description: 'Test policy' },
  ...overrides,
});

const makeClaim = (overrides: Partial<Claim> = {}): Claim => ({
  id: 'cl1',
  claimNumber: 'CLM-001',
  policyId: 'p1',
  policyNumber: 'POL-001',
  customerId: 'c1',
  customerName: 'Test User',
  type: 'auto',
  status: 'submitted',
  amount: 5000,
  description: 'Test claim',
  incidentDate: '2026-01-15T12:00:00Z',
  filedDate: '2026-01-16T12:00:00Z',
  documents: [],
  notes: [],
  ...overrides,
});

const makeState = (overrides: Partial<RootState> = {}): RootState =>
  ({
    auth: { user: null, token: null, isAuthenticated: false, loading: false, error: null },
    policies: {
      items: [],
      total: 0,
      page: 1,
      totalPages: 0,
      loading: false,
      error: null,
      selectedPolicy: null,
      filters: {},
    },
    claims: {
      items: [],
      total: 0,
      page: 1,
      totalPages: 0,
      loading: false,
      error: null,
      selectedClaim: null,
      filters: {},
    },
    customers: {
      items: [],
      total: 0,
      page: 1,
      totalPages: 0,
      loading: false,
      error: null,
      selectedCustomer: null,
    },
    dashboard: {
      metrics: null,
      recentActivity: [],
      policyDistribution: [],
      claimsOverview: [],
      loading: false,
      error: null,
    },
    ...overrides,
  }) as RootState;

describe('Selectors', () => {
  describe('selectActivePolicies', () => {
    it('returns only active policies', () => {
      const state = makeState({
        policies: {
          ...makeState().policies,
          items: [
            makePolicy({ id: 'p1', status: 'active' }),
            makePolicy({ id: 'p2', status: 'cancelled' }),
            makePolicy({ id: 'p3', status: 'active' }),
            makePolicy({ id: 'p4', status: 'expired' }),
          ],
        },
      });
      const result = selectActivePolicies(state);
      expect(result).toHaveLength(2);
      expect(result.every((p) => p.status === 'active')).toBe(true);
    });

    it('returns empty array when no active policies', () => {
      const state = makeState({
        policies: {
          ...makeState().policies,
          items: [makePolicy({ status: 'cancelled' })],
        },
      });
      expect(selectActivePolicies(state)).toHaveLength(0);
    });
  });

  describe('selectTotalPremium', () => {
    it('sums premiums of active policies only', () => {
      const state = makeState({
        policies: {
          ...makeState().policies,
          items: [
            makePolicy({ id: 'p1', status: 'active', premiumAmount: 1200 }),
            makePolicy({ id: 'p2', status: 'cancelled', premiumAmount: 3000 }),
            makePolicy({ id: 'p3', status: 'active', premiumAmount: 800 }),
          ],
        },
      });
      expect(selectTotalPremium(state)).toBe(2000);
    });

    it('returns 0 when no active policies', () => {
      expect(selectTotalPremium(makeState())).toBe(0);
    });
  });

  describe('selectPendingClaims', () => {
    it('returns submitted and under_review claims', () => {
      const state = makeState({
        claims: {
          ...makeState().claims,
          items: [
            makeClaim({ id: 'c1', status: 'submitted' }),
            makeClaim({ id: 'c2', status: 'under_review' }),
            makeClaim({ id: 'c3', status: 'approved' }),
            makeClaim({ id: 'c4', status: 'rejected' }),
          ],
        },
      });
      const result = selectPendingClaims(state);
      expect(result).toHaveLength(2);
    });
  });

  describe('selectPoliciesByType', () => {
    it('groups policies by type with counts', () => {
      const state = makeState({
        policies: {
          ...makeState().policies,
          items: [
            makePolicy({ id: 'p1', type: 'auto' }),
            makePolicy({ id: 'p2', type: 'home' }),
            makePolicy({ id: 'p3', type: 'auto' }),
            makePolicy({ id: 'p4', type: 'life' }),
          ],
        },
      });
      const result = selectPoliciesByType(state);
      expect(result).toEqual({ auto: 2, home: 1, life: 1 });
    });
  });

  describe('selectClaimsByStatus', () => {
    it('groups claims by status with counts', () => {
      const state = makeState({
        claims: {
          ...makeState().claims,
          items: [
            makeClaim({ id: 'c1', status: 'submitted' }),
            makeClaim({ id: 'c2', status: 'submitted' }),
            makeClaim({ id: 'c3', status: 'approved' }),
          ],
        },
      });
      const result = selectClaimsByStatus(state);
      expect(result).toEqual({ submitted: 2, approved: 1 });
    });
  });

  describe('selectUserRole', () => {
    it('returns the user role when authenticated', () => {
      const state = makeState({
        auth: {
          ...makeState().auth,
          user: {
            id: 'u1',
            email: 'test@test.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'admin',
            createdAt: '2026-01-01',
          } as User,
        },
      });
      expect(selectUserRole(state)).toBe('admin');
    });

    it('returns null when no user', () => {
      expect(selectUserRole(makeState())).toBeNull();
    });
  });
});
