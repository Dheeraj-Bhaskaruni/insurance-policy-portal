import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, Button, Badge, SearchBar, Table, Pagination } from '../../components/ui';
import Select from '../../components/ui/Select';
import { usePageTitle } from '../../hooks/usePageTitle';
import { fetchClaims, setClaimFilters } from '../../store/claimsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectCurrentUser } from '../../store/selectors';
import { Claim, ClaimStatus } from '../../types';
import { CLAIM_STATUS_LABELS, POLICY_TYPE_LABELS } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';

import './ClaimsPage.css';

const statusBadgeVariant: Record<ClaimStatus, 'success' | 'warning' | 'danger' | 'default' | 'info'> = {
  submitted: 'default',
  under_review: 'warning',
  approved: 'success',
  rejected: 'danger',
  settled: 'info',
};

const ClaimsPage: React.FC = () => {
  usePageTitle('Claims');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const { items, total, page, totalPages, loading, filters } = useAppSelector((state) => state.claims);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const isCustomer = user?.role === 'customer';

  useEffect(() => {
    const params = isCustomer ? { ...filters, customerId: user?.customerId } : filters;
    dispatch(fetchClaims(params));
  }, [dispatch, filters, isCustomer, user?.customerId]);

  const handleSearch = useCallback(
    (query: string) => dispatch(setClaimFilters({ search: query, page: 1 })),
    [dispatch],
  );

  const columns = [
    {
      key: 'claimNumber',
      label: 'Claim #',
      sortable: true,
      render: (c: Claim) => <span className="claim-number">{c.claimNumber}</span>,
    },
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'policyNumber', label: 'Policy #', sortable: true },
    {
      key: 'type', label: 'Type', render: (c: Claim) => POLICY_TYPE_LABELS[c.type] || c.type,
    },
    {
      key: 'status', label: 'Status',
      render: (c: Claim) => <Badge variant={statusBadgeVariant[c.status]}>{CLAIM_STATUS_LABELS[c.status]}</Badge>,
    },
    {
      key: 'amount', label: 'Amount', sortable: true,
      render: (c: Claim) => formatCurrency(c.amount),
    },
    {
      key: 'filedDate', label: 'Filed', sortable: true,
      render: (c: Claim) => formatDate(c.filedDate),
    },
  ];

  return (
    <div className="claims-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Claims</h1>
          <p className="page-subtitle">{total} total claims</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/claims/new')}>
          + File Claim
        </Button>
      </div>

      <Card padding="none" className="claims-card">
        <div className="claims-toolbar">
          <SearchBar onSearch={handleSearch} placeholder="Search claims..." />
          <Select
            options={Object.entries(CLAIM_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))}
            placeholder="All Statuses"
            onChange={(e) => dispatch(setClaimFilters({ status: e.target.value || undefined, page: 1 }))}
            fullWidth={false}
          />
        </div>

        <Table
          columns={columns}
          data={items}
          keyExtractor={(c) => c.id}
          onRowClick={(c) => navigate(`/claims/${c.id}`)}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={(key) => { setSortOrder(sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc'); setSortBy(key); }}
          loading={loading}
          emptyMessage="No claims found"
        />

        <div className="claims-pagination">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => dispatch(setClaimFilters({ page: p }))} totalItems={total} pageSize={filters.pageSize} />
        </div>
      </Card>
    </div>
  );
};

export default ClaimsPage;
