export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

export const POLICY_TYPE_LABELS: Record<string, string> = {
  auto: 'Automobile',
  home: 'Homeowners',
  life: 'Life Insurance',
  health: 'Health Insurance',
};

export const POLICY_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  pending: 'Pending',
  expired: 'Expired',
  cancelled: 'Cancelled',
};

export const CLAIM_STATUS_LABELS: Record<string, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
  settled: 'Settled',
};

export const POLICY_TYPE_COLORS: Record<string, string> = {
  auto: '#3B82F6',
  home: '#10B981',
  life: '#8B5CF6',
  health: '#F59E0B',
};

export const CLAIM_STATUS_COLORS: Record<string, string> = {
  submitted: '#6B7280',
  under_review: '#F59E0B',
  approved: '#10B981',
  rejected: '#EF4444',
  settled: '#3B82F6',
};

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  POLICIES: '/policies',
  POLICY_DETAIL: '/policies/:id',
  POLICY_CREATE: '/policies/new',
  CLAIMS: '/claims',
  CLAIM_DETAIL: '/claims/:id',
  CLAIM_CREATE: '/claims/new',
  CUSTOMERS: '/customers',
  CUSTOMER_DETAIL: '/customers/:id',
  REPORTS: '/reports',
  SETTINGS: '/settings',
} as const;

export const PAGE_SIZES = [10, 25, 50, 100];
export const DEFAULT_PAGE_SIZE = 10;
