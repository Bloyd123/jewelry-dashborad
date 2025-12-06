// ============================================================================
// FILE: src/utils/errors/index.ts
// Export all error classes
// ============================================================================
export { ApiError } from './ApiError';
export { AuthError } from './AuthError';
export { PermissionError } from './PermissionError';
export { ValidationError } from './ValidationError';
export { NetworkError } from './NetworkError';
export { NotFoundError } from './NotFoundError';
export { ServerError } from './ServerError';
export { RateLimitError } from './RateLimitError';
export { ERROR_KEYS, getErrorKeyByStatus } from './errorMessages' 
export type { ErrorKey } from './errorMessages' 

