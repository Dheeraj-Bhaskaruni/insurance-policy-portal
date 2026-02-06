import React, { createContext, useContext } from 'react';

import Toast from '../components/feedback/Toast';

import { useNotification, NotificationType } from './useNotification';

interface ToastContextValue {
  notify: (type: NotificationType, message: string) => string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { notifications, addNotification, removeNotification } = useNotification();

  return (
    <ToastContext.Provider value={{ notify: addNotification }}>
      {children}
      <Toast notifications={notifications} onDismiss={removeNotification} />
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
