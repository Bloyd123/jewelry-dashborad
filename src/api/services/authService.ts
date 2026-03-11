// FILE: api/services/authService.ts

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
export const registerSuperAdmin = async (
  userData: RegisterRequest
): Promise<ApiResponse<RegisterResponse['data']>> => {
  const response = await api.post(
    API_ENDPOINTS.AUTH.REGISTER_SUPER_ADMIN,
    userData
  )
  return response.data
}
export const register = async (
  userData: RegisterRequest
): Promise<ApiResponse<RegisterResponse['data']>> => {
  const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData)
  return response.data
}
export const login = async (
  credentials: LoginRequest
): Promise<ApiResponse<LoginResponse['data']>> => {
  const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
  return response.data
}
export const refreshToken = async (
  refreshToken: string
): Promise<ApiResponse<RefreshTokenResponse['data']>> => {
  const response = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
    refreshToken,
  })
  return response.data
}
export const forgotPassword = async (
  email: string
): Promise<ApiResponse<ForgotPasswordResponse['data']>> => {
  const response = await retryRequest(
    () => api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }),
    2, 
    1000 
  )
  return response.data
}
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

export const verifyEmail = async (
  token: string
): Promise<ApiResponse<VerifyEmailResponse['data']>> => {
  const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token })
  return response.data
}
export const getCurrentUser = async (): Promise<
  ApiResponse<GetProfileResponse['data']>
> => {
  const response = await api.get(API_ENDPOINTS.AUTH.ME)
  return response.data
}
export const updateProfile = async (
  updates: UpdateProfileRequest
): Promise<ApiResponse<UpdateProfileResponse['data']>> => {
  const response = await api.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, updates)
  return response.data
}
export const logout = async (
  refreshToken: string,
  accessToken: string
): Promise<ApiResponse<LogoutResponse>> => {
  const response = await retryRequest(
    () =>
      api.post(API_ENDPOINTS.AUTH.LOGOUT, {
        refreshToken,
        accessToken,
      }),
    2,
    1000 
  )
  return response.data
}

export const logoutAllDevices = async (): Promise<
  ApiResponse<LogoutAllResponse['data']>
> => {
  const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT_ALL)
  return response.data
}
export const changePassword = async (
  data: ChangePasswordRequest
): Promise<ApiResponse<ChangePasswordResponse['data']>> => {
  const response = await api.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data)
  return response.data
}

export const resendVerificationEmail = async (): Promise<
  ApiResponse<{ success: boolean }>
> => {
  const response = await api.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION)
  return response.data
}
export const getActiveSessions = async (): Promise<
  ApiResponse<GetSessionsResponse['data']>
> => {
  const response = await api.get(API_ENDPOINTS.AUTH.SESSIONS)
  return response.data
}

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
export const verify2FA = async (
  token: string
): Promise<ApiResponse<{ success: boolean; backupCodes: string[] }>> => {
  const response = await api.post(API_ENDPOINTS.AUTH.VERIFY_2FA, { token })
  return response.data
}
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

export default {
  registerSuperAdmin,
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
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
  checkEmailAvailability,
  checkUsernameAvailability,
}
