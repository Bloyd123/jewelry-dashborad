// FILE: src/services/storage/index.ts
// Export all storage services

import localStorageService from './localStorageService'
import sessionStorageService from './sessionStorageService'

export { localStorageService, sessionStorageService }

// Named exports for localStorage
export {
  setItem as setLocalItem,
  getItem as getLocalItem,
  removeItem as removeLocalItem,
  clear as clearLocal,
  isAvailable as isLocalAvailable,
  getAllKeys as getAllLocalKeys,
  getSize as getLocalSize,
  hasKey as hasLocalKey,
  setItemWithExpiry as setLocalItemWithExpiry,
  getItemWithExpiry as getLocalItemWithExpiry,
} from './localStorageService'

// Named exports for sessionStorage
export {
  setItem as setSessionItem,
  getItem as getSessionItem,
  removeItem as removeSessionItem,
  clear as clearSession,
  isAvailable as isSessionAvailable,
  getAllKeys as getAllSessionKeys,
  getSize as getSessionSize,
  hasKey as hasSessionKey,
} from './sessionStorageService'

export default {
  local: localStorageService,
  session: sessionStorageService,
}
