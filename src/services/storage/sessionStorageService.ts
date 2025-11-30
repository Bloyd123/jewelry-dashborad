// ============================================================================
// FILE: src/services/storage/sessionStorageService.ts
// Session storage service instance
// ============================================================================

import createStorageService from './storageService'

const sessionStorageService = createStorageService(sessionStorage)

export const {
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
} = sessionStorageService

export default sessionStorageService
