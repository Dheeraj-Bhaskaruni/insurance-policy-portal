import React from 'react';

import { ActivityItem } from '../../types';
import { formatRelativeTime } from '../../utils/formatters';

import './ActivityFeed.css';

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const activityTypeStyles: Record<string, { bg: string; label: string }> = {
  policy_created: { bg: '#DBEAFE', label: 'New Policy' },
  claim_filed: { bg: '#FEF3C7', label: 'Claim Filed' },
  claim_resolved: { bg: '#D1FAE5', label: 'Claim Resolved' },
  policy_renewed: { bg: '#EDE9FE', label: 'Renewal' },
  payment_received: { bg: '#D1FAE5', label: 'Payment' },
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div className="activity-feed">
      {activities.map((activity) => {
        const style = activityTypeStyles[activity.type] || { bg: '#F3F4F6', label: 'Update' };
        return (
          <div key={activity.id} className="activity-item">
            <div className="activity-badge" style={{ backgroundColor: style.bg }}>
              {style.label}
            </div>
            <div className="activity-content">
              <p className="activity-description">{activity.description}</p>
              <span className="activity-time">{formatRelativeTime(activity.timestamp)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(ActivityFeed);
