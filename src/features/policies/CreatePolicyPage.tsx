import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { Card, Button } from '../../components/ui';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useAppDispatch } from '../../store/hooks';
import { createPolicy } from '../../store/policiesSlice';
import { CreatePolicyPayload, PolicyType } from '../../types';
import { POLICY_TYPE_LABELS } from '../../utils/constants';

import './CreatePolicyPage.css';

const steps = ['Policy Type', 'Coverage Details', 'Review & Submit'];

const CreatePolicyPage: React.FC = () => {
  usePageTitle('Create Policy');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<{
    type: PolicyType;
    customerId: string;
    premiumAmount: string;
    coverageAmount: string;
    deductible: string;
    startDate: string;
    endDate: string;
    description: string;
  }>({
    defaultValues: {
      type: 'auto',
      customerId: 'CUST-001',
      premiumAmount: '',
      coverageAmount: '',
      deductible: '',
      startDate: '',
      endDate: '',
      description: '',
    },
  });

  const values = watch();

  const handleNext = async () => {
    let fieldsToValidate: Array<keyof typeof values> = [];
    if (currentStep === 0) fieldsToValidate = ['type', 'customerId'];
    if (currentStep === 1)
      fieldsToValidate = ['premiumAmount', 'coverageAmount', 'deductible', 'startDate', 'endDate'];

    const valid = await trigger(fieldsToValidate as never[]);
    if (valid) setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: typeof values) => {
    setSubmitting(true);
    setSubmitError(null);
    const payload: CreatePolicyPayload = {
      type: data.type,
      customerId: data.customerId,
      premiumAmount: parseFloat(data.premiumAmount),
      coverageAmount: parseFloat(data.coverageAmount),
      deductible: parseFloat(data.deductible),
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      details: { description: data.description },
    };
    const result = await dispatch(createPolicy(payload));
    setSubmitting(false);
    if (createPolicy.fulfilled.match(result)) {
      navigate('/policies');
    } else {
      setSubmitError((result.payload as string) || 'Failed to create policy. Please try again.');
    }
  };

  return (
    <div className="create-policy">
      <div className="page-header">
        <div>
          <h1 className="page-title">Create New Policy</h1>
          <p className="page-subtitle">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
          </p>
        </div>
        <Button variant="ghost" onClick={() => navigate('/policies')}>
          Cancel
        </Button>
      </div>

      <div className="stepper">
        {steps.map((step, idx) => (
          <div
            key={step}
            className={`stepper-step ${idx <= currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
          >
            <div className="stepper-circle">{idx < currentStep ? '\u2713' : idx + 1}</div>
            <span className="stepper-label">{step}</span>
          </div>
        ))}
      </div>

      <Card className="create-policy-card">
        <form onSubmit={handleSubmit(onSubmit)}>
          {submitError && (
            <div className="form-error" role="alert">
              {submitError}
            </div>
          )}
          {currentStep === 0 && (
            <div className="form-section">
              <Controller
                name="type"
                control={control}
                rules={{ required: 'Policy type is required' }}
                render={({ field }) => (
                  <Select
                    label="Policy Type"
                    options={Object.entries(POLICY_TYPE_LABELS).map(([v, l]) => ({
                      value: v,
                      label: l,
                    }))}
                    error={errors.type?.message}
                    required
                    {...field}
                  />
                )}
              />
              <Controller
                name="customerId"
                control={control}
                rules={{ required: 'Customer is required' }}
                render={({ field }) => (
                  <Select
                    label="Customer"
                    options={[
                      { value: 'CUST-001', label: 'Emily Chen' },
                      { value: 'CUST-002', label: 'Robert Garcia' },
                      { value: 'CUST-003', label: 'Michael Torres' },
                      { value: 'CUST-004', label: 'Lisa Park' },
                      { value: 'CUST-005', label: 'David Kim' },
                    ]}
                    error={errors.customerId?.message}
                    required
                    {...field}
                  />
                )}
              />
            </div>
          )}

          {currentStep === 1 && (
            <div className="form-section">
              <div className="form-row">
                <Controller
                  name="premiumAmount"
                  control={control}
                  rules={{
                    required: 'Premium is required',
                    min: { value: 1, message: 'Must be positive' },
                  }}
                  render={({ field }) => (
                    <Input
                      label="Annual Premium ($)"
                      type="number"
                      error={errors.premiumAmount?.message}
                      required
                      placeholder="e.g. 1200"
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="coverageAmount"
                  control={control}
                  rules={{
                    required: 'Coverage is required',
                    min: { value: 1, message: 'Must be positive' },
                  }}
                  render={({ field }) => (
                    <Input
                      label="Coverage Amount ($)"
                      type="number"
                      error={errors.coverageAmount?.message}
                      required
                      placeholder="e.g. 50000"
                      {...field}
                    />
                  )}
                />
              </div>
              <Controller
                name="deductible"
                control={control}
                rules={{ required: 'Deductible is required' }}
                render={({ field }) => (
                  <Input
                    label="Deductible ($)"
                    type="number"
                    error={errors.deductible?.message}
                    required
                    placeholder="e.g. 500"
                    {...field}
                  />
                )}
              />
              <div className="form-row">
                <Controller
                  name="startDate"
                  control={control}
                  rules={{ required: 'Start date is required' }}
                  render={({ field }) => (
                    <Input
                      label="Start Date"
                      type="date"
                      error={errors.startDate?.message}
                      required
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="endDate"
                  control={control}
                  rules={{ required: 'End date is required' }}
                  render={({ field }) => (
                    <Input
                      label="End Date"
                      type="date"
                      error={errors.endDate?.message}
                      required
                      {...field}
                    />
                  )}
                />
              </div>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Description"
                    placeholder="Brief description of the policy"
                    {...field}
                  />
                )}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="form-section review-section">
              <h3>Review Policy Details</h3>
              <div className="review-grid">
                <div className="review-item">
                  <span>Type</span>
                  <strong>{POLICY_TYPE_LABELS[values.type]}</strong>
                </div>
                <div className="review-item">
                  <span>Premium</span>
                  <strong>${values.premiumAmount}/yr</strong>
                </div>
                <div className="review-item">
                  <span>Coverage</span>
                  <strong>${values.coverageAmount}</strong>
                </div>
                <div className="review-item">
                  <span>Deductible</span>
                  <strong>${values.deductible}</strong>
                </div>
                <div className="review-item">
                  <span>Start Date</span>
                  <strong>{values.startDate}</strong>
                </div>
                <div className="review-item">
                  <span>End Date</span>
                  <strong>{values.endDate}</strong>
                </div>
              </div>
              {values.description && <p className="review-description">{values.description}</p>}
            </div>
          )}

          <div className="form-actions">
            {currentStep > 0 && (
              <Button
                variant="secondary"
                type="button"
                onClick={() => setCurrentStep((s) => s - 1)}
              >
                Previous
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button variant="primary" type="button" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button variant="primary" type="submit" loading={submitting}>
                Create Policy
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreatePolicyPage;
