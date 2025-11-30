// ============================================================================
// FILE: store/hooks/notification.ts
// Custom Hooks for Notifications
// ============================================================================

import { useCallback } from 'react'

import { useDispatch } from 'react-redux'

import {
  showNotification,
  showInfoNotification,
  showSuccessNotification,
  showWarningNotification,
  showErrorNotification,
  hideNotification,
  clearAllNotifications,
  type ShowNotificationPayload,
} from '../slices/notificationSlice'

import type { AppDispatch } from '../index'

/**
 * Custom hook for notification actions
 */
export const useNotification = () => {
  const dispatch = useDispatch<AppDispatch>()

  const notify = useCallback(
    (payload: ShowNotificationPayload) => {
      dispatch(showNotification(payload))
    },
    [dispatch]
  )

  const notifyInfo = useCallback(
    (message: string, title?: string) => {
      dispatch(showInfoNotification({ message, title }))
    },
    [dispatch]
  )

  const notifySuccess = useCallback(
    (message: string, title?: string) => {
      dispatch(showSuccessNotification({ message, title }))
    },
    [dispatch]
  )

  const notifyWarning = useCallback(
    (message: string, title?: string) => {
      dispatch(showWarningNotification({ message, title }))
    },
    [dispatch]
  )

  const notifyError = useCallback(
    (message: string, title?: string) => {
      dispatch(showErrorNotification({ message, title }))
    },
    [dispatch]
  )

  const dismiss = useCallback(
    (id: string) => {
      dispatch(hideNotification(id))
    },
    [dispatch]
  )

  const dismissAll = useCallback(() => {
    dispatch(clearAllNotifications())
  }, [dispatch])

  return {
    notify,
    notifyInfo,
    notifySuccess,
    notifyWarning,
    notifyError,
    dismiss,
    dismissAll,
  }
}
