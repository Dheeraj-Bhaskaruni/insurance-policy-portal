import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Card, Badge, Button, Breadcrumb } from '../../components/ui';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchCustomerById, clearSelectedCustomer } from '../../store/customersSlice';
import { usePageTitle } from '../../hooks/usePageTitle';
import { formatCurrency, formatPhoneNumber, formatDate } from '../../utils/formatters';

import './CustomerDetailPage.css';

const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedCustomer: customer, loading } = useAppSelector((state) => state.customers);

  usePageTitle(customer ? `${customer.firstName} ${customer.lastName}` : 'Customer');

  useEffect(() => {
    if (id) dispatch(fetchCustomerById(id));
    return () => { dispatch(clearSelectedCustomer()); };
  }, [id, dispatch]);

  if (loading || !customer) {
    return <LoadingSpinner size="lg" message="Loading customer..." />;
  }

  return (
    <div className="customer-detail">
      <Breadcrumb
        items={[
          { label: 'Dashboard', to: '/' },
          { label: 'Customers', to: '/customers' },
          { label: `${customer.firstName} ${customer.lastName}` },
        ]}
      />

      <Card className="customer-profile-card">
        <div className="customer-profile-header">
          <div className="customer-avatar-lg">
            {customer.firstName[0]}{customer.lastName[0]}
          </div>
          <div>
            <h2>{customer.firstName} {customer.lastName}</h2>
            <p className="customer-detail-meta">Customer since {formatDate(customer.createdAt)}</p>
          </div>
        </div>

        <div className="customer-info-grid">
          <div className="customer-info-item"><span>Email</span><strong>{customer.email}</strong></div>
          <div className="customer-info-item"><span>Phone</span><strong>{formatPhoneNumber(customer.phone)}</strong></div>
          <div className="customer-info-item"><span>Address</span><strong>{customer.address}, {customer.city}, {customer.state} {customer.zipCode}</strong></div>
          <div className="customer-info-item"><span>Date of Birth</span><strong>{formatDate(customer.dateOfBirth)}</strong></div>
          <div className="customer-info-item"><span>Active Policies</span><strong>{customer.policies.length}</strong></div>
          <div className="customer-info-item"><span>Total Premium</span><strong>{formatCurrency(customer.totalPremium)}</strong></div>
        </div>

        <div className="customer-policies-section">
          <h3>Policy IDs</h3>
          <div className="customer-policy-badges">
            {customer.policies.map((pId) => (
              <Badge key={pId} variant="info">{pId}</Badge>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CustomerDetailPage;
