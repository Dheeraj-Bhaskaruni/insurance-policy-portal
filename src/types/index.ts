// ============================================================
// Core Domain Types - Insurance Policy Management Portal
// ============================================================

// --- User & Auth ---
export type UserRole = 'admin' | 'agent' | 'customer';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  customerId?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// --- Policy ---
export type PolicyType = 'auto' | 'home' | 'life' | 'health';
export type PolicyStatus = 'active' | 'pending' | 'expired' | 'cancelled';

export interface Policy {
  id: string;
  policyNumber: string;
  type: PolicyType;
  status: PolicyStatus;
  customerId: string;
  customerName: string;
  premiumAmount: number;
  coverageAmount: number;
  deductible: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  details: PolicyDetails;
}

export interface PolicyDetails {
  description: string;
  beneficiaries?: string[];
  vehicleInfo?: VehicleInfo;
  propertyInfo?: PropertyInfo;
  healthInfo?: HealthInfo;
}

export interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  vin: string;
}

export interface PropertyInfo {
  address: string;
  squareFootage: number;
  yearBuilt: number;
  propertyType: string;
}

export interface HealthInfo {
  planType: string;
  networkType: string;
  copay: number;
}

export interface CreatePolicyPayload {
  type: PolicyType;
  customerId: string;
  premiumAmount: number;
  coverageAmount: number;
  deductible: number;
  startDate: string;
  endDate: string;
  details: PolicyDetails;
}

// --- Claims ---
export type ClaimStatus = 'submitted' | 'under_review' | 'approved' | 'rejected' | 'settled';

export interface Claim {
  id: string;
  claimNumber: string;
  policyId: string;
  policyNumber: string;
  customerId: string;
  customerName: string;
  type: PolicyType;
  status: ClaimStatus;
  amount: number;
  description: string;
  incidentDate: string;
  filedDate: string;
  resolvedDate?: string;
  documents: ClaimDocument[];
  notes: ClaimNote[];
}

export interface ClaimDocument {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export interface ClaimNote {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface CreateClaimPayload {
  policyId: string;
  amount: number;
  description: string;
  incidentDate: string;
}

// --- Customer ---
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  dateOfBirth: string;
  createdAt: string;
  policies: string[];
  totalPremium: number;
}

// --- Dashboard ---
export interface DashboardMetrics {
  totalPolicies: number;
  activePolicies: number;
  pendingClaims: number;
  totalPremiumCollected: number;
  claimsRatio: number;
  customerCount: number;
}

export interface ActivityItem {
  id: string;
  type: 'policy_created' | 'claim_filed' | 'claim_resolved' | 'policy_renewed' | 'payment_received';
  description: string;
  timestamp: string;
  userId: string;
}

// --- Common ---
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

export interface FilterParams {
  search?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  customerId?: string;
}
