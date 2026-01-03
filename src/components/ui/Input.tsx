import React from 'react';

import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  fullWidth = true,
  id,
  className = '',
  ...props
}) => {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`input-group ${fullWidth ? 'input-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {props.required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`input-field ${error ? 'input-error' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <span id={`${inputId}-error`} className="input-error-text" role="alert">
          {error}
        </span>
      )}
      {helperText && !error && <span className="input-helper">{helperText}</span>}
    </div>
  );
};

export default Input;
