// ============================================================================
// FILE: src/hooks/customer/useCustomerFilters.ts
// Custom Hook for Customer Filters
// ============================================================================

import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  setSearchFilter,
  setCustomerTypeFilter,
  setMembershipTierFilter,
  setActiveFilter,
  setBalanceFilter,
  setDateRangeFilter,
  setFilters,
  clearFilters,
  selectCustomerFilters,
} from '@/store/slices/customerSlice'
import type { CustomerType, MembershipTier } from '@/types'

export const useCustomerFilters = () => {
  const dispatch = useAppDispatch()
  const filters = useAppSelector(selectCustomerFilters)

  const setSearch = useCallback(
    (search: string) => {
      dispatch(setSearchFilter(search))
    },
    [dispatch]
  )

  const setCustomerType = useCallback(
    (type: CustomerType | undefined) => {
      dispatch(setCustomerTypeFilter(type))
    },
    [dispatch]
  )

  const setMembershipTier = useCallback(
    (tier: MembershipTier | undefined) => {
      dispatch(setMembershipTierFilter(tier))
    },
    [dispatch]
  )

  const setActive = useCallback(
    (isActive: boolean | undefined) => {
      dispatch(setActiveFilter(isActive))
    },
    [dispatch]
  )

  const setHasBalance = useCallback(
    (hasBalance: boolean | undefined) => {
      dispatch(setBalanceFilter(hasBalance))
    },
    [dispatch]
  )

  const setDateRange = useCallback(
    (startDate?: string, endDate?: string) => {
      dispatch(setDateRangeFilter({ startDate, endDate }))
    },
    [dispatch]
  )

  const updateFilters = useCallback(
    (newFilters: Partial<typeof filters>) => {
      dispatch(setFilters(newFilters))
    },
    [dispatch]
  )

  const reset = useCallback(() => {
    dispatch(clearFilters())
  }, [dispatch])

  const hasActiveFilters = 
    filters.search !== '' ||
    filters.customerType !== undefined ||
    filters.membershipTier !== undefined ||
    filters.isActive !== undefined ||
    filters.hasBalance !== undefined ||
    filters.startDate !== undefined ||
    filters.endDate !== undefined

  return {
    filters,
    setSearch,
    setCustomerType,
    setMembershipTier,
    setActive,
    setHasBalance,
    setDateRange,
    updateFilters,
    reset,
    hasActiveFilters,
  }
}