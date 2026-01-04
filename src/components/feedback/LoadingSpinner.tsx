import React from 'react';

import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', message }) => {
  return (
    <div className="loading-spinner-container" role="status">
      <div className={`loading-spinner spinner-${size}`} />
      {message && <p className="loading-message">{message}</p>}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
