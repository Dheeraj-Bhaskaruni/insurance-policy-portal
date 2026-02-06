import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, Button, Badge, SearchBar, Table, Pagination } from '../../components/ui';
import Select from '../../components/ui/Select';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPolicies, setFilters } from '../../store/policiesSlice';
import { selectCurrentUser } from '../../store/selectors';
import { Policy, PolicyStatus } from '../../types';
import { POLICY_TYPE_LABELS, POLICY_STATUS_LABELS } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';

import './PoliciesPage.css';

const statusBadgeVariant: Record<PolicyStatus, 'success' | 'warning' | 'danger' | 'default'> = {
  active: 'success',
  pending: 'warning',
  expired: 'default',
  cancelled: 'danger',
};

const PoliciesPage: React.FC = () => {
  usePageTitle('Policies');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const { items, total, page, totalPages, loading, filters } = useAppSelector((state) => state.policies);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const isCustomer = user?.role === 'customer';

  useEffect(() => {
    const params = isCustomer ? { ...filters, customerId: user?.customerId } : filters;
    dispatch(fetchPolicies(params));
  }, [dispatch, filters, isCustomer, user?.customerId]);

  const handleSearch = useCallback(
    (query: string) => {
      dispatch(setFilters({ search: query, page: 1 }));
    },
    [dispatch],
  );

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ status: e.target.value || undefined, page: 1 }));
  };

  const handleTypeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ type: e.target.value || undefined, page: 1 }));
  };

  const handleSort = (key: string) => {
    const newOrder = sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(key);
    setSortOrder(newOrder);
    dispatch(setFilters({ sortBy: key, sortOrder: newOrder }));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setFilters({ page: newPage }));
  };

  const columns = [
    {
      key: 'policyNumber',
      label: 'Policy #',
      sortable: true,
      render: (p: Policy) => <span className="policy-number">{p.policyNumber}</span>,
    },
    {
      key: 'customerName',
      label: 'Customer',
      sortable: true,
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (p: Policy) => POLICY_TYPE_LABELS[p.type] || p.type,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (p: Policy) => (
        <Badge variant={statusBadgeVariant[p.status]}>{POLICY_STATUS_LABELS[p.status]}</Badge>
      ),
    },
    {
      key: 'premiumAmount',
      label: 'Premium',
      sortable: true,
      render: (p: Policy) => formatCurrency(p.premiumAmount),
    },
    {
      key: 'coverageAmount',
      label: 'Coverage',
      sortable: true,
      render: (p: Policy) => formatCurrency(p.coverageAmount),
    },
    {
      key: 'endDate',
      label: 'Expiry',
      sortable: true,
      render: (p: Policy) => formatDate(p.endDate),
    },
  ];

  return (
    <div className="policies-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Policies</h1>
          <p className="page-subtitle">{total} total policies</p>
        </div>
        {!isCustomer && (
          <Button variant="primary" onClick={() => navigate('/policies/new')}>
            + New Policy
          </Button>
        )}
      </div>

      <Card padding="none" className="policies-card">
        <div className="policies-toolbar">
          <SearchBar onSearch={handleSearch} placeholder="Search policies..." />
          <div className="policies-filters">
            <Select
              options={Object.entries(POLICY_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))}
              placeholder="All Statuses"
              onChange={handleStatusFilter}
              fullWidth={false}
            />
            <Select
              options={Object.entries(POLICY_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }))}
              placeholder="All Types"
              onChange={handleTypeFilter}
              fullWidth={false}
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={items}
          keyExtractor={(p) => p.id}
          onRowClick={(p) => navigate(`/policies/${p.id}`)}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          loading={loading}
          emptyMessage="No policies found"
        />

        <div className="policies-pagination">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={total}
            pageSize={filters.pageSize}
          />
        </div>
      </Card>
    </div>
  );
};

export default PoliciesPage;
