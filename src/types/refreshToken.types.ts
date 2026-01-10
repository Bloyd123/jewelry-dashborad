// FILE: refreshToken.types.ts
// Refresh Token & Session Management Types

/**
 * Device Type
 */
export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'unknown'

/**
 * Device Information
 */
export interface DeviceInfo {
  type: DeviceType
  browser: string
  os: string
}

/**
 * Refresh Token - Complete Model
 */
export interface RefreshToken {
  _id: string

  // User Reference
  userId: string

  // Organization Reference (Multi-tenant)
  organizationId?: string | null

  // Token Information
  token: string
  tokenId: string

  // Token Status
  isRevoked: boolean
  revokedAt?: Date | string | null
  revokedReason?: string | null

  // Token Expiry
  expiresAt: Date | string

  // Session Information
  ipAddress?: string | null
  userAgent?: string | null

  // Device Information (parsed from userAgent)
  device: DeviceInfo

  // Usage Tracking
  lastUsedAt: Date | string
  lastUsedIP?: string | null
  usageCount: number

  // Metadata
  metadata: Record<string, any>

  // Timestamps
  createdAt: Date | string
  updatedAt: Date | string

  // Virtuals (computed fields)
  isExpired?: boolean
  isValid?: boolean
  expiresIn?: number // seconds
  age?: number // days
}

/**
 * Refresh Token with User Info (Populated)
 */
export interface RefreshTokenWithUser extends RefreshToken {
  user?: any // User type
  organization?: any // Organization type
}

/**
 * Create Refresh Token Request
 */
export interface CreateRefreshTokenRequest {
  userId: string
  organizationId?: string | null
  token: string
  tokenId: string
  expiresAt: Date | string
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, any>
}

/**
 * Update Refresh Token Request
 */
export interface UpdateRefreshTokenRequest {
  lastUsedAt?: Date | string
  lastUsedIP?: string
  usageCount?: number
  metadata?: Record<string, any>
}

/**
 * Revoke Token Request
 */
export interface RevokeTokenRequest {
  tokenId: string
  reason?: string
}

/**
 * Revoke All Tokens Request
 */
export interface RevokeAllTokensRequest {
  userId: string
  reason?: string
  exceptCurrentToken?: boolean
  currentTokenId?: string
}

/**
 * Revoke Organization Tokens Request
 */
export interface RevokeOrgTokensRequest {
  organizationId: string
  reason?: string
}

/**
 * Token Query Parameters
 */
export interface TokenQueryParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  userId?: string
  organizationId?: string
  isRevoked?: boolean
  isExpired?: boolean
  deviceType?: DeviceType
  ipAddress?: string
  includeInvalid?: boolean
}

/**
 * Token Statistics (for a user)
 */
export interface TokenStatistics {
  total: number
  active: number
  revoked: number
  expired: number
}

/**
 * Organization Token Statistics
 */
export interface OrgTokenStatistics {
  total: number
  active: number
  activeUsers: number
  byDeviceType: Record<DeviceType, number>
  recentActivity: number
}

/**
 * Token Info (Sanitized for frontend)
 */
export interface TokenInfo {
  tokenId: string
  createdAt: Date | string
  expiresAt: Date | string
  lastUsedAt: Date | string
  isValid: boolean
  isExpired: boolean
  isRevoked: boolean
  device: DeviceInfo
  ipAddress?: string
  usageCount: number
  expiresIn?: number // seconds
  age?: number // days
}

/**
 * Active Session Info (for display in user settings)
 */
export interface ActiveSession {
  tokenId: string
  device: DeviceInfo
  ipAddress?: string
  lastUsedAt: Date | string
  createdAt: Date | string
  expiresAt: Date | string
  isCurrent: boolean // If this is the current session
}

/**
 * Session List Item (for tables/lists)
 */
export interface SessionListItem {
  tokenId: string
  deviceType: DeviceType
  browser: string
  os: string
  ipAddress?: string
  location?: string // Can be derived from IP
  lastUsedAt: Date | string
  createdAt: Date | string
  isActive: boolean
  isCurrent: boolean
}

/**
 * Revoke Session Request (User-facing)
 */
export interface RevokeSessionRequest {
  tokenId: string
}

/**
 * Token Validation Result
 */
export interface TokenValidationResult {
  isValid: boolean
  token?: RefreshToken
  reason?: string
  errors?: string[]
}

/**
 * Token Refresh Response
 */
export interface TokenRefreshResponse {
  accessToken: string
  refreshToken: string
  tokenId: string
  expiresIn: number
}

/**
 * Suspicious Activity Detection Result
 */
export interface SuspiciousActivityResult {
  uniqueIPs: string[]
  activeTokens: number
  suspicious: boolean
  details?: {
    multipleDevices: boolean
    multipleLocations: boolean
    unusualActivity: boolean
  }
}

/**
 * Token Cleanup Result
 */
export interface TokenCleanupResult {
  deletedCount: number
  success: boolean
  olderThanDays: number
}

/**
 * Token Usage Analytics
 */
export interface TokenUsageAnalytics {
  totalTokens: number
  activeTokens: number
  averageUsageCount: number
  mostActiveUsers: Array<{
    userId: string
    tokenCount: number
    totalUsage: number
  }>
  deviceDistribution: Record<DeviceType, number>
  browserDistribution: Record<string, number>
  osDistribution: Record<string, number>
  peakUsageHours: number[]
}

/**
 * Token Revocation Log
 */
export interface TokenRevocationLog {
  tokenId: string
  userId: string
  revokedAt: Date | string
  revokedBy?: string
  reason: string
  automaticRevocation: boolean
}

/**
 * Token Expiry Alert
 */
export interface TokenExpiryAlert {
  tokenId: string
  userId: string
  expiresAt: Date | string
  hoursRemaining: number
  device: DeviceInfo
}

/**
 * Bulk Token Operation Request
 */
export interface BulkTokenOperationRequest {
  tokenIds: string[]
  action: 'revoke' | 'delete'
  reason?: string
}

/**
 * Bulk Token Operation Result
 */
export interface BulkTokenOperationResult {
  total: number
  successful: number
  failed: number
  results: Array<{
    tokenId: string
    success: boolean
    error?: string
  }>
}

/**
 * Token Security Event
 */
export interface TokenSecurityEvent {
  eventId: string
  tokenId: string
  userId: string
  eventType:
    | 'suspicious_ip'
    | 'multiple_devices'
    | 'unusual_usage'
    | 'token_leaked'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  timestamp: Date | string
  resolved: boolean
}

/**
 * Device Fingerprint (for enhanced security)
 */
export interface DeviceFingerprint {
  userAgent: string
  screenResolution?: string
  timezone?: string
  language?: string
  platform?: string
  hash?: string // Combined hash of all fingerprint data
}

/**
 * Token Session Context
 */
export interface TokenSessionContext {
  tokenId: string
  userId: string
  organizationId?: string
  device: DeviceInfo
  ipAddress?: string
  createdAt: Date | string
  expiresAt: Date | string
  permissions?: any // Can include user permissions
}

/**
 * Token Rotation Request
 */
export interface TokenRotationRequest {
  currentToken: string
  rotationReason?: 'security' | 'expiry' | 'user_request'
}

/**
 * Token Rotation Response
 */
export interface TokenRotationResponse {
  newAccessToken: string
  newRefreshToken: string
  newTokenId: string
  expiresIn: number
  oldTokenRevoked: boolean
}

/**
 * Token Blacklist Entry (for immediate invalidation)
 */
export interface TokenBlacklistEntry {
  tokenId: string
  blacklistedAt: Date | string
  reason: string
  expiresAt: Date | string
}

/**
 * Session Timeout Settings
 */
export interface SessionTimeoutSettings {
  accessTokenExpiry: number // minutes
  refreshTokenExpiry: number // days
  absoluteTimeout: number // hours
  inactivityTimeout: number // minutes
  rememberMeDuration: number // days
}

/**
 * Multi-Factor Token (for 2FA sessions)
 */
export interface MultiFactorToken {
  tokenId: string
  userId: string
  verified: boolean
  verifiedAt?: Date | string
  expiresAt: Date | string
}

/**
 * Token Rate Limit Info
 */
export interface TokenRateLimitInfo {
  tokenId: string
  requestCount: number
  lastRequest: Date | string
  limitExceeded: boolean
  resetAt: Date | string
}

/**
 * Concurrent Session Policy
 */
export interface ConcurrentSessionPolicy {
  maxConcurrentSessions: number
  enforceLimit: boolean
  action: 'revoke_oldest' | 'deny_new' | 'notify_user'
}

/**
 * Token Audit Trail Entry
 */
export interface TokenAuditTrail {
  tokenId: string
  action: 'created' | 'used' | 'refreshed' | 'revoked' | 'expired'
  timestamp: Date | string
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, any>
}
