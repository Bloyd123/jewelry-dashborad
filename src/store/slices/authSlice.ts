// FILE: store/slices/authSlice.ts
// Authentication State Management

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

// STATE INTERFACE

interface AuthState {
  // User & Authentication
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  tokenId: string | null
  isAuthenticated: boolean

  // Loading States
  isLoading: boolean // ✅ ONLY for login/logout/init
  is2FALoading: boolean //  : Only for 2FA operations
  isPasswordChanging: boolean //  : Only for password
  isProfileUpdating: boolean //  : Only for profile
  activeSessions: any[]
  isSessionsLoading: boolean //
  isRevokingSession: boolean //
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
  tempToken: string | null

  // Last Activity
  lastActivity: number | null
}

// INITIAL STATE

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  tokenId: null,
  isAuthenticated: false,

  isLoading: false,
  is2FALoading: false, // ✅ Add this
  isPasswordChanging: false,
  isProfileUpdating: false,

  isInitializing: true,
  isRefreshing: false,

  error: null,
  isSessionsLoading: false, //
  isRevokingSession: false, //
  activeSessions: [], //

  shopAccesses: [],
  currentShop: null,
  currentShopAccess: null,
  permissions: null,

  requires2FA: false,
  twoFactorEnabled: false,
  tempToken: null,

  lastActivity: null,
}

// ASYNC THUNKS

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
/**
 * Enable 2FA
 */
export const enable2FA = createAsyncThunk(
  'auth/enable2FA',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.enable2FA()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error)
    }
  }
)

/**
 * Verify 2FA
 */
export const verify2FA = createAsyncThunk(
  'auth/verify2FA',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await authService.verify2FA(token)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error)
    }
  }
)

/**
 * Disable 2FA
 */
export const disable2FA = createAsyncThunk(
  'auth/disable2FA',
  async (
    { password, token }: { password: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.disable2FA(password, token)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error)
    }
  }
)

/**
 * Verify 2FA during login
 */
export const verify2FALogin = createAsyncThunk(
  'auth/verify2FALogin',
  async (
    { tempToken, token }: { tempToken: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.verify2FALogin(tempToken, token)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error)
    }
  }
)

/**
 * Verify backup code during login
 */
export const verifyBackupCodeLogin = createAsyncThunk(
  'auth/verifyBackupCode',
  async (
    { tempToken, backupCode }: { tempToken: string; backupCode: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.verifyBackupCode(tempToken, backupCode)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error)
    }
  }
)
/**
 * Get active sessions
 */
export const getActiveSessions = createAsyncThunk(
  'auth/getActiveSessions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getActiveSessions()
      // response.data is the sessions array from your API
      return response.data
    } catch (error: any) {
      return rejectWithValue(error)
    }
  }
)

/**
 * Revoke a session
 */
export const revokeSession = createAsyncThunk(
  'auth/revokeSession',
  async (tokenId: string, { rejectWithValue }) => {
    try {
      await authService.revokeSession(tokenId)
      return tokenId
    } catch (error: any) {
      return rejectWithValue(error)
    }
  }
)

// SLICE

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
            return // Don't proceed with normal login
          }
          state.user = action.payload.user
          state.accessToken = action.payload.accessToken
          state.refreshToken = action.payload.refreshToken
          state.tokenId = action.payload.tokenId
          state.isAuthenticated = true
          state.requires2FA = action.payload.requires2FA || false
          state.twoFactorEnabled = action.payload.user.twoFactorEnabled || false // ✅ Sync on login
          state.lastActivity = Date.now()

          // Store tokens
          tokenService.saveAccessToken(action.payload.accessToken)
          tokenService.saveRefreshToken(action.payload.refreshToken)

          //  : Handle both org-level and shop-level users
          const { effectivePermissions, shopAccesses } = action.payload

          if (effectivePermissions) {
            // ✅ Org-level user (super_admin, org_admin)
            state.permissions = effectivePermissions
            state.shopAccesses = []
            state.currentShop = null
            state.currentShopAccess = null

            console.log(
              `[Auth] ${action.payload.user.role} logged in with effective permissions`
            )
          } else {
            // ✅ Shop-level user (shop_admin, manager, staff, etc.)
            state.shopAccesses = shopAccesses || []

            if (state.shopAccesses.length > 0) {
              // Restore last selected shop or use first
              const storedShop = localStorage.getItem('currentShop')
              const shopExists = state.shopAccesses.some(
                access => access.shopId === storedShop
              )

              if (storedShop && shopExists) {
                state.currentShop = storedShop
              } else {
                state.currentShop = state.shopAccesses[0].shopId
                localStorage.setItem('currentShop', state.currentShop)
              }

              // Set permissions from current shop access
              const shopAccess = state.shopAccesses.find(
                access => access.shopId === state.currentShop
              )
              state.currentShopAccess = shopAccess || null
              state.permissions = shopAccess?.permissions || null

              console.log(
                `[Auth] Shop-level user logged in to shop: ${state.currentShop}`
              )
            } else {
              console.warn('[Auth] Shop-level user has no shop access!')
            }
          }
        }
      )
      // .addCase(
      //   login.fulfilled,
      //   (state, action: PayloadAction<LoginResponse['data']>) => {
      //     state.isLoading = false
      //     state.user = action.payload.user
      //     state.accessToken = action.payload.accessToken
      //     state.refreshToken = action.payload.refreshToken
      //     state.tokenId = action.payload.tokenId
      //     state.isAuthenticated = true
      //     state.shopAccesses = action.payload.shopAccesses || []
      //     state.requires2FA = action.payload.requires2FA || false
      //     state.lastActivity = Date.now()

      //     // Store tokens
      //     tokenService.saveAccessToken(action.payload.accessToken)
      //     tokenService.saveRefreshToken(action.payload.refreshToken)

      //     // Set current shop if user has shop accesses
      //     if (state.shopAccesses.length > 0) {
      //       const storedShop = localStorage.getItem('currentShop')
      //       const shopExists = state.shopAccesses.some(
      //         access => access.shopId === storedShop
      //       )

      //       if (storedShop && shopExists) {
      //         state.currentShop = storedShop
      //       } else {
      //         state.currentShop = state.shopAccesses[0].shopId
      //       }

      //       const shopAccess = state.shopAccesses.find(
      //         access => access.shopId === state.currentShop
      //       )
      //       state.currentShopAccess = shopAccess || null
      //       state.permissions = shopAccess?.permissions || null
      //     }
      //   }
      // )
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.tokenId = null

        // 🔥 yehi main fix hai
        state.requires2FA = false
        state.tempToken = null
      })

    // GET ACTIVE SESSIONS

    builder
      .addCase(getActiveSessions.pending, state => {
        state.isSessionsLoading = true
        state.error = null
      })
      .addCase(getActiveSessions.fulfilled, (state, action) => {
        state.isSessionsLoading = false
        // ✅ action.payload is already the sessions array
        state.activeSessions = Array.isArray(action.payload)
          ? action.payload
          : []
      })
      .addCase(getActiveSessions.rejected, (state, action) => {
        state.isSessionsLoading = false
        state.error = action.payload as string
        state.activeSessions = [] // Clear on error
      })

    // REVOKE SESSION

    builder
      .addCase(revokeSession.pending, state => {
        state.isRevokingSession = true
        state.error = null
      })
      .addCase(revokeSession.fulfilled, (state, action) => {
        state.isRevokingSession = false
        // Remove revoked session from list
        state.activeSessions = state.activeSessions.filter(
          session => session.id !== action.payload
        )
      })
      .addCase(revokeSession.rejected, (state, action) => {
        state.isRevokingSession = false
        state.error = action.payload as string
      })

    // FORGOT PASSWORD

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

    // REGISTER

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

    // GET CURRENT USER

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
        // ✅ Sync 2FA status from user object
        state.twoFactorEnabled = action.payload.user.twoFactorEnabled || false
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })

    // RESET PASSWORD

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

    // UPDATE PROFILE

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

    // CHANGE PASSWORD

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

    // LOGOUT

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

    // LOGOUT ALL

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

    // INITIALIZE AUTH

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

          state.twoFactorEnabled = action.payload.user.twoFactorEnabled || false

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
      .addCase(enable2FA.pending, state => {
        state.is2FALoading = true
        state.error = null
      })
      .addCase(enable2FA.fulfilled, state => {
        state.is2FALoading = false
      })
      .addCase(enable2FA.rejected, (state, action) => {
        state.is2FALoading = false
        state.error = action.payload as string
      })

    // VERIFY 2FA

    builder
      .addCase(verify2FA.pending, state => {
        state.is2FALoading = true
        state.error = null
      })
      .addCase(verify2FA.fulfilled, (state, action) => {
        state.is2FALoading = false
        if (state.user) {
          state.user.twoFactorEnabled = true
          state.twoFactorEnabled = true // ✅ Sync Redux state
          state.user.backupCodes = action.payload.backupCodes || []
          state.user.backupCodesUsed = [] // ✅ Reset used codes
        }
      })
      .addCase(verify2FA.rejected, (state, action) => {
        state.is2FALoading = false
        state.error = action.payload as string
      })

    // DISABLE 2FA

    builder
      .addCase(disable2FA.pending, state => {
        state.is2FALoading = true // ✅ Fixed
        state.error = null
      })
      .addCase(disable2FA.fulfilled, state => {
        state.is2FALoading = false
        if (state.user) {
          state.user.twoFactorEnabled = false
          state.twoFactorEnabled = false // ✅ Sync Redux state
          state.user.backupCodes = [] // ✅ Clear backup codes
          state.user.backupCodesUsed = [] // ✅ Clear used codes
        }
      })
      .addCase(disable2FA.rejected, (state, action) => {
        state.is2FALoading = false
        state.error = action.payload as string
      })

    // VERIFY 2FA LOGIN

    builder
      .addCase(verify2FALogin.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(
        verify2FALogin.fulfilled,
        (state, action: PayloadAction<LoginResponse['data']>) => {
          state.isLoading = false
          state.requires2FA = false
          state.tempToken = null
          state.user = action.payload.user
          state.accessToken = action.payload.accessToken
          state.refreshToken = action.payload.refreshToken
          state.tokenId = action.payload.tokenId
          state.isAuthenticated = true
          state.twoFactorEnabled = action.payload.user.twoFactorEnabled || false
          state.lastActivity = Date.now()

          // Store tokens
          tokenService.saveAccessToken(action.payload.accessToken)
          tokenService.saveRefreshToken(action.payload.refreshToken)

          // ✅ COMPLETE shop logic (same as login.fulfilled)
          const { effectivePermissions, shopAccesses } = action.payload

          if (effectivePermissions) {
            // Org-level user (super_admin, org_admin)
            state.permissions = effectivePermissions
            state.shopAccesses = []
            state.currentShop = null
            state.currentShopAccess = null

            console.log(
              `[Auth] ${action.payload.user.role} logged in via 2FA with effective permissions`
            )
          } else {
            // Shop-level user (shop_admin, manager, staff, etc.)
            state.shopAccesses = shopAccesses || []

            if (state.shopAccesses.length > 0) {
              // Restore last selected shop or use first
              const storedShop = localStorage.getItem('currentShop')
              const shopExists = state.shopAccesses.some(
                access => access.shopId === storedShop
              )

              if (storedShop && shopExists) {
                state.currentShop = storedShop
              } else {
                state.currentShop = state.shopAccesses[0].shopId
                localStorage.setItem('currentShop', state.currentShop)
              }

              // Set permissions from current shop access
              const shopAccess = state.shopAccesses.find(
                access => access.shopId === state.currentShop
              )
              state.currentShopAccess = shopAccess || null
              state.permissions = shopAccess?.permissions || null

              console.log(
                `[Auth] Shop-level user logged in via 2FA to shop: ${state.currentShop}`
              )
            } else {
              console.warn('[Auth] Shop-level user has no shop access!')
            }
          }
        }
      )
      .addCase(verify2FALogin.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // VERIFY BACKUP CODE

    builder
      .addCase(verifyBackupCodeLogin.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(
        verifyBackupCodeLogin.fulfilled,
        (state, action: PayloadAction<LoginResponse['data']>) => {
          state.isLoading = false
          state.requires2FA = false
          state.tempToken = null
          state.user = action.payload.user
          state.accessToken = action.payload.accessToken
          state.refreshToken = action.payload.refreshToken
          state.tokenId = action.payload.tokenId
          state.isAuthenticated = true
          state.twoFactorEnabled = action.payload.user.twoFactorEnabled || false
          state.lastActivity = Date.now()

          // Store tokens
          tokenService.saveAccessToken(action.payload.accessToken)
          tokenService.saveRefreshToken(action.payload.refreshToken)

          // ✅ COMPLETE shop logic (same as login.fulfilled)
          const { effectivePermissions, shopAccesses } = action.payload

          if (effectivePermissions) {
            // Org-level user (super_admin, org_admin)
            state.permissions = effectivePermissions
            state.shopAccesses = []
            state.currentShop = null
            state.currentShopAccess = null

            console.log(
              `[Auth] ${action.payload.user.role} logged in via backup code with effective permissions`
            )
          } else {
            // Shop-level user (shop_admin, manager, staff, etc.)
            state.shopAccesses = shopAccesses || []

            if (state.shopAccesses.length > 0) {
              // Restore last selected shop or use first
              const storedShop = localStorage.getItem('currentShop')
              const shopExists = state.shopAccesses.some(
                access => access.shopId === storedShop
              )

              if (storedShop && shopExists) {
                state.currentShop = storedShop
              } else {
                state.currentShop = state.shopAccesses[0].shopId
                localStorage.setItem('currentShop', state.currentShop)
              }

              // Set permissions from current shop access
              const shopAccess = state.shopAccesses.find(
                access => access.shopId === state.currentShop
              )
              state.currentShopAccess = shopAccess || null
              state.permissions = shopAccess?.permissions || null

              console.log(
                `[Auth] Shop-level user logged in via backup code to shop: ${state.currentShop}`
              )
            } else {
              console.warn('[Auth] Shop-level user has no shop access!')
            }
          }
        }
      )
      .addCase(verifyBackupCodeLogin.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

// ACTIONS

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

// SELECTORS

// Basic selectors
export const selectAuth = (state: RootState) => state.auth
export const selectUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated
export const selectActiveSessions = (state: RootState) =>
  state.auth.activeSessions ?? []
export const selectIsSessionsLoading = (state: RootState) =>
  state.auth.isSessionsLoading ?? false
export const selectIsRevokingSession = (state: RootState) =>
  state.auth.isRevokingSession ?? false
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

// EXPORT REDUCER

export default authSlice.reducer
