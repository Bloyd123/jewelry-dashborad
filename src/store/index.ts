// FILE: store/index.ts
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
import authReducer from './slices/authSlice'
import userReducer from './slices/userSlice'
import permissionsReducer from './slices/permissionsSlice'
import uiReducer from './slices/uiSlice'
import notificationReducer from './slices/notificationSlice'
import { baseApi } from './api/baseApi'
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

const rootReducer = combineReducers({
  auth: authReducer,                                                          
  user: userReducer,                                                          
  permissions: persistReducer(permissionsPersistConfig, permissionsReducer),  
  ui: persistReducer(uiPersistConfig, uiReducer),
  notification: notificationReducer,
  [baseApi.reducerPath]: baseApi.reducer,
})

export const store = configureStore({
  reducer: rootReducer,

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          'api/executeQuery/pending',
          'api/executeQuery/fulfilled',
          'api/executeQuery/rejected',
        ],
        ignoredActionPaths: [
          'meta.arg',
          'payload.timestamp',
          'meta.baseQueryMeta.request',
          'meta.baseQueryMeta.response',
        ],
        ignoredPaths: ['notification.notifications'],
      },
    }).concat(baseApi.middleware),

  devTools: import.meta.env.DEV,
})

export const persistor = persistStore(store)

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store