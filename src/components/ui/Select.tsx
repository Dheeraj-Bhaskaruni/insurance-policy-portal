import React from 'react';

import { SelectOption } from '../../types';

import './Select.css';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  placeholder = 'Select an option',
  fullWidth = true,
  id,
  className = '',
  ...props
}) => {
  const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`select-group ${fullWidth ? 'select-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={selectId} className="select-label">
          {label}
          {props.required && <span className="select-required">*</span>}
        </label>
      )}
      <select
        id={selectId}
        className={`select-field ${error ? 'select-error' : ''}`}
        aria-invalid={!!error}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="select-error-text" role="alert">{error}</span>}
    </div>
  );
};

export default Select;
