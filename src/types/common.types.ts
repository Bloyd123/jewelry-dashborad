// ============================================================================
// FILE: src/types/common.types.ts
// Common TypeScript types for frontend application
// ============================================================================

/**
 * Generic API Response wrapper
 * Wraps all API responses in a consistent format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  timestamp: string;
  meta?: Record<string, any>;
}

/**
 * Pagination metadata
 * Contains pagination information from API
 */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage?: number | null;
  prevPage?: number | null;
}

/**
 * Paginated API Response
 * Used when API returns paginated data
 */
export interface PaginatedResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T[];
  timestamp: string;
  meta: {
    pagination: PaginationMeta;
    [key: string]: any;
  };
}

/**
 * API Error details
 * Structure for validation/field errors
 */
export interface ApiErrorDetail {
  field?: string;
  message: string;
  value?: any;
  code?: string;
}

/**
 * API Error Response
 * Structure when API returns error
 */
export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  timestamp: string;
  errors?: ApiErrorDetail[];
  meta?: Record<string, any>;
  stack?: string; // Only in development
}

/**
 * Select Option for dropdowns
 * Generic option type for <Select> components
 */
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: string;
  description?: string;
  group?: string;
}

/**
 * Loading State
 * Track loading states in components
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

/**
 * Form Field Error
 * For form validation errors
 */
export interface FormFieldError {
  field: string;
  message: string;
}

/**
 * Toast Notification
 * For toast/notification system
 */
export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Sort Configuration
 * For table sorting
 */
export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Filter Config
 * For list/table filtering
 */
export interface FilterConfig {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'like';
  value: any;
}

/**
 * Search Params
 * Common search parameters
 */
export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

/**
 * Date Range
 * For date range filters
 */
export interface DateRange {
  startDate: string | Date;
  endDate: string | Date;
}

/**
 * File Upload Response
 */
export interface FileUploadResponse {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

/**
 * Breadcrumb Item
 * For breadcrumb navigation
 */
export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: string;
  active?: boolean;
}

/**
 * Tab Item
 * For tab navigation
 */
export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  badge?: number | string;
}

/**
 * Menu Item
 * For sidebar/navigation menus
 */
export interface MenuItem {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  badge?: number | string;
  children?: MenuItem[];
  roles?: string[];
  permissions?: string[];
}

/**
 * Modal State
 * For modal/dialog management
 */
export interface ModalState {
  isOpen: boolean;
  title?: string;
  data?: any;
}

/**
 * Table Column Config
 * For table column definitions
 */
export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => React.ReactNode;
  hidden?: boolean;
}

/**
 * Chart Data Point
 * For charts/graphs
 */
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

/**
 * Dashboard Stats Card
 */
export interface StatsCard {
  title: string;
  value: number | string;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon?: string;
  color?: string;
}

/**
 * Action Button Config
 * For action buttons in lists/tables
 */
export interface ActionButton {
  label: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  onClick: () => void;
  disabled?: boolean;
  hidden?: boolean;
  permission?: string;
}

/**
 * Confirmation Dialog Config
 */
export interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger' | 'success';
  onConfirm: () => void;
  onCancel?: () => void;
}

/**
 * Export Options
 * For data export functionality
 */
export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  fileName?: string;
  columns?: string[];
  includeHeaders?: boolean;
}

/**
 * Import Result
 */
export interface ImportResult {
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
  }>;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Check if response is error
 */
export function isApiError(response: any): response is ApiError {
  return response && response.success === false;
}

/**
 * Check if response is paginated
 */
export function isPaginatedResponse<T>(response: any): response is PaginatedResponse<T> {
  return (
    response &&
    response.success === true &&
    response.meta &&
    response.meta.pagination !== undefined
  );
}

/**
 * Check if value is SelectOption
 */
export function isSelectOption(value: any): value is SelectOption {
  return value && typeof value === 'object' && 'label' in value && 'value' in value;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Make all properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific properties required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Deep Partial (makes nested properties optional)
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Nullable type
 */
export type Nullable<T> = T | null;

/**
 * Optional type
 */
export type Optional<T> = T | undefined;

/**
 * ID type (can be string or number)
 */
export type ID = string | number;

/**
 * Timestamp type
 */
export type Timestamp = string | Date;

/**
 * Generic Record type
 */
export type GenericRecord = Record<string, any>;

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Toast Types
 */
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

/**
 * Sort Directions
 */
export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

/**
 * Default Pagination
 */
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc' as const,
} as const;

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  HTTP_STATUS,
  TOAST_TYPES,
  SORT_DIRECTION,
  DEFAULT_PAGINATION,
};