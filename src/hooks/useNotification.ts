import { useCallback } from 'react';
import { useNotificationContext } from '../context/NotificationContext';

export const useNotification = () => {
  const { addNotification, removeNotification } = useNotificationContext();

  const showSuccess = useCallback(
    (message: string, title?: string, duration?: number) => {
      addNotification({
        message,
        title,
        variant: 'success',
        duration,
      });
    },
    [addNotification]
  );

  const showError = useCallback(
    (message: string, title?: string, duration?: number) => {
      addNotification({
        message,
        title,
        variant: 'error',
        duration,
      });
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (message: string, title?: string, duration?: number) => {
      addNotification({
        message,
        title,
        variant: 'warning',
        duration,
      });
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (message: string, title?: string, duration?: number) => {
      addNotification({
        message,
        title,
        variant: 'info',
        duration,
      });
    },
    [addNotification]
  );

  const dismiss = useCallback(
    (id: string) => {
      removeNotification(id);
    },
    [removeNotification]
  );

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismiss,
  };
};