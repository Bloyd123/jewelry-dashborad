// ============================================================================
// FILE: src/utils/api/buildQueryString.ts
// Build query string from object
// ============================================================================

/**
 * Build query string from object
 * @param params - Object with query parameters
 * @returns Query string (e.g., "?key1=value1&key2=value2")
 */
export const buildQueryString = (params: Record<string, any>): string => {
  const filtered = Object.entries(params).filter(
    ([_, value]) => value !== undefined && value !== null
  );
  
  if (filtered.length === 0) return '';
  
  const searchParams = new URLSearchParams();
  filtered.forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => searchParams.append(key, String(v)));
    } else {
      searchParams.append(key, String(value));
    }
  });
  
  return `?${searchParams.toString()}`;
};

export default buildQueryString;