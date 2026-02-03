//
// FILE: hooks/auth/useShop.ts
// Shop Management - switchShop / clearShop / useShopContext
//

import { useCallback, useMemo } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { setCurrentShop, clearCurrentShop } from '@/store/slices/authSlice'

import { setCurrentShopPermissions } from '@/store/slices/permissionsSlice'

import { useCurrentShopId, useShopAccesses } from './useAuthState'
import { usePermissions } from './usePermissions'

//
// SHOP ACTIONS HOOK
//

export const useShopActions = () => {
  const dispatch = useAppDispatch()

  const switchShop = useCallback(
    (shopId: string) => {
      dispatch(setCurrentShop(shopId))
      dispatch(setCurrentShopPermissions(shopId))
    },
    [dispatch]
  )

  const clearShop = useCallback(() => {
    dispatch(clearCurrentShop())
  }, [dispatch])

  return {
    switchShop,
    clearShop,
  }
}

//
// SHOP CONTEXT HOOK
//

/**
 *  REFACTORED: Shop context from permissionsSlice
 */
export const useShopContext = () => {
  const dispatch = useAppDispatch()
  const currentShopId = useCurrentShopId()
  const shopAccesses = useShopAccesses() //  From permissionsSlice
  const permissions = usePermissions()

  const switchShop = useCallback(
    (shopId: string) => {
      dispatch(setCurrentShop(shopId))
      dispatch(setCurrentShopPermissions(shopId))
    },
    [dispatch]
  )

  const currentShopAccess = useMemo(() => {
    if (!currentShopId) return null
    return shopAccesses.find(access => access.shopId === currentShopId) || null
  }, [currentShopId, shopAccesses])

  return {
    currentShopId,
    currentShopAccess,
    shopAccesses,
    permissions,
    switchShop,
    hasMultipleShops: shopAccesses.length > 1,
    hasNoShops: shopAccesses.length === 0,
  }
}
