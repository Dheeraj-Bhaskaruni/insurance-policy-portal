import { mockPolicies } from '../mocks/data';
import { Policy, CreatePolicyPayload, PaginatedResponse, FilterParams } from '../types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const policyService = {
  async getPolicies(params: FilterParams = {}): Promise<PaginatedResponse<Policy>> {
    await delay(600);
    let filtered = [...mockPolicies];

    if (params.customerId) {
      filtered = filtered.filter((p) => p.customerId === params.customerId);
    }

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.policyNumber.toLowerCase().includes(q) ||
          p.customerName.toLowerCase().includes(q),
      );
    }
    if (params.status) {
      filtered = filtered.filter((p) => p.status === params.status);
    }
    if (params.type) {
      filtered = filtered.filter((p) => p.type === params.type);
    }

    if (params.sortBy) {
      const key = params.sortBy as keyof Policy;
      filtered.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return params.sortOrder === 'desc' ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
        }
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return params.sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
        }
        return 0;
      });
    }

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const start = (page - 1) * pageSize;
    const paginatedData = filtered.slice(start, start + pageSize);

    return {
      data: paginatedData,
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    };
  },

  async getPolicyById(id: string): Promise<Policy> {
    await delay(400);
    const policy = mockPolicies.find((p) => p.id === id);
    if (!policy) throw new Error('Policy not found');
    return policy;
  },

  async createPolicy(payload: CreatePolicyPayload): Promise<Policy> {
    await delay(1000);
    const newPolicy: Policy = {
      id: `POL-${Date.now()}`,
      policyNumber: `INS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      ...payload,
      status: 'pending',
      customerName: 'New Customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockPolicies.unshift(newPolicy);
    return newPolicy;
  },

  async cancelPolicy(id: string): Promise<Policy> {
    await delay(600);
    const idx = mockPolicies.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Policy not found');
    mockPolicies[idx] = { ...mockPolicies[idx], status: 'cancelled', updatedAt: new Date().toISOString() };
    return mockPolicies[idx];
  },

  async renewPolicy(id: string): Promise<Policy> {
    await delay(800);
    const idx = mockPolicies.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Policy not found');
    const current = mockPolicies[idx];
    const newEnd = new Date(current.endDate);
    newEnd.setFullYear(newEnd.getFullYear() + 1);
    mockPolicies[idx] = {
      ...current,
      status: 'active',
      endDate: newEnd.toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return mockPolicies[idx];
  },
};
