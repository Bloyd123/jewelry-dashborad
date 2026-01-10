// ============================================================================
// FILE: auth.types.ts
// Authentication Request/Response Types
// ============================================================================

import { RefreshToken, DeviceInfo } from './refreshToken.types'
import { User, UserRole, Department } from './user.types'
import {
  UserShopAccess,
  ShopPermissions,
  PermissionKey,
} from './userShopAccess.types'

// ============================================================================
// AUTH REQUEST TYPES
// ============================================================================

/**
 * Register Request
 */
export interface RegisterRequest {
  username: string
  email: string
  password: string
  firstName: string
  lastName?: string
  phone?: string
  organizationId?: string
  role: UserRole
  primaryShop?: string
  department?: Department
}

/**
 * Login Request
 */
export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}
export interface ForgetRequest {
  email: string
}
/**
 * Change Password Request
 */
export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

/**
 * Forgot Password Request
 */
export interface ForgotPasswordRequest {
  email: string
}

/**
 * Reset Password Request
 */
export interface ResetPasswordRequest {
  token: string
  newPassword: string
  confirmPassword: string
}

/**
 * Verify Email Request
 */
export interface VerifyEmailRequest {
  token: string
}

/**
 * Refresh Token Request
 */
export interface RefreshTokenRequest {
  refreshToken: string
}

/**
 * Resend Verification Email Request
 */
export interface ResendVerificationRequest {
  email: string
}

/**
 * Enable Two-Factor Request
 */
export interface EnableTwoFactorRequest {
  password: string
}
export interface Enable2FAResponse {
  success: boolean
  message: string
  data: {
    secret: string
    qrCodeDataURL: string
  }
}

/**
 * Verify 2FA Response
 */
export interface Verify2FAResponse {
  success: boolean
  message: string
  data: {
    success: boolean
    backupCodes: string[]
  }
}

/**
 * Disable 2FA Request
 */
export interface Disable2FARequest {
  password: string
  token: string
}

/**
 * Verify 2FA Login Request
 */
export interface Verify2FALoginRequest {
  tempToken: string
  token: string
}

/**
 * Verify Backup Code Login Request
 */
export interface VerifyBackupCodeLoginRequest {
  tempToken: string
  backupCode: string
}
/**
 * Verify Two-Factor Request
 */
export interface VerifyTwoFactorRequest {
  token: string
  code: string
}

/**
 * Disable Two-Factor Request
 */
export interface DisableTwoFactorRequest {
  password: string
  code: string
}

/**
 * Two-Factor Login Request
 */
export interface TwoFactorLoginRequest {
  email: string
  password: string
  code: string
}

/**
 * Verify Backup Code Request
 */
export interface VerifyBackupCodeRequest {
  email: string
  backupCode: string
}

// ============================================================================
// AUTH RESPONSE TYPES
// ============================================================================

/**
 * Register Response
 */
export interface RegisterResponse {
  success: boolean
  message: string
  data: {
    user: User
    verificationRequired: boolean
    verificationEmailSent: boolean
  }
}

/**
 * Login Response
 */
export interface LoginResponse {
  success: boolean
  message: string
  data: {
    user: User
    accessToken: string
    refreshToken: string
    tokenId: string
    expiresIn: number
    shopAccesses?: UserShopAccess[] // ✅ Optional now
    effectivePermissions?: ShopPermissions //   field
    requires2FA?: boolean
    tempToken?: string
  }
}

/**
 * Two-Factor Challenge Response
 */
export interface TwoFactorChallengeResponse {
  success: boolean
  message: string
  data: {
    requires2FA: true
    tempToken: string
    methods: Array<'app' | 'sms' | 'email'>
  }
}

/**
 * Logout Response
 */
export interface LogoutResponse {
  success: boolean
  message: string
}
/**
 * Logout All Response
 */
export interface LogoutAllResponse {
  success: boolean
  message: string
  data: {
    revokedCount: number
  }
}

/**
 * Refresh Token Response
 */
export interface RefreshTokenResponse {
  success: boolean
  message: string
  data: {
    accessToken: string
    refreshToken: string
    tokenId: string
    expiresIn: number
  }
}

/**
 * Change Password Response
 */
export interface ChangePasswordResponse {
  success: boolean
  message: string
  data: {
    passwordChanged: boolean
    allSessionsRevoked: boolean
  }
}

/**
 * Forgot Password Response
 */
export interface ForgotPasswordResponse {
  success: boolean
  message: string
  data: {
    emailSent: boolean
    expiresIn: number // minutes
  }
}

/**
 * Reset Password Response
 */
export interface ResetPasswordResponse {
  success: boolean
  message: string
  data: {
    passwordReset: boolean
  }
}

/**
 * Verify Email Response
 */
export interface VerifyEmailResponse {
  success: boolean
  message: string
  data: {
    verified: boolean
    user: User
  }
}

/**
 * Get Profile Response
 */
export interface GetProfileResponse {
  success: boolean
  data: {
    user: User
    shopAccesses: UserShopAccess[]
    activeShops: number
  }
}

/**
 * Update Profile Response
 */
export interface UpdateProfileResponse {
  success: boolean
  message: string
  data: {
    user: User
  }
}

/**
 * Enable Two-Factor Response
 */
export interface EnableTwoFactorResponse {
  success: boolean
  message: string
  data: {
    secret: string
    qrCode: string
    backupCodes: string[]
  }
}

/**
 * Verify Two-Factor Response
 */
export interface VerifyTwoFactorResponse {
  success: boolean
  message: string
  data: {
    verified: boolean
    enabled: boolean
  }
}

/**
 * Disable Two-Factor Response
 */
export interface DisableTwoFactorResponse {
  success: boolean
  message: string
  data: {
    disabled: boolean
  }
}

/**
 * Get Sessions Response
 */
export interface GetSessionsResponse {
  success: boolean
  data: {
    sessions: Array<{
      tokenId: string
      device: DeviceInfo
      ipAddress?: string
      lastUsedAt: Date | string
      createdAt: Date | string
      expiresAt: Date | string
      isCurrent: boolean
    }>
    total: number
  }
}

/**
 * Revoke Session Response
 */
export interface RevokeSessionResponse {
  success: boolean
  message: string
  data: {
    revoked: boolean
    tokenId: string
  }
}

/**
 * Check Email Availability Response
 */
export interface CheckEmailResponse {
  success: boolean
  data: {
    available: boolean
  }
}

/**
 * Check Username Availability Response
 */
export interface CheckUsernameResponse {
  success: boolean
  data: {
    available: boolean
  }
}

/**
 * Validate Token Response
 */
export interface ValidateTokenResponse {
  success: boolean
  data: {
    valid: boolean
    user?: User
    expiresAt?: Date | string
  }
}

// ============================================================================
// AUTH STATE TYPES (for Frontend State Management)
// ============================================================================

/**
 * Auth State
 */
export interface AuthState {
  // User & Authentication
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  tokenId: string | null
  isAuthenticated: boolean

  // Loading States
  isLoading: boolean
  is2FALoading: boolean //  : Only for 2FA operations
  isPasswordChanging: boolean //  : Only for password
  isProfileUpdating: boolean //  : Only for profile
  isInitializing: boolean
  isRefreshing: boolean

  // Error State
  error: string | null

  // Shop Access & Permissions
  shopAccesses: UserShopAccess[]
  currentShop: string | null
  currentShopAccess: UserShopAccess | null
  permissions: ShopPermissions | null

  // Session Management
  sessions: RefreshToken[]

  // Two-Factor
  requires2FA: boolean
  twoFactorEnabled: boolean

  // Last Activity
  lastActivity: Date | null
}

/**
 * Auth Context Value
 */
export interface AuthContextValue {
  // State
  state: AuthState

  // Auth Actions
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  logoutAll: () => Promise<void>
  refreshAccessToken: () => Promise<void>

  // Profile Actions
  updateProfile: (data: any) => Promise<void>
  changePassword: (data: ChangePasswordRequest) => Promise<void>

  // Email & Password Recovery
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (data: ResetPasswordRequest) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  resendVerification: (email: string) => Promise<void>

  // Two-Factor
  enableTwoFactor: (
    password: string
  ) => Promise<{ secret: string; qrCode: string; backupCodes: string[] }>
  verifyTwoFactor: (token: string, code: string) => Promise<void>
  disableTwoFactor: (password: string, code: string) => Promise<void>

  // Shop Selection & Permissions
  setCurrentShop: (shopId: string) => void
  hasPermission: (permission: PermissionKey) => boolean
  hasAnyPermission: (permissions: PermissionKey[]) => boolean
  hasAllPermissions: (permissions: PermissionKey[]) => boolean
  hasRole: (role: UserRole) => boolean
  hasShopRole: (role: string) => boolean

  // Session Management
  getSessions: () => Promise<void>
  revokeSession: (tokenId: string) => Promise<void>

  // Utility
  checkAuth: () => Promise<void>
  clearError: () => void
  updateLastActivity: () => void
}

/**
 * Protected Route Props
 */
export interface ProtectedRouteProps {
  children: React.ReactNode

  // Role-based Protection
  requiredRole?: UserRole
  requiredRoles?: UserRole[]

  // Permission-based Protection
  requiredPermission?: PermissionKey
  requiredPermissions?: PermissionKey[]
  requireAll?: boolean // If true, user must have all permissions

  // Shop-based Protection
  requireShopAccess?: boolean
  specificShop?: string

  // Email Verification
  requireVerifiedEmail?: boolean

  // Redirect Options
  redirectTo?: string
  fallback?: React.ReactNode
}

/**
 * Public Route Props (redirects authenticated users)
 */
export interface PublicRouteProps {
  children: React.ReactNode
  restricted?: boolean // If true, authenticated users can't access
  redirectTo?: string
}

/**
 * Auth Guard Props
 */
export interface AuthGuardProps {
  children: React.ReactNode
  loading?: React.ReactNode
}

// ============================================================================
// FORM STATE TYPES
// ============================================================================

/**
 * Login Form State
 */
export interface LoginFormState {
  email: string
  password: string
  rememberMe: boolean
}

/**
 * Register Form State
 */
export interface RegisterFormState {
  username: string
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone: string
  organizationId: string
  role: UserRole
  primaryShop: string
  department: Department
  agreeToTerms: boolean
}

/**
 * Change Password Form State
 */
export interface ChangePasswordFormState {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

/**
 * Forgot Password Form State
 */
export interface ForgotPasswordFormState {
  email: string
}

/**
 * Reset Password Form State
 */
export interface ResetPasswordFormState {
  token: string
  newPassword: string
  confirmPassword: string
}

/**
 * Two-Factor Setup Form State
 */
export interface TwoFactorSetupFormState {
  password: string
  verificationCode: string
}

/**
 * Two-Factor Login Form State
 */
export interface TwoFactorLoginFormState {
  code: string
  useBackupCode: boolean
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

/**
 * Field Error
 */
export interface FieldError {
  field: string
  message: string
  value?: any
}

/**
 * Validation Result
 */
export interface ValidationResult {
  isValid: boolean
  errors: FieldError[]
}

/**
 * Password Strength
 */
export interface PasswordStrength {
  score: number // 0-4
  strength: 'weak' | 'fair' | 'good' | 'strong' | 'very strong'
  feedback: string[]
  hasUpperCase: boolean
  hasLowerCase: boolean
  hasNumber: boolean
  hasSpecialChar: boolean
  minLength: boolean
}

// ============================================================================
// AUTH EVENT TYPES
// ============================================================================

/**
 * Auth Event Type
 */
export type AuthEventType =
  | 'login'
  | 'logout'
  | 'logout_all'
  | 'register'
  | 'password_change'
  | 'password_reset'
  | 'email_verify'
  | 'token_refresh'
  | '2fa_enable'
  | '2fa_disable'
  | 'session_revoke'

/**
 * Auth Event
 */
export interface AuthEvent {
  type: AuthEventType
  userId?: string
  timestamp: Date
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, any>
}

// ============================================================================
// AUTH CONFIGURATION
// ============================================================================

/**
 * Auth Configuration
 */
export interface AuthConfig {
  // API Endpoints
  apiBaseUrl: string
  loginEndpoint: string
  registerEndpoint: string
  logoutEndpoint: string
  refreshEndpoint: string

  // Token Settings
  tokenKey: string
  refreshTokenKey: string
  tokenExpiryBuffer: number // minutes before expiry to refresh

  // Session Settings
  sessionTimeout: number // minutes
  absoluteTimeout: number // hours
  inactivityTimeout: number // minutes

  // Redirect URLs
  loginRedirect: string
  logoutRedirect: string
  unauthorizedRedirect: string

  // Features
  enableRememberMe: boolean
  enable2FA: boolean
  enableEmailVerification: boolean

  // Security
  maxLoginAttempts: number
  lockoutDuration: number // minutes
}
