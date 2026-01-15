import { Claim, CreateClaimPayload, PaginatedResponse, FilterParams } from '../types';
import { mockClaims, mockPolicies } from '../mocks/data';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const claimService = {
  async getClaims(params: FilterParams = {}): Promise<PaginatedResponse<Claim>> {
    await delay(600);
    let filtered = [...mockClaims];

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.claimNumber.toLowerCase().includes(q) ||
          c.customerName.toLowerCase().includes(q) ||
          c.policyNumber.toLowerCase().includes(q),
      );
    }
    if (params.status) {
      filtered = filtered.filter((c) => c.status === params.status);
    }
    if (params.type) {
      filtered = filtered.filter((c) => c.type === params.type);
    }

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const start = (page - 1) * pageSize;

    return {
      data: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    };
  },

  async getClaimById(id: string): Promise<Claim> {
    await delay(400);
    const claim = mockClaims.find((c) => c.id === id);
    if (!claim) throw new Error('Claim not found');
    return claim;
  },

  async createClaim(payload: CreateClaimPayload): Promise<Claim> {
    await delay(1000);
    const policy = mockPolicies.find((p) => p.id === payload.policyId);
    if (!policy) throw new Error('Policy not found');
    const newClaim: Claim = {
      id: `CLM-${Date.now()}`,
      claimNumber: `CLM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      policyId: payload.policyId,
      policyNumber: policy.policyNumber,
      customerId: policy.customerId,
      customerName: policy.customerName,
      type: policy.type,
      status: 'submitted',
      amount: payload.amount,
      description: payload.description,
      incidentDate: payload.incidentDate,
      filedDate: new Date().toISOString(),
      documents: [],
      notes: [],
    };
    mockClaims.unshift(newClaim);
    return newClaim;
  },

  async updateClaimStatus(id: string, status: Claim['status']): Promise<Claim> {
    await delay(600);
    const idx = mockClaims.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Claim not found');
    mockClaims[idx] = {
      ...mockClaims[idx],
      status,
      resolvedDate: ['approved', 'rejected', 'settled'].includes(status)
        ? new Date().toISOString()
        : undefined,
    };
    return mockClaims[idx];
  },
};
