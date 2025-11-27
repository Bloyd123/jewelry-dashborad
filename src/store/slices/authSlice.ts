// ============================================================================
// FILE: src/store/slices/authSlice.ts
// Authentication Redux Slice
// ============================================================================

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import type {
  AuthState,
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  User,
  UserShopAccess,
  UserShopAccessWithRelations,
  ShopPermissions,
  PermissionKey,
} from '@/types';
import * as authService from '@/api/services/authService';
import * as sessionService from '@/services/auth/sessionService';
import * as tokenService from '@/services/auth/tokenService';

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: AuthState = {
  // User & Authentication
  user: sessionService.getUser(),
  accessToken: tokenService.getAccessToken(),
  refreshToken: tokenService.getRefreshToken(),
  tokenId: null,
  isAuthenticated: sessionService.isAuthenticated(),
  
  // Loading States
  isLoading: false,
  isInitializing: true,
  isRefreshing: false,
  
  // Error State
  error: null,
  
  // Shop Access & Permissions
  shopAccesses: [],
  currentShop: sessionService.getCurrentShopId(),
  currentShopAccess: null,
  permissions: sessionService.getPermissions(),
  
  // Session Management
  sessions: [],
  
  // Two-Factor
  requires2FA: false,
  twoFactorEnabled: false,
  
  // Last Activity
  lastActivity: null,
};

// ============================================================================
// ASYNC THUNKS
// ============================================================================

/**
 * Register new user
 */
export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

/**
 * Login user
 */
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      const { user, accessToken, refreshToken, tokenId, shopAccesses } = response.data;
      
      // Save tokens and session
      tokenService.saveTokens(accessToken, refreshToken);
      sessionService.saveSession(user);
      
      return { user, accessToken, refreshToken, tokenId, shopAccesses };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

/**
 * Logout user
 */
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      sessionService.clearSession();
      return true;
    } catch (error: any) {
      // Clear session even if API call fails
      sessionService.clearSession();
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

/**
 * Logout from all devices
 */
export const logoutAll = createAsyncThunk(
  'auth/logoutAll',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logoutAll();
      sessionService.clearSession();
      return true;
    } catch (error: any) {
      sessionService.clearSession();
      return rejectWithValue(error.response?.data?.message || 'Logout all failed');
    }
  }
);

/**
 * Get current user profile
 */
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      const { user, shopAccesses } = response.data;
      
      // Update session
      sessionService.saveUser(user);
      
      return { user, shopAccesses };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

/**
 * Update user profile
 */
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(data);
      const { user } = response.data;
      
      // Update session
      sessionService.saveUser(user);
      
      return user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

/**
 * Change password
 */
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (data: ChangePasswordRequest, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

/**
 * Refresh access token
 */
export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken();
      const { accessToken, refreshToken, tokenId } = response.data;
      
      // Save new tokens
      tokenService.saveTokens(accessToken, refreshToken);
      
      return { accessToken, refreshToken, tokenId };
    } catch (error: any) {
      // Clear session on refresh failure
      sessionService.clearSession();
      return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
    }
  }
);

/**
 * Get active sessions
 */
export const getSessions = createAsyncThunk(
  'auth/getSessions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getSessions();
      return response.data.sessions;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sessions');
    }
  }
);

/**
 * Revoke a session
 */
export const revokeSession = createAsyncThunk(
  'auth/revokeSession',
  async (tokenId: string, { rejectWithValue }) => {
    try {
      await authService.revokeSession(tokenId);
      return tokenId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to revoke session');
    }
  }
);

/**
 * Initialize auth (check existing session)
 */
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      // Check if we have valid tokens
      if (!tokenService.isAccessTokenValid()) {
        // Try to refresh
        if (tokenService.isRefreshTokenValid()) {
          const response = await authService.refreshToken();
          const { accessToken, refreshToken, tokenId } = response.data;
          tokenService.saveTokens(accessToken, refreshToken);
        } else {
          // No valid tokens
          sessionService.clearSession();
          return { authenticated: false };
        }
      }
      
      // Get current user
      const response = await authService.getCurrentUser();
      const { user, shopAccesses } = response.data;
      
      sessionService.saveUser(user);
      
      return { authenticated: true, user, shopAccesses };
    } catch (error: any) {
      sessionService.clearSession();
      return rejectWithValue(error.response?.data?.message || 'Initialization failed');
    }
  }
);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Helper to get shop ID from shop access (handles both populated and unpopulated)
 */
const getShopId = (shopAccess: UserShopAccess | UserShopAccessWithRelations): string => {
  // Check if shop is populated (UserShopAccessWithRelations)
  if ('shop' in shopAccess && shopAccess.shop && typeof shopAccess.shop === 'object') {
    return String((shopAccess.shop as any)._id);
  }
  // Otherwise use shopId directly
  return String(shopAccess.shopId);
};

// ============================================================================
// SLICE
// ============================================================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set current shop
    setCurrentShop: (state, action: PayloadAction<string>) => {
      state.currentShop = action.payload;
      sessionService.saveCurrentShopId(action.payload);
      
      // Find and set current shop access
      const shopAccess = state.shopAccesses.find(
        (access) => getShopId(access) === action.payload
      );
      
      if (shopAccess) {
        state.currentShopAccess = shopAccess;
        state.permissions = shopAccess.permissions;
        sessionService.savePermissions(shopAccess.permissions);
      }
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Update last activity
    updateLastActivity: (state) => {
      state.lastActivity = new Date();
    },
    
    // Set shop accesses
    setShopAccesses: (state, action: PayloadAction<UserShopAccess[]>) => {
      state.shopAccesses = action.payload;
    },
    
    // Reset auth state
    resetAuth: (state) => {
      Object.assign(state, initialState);
      state.isInitializing = false;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.tokenId = action.payload.tokenId;
        state.isAuthenticated = true;
        state.shopAccesses = action.payload.shopAccesses || [];
        state.error = null;
        
        // Set first shop as current if available
        if (state.shopAccesses.length > 0) {
          const firstShop = state.shopAccesses[0];
          const shopId = getShopId(firstShop);
          state.currentShop = shopId;
          state.currentShopAccess = firstShop;
          state.permissions = firstShop.permissions;
          sessionService.saveCurrentShopId(shopId);
          sessionService.savePermissions(firstShop.permissions);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        Object.assign(state, initialState);
        state.isInitializing = false;
      })
      .addCase(logout.rejected, (state) => {
        Object.assign(state, initialState);
        state.isInitializing = false;
      });
    
    // Logout All
    builder
      .addCase(logoutAll.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAll.fulfilled, (state) => {
        Object.assign(state, initialState);
        state.isInitializing = false;
      })
      .addCase(logoutAll.rejected, (state) => {
        Object.assign(state, initialState);
        state.isInitializing = false;
      });
    
    // Get Current User
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.shopAccesses = action.payload.shopAccesses || [];
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Change Password
    builder
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Refresh Token
    builder
      .addCase(refreshAccessToken.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.isRefreshing = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.tokenId = action.payload.tokenId;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.isRefreshing = false;
        Object.assign(state, initialState);
        state.isInitializing = false;
      });
    
    // Get Sessions
    builder
      .addCase(getSessions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSessions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = action.payload;
        state.error = null;
      })
      .addCase(getSessions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Revoke Session
    builder
      .addCase(revokeSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(revokeSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = state.sessions.filter(
          (session: any) => session.tokenId !== action.payload
        );
        state.error = null;
      })
      .addCase(revokeSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Initialize Auth
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isInitializing = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isInitializing = false;
        
        if (action.payload.authenticated) {
          state.user = action.payload.user;
          state.shopAccesses = action.payload.shopAccesses || [];
          state.isAuthenticated = true;
          
          // Restore current shop if available
          if (state.currentShop && state.shopAccesses.length > 0) {
            const shopAccess = state.shopAccesses.find(
              (access) => getShopId(access) === state.currentShop
            );
            
            if (shopAccess) {
              state.currentShopAccess = shopAccess;
              state.permissions = shopAccess.permissions;
            }
          }
        } else {
          state.isAuthenticated = false;
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isInitializing = false;
        state.isAuthenticated = false;
      });
  },
});

// ============================================================================
// ACTIONS
// ============================================================================

export const {
  setCurrentShop,
  clearError,
  updateLastActivity,
  setShopAccesses,
  resetAuth,
} = authSlice.actions;

// ============================================================================
// SELECTORS
// ============================================================================

export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectError = (state: RootState) => state.auth.error;
export const selectShopAccesses = (state: RootState) => state.auth.shopAccesses;
export const selectCurrentShop = (state: RootState) => state.auth.currentShop;
export const selectCurrentShopAccess = (state: RootState) => state.auth.currentShopAccess;
export const selectPermissions = (state: RootState) => state.auth.permissions;
export const selectSessions = (state: RootState) => state.auth.sessions;

// Permission checker selectors
export const selectHasPermission = (state: RootState, permission: PermissionKey): boolean => {
  return state.auth.permissions?.[permission] || false;
};

export const selectHasAnyPermission = (state: RootState, permissions: PermissionKey[]): boolean => {
  return permissions.some(permission => state.auth.permissions?.[permission]);
};

export const selectHasAllPermissions = (state: RootState, permissions: PermissionKey[]): boolean => {
  return permissions.every(permission => state.auth.permissions?.[permission]);
};

// ============================================================================
// EXPORT REDUCER
// ============================================================================

export default authSlice.reducer;