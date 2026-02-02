// 
// FILE: hooks/auth/usePermissions.ts
// Permission Selectors & Helpers
// 

import { useCallback } from 'react'
import { useAppSelector } from '@/store/hooks'
import {
  selectEffectivePermissions,
  selectHasPermission,
  selectHasAnyPermission,
  selectHasAllPermissions,
} from '@/store/slices/permissionsSlice'

import type { PermissionKey, UserRole } from '@/types'
import { useUserRole } from './useAuthState'

// 
// PERMISSIONS HOOK
// 

export const usePermissions = () => {
  return useAppSelector(selectEffectivePermissions)
}

export const useHasPermission = (permission: PermissionKey): boolean => {
  return useAppSelector(state => selectHasPermission(state, permission))
}

export const useHasAnyPermission = (permissions: PermissionKey[]): boolean => {
  return useAppSelector(state => selectHasAnyPermission(state, permissions))
}

export const useHasAllPermissions = (permissions: PermissionKey[]): boolean => {
  return useAppSelector(state => selectHasAllPermissions(state, permissions))
}

// 
// ROLE HOOKS
// 

export const useHasRole = (role: UserRole): boolean => {
  const userRole = useUserRole()
  return userRole === role
}

export const useIsSuperAdmin = (): boolean => {
  return useHasRole('super_admin')
}

export const useIsOrgAdmin = (): boolean => {
  return useHasRole('org_admin')
}

export const useIsShopAdmin = (): boolean => {
  return useHasRole('shop_admin')
}

// 
// PERMISSION CHECK HOOK
// 

export const usePermissionCheck = () => {
  const permissions = usePermissions()

  const can = useCallback(
    (permission: PermissionKey): boolean => {
      return permissions?.[permission] === true
    },
    [permissions]
  )

  const canAny = useCallback(
    (perms: PermissionKey[]): boolean => {
      return perms.some(perm => permissions?.[perm] === true)
    },
    [permissions]
  )

  const canAll = useCallback(
    (perms: PermissionKey[]): boolean => {
      return perms.every(perm => permissions?.[perm] === true)
    },
    [permissions]
  )

  return { can, canAny, canAll, permissions }
}