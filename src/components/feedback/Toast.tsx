import React from 'react';

import { Notification, NotificationType } from '../../hooks/useNotification';

import './Toast.css';

interface ToastProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const typeStyles: Record<NotificationType, string> = {
  success: 'toast-success',
  error: 'toast-error',
  info: 'toast-info',
  warning: 'toast-warning',
};

const Toast: React.FC<ToastProps> = ({ notifications, onDismiss }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`toast ${typeStyles[notification.type]}`}
          role="alert"
        >
          <span className="toast-message">{notification.message}</span>
          <button
            className="toast-dismiss"
            onClick={() => onDismiss(notification.id)}
            aria-label="Dismiss notification"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
