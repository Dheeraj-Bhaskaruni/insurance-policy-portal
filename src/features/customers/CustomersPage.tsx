import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, SearchBar, Table, Pagination } from '../../components/ui';
import { usePageTitle } from '../../hooks/usePageTitle';
import { fetchCustomers } from '../../store/customersSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Customer } from '../../types';
import { formatCurrency, formatPhoneNumber } from '../../utils/formatters';

import './CustomersPage.css';

const CustomersPage: React.FC = () => {
  usePageTitle('Customers');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, total, page, totalPages, loading } = useAppSelector((state) => state.customers);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);

  useEffect(() => {
    dispatch(fetchCustomers({ search: searchQuery, page: currentPage, pageSize: 10 }));
  }, [dispatch, searchQuery, currentPage]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (c: Customer) => (
        <div className="customer-name-cell">
          <div className="customer-avatar-sm">
            {c.firstName[0]}
            {c.lastName[0]}
          </div>
          <div>
            <div className="customer-full-name">
              {c.firstName} {c.lastName}
            </div>
            <div className="customer-email">{c.email}</div>
          </div>
        </div>
      ),
    },
    { key: 'phone', label: 'Phone', render: (c: Customer) => formatPhoneNumber(c.phone) },
    { key: 'location', label: 'Location', render: (c: Customer) => `${c.city}, ${c.state}` },
    { key: 'policies', label: 'Policies', render: (c: Customer) => c.policies.length },
    {
      key: 'totalPremium',
      label: 'Total Premium',
      render: (c: Customer) => formatCurrency(c.totalPremium),
    },
  ];

  return (
    <div className="customers-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">{total} total customers</p>
        </div>
      </div>

      <Card padding="none">
        <div className="customers-toolbar">
          <SearchBar onSearch={handleSearch} placeholder="Search customers..." />
        </div>
        <Table
          columns={columns}
          data={items}
          keyExtractor={(c) => c.id}
          onRowClick={(c) => navigate(`/customers/${c.id}`)}
          loading={loading}
          emptyMessage="No customers found"
        />
        <div style={{ padding: '0 1.25rem' }}>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={total}
            pageSize={10}
          />
        </div>
      </Card>
    </div>
  );
};

export default CustomersPage;
