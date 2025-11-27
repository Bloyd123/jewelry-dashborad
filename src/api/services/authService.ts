// ============================================================================
// FILE: src/services/auth/authService.ts
// Authentication API Service
// ============================================================================

import { api } from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  LogoutAllResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  GetProfileResponse,
  UpdateProfileResponse,
  GetSessionsResponse,
  RevokeSessionResponse,
  ApiResponse,
} from '@/types';

// ============================================================================
// REGISTRATION
// ============================================================================

/**
 * Register a new user
 */
export const register = async (data: RegisterRequest): Promise<ApiResponse<RegisterResponse['data']>> => {
  return api.post(API_ENDPOINTS.AUTH.REGISTER, data);
};

/**
 * Register super admin (only if no super admin exists)
 */
export const registerSuperAdmin = async (data: RegisterRequest): Promise<ApiResponse<RegisterResponse['data']>> => {
  return api.post(API_ENDPOINTS.AUTH.REGISTER_SUPER_ADMIN, data);
};

// ============================================================================
// LOGIN / LOGOUT
// ============================================================================

/**
 * Login user
 */
export const login = async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse['data']>> => {
  return api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
};

/**
 * Logout current user
 */
export const logout = async (): Promise<ApiResponse<LogoutResponse>> => {
  return api.post(API_ENDPOINTS.AUTH.LOGOUT);
};

/**
 * Logout from all devices
 */
export const logoutAll = async (): Promise<ApiResponse<LogoutAllResponse>> => {
  return api.post(API_ENDPOINTS.AUTH.LOGOUT_ALL);
};

// ============================================================================
// USER PROFILE
// ============================================================================

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<ApiResponse<GetProfileResponse['data']>> => {
  return api.get(API_ENDPOINTS.AUTH.ME);
};

/**
 * Update user profile
 */
export const updateProfile = async (data: any): Promise<ApiResponse<UpdateProfileResponse['data']>> => {
  return api.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data);
};

// ============================================================================
// PASSWORD MANAGEMENT
// ============================================================================

/**
 * Change password
 */
export const changePassword = async (data: ChangePasswordRequest): Promise<ApiResponse<ChangePasswordResponse['data']>> => {
  return api.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
};

/**
 * Request password reset
 */
export const forgotPassword = async (data: ForgotPasswordRequest): Promise<ApiResponse<ForgotPasswordResponse['data']>> => {
  return api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
};

/**
 * Reset password with token
 */
export const resetPassword = async (data: ResetPasswordRequest): Promise<ApiResponse<ResetPasswordResponse['data']>> => {
  return api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
};

// ============================================================================
// EMAIL VERIFICATION
// ============================================================================

/**
 * Verify email with token
 */
export const verifyEmail = async (data: VerifyEmailRequest): Promise<ApiResponse<VerifyEmailResponse['data']>> => {
  return api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, data);
};

/**
 * Resend verification email
 */
export const resendVerification = async (): Promise<ApiResponse> => {
  return api.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION);
};

// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================

/**
 * Refresh access token
 */
export const refreshToken = async (): Promise<ApiResponse<RefreshTokenResponse['data']>> => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  return api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });
};

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Get all active sessions
 */
export const getSessions = async (): Promise<ApiResponse<GetSessionsResponse['data']>> => {
  return api.get(API_ENDPOINTS.AUTH.SESSIONS);
};

/**
 * Revoke a specific session
 */
export const revokeSession = async (tokenId: string): Promise<ApiResponse<RevokeSessionResponse>> => {
  return api.delete(API_ENDPOINTS.AUTH.REVOKE_SESSION.replace(':tokenId', tokenId));
};

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Check if email is available
 */
export const checkEmailAvailability = async (email: string): Promise<boolean> => {
  try {
    const response = await api.get(`${API_ENDPOINTS.AUTH.ME}/check-email`, {
      params: { email },
    });
    return response.data.data.available;
  } catch (error) {
    return false;
  }
};

/**
 * Check if username is available
 */
export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  try {
    const response = await api.get(`${API_ENDPOINTS.AUTH.ME}/check-username`, {
      params: { username },
    });
    return response.data.data.available;
  } catch (error) {
    return false;
  }
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  register,
  registerSuperAdmin,
  login,
  logout,
  logoutAll,
  getCurrentUser,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  refreshToken,
  getSessions,
  revokeSession,
  checkEmailAvailability,
  checkUsernameAvailability,
};