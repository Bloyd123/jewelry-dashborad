// ============================================================================
// FILE: src/utils/errors/index.ts
// Export all error classes
// ============================================================================

import { ApiError } from './ApiError'
import { AuthError } from './AuthError'
import { NetworkError } from './NetworkError'
import { NotFoundError } from './NotFoundError'
import { PermissionError } from './PermissionError'
import { RateLimitError } from './RateLimitError'
import { ServerError } from './ServerError'
import { ValidationError } from './ValidationError'

export default {
  ApiError,
  AuthError,
  PermissionError,
  ValidationError,
  NetworkError,
  NotFoundError,
  ServerError,
  RateLimitError,
}
