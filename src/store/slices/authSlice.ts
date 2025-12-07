// ============================================================================
// FILE: store/slices/authSlice.ts
// Authentication State Management
// ============================================================================

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

import * as authService from '@/api/services/authService'
import * as tokenService from '@/services/auth/tokenService'
import type {
  User,
  LoginRequest,
  ResetPasswordRequest,
  ForgotPasswordRequest,
  RegisterRequest,
  LoginResponse,
  ChangePasswordRequest,
  UpdateProfileRequest,
  UserShopAccess,
  ShopPermissions,
  PermissionKey,
} from '@/types'

import type { RootState } from '../index'

// ============================================================================
// STATE INTERFACE
// ============================================================================

interface AuthState {
  // User & Authentication
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  tokenId: string | null
  isAuthenticated: boolean

  // Loading States
  isLoading: boolean
  isInitializing: boolean
  isRefreshing: boolean

  // Error State
  error: string | null

  // Shop Access & Permissions
  shopAccesses: UserShopAccess[]
  currentShop: string | null
  currentShopAccess: UserShopAccess | null
  permissions: ShopPermissions | null

  // Two-Factor
  requires2FA: boolean
  twoFactorEnabled: boolean

  // Last Activity
  lastActivity: number | null
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  tokenId: null,
  isAuthenticated: false,

  isLoading: false,
  isInitializing: true,
  isRefreshing: false,

  error: null,

  shopAccesses: [],
  currentShop: null,
  currentShopAccess: null,
  permissions: null,

  requires2FA: false,
  twoFactorEnabled: false,

  lastActivity: null,
}

// ============================================================================
// ASYNC THUNKS
// ============================================================================

/**
 * Login user
 */
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials)
      return response.data
    } catch (error: any) {
      // ✅ Just pass the error as-is (already custom error from interceptor)
      return rejectWithValue(error)
    }
  }
)

/**
 * Logout user
 */
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const { refreshToken, accessToken } = state.auth

      if (refreshToken) {
        await authService.logout(refreshToken, accessToken || '')
      }

      // Clear tokens from storage
      tokenService.clearTokens()

      return { success: true }
    } catch (error: any) {
      // Even if API call fails, clear local state
      tokenService.clearTokens()
      // ✅ Pass the error as-is (already custom error from interceptor)
      return rejectWithValue(error)
    }
  }
)
/**
 * Forgot Password
 */
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (credentials: ForgotPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(credentials.email)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error) 
  }
  }
)
/**
 * Reset Password
 */
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (credentials: ResetPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(credentials)
      return response.data
    } catch (error: any) {
        return rejectWithValue(error) // Pass error object
      }
  }
)

/**
 * Register user
 */
export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      )
    }
  }
)

/**
 * Get current user profile
 */
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser()
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user'
      )
    }
  }
)

/**
 * Update user profile
 */
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (updates: UpdateProfileRequest, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(updates)
      return response.data.user
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Profile update failed'
      )
    }
  }
)

/**
 * Change password
 */
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (data: ChangePasswordRequest, { rejectWithValue, dispatch }) => {
    try {
      await authService.changePassword(data)
      // After password change, user needs to login again
      dispatch(logout())
      return
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Password change failed'
      )
    }
  }
)

/**
 * Logout from all devices
 */
export const logoutAll = createAsyncThunk(
  'auth/logoutAll',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logoutAllDevices()
      tokenService.clearTokens()
      return
    } catch (error: any) {
      tokenService.clearTokens()
      return rejectWithValue(
        error.response?.data?.message || 'Logout all failed'
      )
    }
  }
)

/**
 * Refresh access token
 */
export const refreshAccessToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const { refreshToken } = state.auth

      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await authService.refreshToken(refreshToken)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Token refresh failed'
      )
    }
  }
)

/**
 * Initialize auth state from stored tokens
 */
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = tokenService.getAccessToken()
      const refreshToken = tokenService.getRefreshToken()

      if (!accessToken || !refreshToken) {
        return null
      }

      // Verify token is still valid by fetching current user
      const response = await authService.getCurrentUser()
      return {
        user: response.data.user,
        shopAccesses: response.data.shopAccesses || [],
        accessToken,
        refreshToken,
      }
    } catch (error: any) {
      // Token invalid - clear storage
      tokenService.clearTokens()
      return rejectWithValue(error.response?.data?.message || 'Session expired')
    }
  }
)

// ============================================================================
// SLICE
// ============================================================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set current shop
    setCurrentShop: (state, action: PayloadAction<string>) => {
      state.currentShop = action.payload
      const shopAccess = state.shopAccesses.find(
        access => access.shopId === action.payload
      )
      state.currentShopAccess = shopAccess || null
      state.permissions = shopAccess?.permissions || null

      // Store in localStorage for persistence
      localStorage.setItem('currentShop', action.payload)
    },

    // Clear current shop
    clearCurrentShop: state => {
      state.currentShop = null
      state.currentShopAccess = null
      state.permissions = null
      localStorage.removeItem('currentShop')
    },

    // Update last activity
    updateLastActivity: state => {
      state.lastActivity = Date.now()
    },

    // Clear error
    clearError: state => {
      state.error = null
    },

    // Set error
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },

    // Update user (for real-time updates)
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },

    // Set 2FA requirement
    setRequires2FA: (state, action: PayloadAction<boolean>) => {
      state.requires2FA = action.payload
    },

    // Reset state (for logout)
    resetAuthState: state => {
      Object.assign(state, initialState)
      state.isInitializing = false
    },
  },
  extraReducers: builder => {
    // ========================================
    // LOGIN
    // ========================================
    builder
      .addCase(login.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<LoginResponse['data']>) => {
          state.isLoading = false
          state.user = action.payload.user
          state.accessToken = action.payload.accessToken
          state.refreshToken = action.payload.refreshToken
          state.tokenId = action.payload.tokenId
          state.isAuthenticated = true
          state.shopAccesses = action.payload.shopAccesses || []
          state.requires2FA = action.payload.requires2FA || false
          state.lastActivity = Date.now()

          // Store tokens
          tokenService.saveAccessToken(action.payload.accessToken)
          tokenService.saveRefreshToken(action.payload.refreshToken)

          // Set current shop if user has shop accesses
          if (state.shopAccesses.length > 0) {
            const storedShop = localStorage.getItem('currentShop')
            const shopExists = state.shopAccesses.some(
              access => access.shopId === storedShop
            )

            if (storedShop && shopExists) {
              state.currentShop = storedShop
            } else {
              state.currentShop = state.shopAccesses[0].shopId
            }

            const shopAccess = state.shopAccesses.find(
              access => access.shopId === state.currentShop
            )
            state.currentShopAccess = shopAccess || null
            state.permissions = shopAccess?.permissions || null
          }
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
    // ========================================
    // FORGOT PASSWORD
    // ========================================
    builder
      .addCase(forgotPassword.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(forgotPassword.fulfilled, state => {
        state.isLoading = false
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
    // ========================================
    // REGISTER
    // ========================================
    builder
      .addCase(register.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, _action) => {
        state.isLoading = false
        // Usually don't auto-login after registration
        // User needs to verify email first
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // ========================================
    // GET CURRENT USER
    // ========================================
    builder
      .addCase(getCurrentUser.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.shopAccesses = action.payload.shopAccesses || []
        state.isAuthenticated = true
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
    // ========================================
    // RESET PASSWORD
    // ========================================
    builder
      .addCase(resetPassword.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(resetPassword.fulfilled, state => {
        state.isLoading = false
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // ========================================
    // UPDATE PROFILE
    // ========================================
    builder
      .addCase(updateProfile.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(
        updateProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.isLoading = false
          state.user = action.payload
        }
      )
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // ========================================
    // CHANGE PASSWORD
    // ========================================
    builder
      .addCase(changePassword.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(changePassword.fulfilled, state => {
        state.isLoading = false
        // State will be reset by logout action
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // ========================================
    // LOGOUT
    // ========================================
    builder
      .addCase(logout.pending, state => {
        state.isLoading = true
      })
      .addCase(logout.fulfilled, state => {
        Object.assign(state, initialState)
        state.isInitializing = false
      })
      .addCase(logout.rejected, state => {
        // Clear state even on error
        Object.assign(state, initialState)
        state.isInitializing = false
      })

    // ========================================
    // LOGOUT ALL
    // ========================================
    builder
      .addCase(logoutAll.pending, state => {
        state.isLoading = true
      })
      .addCase(logoutAll.fulfilled, state => {
        Object.assign(state, initialState)
        state.isInitializing = false
      })
      .addCase(logoutAll.rejected, state => {
        Object.assign(state, initialState)
        state.isInitializing = false
      })

    // ========================================
    // REFRESH TOKEN
    // ========================================
    builder
      .addCase(refreshAccessToken.pending, state => {
        state.isRefreshing = true
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.isRefreshing = false
        state.accessToken = action.payload.accessToken
        state.refreshToken = action.payload.refreshToken
        state.tokenId = action.payload.tokenId

        // Update stored tokens
        tokenService.saveAccessToken(action.payload.accessToken)
        tokenService.saveRefreshToken(action.payload.refreshToken)
      })
      .addCase(refreshAccessToken.rejected, state => {
        state.isRefreshing = false
        // Clear auth state on refresh failure
        Object.assign(state, initialState)
        state.isInitializing = false
        tokenService.clearTokens()
      })

    // ========================================
    // INITIALIZE AUTH
    // ========================================
    builder
      .addCase(initializeAuth.pending, state => {
        state.isInitializing = true
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isInitializing = false
        if (action.payload) {
          state.user = action.payload.user
          state.shopAccesses = action.payload.shopAccesses
          state.accessToken = action.payload.accessToken
          state.refreshToken = action.payload.refreshToken
          state.isAuthenticated = true

          // Restore current shop
          const storedShop = localStorage.getItem('currentShop')
          if (
            storedShop &&
            state.shopAccesses.some(a => a.shopId === storedShop)
          ) {
            state.currentShop = storedShop
            const shopAccess = state.shopAccesses.find(
              a => a.shopId === storedShop
            )
            state.currentShopAccess = shopAccess || null
            state.permissions = shopAccess?.permissions || null
          }
        }
      })
      .addCase(initializeAuth.rejected, state => {
        state.isInitializing = false
        state.isAuthenticated = false
      })
  },
})

// ============================================================================
// ACTIONS
// ============================================================================

export const {
  setCurrentShop,
  clearCurrentShop,
  updateLastActivity,
  clearError,
  setError,
  updateUser,
  setRequires2FA,
  resetAuthState,
} = authSlice.actions

// ============================================================================
// SELECTORS
// ============================================================================

// Basic selectors
export const selectAuth = (state: RootState) => state.auth
export const selectUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated
export const selectIsLoading = (state: RootState) => state.auth.isLoading
export const selectError = (state: RootState) => state.auth.error
export const selectCurrentShop = (state: RootState) => state.auth.currentShop
export const selectPermissions = (state: RootState) => state.auth.permissions
export const selectShopAccesses = (state: RootState) => state.auth.shopAccesses

// Permission checker selector
export const selectHasPermission = (
  state: RootState,
  permission: PermissionKey
): boolean => {
  if (!state.auth.permissions) return false
  return state.auth.permissions[permission] === true
}

// Role checker selector
export const selectHasRole = (state: RootState, role: string): boolean => {
  return state.auth.user?.role === role
}

// Multiple permissions checker
export const selectHasAnyPermission = (
  state: RootState,
  permissions: PermissionKey[]
): boolean => {
  if (!state.auth.permissions) return false
  return permissions.some(perm => state.auth.permissions![perm] === true)
}

export const selectHasAllPermissions = (
  state: RootState,
  permissions: PermissionKey[]
): boolean => {
  if (!state.auth.permissions) return false
  return permissions.every(perm => state.auth.permissions![perm] === true)
}

// ============================================================================
// EXPORT REDUCER
// ============================================================================

export default authSlice.reducer
