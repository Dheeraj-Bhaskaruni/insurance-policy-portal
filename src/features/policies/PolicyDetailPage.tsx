import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import { Card, Badge, Button, Tabs, Breadcrumb } from '../../components/ui';
import Modal from '../../components/ui/Modal';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useToast } from '../../hooks/useToastContext';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchPolicyById,
  cancelPolicy,
  renewPolicy,
  clearSelectedPolicy,
} from '../../store/policiesSlice';
import { PolicyStatus } from '../../types';
import { POLICY_TYPE_LABELS, POLICY_STATUS_LABELS } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';

import './PolicyDetailPage.css';

const statusBadgeVariant: Record<PolicyStatus, 'success' | 'warning' | 'danger' | 'default'> = {
  active: 'success',
  pending: 'warning',
  expired: 'default',
  cancelled: 'danger',
};

const PolicyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedPolicy: policy, loading } = useAppSelector((state) => state.policies);
  const { notify } = useToast();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  usePageTitle(policy ? `Policy ${policy.policyNumber}` : 'Policy Details');

  useEffect(() => {
    if (id) dispatch(fetchPolicyById(id));
    return () => {
      dispatch(clearSelectedPolicy());
    };
  }, [id, dispatch]);

  const handleCancel = async () => {
    if (!policy) return;
    setActionLoading(true);
    const result = await dispatch(cancelPolicy(policy.id));
    setActionLoading(false);
    setShowCancelModal(false);
    if (cancelPolicy.fulfilled.match(result)) {
      notify('success', `Policy ${policy.policyNumber} has been cancelled.`);
    } else {
      notify('error', 'Failed to cancel policy. Please try again.');
    }
  };

  const handleRenew = async () => {
    if (!policy) return;
    setActionLoading(true);
    const result = await dispatch(renewPolicy(policy.id));
    setActionLoading(false);
    if (renewPolicy.fulfilled.match(result)) {
      notify('success', `Policy ${policy.policyNumber} has been renewed for another year.`);
    } else {
      notify('error', 'Failed to renew policy. Please try again.');
    }
  };

  if (loading || !policy) {
    return <LoadingSpinner size="lg" message="Loading policy details..." />;
  }

  const detailTabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="detail-grid">
          <div className="detail-row">
            <span className="detail-label">Description</span>
            <span className="detail-value">{policy.details.description}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Deductible</span>
            <span className="detail-value">{formatCurrency(policy.deductible)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Start Date</span>
            <span className="detail-value">{formatDate(policy.startDate)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">End Date</span>
            <span className="detail-value">{formatDate(policy.endDate)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Created</span>
            <span className="detail-value">{formatDate(policy.createdAt)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Last Updated</span>
            <span className="detail-value">{formatDate(policy.updatedAt)}</span>
          </div>
        </div>
      ),
    },
    {
      id: 'details',
      label: 'Policy Details',
      content: (
        <div className="detail-grid">
          {policy.details.vehicleInfo && (
            <>
              <div className="detail-row">
                <span className="detail-label">Vehicle</span>
                <span className="detail-value">
                  {policy.details.vehicleInfo.year} {policy.details.vehicleInfo.make}{' '}
                  {policy.details.vehicleInfo.model}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">VIN</span>
                <span className="detail-value">{policy.details.vehicleInfo.vin}</span>
              </div>
            </>
          )}
          {policy.details.propertyInfo && (
            <>
              <div className="detail-row">
                <span className="detail-label">Address</span>
                <span className="detail-value">{policy.details.propertyInfo.address}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Square Footage</span>
                <span className="detail-value">
                  {policy.details.propertyInfo.squareFootage.toLocaleString()} sq ft
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Year Built</span>
                <span className="detail-value">{policy.details.propertyInfo.yearBuilt}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Property Type</span>
                <span className="detail-value">{policy.details.propertyInfo.propertyType}</span>
              </div>
            </>
          )}
          {policy.details.healthInfo && (
            <>
              <div className="detail-row">
                <span className="detail-label">Plan Type</span>
                <span className="detail-value">{policy.details.healthInfo.planType}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Network</span>
                <span className="detail-value">{policy.details.healthInfo.networkType}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Copay</span>
                <span className="detail-value">
                  {formatCurrency(policy.details.healthInfo.copay)}
                </span>
              </div>
            </>
          )}
          {policy.details.beneficiaries && (
            <div className="detail-row">
              <span className="detail-label">Beneficiaries</span>
              <span className="detail-value">{policy.details.beneficiaries.join(', ')}</span>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="policy-detail">
      <Breadcrumb
        items={[
          { label: 'Dashboard', to: '/' },
          { label: 'Policies', to: '/policies' },
          { label: policy.policyNumber },
        ]}
      />

      <Card className="policy-detail-card">
        <div className="policy-detail-top">
          <div>
            <div className="policy-detail-number">{policy.policyNumber}</div>
            <div className="policy-detail-customer">{policy.customerName}</div>
          </div>
          <div className="policy-detail-actions">
            <Badge variant={statusBadgeVariant[policy.status]}>
              {POLICY_STATUS_LABELS[policy.status]}
            </Badge>
            {policy.status === 'active' && (
              <>
                <Button variant="outline" size="sm" onClick={handleRenew} loading={actionLoading}>
                  Renew Policy
                </Button>
                <Button variant="danger" size="sm" onClick={() => setShowCancelModal(true)}>
                  Cancel Policy
                </Button>
              </>
            )}
            {policy.status === 'expired' && (
              <Button variant="primary" size="sm" onClick={handleRenew} loading={actionLoading}>
                Renew Policy
              </Button>
            )}
          </div>
        </div>

        <div className="policy-detail-summary">
          <div className="summary-item">
            <span className="summary-label">Type</span>
            <span className="summary-value">{POLICY_TYPE_LABELS[policy.type]}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Premium</span>
            <span className="summary-value">{formatCurrency(policy.premiumAmount)}/yr</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Coverage</span>
            <span className="summary-value">{formatCurrency(policy.coverageAmount)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Valid Until</span>
            <span className="summary-value">{formatDate(policy.endDate)}</span>
          </div>
        </div>

        <Tabs tabs={detailTabs} />
      </Card>

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Policy"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
              Keep Policy
            </Button>
            <Button variant="danger" onClick={handleCancel} loading={actionLoading}>
              Confirm Cancellation
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to cancel policy <strong>{policy.policyNumber}</strong>?
        </p>
        <p
          style={{
            color: 'var(--color-gray-500)',
            marginTop: 'var(--spacing-2)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          This action cannot be undone. The policy will be marked as cancelled immediately.
        </p>
      </Modal>
    </div>
  );
};

export default PolicyDetailPage;
