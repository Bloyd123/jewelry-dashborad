// FILE: src/services/storage/storageService.ts
// Base storage service with error handling and type safety

/**
 * Generic storage interface
 */
interface StorageInterface {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
  clear(): void
  key(index: number): string | null
  readonly length: number
}

/**
 * Create storage service wrapper
 */
const createStorageService = (storage: StorageInterface) => {
  /**
   * Set item in storage with error handling
   */
  const setItem = <T>(key: string, value: T): boolean => {
    try {
      const serializedValue = JSON.stringify(value)
      storage.setItem(key, serializedValue)
      return true
    } catch (error) {
      console.error(`Error setting storage item "${key}":`, error)
      return false
    }
  }

  /**
   * Get item from storage with error handling
   */
  const getItem = <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const item = storage.getItem(key)

      if (item === null) {
        return defaultValue
      }

      return JSON.parse(item) as T
    } catch (error) {
      console.error(`Error getting storage item "${key}":`, error)
      return defaultValue
    }
  }

  /**
   * Remove item from storage
   */
  const removeItem = (key: string): boolean => {
    try {
      storage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing storage item "${key}":`, error)
      return false
    }
  }

  /**
   * Clear all items from storage
   */
  const clear = (): boolean => {
    try {
      storage.clear()
      return true
    } catch (error) {
      console.error('Error clearing storage:', error)
      return false
    }
  }

  /**
   * Check if storage is available
   */
  const isAvailable = (): boolean => {
    try {
      const testKey = '__storage_test__'
      storage.setItem(testKey, 'test')
      storage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  /**
   * Get all keys from storage
   */
  const getAllKeys = (): string[] => {
    try {
      return Object.keys(storage)
    } catch (error) {
      console.error('Error getting storage keys:', error)
      return []
    }
  }

  /**
   * Get storage size in bytes (approximate)
   */
  const getSize = (): number => {
    try {
      let size = 0
      for (const key in storage) {
        if (storage.hasOwnProperty(key)) {
          const value = storage.getItem(key)
          if (value) {
            size += value.length + key.length
          }
        }
      }
      return size
    } catch (error) {
      console.error('Error calculating storage size:', error)
      return 0
    }
  }

  /**
   * Check if key exists in storage
   */
  const hasKey = (key: string): boolean => {
    try {
      return storage.getItem(key) !== null
    } catch (error) {
      console.error(`Error checking storage key "${key}":`, error)
      return false
    }
  }

  /**
   * Set item with expiration time
   */
  const setItemWithExpiry = <T>(
    key: string,
    value: T,
    expirationMinutes: number
  ): boolean => {
    try {
      const now = new Date()
      const item = {
        value,
        expiry: now.getTime() + expirationMinutes * 60 * 1000,
      }
      storage.setItem(key, JSON.stringify(item))
      return true
    } catch (error) {
      console.error(`Error setting storage item with expiry "${key}":`, error)
      return false
    }
  }

  /**
   * Get item with expiration check
   */
  const getItemWithExpiry = <T>(key: string): T | null => {
    try {
      const itemStr = storage.getItem(key)

      if (!itemStr) {
        return null
      }

      const item = JSON.parse(itemStr)
      const now = new Date()

      // Check if expired
      if (now.getTime() > item.expiry) {
        storage.removeItem(key)
        return null
      }

      return item.value as T
    } catch (error) {
      console.error(`Error getting storage item with expiry "${key}":`, error)
      return null
    }
  }

  return {
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
  }
}

export default createStorageService
