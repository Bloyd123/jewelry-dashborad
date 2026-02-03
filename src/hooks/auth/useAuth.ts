//
// FILE: hooks/auth/useAuth.ts
// Main Auth Hook - Aggregates all auth functionality
//  REFACTORED: Modular structure with separated concerns
//

import { useAuthState } from './useAuthState'
import { useAuthActions } from './useAuthActions'
import { useUserProfile } from './useUserProfile'
import { usePasswordActions } from './usePasswordActions'
import { use2FA } from './use2FA'
import { useShopActions } from './useShop'
import { useSession } from './useSession'
import { useActivityAction } from './useActivity'
import { useToken } from './useToken'

//
// MAIN AUTH HOOK
//

/**
 * Main authentication hook
 *  REFACTORED: Uses single source of truth from permissionsSlice
 */
export const useAuth = () => {
  // Get all state
  const state = useAuthState()

  // Get all actions
  const authActions = useAuthActions()
  const userActions = useUserProfile()
  const passwordActions = usePasswordActions()
  const twoFAActions = use2FA()
  const shopActions = useShopActions()
  const sessionActions = useSession()
  const activityActions = useActivityAction()
  const tokenUtils = useToken()

  //
  // RETURN HOOK API
  //

  return {
    //  Auth State
    isAuthenticated: state.isAuthenticated,
    userId: state.userId,
    userRole: state.userRole,
    currentShopId: state.currentShopId,
    shopIds: state.shopIds,
    isLoading: state.isLoading,
    error: state.error,
    requires2FA: state.requires2FA,
    tempToken: state.tempToken,
    isInitializing: state.isInitializing,

    //  User Profile
    user: state.user,
    isUserLoading: state.isUserLoading,

    //  Permissions (SINGLE SOURCE)
    shopAccesses: state.shopAccesses,
    currentShopPermissions: state.currentShopPermissions,
    effectivePermissions: state.effectivePermissions,
    activeShops: state.activeShops,

    //  Auth Actions
    login: authActions.login,
    register: authActions.register,
    logout: authActions.logout,
    logoutAll: authActions.logoutAll,
    initialize: authActions.initialize,
    refreshToken: authActions.refreshToken,

    //  User Actions
    getUser: userActions.getUser,
    updateProfile: userActions.updateProfile,

    //  Password Actions
    changePassword: passwordActions.changePassword,
    forgotPassword: passwordActions.forgotPassword,
    resetPassword: passwordActions.resetPassword,

    //  2FA Actions
    enable2FA: twoFAActions.enable2FA,
    verify2FA: twoFAActions.verify2FA,
    disable2FA: twoFAActions.disable2FA,
    verify2FALogin: twoFAActions.verify2FALogin,
    verifyBackupCode: twoFAActions.verifyBackupCode,

    //  Shop Actions
    switchShop: shopActions.switchShop,
    clearShop: shopActions.clearShop,

    //  Session Actions
    getSessions: sessionActions.getSessions,
    revokeSession: sessionActions.revokeSession,

    //  Activity
    trackActivity: activityActions.trackActivity,

    //  Error Handling
    clearAuthError: authActions.clearAuthError,
    setAuthError: authActions.setAuthError,

    //  Token Utilities
    checkTokenValidity: tokenUtils.checkTokenValidity,
    getTokenExpiration: tokenUtils.getTokenExpiration,
  }
}

export default useAuth
