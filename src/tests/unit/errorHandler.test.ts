// Create test file: src/tests/errorHandler.test.ts
import { renderHook } from '@testing-library/react'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { ValidationError, AuthError } from '@/utils/errors'
import { ERROR_KEYS } from '@/utils/errors/errorMessages'

describe('useErrorHandler', () => {
  it('should handle ValidationError correctly', () => {
    const { result } = renderHook(() => useErrorHandler())
    const error = new ValidationError(ERROR_KEYS.VALIDATION.FAILED)

    const setErrors = jest.fn()
    result.current.handleError(error, setErrors)

    // Assert toast was shown
    // Assert setErrors was called
  })

  it('should handle AuthError correctly', () => {
    const { result } = renderHook(() => useErrorHandler())
    const error = new AuthError(ERROR_KEYS.AUTH.FAILED)

    const setErrors = jest.fn()
    result.current.handleError(error, setErrors)

    // Assert correct error messages
  })
})
