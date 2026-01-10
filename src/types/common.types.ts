// FILE: common.types.ts
// Common Types, Utilities, and Constants

// COMMON TYPES

/**
 * Common timestamp types
 */
export type Timestamp = Date | string

/**
 * Common nullable type
 */
export type Nullable<T> = T | null

/**
 * Common optional type
 */
export type Optional<T> = T | undefined

/**
 * Make all properties of T optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/**
 * Make all properties of T required recursively
 */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P]
}

/**
 * Extract keys from T that are of type U
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never
}[keyof T]

/**
 * Omit keys K from T recursively
 */
export type DeepOmit<T, K extends keyof any> = T extends object
  ? {
      [P in Exclude<keyof T, K>]: DeepOmit<T[P], K>
    }
  : T

/**
 * Pick keys K from T recursively
 */
export type DeepPick<T, K extends keyof any> = T extends object
  ? {
      [P in Extract<keyof T, K>]: DeepPick<T[P], K>
    }
  : T

/**
 * Make specific keys K of T required
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Make specific keys K of T optional
 */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>

/**
 * Extract all string literal keys from T
 */
export type StringKeys<T> = Extract<keyof T, string>

/**
 * Extract all number literal keys from T
 */
export type NumberKeys<T> = Extract<keyof T, number>

/**
 * Merge two types, with properties from B overriding A
 */
export type Merge<A, B> = Omit<A, keyof B> & B

/**
 * Create a union of all values in an object type
 */
export type ValueOf<T> = T[keyof T]

/**
 * Create a type with all properties of T set to never
 */
export type Never<T> = {
  [P in keyof T]?: never
}

/**
 * XOR type - either A or B but not both
 */
export type XOR<A, B> = A | B extends object
  ? (Without<A, B> & B) | (Without<B, A> & A)
  : A | B

type Without<A, B> = { [P in Exclude<keyof A, keyof B>]?: never }

/**
 * Prettify type - expands type for better IDE display
 */
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

// UTILITY TYPES FOR FORMS

/**
 * Convert all fields to string (for form inputs)
 */
export type FormValues<T> = {
  [P in keyof T]: T[P] extends object
    ? FormValues<T[P]>
    : T[P] extends (infer U)[]
      ? string
      : string
}

/**
 * Form field state
 */
export interface FormField<T = string> {
  value: T
  error?: string
  touched: boolean
  dirty: boolean
}

/**
 * Form state wrapper
 */
export type FormState<T> = {
  [P in keyof T]: FormField<T[P]>
}

/**
 * Form field errors
 */
export type FormErrors<T> = {
  [P in keyof T]?: T[P] extends object ? FormErrors<T[P]> : string
}

/**
 * Form touched state
 */
export type FormTouched<T> = {
  [P in keyof T]?: T[P] extends object ? FormTouched<T[P]> : boolean
}

/**
 * Form validation result
 */
export interface FormValidationResult<T = any> {
  isValid: boolean
  errors: FormErrors<T>
}

// UTILITY TYPES FOR API

/**
 * Success response wrapper
 */
export type SuccessApiResponse<T> = {
  success: true
  data: T
  message?: string
  timestamp?: string
}

/**
 * Error response wrapper
 */
export type ErrorApiResponse = {
  success: false
  message: string
  error?: string
  errors?: Array<{
    field: string
    message: string
    value?: any
  }>
  timestamp?: string
}

/**
 * Union of success and error responses
 */
export type ApiResponseUnion<T> = SuccessApiResponse<T> | ErrorApiResponse

/**
 * Async function return type
 */
export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : never

/**
 * Promise return type
 */
export type PromiseType<T extends Promise<any>> =
  T extends Promise<infer U> ? U : never

// UTILITY TYPES FOR STATE MANAGEMENT

/**
 * Loading state
 */
export interface LoadingState {
  isLoading: boolean
  error?: string | null
}

/**
 * Async state wrapper
 */
export interface AsyncState<T> extends LoadingState {
  data: T | null
}

/**
 * Pagination state
 */
export interface PaginationState {
  page: number
  limit: number
  total: number
  pages: number
  hasNextPage?: boolean
  hasPrevPage?: boolean
}

/**
 * List state with pagination
 */
export interface ListState<T> extends AsyncState<T[]> {
  pagination: PaginationState
}

/**
 * Filter state
 */
export interface FilterState<T = any> {
  filters: T
  search: string
  sort: string
  order: 'asc' | 'desc'
}

/**
 * Entity state (for Redux/state management)
 */
export interface EntityState<T> {
  ids: string[]
  entities: Record<string, T>
  loading: boolean
  error: string | null
  selectedId: string | null
}

/**
 * Request state (for tracking API requests)
 */
export interface RequestState {
  loading: boolean
  error: string | null
  success: boolean
  timestamp?: number
}

/**
 * Cache state
 */
export interface CacheState<T> {
  data: T | null
  timestamp: number
  expiresAt: number
  isStale: boolean
}

// CONSTANTS

/**
 * Common HTTP status codes
 */
export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Redirection
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,

  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  GONE: 410,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const

/**
 * HTTP status code type
 */
export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS]

/**
 * Default pagination values
 */
export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
  MIN_LIMIT: 1,
} as const

/**
 * Date format constants
 */
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm',
  DATETIME_FULL: 'DD/MM/YYYY HH:mm:ss',
  TIME: 'HH:mm',
  TIME_FULL: 'HH:mm:ss',
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  MONTH_YEAR: 'MM/YYYY',
  YEAR: 'YYYY',
} as const

/**
 * Date format type
 */
export type DateFormatType = (typeof DATE_FORMATS)[keyof typeof DATE_FORMATS]

/**
 * Storage keys (for localStorage/sessionStorage)
 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
  CURRENT_SHOP: 'current_shop',
  PREFERENCES: 'preferences',
  SIDEBAR_COLLAPSED: 'sidebar_collapsed',
  RECENT_SEARCHES: 'recent_searches',
} as const

/**
 * Storage key type
 */
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

/**
 * HTTP methods
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
} as const

/**
 * HTTP method type
 */
export type HttpMethod = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS]

/**
 * Sort order constants
 */
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
  ASCENDING: '1',
  DESCENDING: '-1',
} as const

/**
 * Sort order type
 */
export type SortOrder = (typeof SORT_ORDER)[keyof typeof SORT_ORDER]

/**
 * File size limits (in bytes)
 */
export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
  VIDEO: 100 * 1024 * 1024, // 100MB
  EXCEL: 20 * 1024 * 1024, // 20MB
} as const

/**
 * Accepted file types
 */
export const ACCEPTED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  SPREADSHEETS: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
  ],
  ALL: ['*/*'],
} as const

/**
 * Regex patterns
 */
export const REGEX_PATTERNS = {
  EMAIL: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  PHONE: /^[0-9]{10}$/,
  PINCODE: /^[0-9]{6}$/,
  GST: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  IFSC: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  UPI: /^[\w.-]+@[\w.-]+$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  ALPHA: /^[a-zA-Z]+$/,
  NUMERIC: /^[0-9]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
} as const

/**
 * Debounce delay constants (in milliseconds)
 */
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 200,
  SCROLL: 100,
} as const

/**
 * Animation duration constants (in milliseconds)
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
  XS: 0,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const

/**
 * Z-index layers
 */
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  NOTIFICATION: 1080,
} as const

// TYPE GUARD UTILITIES

/**
 * Check if value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

/**
 * Check if value is null or undefined
 */
export function isNullOrUndefined(value: any): value is null | undefined {
  return value === null || value === undefined
}

/**
 * Check if value is a string
 */
export function isString(value: any): value is string {
  return typeof value === 'string'
}

/**
 * Check if value is a number
 */
export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value)
}

/**
 * Check if value is a boolean
 */
export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean'
}

/**
 * Check if value is an object
 */
export function isObject(value: any): value is object {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Check if value is an array
 */
export function isArray<T = any>(value: any): value is T[] {
  return Array.isArray(value)
}

/**
 * Check if array has items
 */
export function hasItems<T>(arr: T[] | null | undefined): arr is T[] {
  return Array.isArray(arr) && arr.length > 0
}

/**
 * Check if object is empty
 */
export function isEmptyObject(obj: any): boolean {
  return isObject(obj) && Object.keys(obj).length === 0
}

/**
 * Check if string is empty or whitespace
 */
export function isEmptyString(str: any): boolean {
  return !isString(str) || str.trim().length === 0
}

/**
 * Check if object has own property
 */
export function hasOwnProperty<T extends object>(
  obj: T,
  key: PropertyKey
): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

/**
 * Check if value is a function
 */
export function isFunction(value: any): value is Function {
  return typeof value === 'function'
}

/**
 * Check if value is a Promise
 */
export function isPromise<T = any>(value: any): value is Promise<T> {
  return (
    value instanceof Promise ||
    (value !== null &&
      typeof value === 'object' &&
      typeof value.then === 'function')
  )
}

/**
 * Check if value is a Date
 */
export function isDate(value: any): value is Date {
  return value instanceof Date && !isNaN(value.getTime())
}

/**
 * Check if value is a valid ISO date string
 */
export function isISODateString(value: any): boolean {
  if (!isString(value)) return false
  const date = new Date(value)
  return isDate(date) && date.toISOString() === value
}

/**
 * Check if value is a RegExp
 */
export function isRegExp(value: any): value is RegExp {
  return value instanceof RegExp
}

/**
 * Check if value is an Error
 */
export function isError(value: any): value is Error {
  return value instanceof Error
}

// UTILITY FUNCTIONS

/**
 * Sleep/delay function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Generate unique ID
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as any
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any
  if (obj instanceof Object) {
    const clonedObj = {} as T
    for (const key in obj) {
      if (hasOwnProperty(obj, key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}

/**
 * Deep merge two objects
 */
export function deepMerge<T extends object, U extends object>(
  target: T,
  source: U
): T & U {
  const result = { ...target } as T & U

  for (const key in source) {
    if (hasOwnProperty(source, key)) {
      const sourceValue = source[key]
      const targetValue = (target as any)[key]

      if (isObject(sourceValue) && isObject(targetValue)) {
        ;(result as any)[key] = deepMerge(targetValue, sourceValue)
      } else {
        ;(result as any)[key] = sourceValue
      }
    }
  }

  return result
}

/**
 * Omit keys from object
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}

/**
 * Pick keys from object
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>
  keys.forEach(key => {
    if (hasOwnProperty(obj, key)) {
      result[key] = obj[key]
    }
  })
  return result
}

/**
 * Get nested property safely
 */
export function getNestedProperty<T = any>(
  obj: any,
  path: string,
  defaultValue?: T
): T | undefined {
  const keys = path.split('.')
  let result = obj

  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue
    }
    result = result[key]
  }

  return result === undefined ? defaultValue : result
}
