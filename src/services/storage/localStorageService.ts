// FILE: src/services/storage/localStorageService.ts
// Local storage service instance

import createStorageService from './storageService'

const localStorageService = createStorageService(localStorage)

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
} = localStorageService

export default localStorageService
