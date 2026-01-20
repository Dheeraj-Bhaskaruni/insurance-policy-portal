import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Card, Badge, Button, Breadcrumb } from '../../components/ui';
import Modal from '../../components/ui/Modal';
import Select from '../../components/ui/Select';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchClaimById, updateClaimStatus, clearSelectedClaim } from '../../store/claimsSlice';
import { usePageTitle } from '../../hooks/usePageTitle';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';
import { CLAIM_STATUS_LABELS, POLICY_TYPE_LABELS } from '../../utils/constants';
import { ClaimStatus } from '../../types';

import './ClaimDetailPage.css';

const statusBadgeVariant: Record<ClaimStatus, 'success' | 'warning' | 'danger' | 'default' | 'info'> = {
  submitted: 'default', under_review: 'warning', approved: 'success', rejected: 'danger', settled: 'info',
};

const ClaimDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedClaim: claim, loading } = useAppSelector((state) => state.claims);
  const user = useAppSelector((state) => state.auth.user);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<ClaimStatus>('under_review');
  const [updating, setUpdating] = useState(false);

  usePageTitle(claim ? `Claim ${claim.claimNumber}` : 'Claim Details');

  useEffect(() => {
    if (id) dispatch(fetchClaimById(id));
    return () => { dispatch(clearSelectedClaim()); };
  }, [id, dispatch]);

  const handleStatusUpdate = async () => {
    if (!claim) return;
    setUpdating(true);
    await dispatch(updateClaimStatus({ id: claim.id, status: newStatus }));
    setUpdating(false);
    setShowStatusModal(false);
  };

  if (loading || !claim) {
    return <LoadingSpinner size="lg" message="Loading claim details..." />;
  }

  const canUpdateStatus = user?.role === 'admin' || user?.role === 'agent';

  return (
    <div className="claim-detail">
      <Breadcrumb
        items={[
          { label: 'Dashboard', to: '/' },
          { label: 'Claims', to: '/claims' },
          { label: claim.claimNumber },
        ]}
      />

      <Card className="claim-detail-card">
        <div className="claim-detail-top">
          <div>
            <h2 className="claim-detail-number">{claim.claimNumber}</h2>
            <p className="claim-detail-meta">
              {POLICY_TYPE_LABELS[claim.type]} &middot; Policy {claim.policyNumber} &middot; {claim.customerName}
            </p>
          </div>
          <div className="claim-detail-actions">
            <Badge variant={statusBadgeVariant[claim.status]}>{CLAIM_STATUS_LABELS[claim.status]}</Badge>
            {canUpdateStatus && !['settled', 'rejected'].includes(claim.status) && (
              <Button variant="outline" size="sm" onClick={() => setShowStatusModal(true)}>
                Update Status
              </Button>
            )}
          </div>
        </div>

        <div className="claim-info-grid">
          <div className="claim-info-item"><span>Claim Amount</span><strong>{formatCurrency(claim.amount)}</strong></div>
          <div className="claim-info-item"><span>Incident Date</span><strong>{formatDate(claim.incidentDate)}</strong></div>
          <div className="claim-info-item"><span>Filed Date</span><strong>{formatDate(claim.filedDate)}</strong></div>
          <div className="claim-info-item"><span>Resolved Date</span><strong>{claim.resolvedDate ? formatDate(claim.resolvedDate) : 'Pending'}</strong></div>
        </div>

        <div className="claim-section">
          <h3>Description</h3>
          <p className="claim-description">{claim.description}</p>
        </div>

        {claim.documents.length > 0 && (
          <div className="claim-section">
            <h3>Documents</h3>
            <div className="claim-documents">
              {claim.documents.map((doc) => (
                <div key={doc.id} className="claim-document">
                  <span className="doc-name">{doc.name}</span>
                  <span className="doc-date">{formatDate(doc.uploadedAt)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {claim.notes.length > 0 && (
          <div className="claim-section">
            <h3>Notes</h3>
            <div className="claim-notes">
              {claim.notes.map((note) => (
                <div key={note.id} className="claim-note">
                  <div className="note-header">
                    <strong>{note.author}</strong>
                    <span>{formatDateTime(note.createdAt)}</span>
                  </div>
                  <p>{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Modal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} title="Update Claim Status" size="sm"
        footer={<>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleStatusUpdate} loading={updating}>Update</Button>
        </>}
      >
        <Select label="New Status" value={newStatus} onChange={(e) => setNewStatus(e.target.value as ClaimStatus)}
          options={Object.entries(CLAIM_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))}
        />
      </Modal>
    </div>
  );
};

export default ClaimDetailPage;
