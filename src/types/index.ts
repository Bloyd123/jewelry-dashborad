// ============================================================================
// FILE: types/index.ts
// Central Types Export - All TypeScript Types
// ============================================================================

// ============================================================================
// USER TYPES
// ============================================================================
export type {
  UserRole,
  Department,
  Language,
  Theme,
  DateFormat,
  Currency,

  // Interfaces
  UserPreferences,
  User,
  UserWithRelations,
  UserListItem,
  UserProfile,
  UserSearchResult,
  UserActivitySummary,

  // Request Types
  CreateUserRequest,
  UpdateUserRequest,
  UpdateProfileRequest,

  // Query & Filter Types
  UserQueryParams,
  UserFilterOptions,

  // Statistics & Bulk Operations
  UserStatistics,
  BulkUserOperationRequest,
  BulkUserOperationResult,

  // Import/Export
  UserImportRow,
  UserExportData,

  // Form States
  UserFormState,
  UserPreferencesFormState,
} from './user.types'

// ============================================================================
// USER SHOP ACCESS & PERMISSIONS TYPES
// ============================================================================
export type {
  // Enums & Literals
  ShopRole,
  PermissionKey,
  PermissionCategory,

  // Interfaces
  ShopPermissions,
  PermissionGroup,
  UserShopAccess,
  UserShopAccessWithRelations,

  // Request Types
  CreateShopAccessRequest,
  UpdateShopAccessRequest,
  GrantAccessRequest,
  UpdatePermissionsRequest,
  UpdateRoleRequest,
  RevokeAccessRequest,
  RestoreAccessRequest,
  ExtendAccessRequest,
  UpdateLastAccessRequest,

  // Query & Filter Types
  ShopAccessQueryParams,

  // Summary & Statistics
  PermissionSummary,
  ShopAccessStatistics,
  UserAccessSummary,
  ShopUsersSummary,
  ShopAccessListItem,

  // Bulk Operations
  BulkPermissionUpdateRequest,
  BulkRoleUpdateRequest,
  BulkAccessOperationRequest,
  BulkAccessOperationResult,

  // Audit & History
  AccessHistoryEntry,
  AccessAuditLog,

  // Form States
  ShopAccessFormState,
  PermissionMatrix,

  // Validation & Warnings
  PermissionCheckResult,
  IPAddressValidationResult,
  AccessExpiryWarning,
  DefaultPermissionsMap,
} from './userShopAccess.types'

// ============================================================================
// REFRESH TOKEN & SESSION TYPES
// ============================================================================
export type {
  // Enums & Literals
  DeviceType,

  // Interfaces
  DeviceInfo,
  RefreshToken,
  RefreshTokenWithUser,

  // Request Types
  CreateRefreshTokenRequest,
  UpdateRefreshTokenRequest,
  RevokeTokenRequest,
  RevokeAllTokensRequest,
  RevokeOrgTokensRequest,

  // Query Types
  TokenQueryParams,

  // Statistics & Info
  TokenStatistics,
  OrgTokenStatistics,
  TokenInfo,
  ActiveSession,
  SessionListItem,

  // Session Management
  RevokeSessionRequest,
  TokenValidationResult,
  TokenRefreshResponse,

  // Security & Analytics
  SuspiciousActivityResult,
  TokenCleanupResult,
  TokenUsageAnalytics,
  TokenRevocationLog,
  TokenExpiryAlert,

  // Bulk Operations
  BulkTokenOperationRequest,
  BulkTokenOperationResult,

  // Security Events
  TokenSecurityEvent,
  DeviceFingerprint,
  TokenSessionContext,

  // Token Management
  TokenRotationRequest,
  TokenRotationResponse,
  TokenBlacklistEntry,
  SessionTimeoutSettings,
  MultiFactorToken,
  TokenRateLimitInfo,
  ConcurrentSessionPolicy,
  TokenAuditTrail,
} from './refreshToken.types'

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================
export type {
  // Request Types
  RegisterRequest,
  LoginRequest,
  ForgetRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  RefreshTokenRequest,
  ResendVerificationRequest,
  EnableTwoFactorRequest,
  VerifyTwoFactorRequest,
  DisableTwoFactorRequest,
  TwoFactorLoginRequest,
  VerifyBackupCodeRequest,

  // Response Types
  RegisterResponse,
  LoginResponse,
  TwoFactorChallengeResponse,
  LogoutResponse,
  LogoutAllResponse,
  RefreshTokenResponse,
  ChangePasswordResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  VerifyEmailResponse,
  GetProfileResponse,
  UpdateProfileResponse,
  EnableTwoFactorResponse,
  VerifyTwoFactorResponse,
  DisableTwoFactorResponse,
  GetSessionsResponse,
  RevokeSessionResponse,
  CheckEmailResponse,
  CheckUsernameResponse,
  ValidateTokenResponse,

  // State Management
  AuthState,
  AuthContextValue,

  // Route Protection
  ProtectedRouteProps,
  PublicRouteProps,
  AuthGuardProps,

  // Form States
  LoginFormState,
  RegisterFormState,
  ChangePasswordFormState,
  ForgotPasswordFormState,
  ResetPasswordFormState,
  TwoFactorSetupFormState,
  TwoFactorLoginFormState,

  // Validation
  FieldError,
  ValidationResult,
  PasswordStrength,
  Verify2FALoginRequest ,
  Disable2FARequest ,
  Verify2FAResponse ,
  Enable2FAResponse ,
  VerifyBackupCodeLoginRequest ,

  // Events & Configuration
  AuthEventType,
  AuthEvent,
  AuthConfig,
} from './auth.types'

// ============================================================================
// SHOP TYPES
// ============================================================================
export type {
  // Main Shop Interface
  Shop,

  // Address Types
  ShopAddress,
  Coordinates,

  // Bank & Payment Details
  BankDetail,
  UpiDetail,

  // Business Hours
  BusinessHours,
  TimeSlot,

  // Metal Rates
  MetalRate,
  SilverRate,
  PlatinumRate,
  MetalRates,
  MetalRateHistory,

  // Shop Settings
  ShopSettings,
  GSTRates,
  PrintSettings,
  NotificationSettings,

  // Shop Features & Statistics
  ShopFeatures,
  ShopStatistics,

  // Compliance
  Compliance,

  // References
  ShopUser,
  Organization,

  // Form Data
  ShopFormData,

  // Filters & Query
  ShopFilters,
  ShopQueryParams,

  // API Response Types
  ShopListResponse,
  ShopDetailResponse,
  ShopCreateResponse,
  ShopUpdateResponse,
  ShopDeleteResponse,
  ShopStatisticsResponse,
  ShopPaginationMeta,

  // Update Payloads
  MetalRatesUpdatePayload,
  ShopSettingsUpdatePayload,

  // UI Component Props
  ShopTableColumn,
  ShopCardProps,

  // Validation
  ShopValidationError,
} from './shop.types'

// Export Enums
export {
  ShopType,
  ShopCategory,
  ShopStatus,
  ShopCurrency,
  ShopLanguage,
  WeightUnit,
  ShopActionType,
} from './shop.types'

// ============================================================================
// API TYPES
// ============================================================================
export type {
  // Response Types
  ApiResponse,
  PaginatedResponse,
  PaginationMeta,
  ValidationError,
  ApiErrorResponse,
  SuccessResponse,

  // Query Parameters
  BaseQueryParams,
  DateRangeQuery,
  FilterQueryParams,
  SearchQueryParams,

  // Common Request Types
  IdParam,
  IdsParam,
  BulkOperationRequest,
  BulkDeleteRequest,
  BulkUpdateRequest,
  StatusUpdateRequest,
  SoftDeleteRequest,
  RestoreRequest,

  // File & Upload Types
  FileUploadResponse,
  MultipleFileUploadResponse,
  BulkUploadResponse,
  FileDeleteResponse,

  // Export & Import
  ExportFormat,
  ExportRequest,
  ExportResponse,
  ImportRequest,
  ImportResponse,

  // Statistics & Analytics
  StatisticsResponse,
  DashboardStats,
  ChartData,
  ActivityItem,
  AlertItem,
  AggregationResult,

  // Search & Filter
  SearchRequest,
  SearchResult,
  SearchResponse,
  FilterOperator,
  AdvancedFilter,
  AdvancedFilterRequest,
  FacetResult,
  SearchWithFacetsResponse,

  // Audit & Activity
  AuditLogEntry,
  ActivityLogQuery,
  ActivitySummary,

  // Notifications
  NotificationType,
  Notification,
  NotificationQuery,
  MarkNotificationsReadRequest,
  NotificationPreferences,

  // Batch Operations
  BatchActionType,
  BatchOperationItem,
  BatchOperationRequest,
  BatchOperationItemResult,
  BatchOperationResult,
  BatchOperationResponse,

  // Settings & Configuration
  SystemSettings,
  UpdateSettingsRequest,
  SettingsResponse,

  // Health & Monitoring
  HealthStatus,
  ServiceHealth,
  HealthCheckResponse,
  SystemMetrics,

  // Webhooks
  WebhookEvent,
  WebhookSubscription,
  WebhookDeliveryLog,

  // Rate Limiting
  RateLimitInfo,
  RateLimitHeaders,
  RateLimitExceededError,

  // API Client
  ApiClientConfig,
  ApiRequestConfig,

  // Cache
  CacheOptions,
  CachedResponse,
  CacheInvalidationRequest,

  // Sorting
  SortOption,
  SortRequest,
  MultiSortRequest,

  // Type Guards
  isApiError,
  isPaginatedResponse,
  hasData,
  isRateLimitError,
} from './api.types'

// ============================================================================
// COMMON TYPES & UTILITIES
// ============================================================================
export type {
  // Common Types
  Timestamp,
  Nullable,
  Optional,
  DeepPartial,
  DeepRequired,
  KeysOfType,
  DeepOmit,
  DeepPick,
  RequireKeys,
  OptionalKeys,
  StringKeys,
  NumberKeys,
  Merge,
  ValueOf,
  Never,
  XOR,
  Prettify,

  // Form Utilities
  FormValues,
  FormField,
  FormState,
  FormErrors,
  FormTouched,
  FormValidationResult,

  // API Utilities
  SuccessApiResponse,
  ErrorApiResponse,
  ApiResponseUnion,
  AsyncReturnType,
  PromiseType,

  // State Management
  LoadingState,
  AsyncState,
  PaginationState,
  ListState,
  FilterState,
  EntityState,
  RequestState,
  CacheState,

  // Type Aliases
  HttpStatusCode,
  DateFormatType,
  StorageKey,
  HttpMethod,
  SortOrder,
} from './common.types'

export {
  // Constants
  HTTP_STATUS,
  DEFAULT_PAGINATION,
  DATE_FORMATS,
  STORAGE_KEYS,
  HTTP_METHODS,
  SORT_ORDER,
  FILE_SIZE_LIMITS,
  ACCEPTED_FILE_TYPES,
  REGEX_PATTERNS,
  DEBOUNCE_DELAYS,
  ANIMATION_DURATION,
  BREAKPOINTS,
  Z_INDEX,

  // Type Guards
  isDefined,
  isNullOrUndefined,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isArray,
  hasItems,
  isEmptyObject,
  isEmptyString,
  hasOwnProperty,
  isFunction,
  isPromise,
  isDate,
  isISODateString,
  isRegExp,
  isError,

  // Utility Functions
  sleep,
  generateId,
  deepClone,
  deepMerge,
  omit,
  pick,
  getNestedProperty,
} from './common.types'
// export type { Permission, PermissionSet } from './permission.types'
// Export ShopPermissions from config

export type {
  // Core ID type
  ID,

  // Enums
  Gender,
  CustomerType,
  CustomerCategory,
  PreferredMetal,
  CommunicationPreference,
  CustomerSource,

  // Interfaces
  Address,
  CustomerPreferences,
  Customer,

  // Request/Response types
  CreateCustomerRequest,
  UpdateCustomerRequest,

  // Query/Filter types
  CustomerSearchParams,
  CustomerListParams,

  // Operation types
  BlacklistCustomerRequest,
  LoyaltyPointsRequest,

  // Bulk operation types
  BulkImportCustomerItem,
  BulkImportRequest,
  // BulkUpdateRequest,

  // Export types
  ExportCustomersParams,
} from './customer.types'

// Export constants
export { VALIDATION_RULES, VALIDATION_MESSAGES } from './customer.types'
