// ============================================================================
// FILE: src/utils/errors/index.ts
// Export all error classes
// ============================================================================

import { ApiError } from './ApiError';
import { AuthError } from './AuthError';
import { PermissionError } from './PermissionError';
import { ValidationError } from './ValidationError';
import { NetworkError } from './NetworkError';
import { NotFoundError } from './NotFoundError';
import { ServerError } from './ServerError';
import { RateLimitError } from './RateLimitError';


export default {
  ApiError,
  AuthError,
  PermissionError,
  ValidationError,
  NetworkError,
  NotFoundError,
  ServerError,
  RateLimitError,
};