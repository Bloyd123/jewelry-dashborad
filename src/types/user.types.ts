// FILE: user.types.ts
// User Model Types

export type UserRole =
  | 'super_admin'
  | 'org_admin'
  | 'shop_admin'
  | 'manager'
  | 'staff'
  | 'accountant'
  | 'viewer'

/**
 * Department Types
 */
export type Department =
  | 'sales'
  | 'purchase'
  | 'inventory'
  | 'accounts'
  | 'management'
  | 'workshop'
  | 'quality_check'
  | 'customer_service'
  | 'other'

/**
 * Language Options
 */
export type Language = 'en' | 'hi' | 'mr' | 'gu' | 'ta' | 'te'

/**
 * Theme Options
 */
export type Theme = 'light' | 'dark' | 'auto'

/**
 * Date Format Options
 */
export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'

/**
 * Currency Options
 */
export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED'

/**
 * User Preferences
 */
export interface UserPreferences {
  language: Language
  timezone: string
  currency: Currency
  dateFormat: DateFormat
  theme: Theme
  notificationsEnabled: boolean
}

/**
 * User Interface - Complete User Model
 */
export interface User {
  _id: string

  // Basic User Information
  username: string
  email: string
  firstName: string
  lastName?: string
  phone?: string
  profileImage?: string | null

  // SaaS Multi-tenant Fields
  organizationId?: string | null
  role: UserRole
  primaryShop?: string | null

  // User Status
  isActive: boolean
  isEmailVerified: boolean
  isPhoneVerified: boolean

  // Security & Session Management
  lastLogin?: Date | string | null
  lastLoginIP?: string | null

  // Two-Factor Authentication
  twoFactorEnabled: boolean
  backupCodes?: string[] // ADD
  backupCodesUsed?: string[] // ADD

  // Additional Fields for Jewelry Business
  designation?: string
  department: Department
  employeeId?: string
  joiningDate?: Date | string | null

  // Sales Performance & Incentives
  salesTarget: number
  commissionRate: number

  // User Preferences
  preferences: UserPreferences

  // Tracking fields
  createdBy?: string | null
  updatedBy?: string | null

  // Timestamps
  createdAt: Date | string
  updatedAt: Date | string
  deletedAt?: Date | string | null

  // Virtuals (computed fields)
  fullName?: string
  isSuperAdmin?: boolean
  isOrgAdmin?: boolean
}

/**
 * User Create Request (for registration/admin creation)
 */
export interface CreateUserRequest {
  username: string
  email: string
  password: string
  firstName: string
  lastName?: string
  phone?: string
  organizationId?: string
  role: UserRole
  primaryShop?: string
  designation?: string
  department?: Department
  employeeId?: string
  joiningDate?: Date | string
  salesTarget?: number
  commissionRate?: number
  preferences?: Partial<UserPreferences>
}

/**
 * User Update Request
 */
export interface UpdateUserRequest {
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  phone?: string
  profileImage?: string
  role?: UserRole
  primaryShop?: string
  designation?: string
  department?: Department
  employeeId?: string
  joiningDate?: Date | string
  salesTarget?: number
  commissionRate?: number
  isActive?: boolean
  preferences?: Partial<UserPreferences>
}

/**
 * Update Profile Request (Self-service)
 */
export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  phone?: string
  designation?: string
  profileImage?: string
  preferences?: Partial<UserPreferences>
}

/**
 * User Query Parameters
 */
export interface UserQueryParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  search?: string
  organizationId?: string
  role?: UserRole
  department?: Department
  isActive?: boolean
  isEmailVerified?: boolean
  includeDeleted?: boolean
}

/**
 * User Statistics
 */
export interface UserStatistics {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  verifiedUsers: number
  unverifiedUsers: number
  byRole: Record<UserRole, number>
  byDepartment: Record<Department, number>
}

/**
 * User with Relations (Populated)
 */
export interface UserWithRelations extends User {
  organization?: any // Organization type
  primaryShopDetails?: any // Shop type
  shopAccesses?: any[] // UserShopAccess[]
  activityLogs?: any[] // ActivityLog[]
}

/**
 * User List Item (for tables/lists)
 */
export interface UserListItem {
  _id: string
  username: string
  email: string
  fullName: string
  role: UserRole
  department: Department
  isActive: boolean
  isEmailVerified: boolean
  lastLogin?: Date | string | null
  createdAt: Date | string
}

/**
 * User Profile (Public facing)
 */
export interface UserProfile {
  _id: string
  username: string
  firstName: string
  lastName?: string
  fullName: string
  profileImage?: string | null
  designation?: string
  department: Department
  role: UserRole
}

/**
 * User Search Result
 */
export interface UserSearchResult {
  _id: string
  username: string
  email: string
  fullName: string
  role: UserRole
  department: Department
  profileImage?: string | null
}

/**
 * User Activity Summary
 */
export interface UserActivitySummary {
  userId: string
  lastLogin?: Date | string
  loginCount: number
  activeShops: number
  recentActions: number
  lastActivity?: Date | string
}

/**
 * User Filter Options
 */
export interface UserFilterOptions {
  roles?: UserRole[]
  departments?: Department[]
  isActive?: boolean
  isEmailVerified?: boolean
  hasShopAccess?: boolean
  dateJoinedFrom?: Date | string
  dateJoinedTo?: Date | string
}

/**
 * Bulk User Operation Request
 */
export interface BulkUserOperationRequest {
  userIds: string[]
  action: 'activate' | 'deactivate' | 'delete' | 'verify_email'
  reason?: string
}

/**
 * Bulk User Operation Result
 */
export interface BulkUserOperationResult {
  total: number
  successful: number
  failed: number
  results: Array<{
    userId: string
    success: boolean
    error?: string
  }>
}

/**
 * User Import Row
 */
export interface UserImportRow {
  username: string
  email: string
  password: string
  firstName: string
  lastName?: string
  phone?: string
  role: string
  department?: string
  designation?: string
  employeeId?: string
}

/**
 * User Export Data
 */
export interface UserExportData {
  username: string
  email: string
  fullName: string
  role: string
  department: string
  designation?: string
  employeeId?: string
  isActive: boolean
  isEmailVerified: boolean
  lastLogin?: string
  createdAt: string
}

/**
 * User Form State
 */
export interface UserFormState {
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
  designation: string
  department: Department
  employeeId: string
  joiningDate: string
  salesTarget: string
  commissionRate: string
}

/**
 * User Preferences Form State
 */
export interface UserPreferencesFormState {
  language: Language
  timezone: string
  currency: Currency
  dateFormat: DateFormat
  theme: Theme
  notificationsEnabled: boolean
}
