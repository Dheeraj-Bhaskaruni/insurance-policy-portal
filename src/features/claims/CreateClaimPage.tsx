import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

import { Card, Button } from '../../components/ui';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useAppDispatch } from '../../store/hooks';
import { createClaim } from '../../store/claimsSlice';
import { usePageTitle } from '../../hooks/usePageTitle';

import './CreateClaimPage.css';

const CreateClaimPage: React.FC = () => {
  usePageTitle('File a Claim');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      policyId: '',
      amount: '',
      description: '',
      incidentDate: '',
    },
  });

  const onSubmit = async (data: { policyId: string; amount: string; description: string; incidentDate: string }) => {
    setSubmitting(true);
    await dispatch(createClaim({
      policyId: data.policyId,
      amount: parseFloat(data.amount),
      description: data.description,
      incidentDate: new Date(data.incidentDate).toISOString(),
    }));
    setSubmitting(false);
    navigate('/claims');
  };

  return (
    <div className="create-claim">
      <div className="page-header">
        <div>
          <h1 className="page-title">File a New Claim</h1>
          <p className="page-subtitle">Submit a claim against an existing policy</p>
        </div>
        <Button variant="ghost" onClick={() => navigate('/claims')}>Cancel</Button>
      </div>

      <Card className="create-claim-card">
        <form onSubmit={handleSubmit(onSubmit)} className="claim-form">
          <Controller name="policyId" control={control} rules={{ required: 'Policy is required' }}
            render={({ field }) => (
              <Select label="Policy" required error={errors.policyId?.message}
                options={[
                  { value: 'POL-001', label: 'INS-7K2M4P - Emily Chen (Auto)' },
                  { value: 'POL-002', label: 'INS-3H8J1K - Robert Garcia (Home)' },
                  { value: 'POL-003', label: 'INS-5T9P3L - Michael Torres (Life)' },
                  { value: 'POL-004', label: 'INS-6R1V8W - Lisa Park (Health)' },
                  { value: 'POL-005', label: 'INS-1A4C7E - David Kim (Auto)' },
                ]} {...field} />
            )}
          />

          <Controller name="amount" control={control} rules={{ required: 'Amount is required', min: { value: 1, message: 'Must be positive' } }}
            render={({ field }) => <Input label="Claim Amount ($)" type="number" required error={errors.amount?.message} placeholder="e.g. 5000" {...field} />}
          />

          <Controller name="incidentDate" control={control} rules={{ required: 'Incident date is required' }}
            render={({ field }) => <Input label="Incident Date" type="date" required error={errors.incidentDate?.message} {...field} />}
          />

          <Controller name="description" control={control} rules={{ required: 'Description is required', minLength: { value: 10, message: 'Please provide more detail' } }}
            render={({ field }) => <Input label="Description" required error={errors.description?.message} placeholder="Describe the incident in detail" {...field} />}
          />

          <div className="form-actions">
            <Button variant="secondary" type="button" onClick={() => navigate('/claims')}>Cancel</Button>
            <Button variant="primary" type="submit" loading={submitting}>Submit Claim</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateClaimPage;
