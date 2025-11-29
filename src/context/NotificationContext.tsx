// ============================================================================
// Mini-Step 6.1: Notification Context
// FILE: src/context/NotificationContext.tsx
// ============================================================================

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Types
export type NotificationVariant = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  message: string;
  variant: NotificationVariant;
  duration?: number;
  title?: string;
}

interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
}

// Create Context
const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

// Provider Component
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Add notification
  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000, // Default 5 seconds
    };

    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove after duration
if (newNotification.duration && newNotification.duration > 0) {
  setTimeout(() => removeNotification(id), newNotification.duration);
}

  }, []);

  // Remove notification
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use context
export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
};
