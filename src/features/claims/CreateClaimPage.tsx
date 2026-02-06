import React, { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Card, Button } from '../../components/ui';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { usePageTitle } from '../../hooks/usePageTitle';
import { createClaim } from '../../store/claimsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPolicies } from '../../store/policiesSlice';
import { selectPolicyItems } from '../../store/selectors';
import { POLICY_TYPE_LABELS } from '../../utils/constants';

import './CreateClaimPage.css';

const CreateClaimPage: React.FC = () => {
  usePageTitle('File a Claim');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const policies = useAppSelector(selectPolicyItems);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (policies.length === 0) {
      dispatch(fetchPolicies({ pageSize: 100, status: 'active' }));
    }
  }, [dispatch, policies.length]);

  const policyOptions = useMemo(
    () =>
      policies
        .filter((p) => p.status === 'active')
        .map((p) => ({
          value: p.id,
          label: `${p.policyNumber} - ${p.customerName} (${POLICY_TYPE_LABELS[p.type]})`,
        })),
    [policies],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      policyId: '',
      amount: '',
      description: '',
      incidentDate: '',
    },
  });

  const onSubmit = async (data: {
    policyId: string;
    amount: string;
    description: string;
    incidentDate: string;
  }) => {
    setSubmitting(true);
    setSubmitError(null);
    const result = await dispatch(
      createClaim({
        policyId: data.policyId,
        amount: parseFloat(data.amount),
        description: data.description,
        incidentDate: new Date(data.incidentDate).toISOString(),
      }),
    );
    setSubmitting(false);
    if (createClaim.fulfilled.match(result)) {
      navigate('/claims');
    } else {
      setSubmitError((result.payload as string) || 'Failed to submit claim. Please try again.');
    }
  };

  return (
    <div className="create-claim">
      <div className="page-header">
        <div>
          <h1 className="page-title">File a New Claim</h1>
          <p className="page-subtitle">Submit a claim against an existing policy</p>
        </div>
        <Button variant="ghost" onClick={() => navigate('/claims')}>
          Cancel
        </Button>
      </div>

      <Card className="create-claim-card">
        <form onSubmit={handleSubmit(onSubmit)} className="claim-form">
          {submitError && (
            <div className="form-error" role="alert">
              {submitError}
            </div>
          )}

          <Controller
            name="policyId"
            control={control}
            rules={{ required: 'Policy is required' }}
            render={({ field }) => (
              <Select
                label="Policy"
                required
                error={errors.policyId?.message}
                options={policyOptions}
                {...field}
              />
            )}
          />

          <Controller
            name="amount"
            control={control}
            rules={{
              required: 'Amount is required',
              min: { value: 1, message: 'Must be positive' },
            }}
            render={({ field }) => (
              <Input
                label="Claim Amount ($)"
                type="number"
                required
                error={errors.amount?.message}
                placeholder="e.g. 5000"
                {...field}
              />
            )}
          />

          <Controller
            name="incidentDate"
            control={control}
            rules={{ required: 'Incident date is required' }}
            render={({ field }) => (
              <Input
                label="Incident Date"
                type="date"
                required
                error={errors.incidentDate?.message}
                {...field}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            rules={{
              required: 'Description is required',
              minLength: { value: 10, message: 'Please provide more detail' },
            }}
            render={({ field }) => (
              <Input
                label="Description"
                required
                error={errors.description?.message}
                placeholder="Describe the incident in detail"
                {...field}
              />
            )}
          />

          <div className="form-actions">
            <Button variant="secondary" type="button" onClick={() => navigate('/claims')}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={submitting}>
              Submit Claim
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateClaimPage;
