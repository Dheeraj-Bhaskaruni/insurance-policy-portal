import React, { useEffect } from 'react';

import { Card } from '../../components/ui';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchDashboardData } from '../../store/dashboardSlice';
import { usePageTitle } from '../../hooks/usePageTitle';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

import MetricCard from './MetricCard';
import PolicyChart from './PolicyChart';
import ClaimsChart from './ClaimsChart';
import ActivityFeed from './ActivityFeed';

import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  usePageTitle('Dashboard');
  const dispatch = useAppDispatch();
  const { metrics, recentActivity, policyDistribution, claimsOverview, loading } = useAppSelector(
    (state) => state.dashboard,
  );

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading && !metrics) {
    return <LoadingSpinner size="lg" message="Loading dashboard..." />;
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your insurance operations</p>
        </div>
      </div>

      {metrics && (
        <div className="dashboard-metrics">
          <MetricCard
            title="Total Policies"
            value={metrics.totalPolicies.toString()}
            subtitle={`${metrics.activePolicies} active`}
            color="blue"
          />
          <MetricCard
            title="Pending Claims"
            value={metrics.pendingClaims.toString()}
            subtitle="Awaiting review"
            color="amber"
          />
          <MetricCard
            title="Premium Collected"
            value={formatCurrency(metrics.totalPremiumCollected)}
            subtitle="Active policies"
            color="green"
          />
          <MetricCard
            title="Customers"
            value={metrics.customerCount.toString()}
            subtitle={`${(metrics.claimsRatio * 100).toFixed(0)}% claims ratio`}
            color="purple"
          />
        </div>
      )}

      <div className="dashboard-charts">
        <Card className="dashboard-chart-card">
          <h3 className="chart-title">Policy Distribution</h3>
          <PolicyChart data={policyDistribution} />
        </Card>
        <Card className="dashboard-chart-card">
          <h3 className="chart-title">Claims Overview</h3>
          <ClaimsChart data={claimsOverview} />
        </Card>
      </div>

      <Card className="dashboard-activity-card">
        <h3 className="chart-title">Recent Activity</h3>
        <ActivityFeed activities={recentActivity} />
      </Card>
    </div>
  );
};

export default DashboardPage;
