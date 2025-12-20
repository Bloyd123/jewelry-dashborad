// ============================================================================
// FILE: src/hooks/customer/useCustomerSelection.ts
// Custom Hook for Customer Selection
// ============================================================================

import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  selectCustomer,
  deselectCustomer,
  toggleCustomerSelection,
  selectAllCustomers,
  deselectAllCustomers,
  selectSelectedCustomerIds,
} from '@/store/slices/customerSlice'

export const useCustomerSelection = () => {
  const dispatch = useAppDispatch()
  const selectedIds = useAppSelector(selectSelectedCustomerIds)

  const select = useCallback(
    (customerId: string) => {
      dispatch(selectCustomer(customerId))
    },
    [dispatch]
  )

  const deselect = useCallback(
    (customerId: string) => {
      dispatch(deselectCustomer(customerId))
    },
    [dispatch]
  )

  const toggle = useCallback(
    (customerId: string) => {
      dispatch(toggleCustomerSelection(customerId))
    },
    [dispatch]
  )

  const selectAll = useCallback(
    (customerIds: string[]) => {
      dispatch(selectAllCustomers(customerIds))
    },
    [dispatch]
  )

  const deselectAll = useCallback(() => {
    dispatch(deselectAllCustomers())
  }, [dispatch])

  const isSelected = useCallback(
    (customerId: string) => {
      return selectedIds.includes(customerId)
    },
    [selectedIds]
  )

  return {
    selectedIds,
    selectedCount: selectedIds.length,
    select,
    deselect,
    toggle,
    selectAll,
    deselectAll,
    isSelected,
    hasSelection: selectedIds.length > 0,
  }
}
