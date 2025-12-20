// ============================================================================
// FILE: store/index.ts
// Redux Store Configuration
// ============================================================================

import { configureStore, combineReducers } from '@reduxjs/toolkit'
import customerReducer from '@/store/slices/customerSlice'
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
import authReducer from './slices/authSlice'
import notificationReducer from './slices/notificationSlice'
import shopReducer from './slices/shopSlice'
import uiReducer from './slices/uiSlice'
import { customerApi } from '@/api/services/customerService'

// Import reducers
// import userReducer from './slices/userSlice';
// import shopReducer from './slices/shopSlice';
// ... other reducers
const uiPersistConfig = {
  key: 'ui-preferences',
  storage,
  whitelist: ['themeName', 'accentColor', 'appearance', 'language'],
}

// ============================================================================
// ROOT REDUCER
// ============================================================================

const rootReducer = combineReducers({
  auth: authReducer,
  shop: shopReducer,
  ui: persistReducer(uiPersistConfig, uiReducer),

  // user: userReducer,
  // shop: shopReducer,
  notification: notificationReducer,
  // RTK Query reducer
  [customerApi.reducerPath]: customerApi.reducer,
  customer: customerReducer,
  // ... other reducers
})

// ============================================================================
// PERSIST CONFIGURATION
// ============================================================================

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth', 'shop'], // Only persist auth state
  blacklist: ['notification'], // Don't persist notification state
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// ============================================================================
// STORE CONFIGURATION
// ============================================================================

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      // RTK Query middleware added here
      .concat(customerApi.middleware),
  devTools: import.meta.env.DEV, // Enable Redux DevTools in development
})

export const persistor = persistStore(store)

// Enable refetchOnFocus / refetchOnReconnect
setupListeners(store.dispatch)

// ============================================================================
// TYPES
// ============================================================================

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// ============================================================================
// EXPORTS
// ============================================================================

export default store
