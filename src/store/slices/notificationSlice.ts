// ============================================================================
// FILE: src/store/slices/notificationSlice.ts
// Notification/Toast State Management
// ============================================================================

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ============================================================================
// TYPES
// ============================================================================

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number; // in milliseconds
  timestamp: number;
}

interface NotificationState {
  notifications: Notification[];
  maxNotifications: number;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: NotificationState = {
  notifications: [],
  maxNotifications: 5, // Max toasts to show at once
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ============================================================================
// SLICE
// ============================================================================

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // Show notification
    showNotification: (
      state,
      action: PayloadAction<Omit<Notification, 'id' | 'timestamp'>>
    ) => {
      const notification: Notification = {
        ...action.payload,
        id: generateId(),
        timestamp: Date.now(),
        duration: action.payload.duration || 5000, // Default 5 seconds
      };
      
      // Add to beginning
      state.notifications.unshift(notification);
      
      // Limit to max notifications
      if (state.notifications.length > state.maxNotifications) {
        state.notifications = state.notifications.slice(0, state.maxNotifications);
      }
    },
    
    // Hide specific notification
    hideNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notif) => notif.id !== action.payload
      );
    },
    
    // Clear all notifications
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    
    // Success shorthand
    showSuccess: (state, action: PayloadAction<{ title?: string; message: string }>) => {
      const notification: Notification = {
        id: generateId(),
        type: 'success',
        title: action.payload.title,
        message: action.payload.message,
        duration: 3000,
        timestamp: Date.now(),
      };
      
      state.notifications.unshift(notification);
      
      if (state.notifications.length > state.maxNotifications) {
        state.notifications = state.notifications.slice(0, state.maxNotifications);
      }
    },
    
    // Error shorthand
    showError: (state, action: PayloadAction<{ title?: string; message: string }>) => {
      const notification: Notification = {
        id: generateId(),
        type: 'error',
        title: action.payload.title || 'Error',
        message: action.payload.message,
        duration: 5000, // Errors stay longer
        timestamp: Date.now(),
      };
      
      state.notifications.unshift(notification);
      
      if (state.notifications.length > state.maxNotifications) {
        state.notifications = state.notifications.slice(0, state.maxNotifications);
      }
    },
    
    // Warning shorthand
    showWarning: (state, action: PayloadAction<{ title?: string; message: string }>) => {
      const notification: Notification = {
        id: generateId(),
        type: 'warning',
        title: action.payload.title,
        message: action.payload.message,
        duration: 4000,
        timestamp: Date.now(),
      };
      
      state.notifications.unshift(notification);
      
      if (state.notifications.length > state.maxNotifications) {
        state.notifications = state.notifications.slice(0, state.maxNotifications);
      }
    },
    
    // Info shorthand
    showInfo: (state, action: PayloadAction<{ title?: string; message: string }>) => {
      const notification: Notification = {
        id: generateId(),
        type: 'info',
        title: action.payload.title,
        message: action.payload.message,
        duration: 3000,
        timestamp: Date.now(),
      };
      
      state.notifications.unshift(notification);
      
      if (state.notifications.length > state.maxNotifications) {
        state.notifications = state.notifications.slice(0, state.maxNotifications);
      }
    },
  },
});

// ============================================================================
// EXPORT ACTIONS & REDUCER
// ============================================================================

export const {
  showNotification,
  hideNotification,
  clearAllNotifications,
  showSuccess,
  showError,
  showWarning,
  showInfo,
} = notificationSlice.actions;

export default notificationSlice.reducer;