// ============================================================================
// FILE: src/types/auth.types.ts
// Authentication & User related TypeScript types (Backend matched)
// ============================================================================

import { ID, Timestamp } from './common.types';

// ============================================================================
// USER ENUMS
// ============================================================================

/**
 * User Role Enum (matches backend exactly)
 */
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ORG_ADMIN = 'org_admin',
  SHOP_ADMIN = 'shop_admin',
  MANAGER = 'manager',
  STAFF = 'staff',
  ACCOUNTANT = 'accountant',
  VIEWER = 'viewer',
}

/**
 * User Department Enum (matches backend)
 */
export enum UserDepartment {
  SALES = 'sales',
  PURCHASE = 'purchase',
  INVENTORY = 'inventory',
  ACCOUNTS = 'accounts',
  MANAGEMENT = 'management',
  WORKSHOP = 'workshop',
  QUALITY_CHECK = 'quality_check',
  CUSTOMER_SERVICE = 'customer_service',
  OTHER = 'other',
}

/**
 * Language Options (matches backend)
 */
export enum Language {
  EN = 'en',
  HI = 'hi',
  MR = 'mr',
  GU = 'gu',
  TA = 'ta',
  TE = 'te',
}

/**
 * Currency Options (matches backend)
 */
export enum Currency {
  INR = 'INR',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  AED = 'AED',
}

/**
 * Date Format Options (matches backend)
 */
export enum DateFormat {
  DD_MM_YYYY = 'DD/MM/YYYY',
  MM_DD_YYYY = 'MM/DD/YYYY',
  YYYY_MM_DD = 'YYYY-MM-DD',
}

/**
 * Theme Options (matches backend)
 */
export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto',
}

// ============================================================================
// USER PREFERENCES
// ============================================================================

/**
 * User Preferences (matches backend exactly)
 */
export interface UserPreferences {
  language: Language;
  timezone: string;
  currency: Currency;
  dateFormat: DateFormat;
  theme: Theme;
  notificationsEnabled: boolean;
}

/**
 * Default User Preferences
 */
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  language: Language.EN,
  timezone: 'Asia/Kolkata',
  currency: Currency.INR,
  dateFormat: DateFormat.DD_MM_YYYY,
  theme: Theme.LIGHT,
  notificationsEnabled: true,
};

// ============================================================================
// USER INTERFACE (matches backend User model)
// ============================================================================

/**
 * Complete User Interface (matches backend User model)
 */
export interface User {
  // Basic Information
  _id: ID;
  username: string;
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  profileImage?: string;
  
  // SaaS Multi-tenant Fields
  organizationId?: ID;
  
  // Role-based Access Control
  role: UserRole;
  
  // Primary Shop (Default working location)
  primaryShop?: ID;
  
  // User Status
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  
  // Security (not included in JSON response but type for reference)
  lastLogin?: Timestamp;
  lastLoginIP?: string;
  
  // Two-Factor Authentication
  twoFactorEnabled: boolean;
  
  // Additional Fields for Jewelry Business
  designation?: string;
  department?: UserDepartment;
  employeeId?: string;
  joiningDate?: Timestamp;
  
  // Sales Performance & Incentives
  salesTarget?: number;
  commissionRate?: number;
  
  // User Preferences
  preferences: UserPreferences;
  
  // Tracking fields
  createdBy?: ID;
  updatedBy?: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Virtual fields (computed on frontend or from backend)
  fullName?: string;
  isSuperAdmin?: boolean;
  isOrgAdmin?: boolean;
}

/**
 * User with populated relations
 */
export interface UserWithRelations extends User {
  organization?: {
    _id: ID;
    name: string;
    logo?: string;
    isActive: boolean;
  };
  primaryShopDetails?: {
    _id: ID;
    name: string;
    code: string;
    address?: string;
  };
  shopAccesses?: ShopAccess[];
  createdByUser?: {
    _id: ID;
    firstName: string;
    lastName?: string;
  };
}

// ============================================================================
// SHOP ACCESS INTERFACE
// ============================================================================

/**
 * User Shop Access (for multi-shop users)
 */
export interface ShopAccess {
  _id: ID;
  userId: ID;
  shopId: ID;
  organizationId: ID;
  role: UserRole;
  permissions: Record<string, boolean>;
  isActive: boolean;
  grantedBy?: ID;
  grantedAt: Timestamp;
  revokedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt?: Timestamp;
  
  // Populated fields
  shop?: {
    _id: ID;
    name: string;
    code: string;
    address?: string;
  };
}

// ============================================================================
// AUTHENTICATION REQUEST TYPES
// ============================================================================

/**
 * Register Request (matches backend validation)
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  organizationId?: ID;
  role: UserRole;
  primaryShop?: ID;
  department?: UserDepartment;
  designation?: string;
  employeeId?: string;
}

/**
 * Login Request (matches backend validation)
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Change Password Request (matches backend validation)
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Forgot Password Request (matches backend validation)
 */
export interface ForgotPasswordRequest {
  email: string;
}

/**
 * Reset Password Request (matches backend validation)
 */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Verify Email Request (matches backend validation)
 */
export interface VerifyEmailRequest {
  token: string;
}

/**
 * Refresh Token Request (matches backend validation)
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Update Profile Request (matches backend validation)
 */
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileImage?: string;
  designation?: string;
  preferences?: Partial<UserPreferences>;
}

/**
 * Logout Request (matches backend)
 */
export interface LogoutRequest {
  refreshToken: string;
}

// ============================================================================
// AUTHENTICATION RESPONSE TYPES
// ============================================================================

/**
 * Token Pair (from backend tokenManager)
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Login Response (matches backend auth.service response)
 */
export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/**
 * Register Response (matches backend auth.service response)
 */
export interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

/**
 * Refresh Token Response
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Current User Response (from /me endpoint)
 */
export interface CurrentUserResponse extends User {
  permissions?: Record<string, boolean>;
  shopAccesses?: ShopAccess[];
}

/**
 * Password Changed Response
 */
export interface PasswordChangedResponse {
  success: boolean;
  message: string;
}

/**
 * Email Verification Response
 */
export interface EmailVerificationResponse {
  success: boolean;
  alreadyVerified?: boolean;
  message: string;
}

// ============================================================================
// SESSION TYPES (matches backend)
// ============================================================================

/**
 * Active Session (matches backend getActiveSessions response)
 */
export interface ActiveSession {
  id: string;
  device: string;
  ipAddress: string;
  lastUsed: Timestamp;
  createdAt: Timestamp;
  expiresAt: Timestamp;
  isCurrent: boolean;
}

/**
 * Sessions List Response
 */
export interface SessionsListResponse {
  sessions: ActiveSession[];
}

// ============================================================================
// AUTHENTICATION STATE (for Redux/Context)
// ============================================================================

/**
 * Auth State for Redux store or Context
 */
export interface AuthState {
  // User data
  user: User | null;
  
  // Tokens
  accessToken: string | null;
  refreshToken: string | null;
  
  // Status
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  
  // Error
  error: string | null;
  
  // Additional info
  permissions?: Record<string, boolean>;
  shopAccess?: ShopAccess[];
  currentShopId?: ID;
}

/**
 * Initial Auth State
 */
export const initialAuthState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
  permissions: {},
  shopAccess: [],
  currentShopId: undefined,
};

// ============================================================================
// FORM TYPES (for React Hook Form)
// ============================================================================

/**
 * Login Form Values (matches backend validation)
 */
export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Register Form Values (matches backend validation exactly)
 */
export interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  role: UserRole;
  organizationId?: string;
  primaryShop?: string;
  department?: UserDepartment;
  designation?: string;
  acceptTerms: boolean;
}

/**
 * Change Password Form Values (matches backend validation)
 */
export interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Forgot Password Form Values
 */
export interface ForgotPasswordFormValues {
  email: string;
}

/**
 * Reset Password Form Values
 */
export interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

/**
 * Update Profile Form Values (matches backend validation)
 */
export interface UpdateProfileFormValues {
  firstName: string;
  lastName?: string;
  phone?: string;
  designation?: string;
  profileImage?: string;
  preferences?: Partial<UserPreferences>;
}

// ============================================================================
// VALIDATION ERROR TYPES
// ============================================================================

/**
 * Field Validation Error (matches backend validation response)
 */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * Auth Validation Error Response (matches backend error format)
 */
export interface AuthValidationError {
  success: false;
  statusCode: 400 | 422;
  message: string;
  errors: FieldError[];
  timestamp: string;
}

// ============================================================================
// PERMISSION TYPES
// ============================================================================

/**
 * Permission string format
 * Example: "sales:create", "inventory:view", "reports:export"
 */
export type Permission = string;

/**
 * Permission Checker Function Type
 */
export type PermissionChecker = (permission: Permission | Permission[]) => boolean;

/**
 * Role Permission Map
 */
export interface RolePermissions {
  [key: string]: Permission[];
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Check if user has specific role
 */
export type HasRole = (role: UserRole | UserRole[]) => boolean;

/**
 * Check if user has permission
 */
export type HasPermission = (permission: Permission | Permission[]) => boolean;

/**
 * Get user's full name
 */
export type GetFullName = (user: User) => string;

// ============================================================================
// HELPER FUNCTIONS (Type Guards & Utilities)
// ============================================================================

/**
 * Check if user is authenticated
 */
export function isAuthenticated(state: AuthState): state is AuthState & { user: User } {
  return state.isAuthenticated && state.user !== null;
}

/**
 * Check if response is login response
 */
export function isLoginResponse(response: any): response is LoginResponse {
  return (
    response &&
    typeof response === 'object' &&
    response.user &&
    response.accessToken &&
    response.refreshToken
  );
}

/**
 * Check if error is auth validation error
 */
export function isAuthValidationError(error: any): error is AuthValidationError {
  return (
    error &&
    error.success === false &&
    Array.isArray(error.errors) &&
    error.errors.length > 0
  );
}

/**
 * Get user's display name (matches backend virtual fullName)
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return 'Guest';
  
  if (user.fullName) return user.fullName;
  
  return user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}`.trim()
    : user.firstName || user.username;
}

/**
 * Get user's initials
 */
export function getUserInitials(user: User | null): string {
  if (!user) return '?';
  
  const first = user.firstName?.[0] || '';
  const last = user.lastName?.[0] || '';
  const initials = (first + last).toUpperCase();
  
  return initials || user.username?.[0]?.toUpperCase() || '?';
}

/**
 * Check if user is super admin (matches backend virtual)
 */
export function isSuperAdmin(user: User | null): boolean {
  return user?.role === UserRole.SUPER_ADMIN;
}

/**
 * Check if user is org admin (matches backend virtual)
 */
export function isOrgAdmin(user: User | null): boolean {
  return user?.role === UserRole.ORG_ADMIN || user?.role === UserRole.SUPER_ADMIN;
}

/**
 * Check if user is shop admin
 */
export function isShopAdmin(user: User | null): boolean {
  return user?.role === UserRole.SHOP_ADMIN;
}

/**
 * Check if user has manager role or higher
 */
export function isManagerOrAbove(user: User | null): boolean {
  if (!user) return false;
  
  return [
    UserRole.SUPER_ADMIN,
    UserRole.ORG_ADMIN,
    UserRole.SHOP_ADMIN,
    UserRole.MANAGER,
  ].includes(user.role);
}

/**
 * Check if user is staff level (lowest privilege)
 */
export function isStaffLevel(user: User | null): boolean {
  if (!user) return false;
  
  return [
    UserRole.STAFF,
    UserRole.ACCOUNTANT,
    UserRole.VIEWER,
  ].includes(user.role);
}

/**
 * Check if user can access shop (has shop access)
 */
export function canAccessShop(user: User | null, shopId: ID): boolean {
  if (!user) return false;
  if (isSuperAdmin(user)) return true; // Super admin has access to all shops
  if (user.primaryShop === shopId) return true;
  return false;
}

/**
 * Get role hierarchy level (for comparison)
 */
export function getRoleLevel(role: UserRole): number {
  const levels: Record<UserRole, number> = {
    [UserRole.SUPER_ADMIN]: 7,
    [UserRole.ORG_ADMIN]: 6,
    [UserRole.SHOP_ADMIN]: 5,
    [UserRole.MANAGER]: 4,
    [UserRole.STAFF]: 3,
    [UserRole.ACCOUNTANT]: 2,
    [UserRole.VIEWER]: 1,
  };
  return levels[role] || 0;
}

/**
 * Check if user has higher or equal role
 */
export function hasHigherOrEqualRole(user: User | null, role: UserRole): boolean {
  if (!user) return false;
  return getRoleLevel(user.role) >= getRoleLevel(role);
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Role Labels (for UI display)
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Super Admin',
  [UserRole.ORG_ADMIN]: 'Organization Admin',
  [UserRole.SHOP_ADMIN]: 'Shop Admin',
  [UserRole.MANAGER]: 'Manager',
  [UserRole.STAFF]: 'Staff',
  [UserRole.ACCOUNTANT]: 'Accountant',
  [UserRole.VIEWER]: 'Viewer',
};

/**
 * Department Labels (for UI display)
 */
export const DEPARTMENT_LABELS: Record<UserDepartment, string> = {
  [UserDepartment.SALES]: 'Sales',
  [UserDepartment.PURCHASE]: 'Purchase',
  [UserDepartment.INVENTORY]: 'Inventory',
  [UserDepartment.ACCOUNTS]: 'Accounts',
  [UserDepartment.MANAGEMENT]: 'Management',
  [UserDepartment.WORKSHOP]: 'Workshop',
  [UserDepartment.QUALITY_CHECK]: 'Quality Check',
  [UserDepartment.CUSTOMER_SERVICE]: 'Customer Service',
  [UserDepartment.OTHER]: 'Other',
};

/**
 * Language Labels (for UI display)
 */
export const LANGUAGE_LABELS: Record<Language, string> = {
  [Language.EN]: 'English',
  [Language.HI]: 'हिन्दी (Hindi)',
  [Language.MR]: 'मराठी (Marathi)',
  [Language.GU]: 'ગુજરાતી (Gujarati)',
  [Language.TA]: 'தமிழ் (Tamil)',
  [Language.TE]: 'తెలుగు (Telugu)',
};

/**
 * Role Colors (for badges)
 */
export const ROLE_COLORS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'red',
  [UserRole.ORG_ADMIN]: 'purple',
  [UserRole.SHOP_ADMIN]: 'blue',
  [UserRole.MANAGER]: 'green',
  [UserRole.STAFF]: 'gray',
  [UserRole.ACCOUNTANT]: 'yellow',
  [UserRole.VIEWER]: 'gray',
};

/**
 * Validation Regex (matches backend)
 */
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
export const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
export const PHONE_REGEX = /^[0-9]{10}$/;
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/;

/**
 * Field Length Constraints (matches backend)
 */
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;
export const PASSWORD_MIN_LENGTH = 6;
export const FIRST_NAME_MAX_LENGTH = 50;
export const LAST_NAME_MAX_LENGTH = 50;
export const DESIGNATION_MAX_LENGTH = 100;

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  // Enums
  UserRole,
  UserDepartment,
  Language,
  Currency,
  DateFormat,
  Theme,
  
  // Constants
  DEFAULT_USER_PREFERENCES,
  initialAuthState,
  ROLE_LABELS,
  DEPARTMENT_LABELS,
  LANGUAGE_LABELS,
  ROLE_COLORS,
  PASSWORD_REGEX,
  EMAIL_REGEX,
  PHONE_REGEX,
  USERNAME_REGEX,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  FIRST_NAME_MAX_LENGTH,
  LAST_NAME_MAX_LENGTH,
  DESIGNATION_MAX_LENGTH,
  
  // Helper Functions
  isAuthenticated,
  isLoginResponse,
  isAuthValidationError,
  getUserDisplayName,
  getUserInitials,
  isSuperAdmin,
  isOrgAdmin,
  isShopAdmin,
  isManagerOrAbove,
  isStaffLevel,
  canAccessShop,
  getRoleLevel,
  hasHigherOrEqualRole,
};