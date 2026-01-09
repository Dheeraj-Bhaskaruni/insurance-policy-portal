import React, { useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

import { Card } from '../../components/ui';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPolicies } from '../../store/policiesSlice';
import { fetchClaims } from '../../store/claimsSlice';
import { usePageTitle } from '../../hooks/usePageTitle';
import { formatCurrency } from '../../utils/formatters';
import { POLICY_TYPE_LABELS, POLICY_TYPE_COLORS } from '../../utils/constants';

import './ReportsPage.css';

const ReportsPage: React.FC = () => {
  usePageTitle('Reports & Analytics');
  const dispatch = useAppDispatch();
  const policies = useAppSelector((state) => state.policies.items);
  const claims = useAppSelector((state) => state.claims.items);

  useEffect(() => {
    dispatch(fetchPolicies({ pageSize: 100 }));
    dispatch(fetchClaims({ pageSize: 100 }));
  }, [dispatch]);

  const premiumByType = useMemo(() => {
    const grouped: Record<string, number> = {};
    policies.forEach((p) => {
      grouped[p.type] = (grouped[p.type] || 0) + p.premiumAmount;
    });
    return Object.entries(grouped).map(([type, total]) => ({
      name: POLICY_TYPE_LABELS[type] || type,
      premium: total,
      fill: POLICY_TYPE_COLORS[type] || '#6B7280',
    }));
  }, [policies]);

  const claimsRatioData = useMemo(() => {
    const types = ['auto', 'home', 'life', 'health'];
    return types.map((type) => {
      const pCount = policies.filter((p) => p.type === type).length;
      const cCount = claims.filter((c) => c.type === type).length;
      const ratio = pCount > 0 ? (cCount / pCount) * 100 : 0;
      return {
        name: POLICY_TYPE_LABELS[type] || type,
        claims: cCount,
        policies: pCount,
        ratio: Math.round(ratio),
      };
    });
  }, [policies, claims]);

  const totalPremium = policies.filter((p) => p.status === 'active').reduce((s, p) => s + p.premiumAmount, 0);
  const totalClaimAmount = claims.reduce((s, c) => s + c.amount, 0);
  const settledAmount = claims.filter((c) => c.status === 'settled').reduce((s, c) => s + c.amount, 0);

  return (
    <div className="reports-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Insurance operations overview and performance metrics</p>
        </div>
      </div>

      <div className="reports-summary">
        <Card className="report-summary-card">
          <span className="report-summary-label">Total Active Premium</span>
          <span className="report-summary-value">{formatCurrency(totalPremium)}</span>
        </Card>
        <Card className="report-summary-card">
          <span className="report-summary-label">Total Claims Filed</span>
          <span className="report-summary-value">{formatCurrency(totalClaimAmount)}</span>
        </Card>
        <Card className="report-summary-card">
          <span className="report-summary-label">Claims Settled</span>
          <span className="report-summary-value">{formatCurrency(settledAmount)}</span>
        </Card>
        <Card className="report-summary-card">
          <span className="report-summary-label">Loss Ratio</span>
          <span className="report-summary-value">{totalPremium > 0 ? ((totalClaimAmount / totalPremium) * 100).toFixed(1) : 0}%</span>
        </Card>
      </div>

      <div className="reports-charts">
        <Card className="report-chart-card">
          <h3 className="report-chart-title">Premium Collection by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={premiumByType} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="premium" radius={[4, 4, 0, 0]}>
                {premiumByType.map((entry, idx) => (
                  <Bar key={idx} dataKey="premium" fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="report-chart-card">
          <h3 className="report-chart-title">Claims Ratio Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={claimsRatioData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="policies" fill="#3B82F6" name="Policies" radius={[4, 4, 0, 0]} />
              <Bar dataKey="claims" fill="#EF4444" name="Claims" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="report-table-card">
        <h3 className="report-chart-title">Premium Collection Details</h3>
        <table className="report-table">
          <thead>
            <tr>
              <th>Policy Type</th>
              <th>Active Policies</th>
              <th>Total Premium</th>
              <th>Avg. Premium</th>
              <th>Claims Filed</th>
              <th>Claims Ratio</th>
            </tr>
          </thead>
          <tbody>
            {claimsRatioData.map((row) => {
              const typePolicies = policies.filter((p) => POLICY_TYPE_LABELS[p.type] === row.name && p.status === 'active');
              const totalTypePremium = typePolicies.reduce((s, p) => s + p.premiumAmount, 0);
              const avgPremium = typePolicies.length > 0 ? totalTypePremium / typePolicies.length : 0;
              return (
                <tr key={row.name}>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.policies}</td>
                  <td>{formatCurrency(totalTypePremium)}</td>
                  <td>{formatCurrency(avgPremium)}</td>
                  <td>{row.claims}</td>
                  <td>{row.ratio}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default ReportsPage;
