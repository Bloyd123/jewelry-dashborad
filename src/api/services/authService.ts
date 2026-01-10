// FILE: api/services/authService.ts
// Authentication API Service

import api, { retryRequest } from '@/api/axios'
import { API_ENDPOINTS } from '@/api/endpoints'
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyEmailResponse,
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  LogoutResponse,
  LogoutAllResponse,
  RefreshTokenResponse,
  GetSessionsResponse,
  RevokeSessionResponse,
} from '@/types'
import { replacePathParams } from '@/utils/api'

// PUBLIC ENDPOINTS (No Auth Required)

/**
 * Register super admin (first user)
 */
export const registerSuperAdmin = async (
  userData: RegisterRequest
): Promise<ApiResponse<RegisterResponse['data']>> => {
  const response = await api.post(
    API_ENDPOINTS.AUTH.REGISTER_SUPER_ADMIN,
    userData
  )
  return response.data
}

/**
 * Register new user (requires authentication)
 */
export const register = async (
  userData: RegisterRequest
): Promise<ApiResponse<RegisterResponse['data']>> => {
  const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData)
  return response.data
}

/**
 * Login user
 */
export const login = async (
  credentials: LoginRequest
): Promise<ApiResponse<LoginResponse['data']>> => {
  const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
  return response.data
}

/**
 * Refresh access token
 */
export const refreshToken = async (
  refreshToken: string
): Promise<ApiResponse<RefreshTokenResponse['data']>> => {
  const response = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
    refreshToken,
  })
  return response.data
}

/**
 * Forgot password - Request reset link
 */
export const forgotPassword = async (
  email: string
): Promise<ApiResponse<ForgotPasswordResponse['data']>> => {
  const response = await retryRequest(
    () => api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),
    2, // 2 retries
    1000 // 1s delay
  )
  return response.data
}

/**
 * Reset password using token
 */
export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<ApiResponse<ResetPasswordResponse['data']>> => {
  const response = await retryRequest(
    () => api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data),
    2,
    1000
  )
  return response.data
}

/**
 * Verify email address
 */
export const verifyEmail = async (
  token: string
): Promise<ApiResponse<VerifyEmailResponse['data']>> => {
  const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token })
  return response.data
}

// PROTECTED ENDPOINTS (Auth Required)

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<
  ApiResponse<GetProfileResponse['data']>
> => {
  const response = await api.get(API_ENDPOINTS.AUTH.ME)
  return response.data
}

/**
 * Update user profile
 */
export const updateProfile = async (
  updates: UpdateProfileRequest
): Promise<ApiResponse<UpdateProfileResponse['data']>> => {
  const response = await api.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, updates)
  return response.data
}

/**
 *  Logout with automatic retry on network failure
 * Features:
 * - Retries up to 2 times on network/server errors
 * - Exponential backoff (1s, 2s)
 * - No retry on client errors (4xx)
 */
export const logout = async (
  refreshToken: string,
  accessToken: string
): Promise<ApiResponse<LogoutResponse>> => {
  // Will throw ServerError, NetworkError, etc. from interceptor
  const response = await retryRequest(
    () =>
      api.post(API_ENDPOINTS.AUTH.LOGOUT, {
        refreshToken,
        accessToken,
      }),
    2,
    1000 // delay: 1 second initial delay
  )
  return response.data
}

/**
 * Logout from all devices
 */
export const logoutAllDevices = async (): Promise<
  ApiResponse<LogoutAllResponse['data']>
> => {
  const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT_ALL)
  return response.data
}

/**
 * Change password
 */
export const changePassword = async (
  data: ChangePasswordRequest
): Promise<ApiResponse<ChangePasswordResponse['data']>> => {
  const response = await api.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data)
  return response.data
}

/**
 * Resend email verification link
 */
export const resendVerificationEmail = async (): Promise<
  ApiResponse<{ success: boolean }>
> => {
  const response = await api.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION)
  return response.data
}

/**
 * Get all active sessions
 */
export const getActiveSessions = async (): Promise<
  ApiResponse<GetSessionsResponse['data']>
> => {
  const response = await api.get(API_ENDPOINTS.AUTH.SESSIONS)
  return response.data
}

/**
 * Revoke a specific session
 */
export const revokeSession = async (
  tokenId: string
): Promise<ApiResponse<RevokeSessionResponse['data']>> => {
  const url = replacePathParams(API_ENDPOINTS.AUTH.REVOKE_SESSION, { tokenId })
  const response = await api.delete(url)
  return response.data
}
export const enable2FA = async (): Promise<
  ApiResponse<{ secret: string; qrCodeDataURL: string }>
> => {
  const response = await api.post(API_ENDPOINTS.AUTH.ENABLE_2FA)
  return response.data
}

/**
 * Verify and activate 2FA
 */
export const verify2FA = async (
  token: string
): Promise<ApiResponse<{ success: boolean; backupCodes: string[] }>> => {
  const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_2FA, { token })
  return response.data
}

/**
 * Disable 2FA
 */
export const disable2FA = async (
  password: string,
  token: string
): Promise<ApiResponse<{ success: boolean }>> => {
  const response = await api.post(API_ENDPOINTS.AUTH.DISABLE_2FA, {
    password,
    token,
  })
  return response.data
}

/**
 * Verify 2FA code during login
 */
export const verify2FALogin = async (
  tempToken: string,
  token: string
): Promise<ApiResponse<LoginResponse['data']>> => {
  const response = await api.post(API_ENDPOINTS.AUTH.LOGIN_2FA, {
    tempToken,
    token,
  })
  return response.data
}

/**
 * Verify backup code during login
 */
export const verifyBackupCode = async (
  tempToken: string,
  backupCode: string
): Promise<
  ApiResponse<LoginResponse['data'] & { remainingBackupCodes: number }>
> => {
  const response = await api.post(API_ENDPOINTS.AUTH.LOGIN_BACKUP_CODE, {
    tempToken,
    backupCode,
  })
  return response.data
}

// HELPER FUNCTIONS

/**
 * Check if email is available
 */
export const checkEmailAvailability = async (
  email: string
): Promise<boolean> => {
  try {
    const response = await api.post('/auth/check-email', { email })
    return response.data.data.available
  } catch (error) {
    return false
  }
}

/**
 * Check if username is available
 */
export const checkUsernameAvailability = async (
  username: string
): Promise<boolean> => {
  try {
    const response = await api.post('/auth/check-username', { username })
    return response.data.data.available
  } catch (error) {
    return false
  }
}

// EXPORTS

export default {
  // Public
  registerSuperAdmin,
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,

  // Protected
  getCurrentUser,
  updateProfile,
  logout,
  logoutAllDevices,
  changePassword,
  resendVerificationEmail,
  getActiveSessions,
  revokeSession,
  enable2FA,
  verify2FA,
  disable2FA,
  verify2FALogin,
  verifyBackupCode,

  // Helpers
  checkEmailAvailability,
  checkUsernameAvailability,
}
