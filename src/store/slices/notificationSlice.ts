// ============================================================================
// FILE: src/store/slices/notificationSlice.ts
// Notification State Management - Redux Toolkit Slice
// ============================================================================

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// ============================================================================
// TYPES
// ============================================================================

/**
 * Notification Type
 */
export type NotificationVariant = 'info' | 'success' | 'warning' | 'error'

/**
 * Notification Position
 */
export type NotificationPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

/**
 * Notification Item
 */
export interface NotificationItem {
  id: string
  variant: NotificationVariant
  title?: string
  message: string
  duration?: number // milliseconds, 0 = infinite
  position?: NotificationPosition
  dismissible?: boolean
  action?: {
    label: string
    onClick: () => void
  }
  icon?: string
  timestamp: number
}

/**
 * Notification State
 */
export interface NotificationState {
  notifications: NotificationItem[]
  defaultDuration: number
  defaultPosition: NotificationPosition
  maxNotifications: number
}

/**
 * Show Notification Payload
 */
export interface ShowNotificationPayload {
  variant?: NotificationVariant
  title?: string
  message: string
  duration?: number
  position?: NotificationPosition
  dismissible?: boolean
  action?: {
    label: string
    onClick: () => void
  }
  icon?: string
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: NotificationState = {
  notifications: [],
  defaultDuration: 5000, // 5 seconds
  defaultPosition: 'top-right',
  maxNotifications: 5, // Maximum simultaneous notifications
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate unique notification ID
 */
const generateNotificationId = (): string => {
  return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get notification icon based on variant
 */
const getDefaultIcon = (variant: NotificationVariant): string => {
  const iconMap: Record<NotificationVariant, string> = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  }
  return iconMap[variant] || 'ℹ️'
}

// ============================================================================
// SLICE
// ============================================================================

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    /**
     * Show Notification
     */
    showNotification: (
      state,
      action: PayloadAction<ShowNotificationPayload>
    ) => {
      const {
        variant = 'info',
        title,
        message,
        duration = state.defaultDuration,
        position = state.defaultPosition,
        dismissible = true,
        action: notificationAction,
        icon,
      } = action.payload

      // Create notification item
      const notification: NotificationItem = {
        id: generateNotificationId(),
        variant,
        title,
        message,
        duration,
        position,
        dismissible,
        action: notificationAction,
        icon: icon || getDefaultIcon(variant),
        timestamp: Date.now(),
      }

      // Add to notifications array
      state.notifications.push(notification)

      // If max notifications exceeded, remove oldest
      if (state.notifications.length > state.maxNotifications) {
        state.notifications.shift()
      }
    },

    /**
     * Show Info Notification (Shortcut)
     */
    showInfoNotification: (
      state,
      action: PayloadAction<Omit<ShowNotificationPayload, 'variant'>>
    ) => {
      const notification: NotificationItem = {
        id: generateNotificationId(),
        variant: 'info',
        message: action.payload.message,
        title: action.payload.title,
        duration: action.payload.duration ?? state.defaultDuration,
        position: action.payload.position ?? state.defaultPosition,
        dismissible: action.payload.dismissible ?? true,
        action: action.payload.action,
        icon: action.payload.icon ?? getDefaultIcon('info'),
        timestamp: Date.now(),
      }

      state.notifications.push(notification)

      if (state.notifications.length > state.maxNotifications) {
        state.notifications.shift()
      }
    },

    /**
     * Show Success Notification (Shortcut)
     */
    showSuccessNotification: (
      state,
      action: PayloadAction<Omit<ShowNotificationPayload, 'variant'>>
    ) => {
      const notification: NotificationItem = {
        id: generateNotificationId(),
        variant: 'success',
        message: action.payload.message,
        title: action.payload.title,
        duration: action.payload.duration ?? state.defaultDuration,
        position: action.payload.position ?? state.defaultPosition,
        dismissible: action.payload.dismissible ?? true,
        action: action.payload.action,
        icon: action.payload.icon ?? getDefaultIcon('success'),
        timestamp: Date.now(),
      }

      state.notifications.push(notification)

      if (state.notifications.length > state.maxNotifications) {
        state.notifications.shift()
      }
    },

    /**
     * Show Warning Notification (Shortcut)
     */
    showWarningNotification: (
      state,
      action: PayloadAction<Omit<ShowNotificationPayload, 'variant'>>
    ) => {
      const notification: NotificationItem = {
        id: generateNotificationId(),
        variant: 'warning',
        message: action.payload.message,
        title: action.payload.title,
        duration: action.payload.duration ?? state.defaultDuration,
        position: action.payload.position ?? state.defaultPosition,
        dismissible: action.payload.dismissible ?? true,
        action: action.payload.action,
        icon: action.payload.icon ?? getDefaultIcon('warning'),
        timestamp: Date.now(),
      }

      state.notifications.push(notification)

      if (state.notifications.length > state.maxNotifications) {
        state.notifications.shift()
      }
    },

    /**
     * Show Error Notification (Shortcut)
     */
    showErrorNotification: (
      state,
      action: PayloadAction<Omit<ShowNotificationPayload, 'variant'>>
    ) => {
      const notification: NotificationItem = {
        id: generateNotificationId(),
        variant: 'error',
        message: action.payload.message,
        title: action.payload.title,
        duration: action.payload.duration ?? state.defaultDuration,
        position: action.payload.position ?? state.defaultPosition,
        dismissible: action.payload.dismissible ?? true,
        action: action.payload.action,
        icon: action.payload.icon ?? getDefaultIcon('error'),
        timestamp: Date.now(),
      }

      state.notifications.push(notification)

      if (state.notifications.length > state.maxNotifications) {
        state.notifications.shift()
      }
    },

    /**
     * Hide Notification by ID
     */
    hideNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      )
    },

    /**
     * Clear All Notifications
     */
    clearAllNotifications: state => {
      state.notifications = []
    },

    /**
     * Clear Notifications by Variant
     */
    clearNotificationsByVariant: (
      state,
      action: PayloadAction<NotificationVariant>
    ) => {
      state.notifications = state.notifications.filter(
        notification => notification.variant !== action.payload
      )
    },

    /**
     * Update Default Duration
     */
    setDefaultDuration: (state, action: PayloadAction<number>) => {
      state.defaultDuration = action.payload
    },

    /**
     * Update Default Position
     */
    setDefaultPosition: (
      state,
      action: PayloadAction<NotificationPosition>
    ) => {
      state.defaultPosition = action.payload
    },

    /**
     * Update Max Notifications
     */
    setMaxNotifications: (state, action: PayloadAction<number>) => {
      state.maxNotifications = action.payload

      // If current notifications exceed new limit, remove oldest
      if (state.notifications.length > state.maxNotifications) {
        state.notifications = state.notifications.slice(
          state.notifications.length - state.maxNotifications
        )
      }
    },

    /**
     * Remove Expired Notifications
     */
    removeExpiredNotifications: state => {
      const now = Date.now()
      state.notifications = state.notifications.filter(notification => {
        // Keep notifications with duration 0 (infinite) or undefined
        if (!notification.duration || notification.duration === 0) return true

        // Remove if expired
        return now - notification.timestamp < notification.duration
      })
    },
  },
})

// ============================================================================
// ACTIONS
// ============================================================================

export const {
  showNotification,
  showInfoNotification,
  showSuccessNotification,
  showWarningNotification,
  showErrorNotification,
  hideNotification,
  clearAllNotifications,
  clearNotificationsByVariant,
  setDefaultDuration,
  setDefaultPosition,
  setMaxNotifications,
  removeExpiredNotifications,
} = notificationSlice.actions

// ============================================================================
// SELECTORS
// ============================================================================

/**
 * Select all notifications
 */
export const selectNotifications = (state: {
  notification: NotificationState
}) => state.notification.notifications

/**
 * Select notifications by variant
 */
export const selectNotificationsByVariant = (
  state: { notification: NotificationState },
  variant: NotificationVariant
) => state.notification.notifications.filter(n => n.variant === variant)

/**
 * Select notifications by position
 */
export const selectNotificationsByPosition = (
  state: { notification: NotificationState },
  position: NotificationPosition
) => state.notification.notifications.filter(n => n.position === position)

/**
 * Select notification count
 */
export const selectNotificationCount = (state: {
  notification: NotificationState
}) => state.notification.notifications.length

/**
 * Select notification settings
 */
export const selectNotificationSettings = (state: {
  notification: NotificationState
}) => ({
  defaultDuration: state.notification.defaultDuration,
  defaultPosition: state.notification.defaultPosition,
  maxNotifications: state.notification.maxNotifications,
})

/**
 * Select latest notification
 */
export const selectLatestNotification = (state: {
  notification: NotificationState
}) =>
  state.notification.notifications[
    state.notification.notifications.length - 1
  ] ?? null

/**
 * Check if has notifications
 */
export const selectHasNotifications = (state: {
  notification: NotificationState
}) => state.notification.notifications.length > 0

/**
 * Check if has error notifications
 */
export const selectHasErrorNotifications = (state: {
  notification: NotificationState
}) => state.notification.notifications.some(n => n.variant === 'error')

// ============================================================================
// REDUCER
// ============================================================================

export default notificationSlice.reducer

// ============================================================================
// THUNK ACTIONS (Optional - for complex scenarios)
// ============================================================================

/**
 * Show notification with auto-dismiss
 * This is a helper that can be used in components
 */
export const showNotificationWithAutoDismiss = (
  payload: ShowNotificationPayload
) => {
  return (dispatch: any) => {
    const notification = dispatch(showNotification(payload))

    // Auto-dismiss after duration (if not infinite)
    const duration = payload.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => {
        // Get the notification ID from the generated notification
        const notificationId = notification.payload?.id
        if (notificationId) {
          dispatch(hideNotification(notificationId))
        }
      }, duration)
    }
  }
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * EXAMPLE 1: Basic Usage in Component
 *
 * import { useDispatch } from 'react-redux';
 * import { showNotification } from '@/store/slices/notificationSlice';
 *
 * const MyComponent = () => {
 *   const dispatch = useDispatch();
 *
 *   const handleClick = () => {
 *     dispatch(showNotification({
 *       variant: 'success',
 *       message: 'Operation completed successfully!',
 *     }));
 *   };
 *
 *   return <button onClick={handleClick}>Show Notification</button>;
 * };
 */

/**
 * EXAMPLE 2: Using Shortcut Actions
 *
 * dispatch(showSuccessNotification({
 *   title: 'Success',
 *   message: 'Shop created successfully!',
 * }));
 *
 * dispatch(showErrorNotification({
 *   title: 'Error',
 *   message: 'Failed to save data',
 *   duration: 0, // Infinite (manual dismiss)
 * }));
 */

/**
 * EXAMPLE 3: With Action Button
 *
 * dispatch(showNotification({
 *   variant: 'info',
 *   message: 'You have unsaved changes',
 *   action: {
 *     label: 'Save Now',
 *     onClick: () => dispatch(saveData()),
 *   },
 * }));
 */

/**
 * EXAMPLE 4: In Notification Container Component
 *
 * import { useSelector, useDispatch } from 'react-redux';
 * import { selectNotifications, hideNotification } from '@/store/slices/notificationSlice';
 *
 * const NotificationContainer = () => {
 *   const notifications = useSelector(selectNotifications);
 *   const dispatch = useDispatch();
 *
 *   return (
 *     <div className="notification-container">
 *       {notifications.map((notification) => (
 *         <Notification
 *           key={notification.id}
 *           {...notification}
 *           onClose={() => dispatch(hideNotification(notification.id))}
 *         />
 *       ))}
 *     </div>
 *   );
 * };
 */

/**
 * EXAMPLE 5: Handling API Errors
 *
 * try {
 *   await api.createShop(data);
 *   dispatch(showSuccessNotification({
 *     message: 'Shop created successfully!',
 *   }));
 * } catch (error) {
 *   dispatch(showErrorNotification({
 *     title: 'Error',
 *     message: error.message || 'Something went wrong',
 *   }));
 * }
 */
