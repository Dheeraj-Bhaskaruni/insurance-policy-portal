import { mockPolicies, mockClaims, mockCustomers } from '../mocks/data';
import { DashboardMetrics, ActivityItem } from '../types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const dashboardService = {
  async getMetrics(customerId?: string): Promise<DashboardMetrics> {
    await delay(500);
    const policies = customerId
      ? mockPolicies.filter((p) => p.customerId === customerId)
      : mockPolicies;
    const claims = customerId ? mockClaims.filter((c) => c.customerId === customerId) : mockClaims;

    const activePolicies = policies.filter((p) => p.status === 'active').length;
    const pendingClaims = claims.filter(
      (c) => c.status === 'submitted' || c.status === 'under_review',
    ).length;
    const totalPremium = policies
      .filter((p) => p.status === 'active')
      .reduce((sum, p) => sum + p.premiumAmount, 0);
    const claimsRatio = claims.length / Math.max(policies.length, 1);

    return {
      totalPolicies: policies.length,
      activePolicies,
      pendingClaims,
      totalPremiumCollected: totalPremium,
      claimsRatio,
      customerCount: customerId ? 1 : mockCustomers.length,
    };
  },

  async getRecentActivity(customerId?: string): Promise<ActivityItem[]> {
    await delay(400);
    const activities: (ActivityItem & { customerId?: string })[] = [
      {
        id: '1',
        type: 'policy_created',
        description: 'New auto policy INS-7K2M4P created for Emily Chen',
        timestamp: '2026-03-25T14:30:00Z',
        userId: '2',
        customerId: 'CUST-001',
      },
      {
        id: '2',
        type: 'claim_filed',
        description: 'Claim CLM-9X3B2R filed for water damage on policy INS-3H8J1K',
        timestamp: '2026-03-25T11:15:00Z',
        userId: '3',
        customerId: 'CUST-002',
      },
      {
        id: '3',
        type: 'claim_resolved',
        description: 'Claim CLM-4W7N5Q approved and settled for $12,500',
        timestamp: '2026-03-24T16:45:00Z',
        userId: '1',
        customerId: 'CUST-001',
      },
      {
        id: '4',
        type: 'payment_received',
        description: 'Premium payment of $2,400 received from Robert Garcia',
        timestamp: '2026-03-24T09:00:00Z',
        userId: '2',
        customerId: 'CUST-002',
      },
      {
        id: '5',
        type: 'policy_renewed',
        description: 'Home policy INS-5T9P3L renewed for another year',
        timestamp: '2026-03-23T13:20:00Z',
        userId: '2',
        customerId: 'CUST-003',
      },
      {
        id: '6',
        type: 'claim_filed',
        description: 'Claim CLM-8D2K6M filed for auto collision on policy INS-1A4C7E',
        timestamp: '2026-03-23T10:00:00Z',
        userId: '3',
        customerId: 'CUST-005',
      },
      {
        id: '7',
        type: 'policy_created',
        description: 'New health policy INS-6R1V8W created for Lisa Park',
        timestamp: '2026-03-22T15:30:00Z',
        userId: '2',
        customerId: 'CUST-004',
      },
      {
        id: '8',
        type: 'payment_received',
        description: 'Premium payment of $1,850 received from Michael Torres',
        timestamp: '2026-03-22T08:45:00Z',
        userId: '2',
        customerId: 'CUST-003',
      },
    ];
    if (customerId) {
      return activities.filter((a) => a.customerId === customerId);
    }
    return activities;
  },

  async getPolicyDistribution(
    customerId?: string,
  ): Promise<Array<{ name: string; value: number; color: string }>> {
    await delay(300);
    const policies = customerId
      ? mockPolicies.filter((p) => p.customerId === customerId)
      : mockPolicies;
    const dist = policies.reduce(
      (acc, p) => {
        acc[p.type] = (acc[p.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const colors: Record<string, string> = {
      auto: '#3B82F6',
      home: '#10B981',
      life: '#8B5CF6',
      health: '#F59E0B',
    };
    return Object.entries(dist).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
      color: colors[key] || '#6B7280',
    }));
  },

  async getClaimsOverview(
    customerId?: string,
  ): Promise<Array<{ name: string; value: number; color: string }>> {
    await delay(300);
    const claims = customerId ? mockClaims.filter((c) => c.customerId === customerId) : mockClaims;
    const dist = claims.reduce(
      (acc, c) => {
        acc[c.status] = (acc[c.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const colors: Record<string, string> = {
      submitted: '#6B7280',
      under_review: '#F59E0B',
      approved: '#10B981',
      rejected: '#EF4444',
      settled: '#3B82F6',
    };
    const labels: Record<string, string> = {
      submitted: 'Submitted',
      under_review: 'Under Review',
      approved: 'Approved',
      rejected: 'Rejected',
      settled: 'Settled',
    };
    return Object.entries(dist).map(([key, value]) => ({
      name: labels[key] || key,
      value,
      color: colors[key] || '#6B7280',
    }));
  },
};
