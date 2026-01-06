import React from 'react';

import './MetricCard.css';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: 'blue' | 'green' | 'amber' | 'purple';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, color }) => {
  return (
    <div className={`metric-card metric-${color}`}>
      <div className="metric-content">
        <span className="metric-title">{title}</span>
        <span className="metric-value">{value}</span>
        <span className="metric-subtitle">{subtitle}</span>
      </div>
      <div className={`metric-icon-bg metric-icon-${color}`}>
        <span className="metric-icon">
          {color === 'blue' && '\u2637'}
          {color === 'amber' && '\u2696'}
          {color === 'green' && '$'}
          {color === 'purple' && '\u263A'}
        </span>
      </div>
    </div>
  );
};

export default MetricCard;
