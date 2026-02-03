//
// FILE: store/index.ts
// Redux Store Configuration - Proper Separation between Redux & RTK Query
//  UPDATED: Permissions now persisted to localStorage
//

import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { setupListeners } from '@reduxjs/toolkit/query'

//
// REDUX SLICES (Global State Management)
//
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'
import permissionsReducer from './slices/permissionsSlice'
import uiReducer from './slices/uiSlice'
import notificationReducer from './slices/notificationSlice'

//
// RTK QUERY APIs (Server State Management)
//
import { baseApi } from './api/baseApi'
// import { customerApi } from './api/customerApi'
// import { productApi } from './api/productApi'
// import { shopApi } from './api/shopApi'
// Add more API slices as needed

//
// PERSIST CONFIGURATIONS - Selective & Minimal
//

/**
 * Auth Persist Config
 * ONLY essential auth identifiers - NO tokens, NO sensitive data
 */
const authPersistConfig = {
  key: 'auth',
  storage,
  version: 1,
  whitelist: [
    'isAuthenticated',
    'userId',
    'email',
    'role',
    'currentShopId',
    'shopIds',
  ],
  blacklist: [
    // Security: Never persist tokens
    'accessToken',
    'refreshToken',
    'tokenId',

    // Transient states: Don't persist
    'isLoading',
    'isInitializing',
    'isRefreshing',
    'error',

    // 2FA flow: Session-only
    'requires2FA',
    'tempToken',

    // Activity tracking: Session-only
    'lastActivity',
  ],
}

/**
 *  NEW: Permissions Persist Config
 * Cache permissions to avoid re-fetching on reload
 */
const permissionsPersistConfig = {
  key: 'permissions',
  storage,
  version: 1,
  whitelist: [
    'shopAccesses',
    'currentShopId',
    'currentShopPermissions',
    'orgPermissions',
    'lastSyncedAt',
  ],
  blacklist: ['isLoading', 'error'],
}

/**
 * UI Persist Config
 * User preferences only
 */
const uiPersistConfig = {
  key: 'ui-preferences',
  storage,
  version: 1,
  whitelist: ['themeName', 'accentColor', 'appearance', 'language'],
  blacklist: [
    'sidebarOpen',
    'sidebarCollapsed',
    'mobileMenuOpen',
    'isLoading',
    'loadingMessage',
  ],
}

//
// ROOT REDUCER
//

const rootReducer = combineReducers({
  //  REDUX SLICES (Client State)

  // Auth: Minimal authentication state ONLY
  auth: persistReducer(authPersistConfig, authReducer),

  // User: Profile & preferences (NOT persisted - fetched from API)
  user: userReducer,

  //  CHANGED: Permissions now PERSISTED to localStorage
  permissions: persistReducer(permissionsPersistConfig, permissionsReducer),

  // UI: User interface preferences
  ui: persistReducer(uiPersistConfig, uiReducer),

  // Notifications: Toast messages (NOT persisted - runtime only)
  notification: notificationReducer,

  //  RTK QUERY APIS (Server State)

  // Base API: Main API slice
  [baseApi.reducerPath]: baseApi.reducer,

  // Add more API slices here as needed:
  // [customerApi.reducerPath]: customerApi.reducer,
  // [productApi.reducerPath]: productApi.reducer,
  // [shopApi.reducerPath]: shopApi.reducer,
})

//
// STORE CONFIGURATION
//

export const store = configureStore({
  reducer: rootReducer,

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist actions
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,

          // RTK Query actions (IMPORTANT)
          'api/executeQuery/pending',
          'api/executeQuery/fulfilled',
          'api/executeQuery/rejected',
        ],

        // Ignore RTK Query fetch metadata
        ignoredActionPaths: [
          'meta.arg',
          'payload.timestamp',
          'meta.baseQueryMeta.request',
          'meta.baseQueryMeta.response',
        ],

        // Ignore known non-serializable state paths
        ignoredPaths: ['notification.notifications'],
      },
    })
      // Add RTK Query middleware
      .concat(baseApi.middleware),
  // Add more API middlewares here:
  // .concat(customerApi.middleware)
  // .concat(productApi.middleware)
  // .concat(shopApi.middleware)

  devTools: import.meta.env.DEV, // Enable Redux DevTools in development
})

//
// PERSISTOR
//

export const persistor = persistStore(store)

//
// RTK QUERY LISTENERS
//

// Enable refetchOnFocus / refetchOnReconnect for RTK Query
setupListeners(store.dispatch)

//
// TYPES
//

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

//
// EXPORTS
//

export default store
