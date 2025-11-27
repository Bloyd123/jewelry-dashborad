// ============================================================================
// FILE: src/store/index.ts
// Redux Store Configuration
// ============================================================================

import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import all slices
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import notificationReducer from './slices/notificationSlice';
// import shopReducer from './slices/shopSlice';

// ============================================================================
// CONFIGURE STORE
// ============================================================================

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    notification: notificationReducer,
    // shop: shopReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for non-serializable values
        ignoredActions: ['notification/showNotification'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['notification.notifications'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development
});

// ============================================================================
// EXPORT TYPES
// ============================================================================

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ============================================================================
// TYPED HOOKS (Use these instead of plain useDispatch and useSelector)
// ============================================================================

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// ============================================================================
// EXPORT STORE
// ============================================================================

export default store;