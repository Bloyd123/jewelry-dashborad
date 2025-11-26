// ============================================================================
// FILE: src/services/storage/localStorageService.ts
// Local storage service with error handling and type safety
// ============================================================================

/**
 * Set item in localStorage with error handling
 * @param key - Storage key
 * @param value - Value to store (will be JSON stringified)
 * @returns true if successful, false otherwise
 */
export const setItem = <T>(key: string, value: T): boolean => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error(`Error setting localStorage item "${key}":`, error);
    return false;
  }
};

/**
 * Get item from localStorage with error handling
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns Parsed value or default value
 */
export const getItem = <T>(key: string, defaultValue: T | null = null): T | null => {
  try {
    const item = localStorage.getItem(key);
    
    if (item === null) {
      return defaultValue;
    }
    
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error getting localStorage item "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Remove item from localStorage
 * @param key - Storage key
 * @returns true if successful, false otherwise
 */
export const removeItem = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage item "${key}":`, error);
    return false;
  }
};

/**
 * Clear all items from localStorage
 * @returns true if successful, false otherwise
 */
export const clear = (): boolean => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Check if localStorage is available
 * @returns true if localStorage is available
 */
export const isAvailable = (): boolean => {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get all keys from localStorage
 * @returns Array of all keys
 */
export const getAllKeys = (): string[] => {
  try {
    return Object.keys(localStorage);
  } catch (error) {
    console.error('Error getting localStorage keys:', error);
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
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        size += localStorage[key].length + key.length;
      }
    }
    return size;
  } catch (error) {
    console.error('Error calculating localStorage size:', error);
    return 0;
  }
};

/**
 * Check if key exists in localStorage
 * @param key - Storage key
 * @returns true if key exists
 */
export const hasKey = (key: string): boolean => {
  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error checking localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Set item with expiration time
 * @param key - Storage key
 * @param value - Value to store
 * @param expirationMinutes - Expiration time in minutes
 * @returns true if successful
 */
export const setItemWithExpiry = <T>(
  key: string,
  value: T,
  expirationMinutes: number
): boolean => {
  try {
    const now = new Date();
    const item = {
      value,
      expiry: now.getTime() + expirationMinutes * 60 * 1000,
    };
    localStorage.setItem(key, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error(`Error setting localStorage item with expiry "${key}":`, error);
    return false;
  }
};

/**
 * Get item with expiration check
 * @param key - Storage key
 * @returns Value or null if expired or not found
 */
export const getItemWithExpiry = <T>(key: string): T | null => {
  try {
    const itemStr = localStorage.getItem(key);
    
    if (!itemStr) {
      return null;
    }
    
    const item = JSON.parse(itemStr);
    const now = new Date();
    
    // Check if expired
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value as T;
  } catch (error) {
    console.error(`Error getting localStorage item with expiry "${key}":`, error);
    return null;
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
  setItemWithExpiry,
  getItemWithExpiry,
};