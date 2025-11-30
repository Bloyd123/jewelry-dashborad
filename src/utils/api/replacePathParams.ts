// ============================================================================
// FILE: src/utils/api/replacePathParams.ts
// Replace path parameters in URL
// ============================================================================

/**
 * Create URL with path parameters replaced
 * @param path - URL path with parameters (e.g., '/shops/:shopId/products/:id')
 * @param params - Object with parameter values (e.g., { shopId: '123', id: '456' })
 * @returns URL with replaced parameters (e.g., '/shops/123/products/456')
 *
 * @example
 * replacePathParams('/shops/:shopId/products/:id', { shopId: '123', id: '456' })
 * // Returns: '/shops/123/products/456'
 */
export const replacePathParams = (
  path: string,
  params: Record<string, string | number>
): string => {
  let result = path
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value))
  })
  return result
}

export default replacePathParams
