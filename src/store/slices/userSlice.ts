//
// FILE: store/slices/userSlice.ts
// User Profile & Preferences - SEPARATE from Auth
// NOT PERSISTED - Fetched from API on demand
//  REFACTORED: Removed shopAccesses duplication
//

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import * as authService from '@/api/services/authService'
import type { User, UpdateProfileRequest } from '@/types'
import type { RootState } from '../index'

//
// STATE INTERFACE - NO MORE SHOP ACCESSES
//

interface UserState {
  profile: User | null
  //  REMOVED: shopAccesses (moved to permissionsSlice)
  //  REMOVED: activeShops (derived from permissionsSlice)
  isLoading: boolean
  isUpdating: boolean
  error: string | null
  lastSyncedAt: number | null
}

//
// INITIAL STATE
//

const initialState: UserState = {
  profile: null,
  isLoading: false,
  isUpdating: false,
  error: null,
  lastSyncedAt: null,
}

//
// HELPER: Convert any object to User type safely
//

const convertToUser = (userData: any): User => {
  return {
    _id: userData._id,
    username: userData.username || '',
    email: userData.email || '',
    firstName: userData.firstName || '',
    lastName: userData.lastName || '',
    fullName:
      userData.fullName ||
      `${userData.firstName} ${userData.lastName || ''}`.trim(),
    role: userData.role || 'viewer',
    phone: userData.phone || undefined,
    profileImage: userData.profileImage || undefined,
    organizationId: userData.organizationId || undefined,
    primaryShop: userData.primaryShop || undefined,
    department: userData.department || 'other',
    designation: userData.designation || undefined,
    employeeId: userData.employeeId || undefined,
    joiningDate: userData.joiningDate || undefined,
    isActive: userData.isActive !== undefined ? userData.isActive : true,
    isEmailVerified: userData.isEmailVerified || false,
    isPhoneVerified: userData.isPhoneVerified || false,
    twoFactorEnabled: userData.twoFactorEnabled || false,
    lastLogin: userData.lastLogin || undefined,
    lastLoginIP: userData.lastLoginIP || undefined,
    salesTarget: userData.salesTarget || 0,
    commissionRate: userData.commissionRate || 0,
    preferences: userData.preferences || {
      language: 'en',
      timezone: 'Asia/Kolkata',
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      theme: 'light',
      notificationsEnabled: true,
    },
    createdAt: userData.createdAt || new Date().toISOString(),
    updatedAt: userData.updatedAt || new Date().toISOString(),
  }
}

//
// ASYNC THUNKS
//

/**
 * Fetch current user profile from API
 * Used for explicit refresh/reload scenarios
 */
export const fetchUserProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>('user/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await authService.getCurrentUser()

    //  Handle both response structures
    let userData: User

    if (response.data.user) {
      userData = convertToUser(response.data.user)
    } else {
      userData = convertToUser(response.data)
    }

    if (import.meta.env.DEV) {
      console.log('🔍 [userSlice] fetchUserProfile response:', {
        userId: userData._id,
        role: userData.role,
      })
    }

    return userData
  } catch (error: any) {
    console.error(' [userSlice] fetchUserProfile failed:', error)
    return rejectWithValue(error?.message || 'Failed to fetch user profile')
  }
})

/**
 * Update user profile
 */
export const updateUserProfile = createAsyncThunk<
  User,
  UpdateProfileRequest,
  { rejectValue: string }
>('user/updateProfile', async (updates, { rejectWithValue }) => {
  try {
    const response = await authService.updateProfile(updates)
    const userData = response.data.user || response.data

    if (import.meta.env.DEV) {
      console.log(' [userSlice] Profile updated:', userData._id)
    }

    return convertToUser(userData)
  } catch (error: any) {
    console.error(' [userSlice] updateUserProfile failed:', error)
    return rejectWithValue(error?.message || 'Failed to update profile')
  }
})

//
// SLICE
//

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     *  REFACTORED: Set user profile ONLY (no shopAccesses)
     * Called by authSlice after successful login OR auth initialization
     */
    setUserFromLogin: (state, action: PayloadAction<{ user: User | any }>) => {
      const userData = action.payload.user

      if (!userData) {
        console.error(
          ' [userSlice] setUserFromLogin: user data is null/undefined'
        )
        state.error = 'Invalid user data: user object is missing'
        state.isLoading = false
        return
      }

      if (!userData._id) {
        console.error(
          ' [userSlice] setUserFromLogin: user._id is missing',
          userData
        )
        state.error = 'Invalid user data: user ID is missing'
        state.isLoading = false
        return
      }

      state.profile = convertToUser(userData)
      state.lastSyncedAt = Date.now()
      state.error = null
      state.isLoading = false

      if (import.meta.env.DEV) {
        console.log(' [userSlice] User profile set from login:', {
          userId: state.profile._id,
          role: state.profile.role,
        })
      }
    },

    /**
     * Update specific user fields (for partial updates)
     */
    updateUserFields: (state, action: PayloadAction<Partial<User>>) => {
      if (state.profile) {
        state.profile = {
          ...state.profile,
          ...action.payload,
          updatedAt: new Date().toISOString(),
        }
        state.lastSyncedAt = Date.now()

        if (import.meta.env.DEV) {
          console.log(
            ' [userSlice] User fields updated:',
            Object.keys(action.payload)
          )
        }
      }
    },

    /**
     * Clear user profile (on logout)
     */
    clearUserProfile: state => {
      state.profile = null
      state.error = null
      state.isLoading = false
      state.isUpdating = false
      state.lastSyncedAt = null

      if (import.meta.env.DEV) {
        console.log(' [userSlice] User profile cleared')
      }
    },

    /**
     * Clear error
     */
    clearError: state => {
      state.error = null
    },

    /**
     * Set loading state manually (if needed)
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },

  extraReducers: builder => {
    // FETCH USER PROFILE
    builder
      .addCase(fetchUserProfile.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.profile = action.payload
        state.lastSyncedAt = Date.now()

        if (import.meta.env.DEV) {
          console.log(' [userSlice] User profile fetched:', {
            userId: state.profile._id,
            role: state.profile.role,
          })
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
        console.error(' [userSlice] fetchUserProfile rejected:', action.payload)
      })

    // UPDATE USER PROFILE
    builder
      .addCase(updateUserProfile.pending, state => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isUpdating = false

        if (state.profile) {
          state.profile = {
            ...state.profile,
            ...action.payload,
            updatedAt: new Date().toISOString(),
          }
          state.lastSyncedAt = Date.now()
        }

        if (import.meta.env.DEV) {
          console.log(
            ' [userSlice] Profile update completed:',
            action.payload._id
          )
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload as string
        console.error(
          ' [userSlice] updateUserProfile rejected:',
          action.payload
        )
      })
  },
})

// ACTIONS
export const {
  setUserFromLogin,
  updateUserFields,
  clearUserProfile,
  clearError,
  setLoading,
} = userSlice.actions

// SELECTORS
export const selectUserProfile = (state: RootState) => state.user.profile
export const selectUserLoading = (state: RootState) => state.user.isLoading
export const selectUserUpdating = (state: RootState) => state.user.isUpdating
export const selectUserError = (state: RootState) => state.user.error
export const selectLastSyncedAt = (state: RootState) => state.user.lastSyncedAt

// Derived selectors
export const selectUserFullName = (state: RootState) =>
  state.user.profile?.fullName || ''

export const selectUserEmail = (state: RootState) =>
  state.user.profile?.email || ''

export const selectUserRole = (state: RootState) =>
  state.user.profile?.role || null

export const selectIsEmailVerified = (state: RootState) =>
  state.user.profile?.isEmailVerified || false

export const selectUserPreferences = (state: RootState) =>
  state.user.profile?.preferences || {
    language: 'en',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    theme: 'light',
    notificationsEnabled: true,
  }

export default userSlice.reducer
