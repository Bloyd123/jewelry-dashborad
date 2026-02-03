//
// FILE: store/slices/authSlice.ts
// MINIMAL Auth Slice - Authentication & Authorization ONLY
//  FIXED: Don't overwrite persisted permissions on reload
//

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as authService from '@/api/services/authService'
import * as tokenService from '@/services/auth/tokenService'
import type { LoginRequest, LoginResponse, UserRole } from '@/types'
import type { RootState, AppDispatch } from '../index'

import { setUserFromLogin, clearUserProfile } from './userSlice'
import { setPermissionsFromLogin, clearPermissions } from './permissionsSlice'

class ShopContextManager {
  private static STORAGE_KEY = 'currentShopId'

  static save(shopId: string): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, shopId)
    } catch (error) {
      console.error('Failed to save shop context:', error)
    }
  }

  static load(): string | null {
    try {
      return localStorage.getItem(this.STORAGE_KEY)
    } catch (error) {
      console.error('Failed to load shop context:', error)
      return null
    }
  }

  static clear(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear shop context:', error)
    }
  }
}

export { ShopContextManager }

interface AuthState {
  isAuthenticated: boolean
  userId: string | null
  email: string | null
  role: UserRole | null

  //  FIXED: Store ONLY string IDs, not objects
  currentShopId: string | null
  shopIds: string[]

  accessToken: string | null
  refreshToken: string | null
  tokenId: string | null

  isLoading: boolean
  isInitializing: boolean
  isRefreshing: boolean

  error: string | null

  requires2FA: boolean
  tempToken: string | null

  lastActivity: number | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  email: null,
  role: null,
  currentShopId: null,
  shopIds: [],
  accessToken: null,
  refreshToken: null,
  tokenId: null,
  isLoading: false,
  isInitializing: true,
  isRefreshing: false,
  error: null,
  requires2FA: false,
  tempToken: null,
  lastActivity: null,
}

//  Helper to extract shop ID from shopAccess
const extractShopId = (shopId: any): string => {
  return typeof shopId === 'string' ? shopId : shopId._id
}

//
// ASYNC THUNKS
//

export const login = createAsyncThunk<
  LoginResponse['data'],
  LoginRequest,
  { dispatch: AppDispatch; rejectValue: any }
>('auth/login', async (credentials, { dispatch, rejectWithValue }) => {
  try {
    if (import.meta.env.DEV) {
      console.log('🔐 [authSlice] Login attempt:', credentials.email)
    }

    const response = await authService.login(credentials)

    if (!response.data.requires2FA) {
      //  Populate userSlice (profile only)
      dispatch(
        setUserFromLogin({
          user: response.data.user,
        })
      )

      //  Populate permissionsSlice (single source for shop accesses)
      dispatch(
        setPermissionsFromLogin({
          shopAccesses: response.data.shopAccesses || [],
          effectivePermissions: response.data.effectivePermissions || null,
          userRole: response.data.user?.role,
        })
      )

      if (import.meta.env.DEV) {
        console.log(
          ' [authSlice] Populated userSlice and permissionsSlice from login'
        )
      }
    }

    return response.data
  } catch (error: any) {
    console.error(' [authSlice] Login failed:', error)
    return rejectWithValue(error?.message || 'Login failed')
  }
})

// Add this after the login thunk in authSlice.ts

export const complete2FALogin = createAsyncThunk<
  LoginResponse['data'],
  { tempToken: string; code: string; isBackupCode?: boolean },
  { dispatch: AppDispatch; rejectValue: any }
>(
  'auth/complete2FALogin',
  async (
    { tempToken, code, isBackupCode = false },
    { dispatch, rejectWithValue }
  ) => {
    try {
      if (import.meta.env.DEV) {
        console.log('🔐 [authSlice] Completing 2FA login')
      }

      const response = isBackupCode
        ? await authService.verifyBackupCode(tempToken, code)
        : await authService.verify2FALogin(tempToken, code)

      // ✅ Populate userSlice (profile only)
      dispatch(
        setUserFromLogin({
          user: response.data.user,
        })
      )

      // ✅ Populate permissionsSlice (single source for shop accesses)
      dispatch(
        setPermissionsFromLogin({
          shopAccesses: response.data.shopAccesses || [],
          effectivePermissions: response.data.effectivePermissions || null,
          userRole: response.data.user?.role,
        })
      )

      if (import.meta.env.DEV) {
        console.log(
          '✅ [authSlice] 2FA verification successful - populated slices'
        )
      }

      return response.data
    } catch (error: any) {
      console.error(' [authSlice] 2FA verification failed:', error)
      return rejectWithValue(error?.message || '2FA verification failed')
    }
  }
)
export const logout = createAsyncThunk<
  { success: boolean },
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: any }
>('auth/logout', async (_, { getState, dispatch, rejectWithValue }) => {
  try {
    const state = getState()
    const { refreshToken, accessToken } = state.auth

    if (refreshToken) {
      await authService.logout(refreshToken, accessToken || '')
    }

    tokenService.clearTokens()
    dispatch(clearUserProfile())
    dispatch(clearPermissions())
    ShopContextManager.clear()

    if (import.meta.env.DEV) {
      console.log(' [authSlice] Logout completed')
    }

    return { success: true }
  } catch (error: any) {
    tokenService.clearTokens()
    dispatch(clearUserProfile())
    dispatch(clearPermissions())
    ShopContextManager.clear()

    console.error('⚠️ [authSlice] Logout error (local cleanup done):', error)
    return rejectWithValue(error?.message || 'Logout failed')
  }
})

export const initializeAuth = createAsyncThunk<
  {
    userId: string
    email: string
    role: UserRole
    shopIds: string[]
    accessToken: string
    refreshToken: string
  } | null,
  void,
  {
    state: RootState
    dispatch: AppDispatch
    rejectValue: any
  }
>('auth/initialize', async (_, { getState, dispatch, rejectWithValue }) => {
  try {
    const accessToken = tokenService.getAccessToken()
    const refreshToken = tokenService.getRefreshToken()

    if (!accessToken || !refreshToken) {
      if (import.meta.env.DEV) {
        console.log('⚠️ [authSlice] No tokens found, initialization skipped')
      }
      return null
    }

    if (import.meta.env.DEV) {
      console.log('🔄 [authSlice] Initializing auth with existing tokens')
    }

    const response = await authService.getCurrentUser()

    let userData: any
    let shopAccesses: any[] = []

    if (response.data.user) {
      userData = response.data.user
      shopAccesses = response.data.shopAccesses || []
    } else {
      userData = response.data
      shopAccesses = []
    }

    if (!userData || !userData._id) {
      console.error(
        ' [authSlice] Invalid user data from /me endpoint:',
        userData
      )
      throw new Error('Invalid user data received')
    }

    if (import.meta.env.DEV) {
      console.log(' [authSlice] /me endpoint data:', {
        userId: userData._id,
        role: userData.role,
        email: userData.email,
        shopAccessCount: shopAccesses.length,
      })
    }

    //  ALWAYS set user profile (fresh from API)
    dispatch(
      setUserFromLogin({
        user: userData,
      })
    )

    //  CRITICAL FIX: Check if we have persisted permissions BEFORE overwriting
    const state = getState()
    const hasPersistedPermissions = state.permissions.shopAccesses.length > 0

    if (import.meta.env.DEV) {
      console.log('🔍 [authSlice] Permission check:', {
        hasPersistedPermissions,
        persistedShopCount: state.permissions.shopAccesses.length,
        lastSyncedAt: state.permissions.lastSyncedAt
          ? new Date(state.permissions.lastSyncedAt).toISOString()
          : 'never',
      })
    }

    if (!hasPersistedPermissions) {
      // No persisted permissions - generate for org-level users only
      if (['super_admin', 'org_admin'].includes(userData.role)) {
        dispatch(
          setPermissionsFromLogin({
            shopAccesses: [],
            effectivePermissions: null,
            userRole: userData.role,
          })
        )

        if (import.meta.env.DEV) {
          console.log(' [authSlice] Generated org-level permissions')
        }
      } else {
        // Shop-level user with no permissions
        if (import.meta.env.DEV) {
          console.warn(
            '⚠️ [authSlice] Shop user has no persisted permissions - needs re-login'
          )
        }
      }
    } else {
      //  We have persisted permissions - DON'T overwrite them!
      if (import.meta.env.DEV) {
        console.log(' [authSlice] Using persisted permissions:', {
          shopCount: state.permissions.shopAccesses.length,
          currentShopId: state.permissions.currentShopId,
        })
      }
      // No action needed - persisted permissions are already in Redux from persistence!
    }

    // Get shopIds from PERSISTED permissions state (not from empty shopAccesses)
    const finalState = getState()
    const shopIds = finalState.permissions.shopAccesses.map(a => a.shopId)

    if (import.meta.env.DEV) {
      console.log(' [authSlice] Auth initialized successfully:', {
        userId: userData._id,
        role: userData.role,
        shopCount: shopIds.length,
        permissionsSource: hasPersistedPermissions ? 'persisted' : 'generated',
      })
    }

    return {
      userId: userData._id,
      email: userData.email,
      role: userData.role,
      shopIds,
      accessToken,
      refreshToken,
    }
  } catch (error: any) {
    console.error(' [authSlice] Auth initialization failed:', error)
    tokenService.clearTokens()
    return rejectWithValue(error?.message || 'Auth initialization failed')
  }
})

export const refreshAccessToken = createAsyncThunk<
  {
    accessToken: string
    refreshToken: string
    tokenId: string
  },
  void,
  { state: RootState; rejectValue: any }
>('auth/refreshToken', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState()
    const { refreshToken } = state.auth

    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await authService.refreshToken(refreshToken)

    if (import.meta.env.DEV) {
      console.log(' [authSlice] Token refreshed successfully')
    }

    return response.data
  } catch (error: any) {
    console.error(' [authSlice] Token refresh failed:', error)
    return rejectWithValue(error?.message || 'Token refresh failed')
  }
})

//
// SLICE
//

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentShop: (state, action: PayloadAction<string>) => {
      if (!state.shopIds.includes(action.payload)) {
        console.error(
          ` Invalid shop selection: ${action.payload} not in user's shop list`
        )
        return
      }

      state.currentShopId = action.payload
      ShopContextManager.save(action.payload)

      if (import.meta.env.DEV) {
        console.log(` [authSlice] Switched to shop: ${action.payload}`)
      }
    },

    clearCurrentShop: state => {
      state.currentShopId = null
      ShopContextManager.clear()

      if (import.meta.env.DEV) {
        console.log(' [authSlice] Shop context cleared')
      }
    },

    updateLastActivity: state => {
      state.lastActivity = Date.now()
    },

    clearError: state => {
      state.error = null
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },

    setRequires2FA: (state, action: PayloadAction<boolean>) => {
      state.requires2FA = action.payload
    },

    resetAuthState: state => {
      Object.assign(state, initialState)
      state.isInitializing = false
    },
  },

  extraReducers: builder => {
    // LOGIN
    builder
      .addCase(login.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<LoginResponse['data']>) => {
          state.isLoading = false

          if (action.payload.requires2FA) {
            state.requires2FA = true
            state.tempToken = action.payload.tempToken ?? null
            state.isAuthenticated = false

            if (import.meta.env.DEV) {
              console.log(
                '🔐 [authSlice] 2FA required, waiting for verification'
              )
            }
            return
          }

          if (
            !action.payload.user ||
            !action.payload.accessToken ||
            !action.payload.refreshToken
          ) {
            console.error(
              ' [authSlice] Invalid login response: missing required fields'
            )
            state.error = 'Invalid server response'
            return
          }

          state.isAuthenticated = true
          state.userId = action.payload.user._id
          state.email = action.payload.user.email
          state.role = action.payload.user.role
          state.accessToken = action.payload.accessToken
          state.refreshToken = action.payload.refreshToken
          state.tokenId = action.payload.tokenId ?? null
          state.lastActivity = Date.now()

          //  FIXED: Extract and store ONLY shop IDs (strings)
          state.shopIds = (action.payload.shopAccesses || []).map(a =>
            extractShopId(a.shopId)
          )

          //  FIXED: Set currentShopId as STRING only
          if (state.shopIds.length > 0) {
            const storedShopId = ShopContextManager.load()
            const shopExists =
              storedShopId && state.shopIds.includes(storedShopId)

            if (shopExists) {
              state.currentShopId = storedShopId
            } else {
              state.currentShopId = state.shopIds[0]
              ShopContextManager.save(state.shopIds[0])
            }
          } else {
            state.currentShopId = null
            ShopContextManager.clear()
          }

          tokenService.saveAccessToken(action.payload.accessToken)
          tokenService.saveRefreshToken(action.payload.refreshToken)

          if (import.meta.env.DEV) {
            console.log(' [authSlice] Login successful:', {
              userId: state.userId,
              role: state.role,
              shopCount: state.shopIds.length,
              currentShopId: state.currentShopId,
            })
          }
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
        state.requires2FA = false
        state.tempToken = null

        console.error(' [authSlice] Login rejected:', action.payload)
      })

    // In extraReducers, after LOGIN cases, add this:

    // COMPLETE 2FA LOGIN
    builder
      .addCase(complete2FALogin.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(
        complete2FALogin.fulfilled,
        (state, action: PayloadAction<LoginResponse['data']>) => {
          state.isLoading = false

          if (
            !action.payload.user ||
            !action.payload.accessToken ||
            !action.payload.refreshToken
          ) {
            console.error(
              ' [authSlice] Invalid 2FA response: missing required fields'
            )
            state.error = 'Invalid server response'
            return
          }

          // ✅ Complete authentication after 2FA
          state.isAuthenticated = true
          state.userId = action.payload.user._id
          state.email = action.payload.user.email
          state.role = action.payload.user.role
          state.accessToken = action.payload.accessToken
          state.refreshToken = action.payload.refreshToken
          state.tokenId = action.payload.tokenId ?? null
          state.lastActivity = Date.now()

          // ✅ Clear 2FA state
          state.requires2FA = false
          state.tempToken = null

          // ✅ Extract and store shop IDs
          state.shopIds = (action.payload.shopAccesses || []).map(a =>
            extractShopId(a.shopId)
          )

          // ✅ Set current shop
          if (state.shopIds.length > 0) {
            const storedShopId = ShopContextManager.load()
            const shopExists =
              storedShopId && state.shopIds.includes(storedShopId)

            if (shopExists) {
              state.currentShopId = storedShopId
            } else {
              state.currentShopId = state.shopIds[0]
              ShopContextManager.save(state.shopIds[0])
            }
          } else {
            state.currentShopId = null
            ShopContextManager.clear()
          }

          tokenService.saveAccessToken(action.payload.accessToken)
          tokenService.saveRefreshToken(action.payload.refreshToken)

          if (import.meta.env.DEV) {
            console.log('✅ [authSlice] 2FA login completed successfully:', {
              userId: state.userId,
              role: state.role,
              shopCount: state.shopIds.length,
              currentShopId: state.currentShopId,
            })
          }
        }
      )
      .addCase(complete2FALogin.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        // Don't clear 2FA state on rejection - allow retry

        console.error(' [authSlice] 2FA login rejected:', action.payload)
      })

    // LOGOUT
    builder
      .addCase(logout.pending, state => {
        state.isLoading = true
      })
      .addCase(logout.fulfilled, state => {
        Object.assign(state, initialState)
        state.isInitializing = false

        if (import.meta.env.DEV) {
          console.log(' [authSlice] Logout fulfilled')
        }
      })
      .addCase(logout.rejected, state => {
        Object.assign(state, initialState)
        state.isInitializing = false

        if (import.meta.env.DEV) {
          console.log('⚠️ [authSlice] Logout rejected (state cleared anyway)')
        }
      })

    // INITIALIZE
    builder
      .addCase(initializeAuth.pending, state => {
        state.isInitializing = true
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isInitializing = false

        if (action.payload) {
          state.isAuthenticated = true
          state.userId = action.payload.userId
          state.email = action.payload.email
          state.role = action.payload.role
          state.shopIds = action.payload.shopIds
          state.accessToken = action.payload.accessToken
          state.refreshToken = action.payload.refreshToken

          const storedShopId = ShopContextManager.load()
          if (storedShopId && state.shopIds.includes(storedShopId)) {
            state.currentShopId = storedShopId
          } else if (state.shopIds.length > 0) {
            state.currentShopId = state.shopIds[0]
            ShopContextManager.save(state.shopIds[0])
          }

          if (import.meta.env.DEV) {
            console.log(' [authSlice] Auth initialization fulfilled:', {
              userId: state.userId,
              role: state.role,
            })
          }
        } else {
          if (import.meta.env.DEV) {
            console.log(
              '⚠️ [authSlice] Auth initialization returned null (no tokens)'
            )
          }
        }
      })
      .addCase(initializeAuth.rejected, state => {
        state.isInitializing = false
        state.isAuthenticated = false

        if (import.meta.env.DEV) {
          console.log('⚠️ [authSlice] Auth initialization rejected')
        }
      })

    // REFRESH TOKEN
    builder
      .addCase(refreshAccessToken.pending, state => {
        state.isRefreshing = true
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.isRefreshing = false
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        state.tokenId = action.payload.tokenId

        tokenService.saveAccessToken(action.payload.accessToken)
        tokenService.saveRefreshToken(action.payload.refreshToken)

        if (import.meta.env.DEV) {
          console.log(' [authSlice] Token refresh fulfilled')
        }
      })
      .addCase(refreshAccessToken.rejected, state => {
        state.isRefreshing = false
        Object.assign(state, initialState)
        state.isInitializing = false
        tokenService.clearTokens()

        console.error(' [authSlice] Token refresh rejected - logging out')
      })
  },
})

export const {
  setCurrentShop,
  clearCurrentShop,
  updateLastActivity,
  clearError,
  setError,
  setRequires2FA,
  resetAuthState,
} = authSlice.actions

export const selectAuth = (state: RootState) => state.auth
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated
export const selectUserId = (state: RootState) => state.auth.userId
export const selectUserRole = (state: RootState) => state.auth.role
export const selectCurrentShopId = (state: RootState) =>
  state.auth.currentShopId
export const selectShopIds = (state: RootState) => state.auth.shopIds
export const selectIsLoading = (state: RootState) => state.auth.isLoading
export const selectIsInitializing = (state: RootState) =>
  state.auth.isInitializing
export const selectError = (state: RootState) => state.auth.error
export const selectRequires2FA = (state: RootState) => state.auth.requires2FA
export const selectTempToken = (state: RootState) => state.auth.tempToken

export default authSlice.reducer
