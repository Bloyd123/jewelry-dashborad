// ============================================================================
// FILE: src/services/storage/sessionStorageService.ts
// Session storage service with error handling and type safety
// ============================================================================

/**
 * Set item in sessionStorage with error handling
 * @param key - Storage key
 * @param value - Value to store (will be JSON stringified)
 * @returns true if successful, false otherwise
 */
export const setItem = <T>(key: string, value: T): boolean => {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error(`Error setting sessionStorage item "${key}":`, error);
    return false;
  }
};

/**
 * Get item from sessionStorage with error handling
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Parsed value or default value
 */
export const getItem = <T>(key: string, defaultValue: T | null = null): T | null => {
  try {
    const item = sessionStorage.getItem(key);
    
    if (item === null) {
      return defaultValue;
    }
    
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error getting sessionStorage item "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Remove item from sessionStorage
 * @param key - Storage key
 * @returns true if successful, false otherwise
 */
export const removeItem = (key: string): boolean => {
  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing sessionStorage item "${key}":`, error);
    return false;
  }
};

/**
 * Clear all items from sessionStorage
 * @returns true if successful, false otherwise
 */
export const clear = (): boolean => {
  try {
    sessionStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing sessionStorage:', error);
    return false;
  }
};

/**
 * Check if sessionStorage is available
 * @returns true if sessionStorage is available
 */
export const isAvailable = (): boolean => {
  try {
    const testKey = '__sessionStorage_test__';
    sessionStorage.setItem(testKey, 'test');
    sessionStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get all keys from sessionStorage
 * @returns Array of all keys
 */
export const getAllKeys = (): string[] => {
  try {
    return Object.keys(sessionStorage);
  } catch (error) {
    console.error('Error getting sessionStorage keys:', error);
    return [];
  }
};

/**
 * Get storage size in bytes (approximate)
 * @returns Size in bytes
 */
export const getSize = (): number => {
  try {
    let size = 0;
    for (const key in sessionStorage) {
      if (sessionStorage.hasOwnProperty(key)) {
        size += sessionStorage[key].length + key.length;
      }
    }
    return size;
  } catch (error) {
    console.error('Error calculating sessionStorage size:', error);
    return 0;
  }
};

/**
 * Check if key exists in sessionStorage
 * @param key - Storage key
 * @returns true if key exists
 */
export const hasKey = (key: string): boolean => {
  try {
    return sessionStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error checking sessionStorage key "${key}":`, error);
    return false;
  }
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  setItem,
  getItem,
  removeItem,
  clear,
  isAvailable,
  getAllKeys,
  getSize,
  hasKey,
};