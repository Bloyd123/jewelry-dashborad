// ============================================================================
// FILE: api.types.ts
// Common API Response & Request Types
// ============================================================================

// ============================================================================
// RESPONSE TYPES
// ============================================================================

/**
 * Generic API Response
 */
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data: T
  errors?: ValidationError[]
  timestamp?: string
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T = any> {
  success: boolean
  data: T[]
  pagination: PaginationMeta
  message?: string
  timestamp?: string
}

/**
 * Pagination Metadata
 */
export interface PaginationMeta {
  total: number
  page: number
  limit: number
  pages: number
  hasNextPage?: boolean
  hasPrevPage?: boolean
  nextPage?: number | null
  prevPage?: number | null
}

/**
 * Validation Error
 */
export interface ValidationError {
  field: string
  message: string
  value?: any
  location?: 'body' | 'query' | 'params' | 'headers'
}

/**
 * API Error Response
 */
export interface ApiErrorResponse {
  success: false
  message: string
  error?: string
  errors?: ValidationError[]
  stack?: string // Only in development
  statusCode?: number
  timestamp?: string
  path?: string
  method?: string
}

/**
 * Success Response (Simple)
 */
export interface SuccessResponse {
  success: true
  message: string
  timestamp?: string
}

// ============================================================================
// QUERY PARAMETERS
// ============================================================================

/**
 * Base Query Parameters
 */
export interface BaseQueryParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc' | '1' | '-1'
  search?: string
  fields?: string // Comma-separated field names
}

/**
 * Date Range Query
 */
export interface DateRangeQuery {
  startDate?: string | Date
  endDate?: string | Date
  dateField?: string // Field to apply date range to
}

/**
 * Filter Query Parameters
 */
export interface FilterQueryParams extends BaseQueryParams {
  isActive?: boolean
  includeDeleted?: boolean
  includeInactive?: boolean
}

/**
 * Search Query Parameters
 */
export interface SearchQueryParams extends BaseQueryParams {
  query: string
  searchFields?: string[] // Fields to search in
  fuzzy?: boolean
  minScore?: number
}

// ============================================================================
// COMMON REQUEST TYPES
// ============================================================================

/**
 * ID Parameter
 */
export interface IdParam {
  id: string
}

/**
 * Multiple IDs Parameter
 */
export interface IdsParam {
  ids: string[]
}

/**
 * Bulk Operation Request
 */
export interface BulkOperationRequest {
  ids: string[]
  action?: string
  data?: any
}

/**
 * Bulk Delete Request
 */
export interface BulkDeleteRequest extends BulkOperationRequest {
  permanent?: boolean
  reason?: string
}

/**
 * Bulk Update Request
 */
export interface BulkUpdateRequest extends BulkOperationRequest {
  updates: Record<string, any>
}

/**
 * Status Update Request
 */
export interface StatusUpdateRequest {
  isActive: boolean
  reason?: string
}

/**
 * Soft Delete Request
 */
export interface SoftDeleteRequest {
  reason?: string
}

/**
 * Restore Request
 */
export interface RestoreRequest {
  reason?: string
}

// ============================================================================
// FILE & UPLOAD TYPES
// ============================================================================

/**
 * File Upload Response
 */
export interface FileUploadResponse {
  success: boolean
  message?: string
  data: {
    filename: string
    originalName: string
    mimetype: string
    size: number
    path: string
    url: string
    uploadedAt: Date | string
  }
}

/**
 * Multiple File Upload Response
 */
export interface MultipleFileUploadResponse {
  success: boolean
  message?: string
  data: {
    files: Array<{
      filename: string
      originalName: string
      mimetype: string
      size: number
      path: string
      url: string
    }>
    total: number
  }
}

/**
 * Bulk Upload Response
 */
export interface BulkUploadResponse {
  success: boolean
  message?: string
  data: {
    total: number
    successful: number
    failed: number
    errors: Array<{
      row: number
      errors: ValidationError[]
      data?: any
    }>
    results?: any[]
  }
}

/**
 * File Delete Response
 */
export interface FileDeleteResponse {
  success: boolean
  message?: string
  data: {
    deleted: boolean
    filename: string
  }
}

// ============================================================================
// EXPORT & IMPORT TYPES
// ============================================================================

/**
 * Export Format
 */
export type ExportFormat = 'csv' | 'xlsx' | 'pdf' | 'json'

/**
 * Export Request
 */
export interface ExportRequest {
  format: ExportFormat
  filters?: Record<string, any>
  columns?: string[]
  dateRange?: DateRangeQuery
  sort?: string
  order?: 'asc' | 'desc'
  includeHeaders?: boolean
  filename?: string
}

/**
 * Export Response
 */
export interface ExportResponse {
  success: boolean
  message?: string
  data: {
    filename: string
    url: string
    format: ExportFormat
    size: number
    recordCount: number
    expiresAt: Date | string
    downloadToken?: string
  }
}

/**
 * Import Request
 */
export interface ImportRequest {
  file: File | Blob
  skipValidation?: boolean
  updateExisting?: boolean
  dryRun?: boolean
}

/**
 * Import Response
 */
export interface ImportResponse {
  success: boolean
  message?: string
  data: {
    total: number
    successful: number
    failed: number
    skipped: number
    errors: Array<{
      row: number
      field?: string
      message: string
      data?: any
    }>
    warnings?: Array<{
      row: number
      message: string
    }>
  }
}

// ============================================================================
// STATISTICS & ANALYTICS
// ============================================================================

/**
 * Statistics Response
 */
export interface StatisticsResponse<T = any> {
  success: boolean
  data: T
  period?: {
    start: Date | string
    end: Date | string
  }
  generatedAt?: Date | string
}

/**
 * Dashboard Stats
 */
export interface DashboardStats {
  summary: {
    totalUsers: number
    activeUsers: number
    totalShops: number
    activeShops: number
    totalOrders: number
    totalRevenue: number
    revenueChange?: number // percentage
  }
  charts: {
    revenue: ChartData[]
    orders: ChartData[]
    users: ChartData[]
  }
  recentActivity: ActivityItem[]
  alerts?: AlertItem[]
}

/**
 * Chart Data Point
 */
export interface ChartData {
  label: string
  value: number
  date?: Date | string
  metadata?: Record<string, any>
}

/**
 * Activity Item
 */
export interface ActivityItem {
  id: string
  type: string
  action: string
  description: string
  user?: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: Date | string
  metadata?: Record<string, any>
  icon?: string
  color?: string
}

/**
 * Alert Item
 */
export interface AlertItem {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: Date | string
  read: boolean
  actionUrl?: string
  actionLabel?: string
}

/**
 * Aggregation Result
 */
export interface AggregationResult {
  field: string
  count: number
  sum?: number
  avg?: number
  min?: number
  max?: number
  values?: Array<{
    value: any
    count: number
  }>
}

// ============================================================================
// SEARCH & FILTER
// ============================================================================

/**
 * Search Request
 */
export interface SearchRequest extends Omit<BaseQueryParams, 'fields'> {
  query: string
  fields?: string[] // Override fields to be array
  fuzzy?: boolean
  filters?: Record<string, any>
}

/**
 * Search Result Item
 */
export interface SearchResult<T = any> {
  item: T
  score: number
  highlights?: Record<string, string[]>
  matchedFields?: string[]
}

/**
 * Search Response
 */
export interface SearchResponse<T = any> {
  success: boolean
  data: SearchResult<T>[]
  total: number
  took: number // Time taken in ms
  query: string
  pagination?: PaginationMeta
}

/**
 * Advanced Filter Operator
 */
export type FilterOperator =
  | 'eq'
  | 'ne'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'nin'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'regex'
  | 'exists'

/**
 * Advanced Filter
 */
export interface AdvancedFilter {
  field: string
  operator: FilterOperator
  value: any
  caseSensitive?: boolean
}

/**
 * Advanced Filter Request
 */
export interface AdvancedFilterRequest extends BaseQueryParams {
  filters: AdvancedFilter[]
  logic?: 'and' | 'or'
}

/**
 * Facet Result
 */
export interface FacetResult {
  field: string
  values: Array<{
    value: any
    count: number
  }>
}

/**
 * Search with Facets Response
 */
export interface SearchWithFacetsResponse<T = any> extends SearchResponse<T> {
  facets: FacetResult[]
}

// ============================================================================
// AUDIT & ACTIVITY LOG
// ============================================================================

/**
 * Audit Log Entry
 */
export interface AuditLogEntry {
  _id: string
  userId: string
  userName: string
  userEmail?: string
  action: string
  module: string
  resourceType?: string
  resourceId?: string
  description: string
  changes?: Array<{
    field: string
    oldValue: any
    newValue: any
  }>
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, any>
  level: 'info' | 'warning' | 'error'
  status: 'success' | 'failure'
  timestamp: Date | string
}

/**
 * Activity Log Query
 */
export interface ActivityLogQuery extends BaseQueryParams, DateRangeQuery {
  userId?: string
  module?: string
  action?: string
  resourceType?: string
  resourceId?: string
  level?: 'info' | 'warning' | 'error'
  status?: 'success' | 'failure'
}

/**
 * Activity Summary
 */
export interface ActivitySummary {
  totalActivities: number
  byAction: Record<string, number>
  byModule: Record<string, number>
  byUser: Array<{
    userId: string
    userName: string
    count: number
  }>
  byDate: Array<{
    date: string
    count: number
  }>
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

/**
 * Notification Type
 */
export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'system'
  | 'reminder'

/**
 * Notification
 */
export interface Notification {
  _id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  readAt?: Date | string | null
  createdAt: Date | string
  link?: string
  actionLabel?: string
  metadata?: Record<string, any>
  priority?: 'low' | 'medium' | 'high'
  expiresAt?: Date | string | null
}

/**
 * Notification Query
 */
export interface NotificationQuery extends BaseQueryParams {
  read?: boolean
  type?: NotificationType
  priority?: 'low' | 'medium' | 'high'
  startDate?: Date | string
  endDate?: Date | string
}

/**
 * Mark Notifications Read Request
 */
export interface MarkNotificationsReadRequest {
  notificationIds: string[]
}

/**
 * Notification Preferences
 */
export interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
  inApp: boolean
  categories: Record<string, boolean>
}

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

/**
 * Batch Action Type
 */
export type BatchActionType = 'create' | 'update' | 'delete' | 'restore'

/**
 * Batch Operation Item
 */
export interface BatchOperationItem<T = any> {
  action: BatchActionType
  data: T
  id?: string
}

/**
 * Batch Operation Request
 */
export interface BatchOperationRequest<T = any> {
  operations: BatchOperationItem<T>[]
  stopOnError?: boolean
  validateOnly?: boolean
}

/**
 * Batch Operation Item Result
 */
export interface BatchOperationItemResult {
  index: number
  success: boolean
  id?: string
  error?: string
  data?: any
}

/**
 * Batch Operation Result
 */
export interface BatchOperationResult {
  total: number
  successful: number
  failed: number
  skipped: number
  results: BatchOperationItemResult[]
  errors: Array<{
    index: number
    error: string
  }>
}

/**
 * Batch Operation Response
 */
export interface BatchOperationResponse {
  success: boolean
  message?: string
  data: BatchOperationResult
  timestamp?: string
}

// ============================================================================
// SETTINGS & CONFIGURATION
// ============================================================================

/**
 * System Settings
 */
export interface SystemSettings {
  maintenance: {
    enabled: boolean
    message?: string
    scheduledAt?: Date | string
    estimatedDuration?: number // minutes
  }
  security: {
    maxLoginAttempts: number
    lockoutDuration: number // minutes
    sessionTimeout: number // minutes
    passwordExpiry: number // days
    requireTwoFactor: boolean
    allowedIPRanges?: string[]
  }
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    channels: Record<string, boolean>
  }
  backup: {
    enabled: boolean
    frequency: 'daily' | 'weekly' | 'monthly'
    lastBackup?: Date | string
    nextBackup?: Date | string
    retentionDays: number
  }
  features: {
    multiTenant: boolean
    advancedReporting: boolean
    apiAccess: boolean
    customBranding: boolean
  }
}

/**
 * Update Settings Request
 */
export interface UpdateSettingsRequest {
  settings: Partial<SystemSettings>
}

/**
 * Settings Response
 */
export interface SettingsResponse {
  success: boolean
  data: SystemSettings
  updatedAt?: Date | string
}

// ============================================================================
// HEALTH & MONITORING
// ============================================================================

/**
 * Service Health Status
 */
export type HealthStatus = 'up' | 'down' | 'degraded'

/**
 * Service Health
 */
export interface ServiceHealth {
  status: HealthStatus
  responseTime?: number
  message?: string
  lastCheck?: Date | string
}

/**
 * Health Check Response
 */
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: Date | string
  uptime: number
  services: {
    database: ServiceHealth
    cache?: ServiceHealth
    storage?: ServiceHealth
    queue?: ServiceHealth
    search?: ServiceHealth
  }
  version: string
  environment: string
  memory?: {
    used: number
    free: number
    total: number
  }
}

/**
 * System Metrics
 */
export interface SystemMetrics {
  cpu: {
    usage: number // percentage
    cores: number
  }
  memory: {
    used: number
    free: number
    total: number
    usage: number // percentage
  }
  disk: {
    used: number
    free: number
    total: number
    usage: number // percentage
  }
  network: {
    in: number
    out: number
  }
  requests: {
    total: number
    successful: number
    failed: number
    avgResponseTime: number
  }
}

// ============================================================================
// WEBHOOK TYPES
// ============================================================================

/**
 * Webhook Event
 */
export interface WebhookEvent {
  id: string
  event: string
  payload: Record<string, any>
  timestamp: Date | string
  signature: string
  deliveryAttempts: number
}

/**
 * Webhook Subscription
 */
export interface WebhookSubscription {
  _id: string
  url: string
  events: string[]
  isActive: boolean
  secret: string
  headers?: Record<string, string>
  retryPolicy?: {
    maxRetries: number
    backoffMultiplier: number
  }
  createdAt: Date | string
  updatedAt: Date | string
}

/**
 * Webhook Delivery Log
 */
export interface WebhookDeliveryLog {
  _id: string
  webhookId: string
  event: string
  payload: Record<string, any>
  response?: {
    statusCode: number
    body?: any
  }
  success: boolean
  attempt: number
  timestamp: Date | string
  error?: string
}

// ============================================================================
// RATE LIMITING
// ============================================================================

/**
 * Rate Limit Info
 */
export interface RateLimitInfo {
  limit: number
  remaining: number
  reset: Date | string
  resetInSeconds: number
  retryAfter?: number
}

/**
 * Rate Limit Response Headers
 */
export interface RateLimitHeaders {
  'X-RateLimit-Limit': string
  'X-RateLimit-Remaining': string
  'X-RateLimit-Reset': string
  'Retry-After'?: string
}

/**
 * Rate Limit Exceeded Error
 */
export interface RateLimitExceededError extends ApiErrorResponse {
  statusCode: 429
  rateLimit: RateLimitInfo
}

// ============================================================================
// API CLIENT CONFIGURATION
// ============================================================================

/**
 * API Client Config
 */
export interface ApiClientConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
  withCredentials?: boolean
  validateStatus?: (status: number) => boolean
  retry?: {
    maxRetries: number
    retryDelay: number
    retryCondition?: (error: any) => boolean
  }
}

/**
 * API Request Config
 */
export interface ApiRequestConfig<T = any> {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  params?: Record<string, any>
  data?: T
  headers?: Record<string, string>
  timeout?: number
  responseType?: 'json' | 'blob' | 'text' | 'arraybuffer'
  onUploadProgress?: (progressEvent: any) => void
  onDownloadProgress?: (progressEvent: any) => void
}

// ============================================================================
// CACHE TYPES
// ============================================================================

/**
 * Cache Options
 */
export interface CacheOptions {
  ttl?: number // Time to live in seconds
  key?: string
  tags?: string[]
  invalidateOnMutation?: boolean
  staleWhileRevalidate?: boolean
}

/**
 * Cached Response
 */
export interface CachedResponse<T = any> {
  data: T
  cachedAt: Date | string
  expiresAt: Date | string
  fromCache: boolean
  fresh: boolean
}

/**
 * Cache Invalidation Request
 */
export interface CacheInvalidationRequest {
  keys?: string[]
  tags?: string[]
  pattern?: string
  invalidateAll?: boolean
}

// ============================================================================
// SORTING & ORDERING
// ============================================================================

/**
 * Sort Option
 */
export interface SortOption {
  field: string
  order: 'asc' | 'desc' | '1' | '-1'
}

/**
 * Sort Request
 */
export interface SortRequest {
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

/**
 * Multi-field Sort Request
 */
export interface MultiSortRequest {
  sorts: SortOption[]
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Check if response is an error
 */
export function isApiError(response: any): response is ApiErrorResponse {
  return response && response.success === false
}

/**
 * Check if response is paginated
 */
export function isPaginatedResponse<T>(
  response: any
): response is PaginatedResponse<T> {
  return response && response.pagination !== undefined
}

/**
 * Check if response has data
 */
export function hasData<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { data: T } {
  return response.success && response.data !== undefined
}

/**
 * Check if error is rate limit error
 */
export function isRateLimitError(error: any): error is RateLimitExceededError {
  return error && error.statusCode === 429
}
