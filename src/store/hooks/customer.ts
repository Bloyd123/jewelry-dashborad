// FILE: src/store/hooks/customer.ts
// Customer-specific Redux hooks with selectors and utilities

import { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  // Actions
  setSearchFilter,
  setCustomerTypeFilter,
  setMembershipTierFilter,
  setActiveFilter,
  setBalanceFilter,
  setDateRangeFilter,
  setFilters,
  clearFilters,
  setCurrentPage,
  setPageSize,
  nextPage,
  previousPage,
  setSorting,
  toggleSortOrder,
  selectCustomer,
  deselectCustomer,
  toggleCustomerSelection,
  selectAllCustomers,
  deselectAllCustomers,
  setViewMode,
  toggleFilters,
  setShowFilters,
  setIsExporting,
  openCreateForm,
  openEditForm,
  closeForm,
  resetCustomerState,

  // Selectors
  selectCustomerFilters,
  selectCustomerSearch,
  selectCustomerTypeFilter,
  selectMembershipTierFilter,
  selectCustomerPagination,
  selectSelectedCustomerIds,
  selectSelectedCount,
  selectHasSelection,
  selectCustomerViewMode,
  selectShowFilters,
  selectIsExporting,
  selectCustomerFormState,
  selectHasActiveFilters,
} from '@/store/slices/customerSlice'
import type { CustomerType, MembershipTier } from '@/types'

// FILTER HOOKS

/**
 * Hook to get customer filters state
 * @returns Current filter values
 */
export const useCustomerFiltersState = () => {
  return useAppSelector(selectCustomerFilters)
}

/**
 * Hook to get search filter value
 * @returns Current search string
 */
export const useCustomerSearch = () => {
  return useAppSelector(selectCustomerSearch)
}

/**
 * Hook to get customer type filter
 * @returns Current customer type filter
 */
export const useCustomerTypeFilter = () => {
  return useAppSelector(selectCustomerTypeFilter)
}

/**
 * Hook to get membership tier filter
 * @returns Current membership tier filter
 */
export const useMembershipTierFilter = () => {
  return useAppSelector(selectMembershipTierFilter)
}

/**
 * Hook to check if any filters are active
 * @returns Boolean indicating if filters are active
 */
export const useHasActiveFilters = () => {
  return useAppSelector(selectHasActiveFilters)
}

/**
 * Hook to manage customer filters with actions
 * @returns Filters state and action methods
 */
export const useCustomerFilters = () => {
  const dispatch = useAppDispatch()
  const filters = useAppSelector(selectCustomerFilters)
  const hasActiveFilters = useAppSelector(selectHasActiveFilters)

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

  const resetFilters = useCallback(() => {
    dispatch(clearFilters())
  }, [dispatch])

  return {
    filters,
    hasActiveFilters,
    setSearch,
    setCustomerType,
    setMembershipTier,
    setActive,
    setHasBalance,
    setDateRange,
    updateFilters,
    resetFilters,
  }
}

// PAGINATION HOOKS

/**
 * Hook to get customer pagination state
 * @returns Current pagination state
 */
export const useCustomerPaginationState = () => {
  return useAppSelector(selectCustomerPagination)
}

/**
 * Hook to manage customer pagination with actions
 * @returns Pagination state and action methods
 */
export const useCustomerPagination = () => {
  const dispatch = useAppDispatch()
  const pagination = useAppSelector(selectCustomerPagination)

  const goToPage = useCallback(
    (page: number) => {
      dispatch(setCurrentPage(page))
    },
    [dispatch]
  )

  const changePageSize = useCallback(
    (size: number) => {
      dispatch(setPageSize(size))
    },
    [dispatch]
  )

  const goToNextPage = useCallback(() => {
    dispatch(nextPage())
  }, [dispatch])

  const goToPreviousPage = useCallback(() => {
    dispatch(previousPage())
  }, [dispatch])

  const changeSorting = useCallback(
    (sortBy: string, sortOrder: 'asc' | 'desc') => {
      dispatch(setSorting({ sortBy, sortOrder }))
    },
    [dispatch]
  )

  const toggleSort = useCallback(() => {
    dispatch(toggleSortOrder())
  }, [dispatch])

  return {
    ...pagination,
    goToPage,
    changePageSize,
    goToNextPage,
    goToPreviousPage,
    changeSorting,
    toggleSort,
  }
}

// SELECTION HOOKS

/**
 * Hook to get selected customer IDs
 * @returns Array of selected customer IDs
 */
export const useSelectedCustomerIds = () => {
  return useAppSelector(selectSelectedCustomerIds)
}

/**
 * Hook to get selected customers count
 * @returns Number of selected customers
 */
export const useSelectedCustomersCount = () => {
  return useAppSelector(selectSelectedCount)
}

/**
 * Hook to check if any customers are selected
 * @returns Boolean indicating if any customers are selected
 */
export const useHasSelectedCustomers = () => {
  return useAppSelector(selectHasSelection)
}

/**
 * Hook to check if a specific customer is selected
 * @param customerId - Customer ID to check
 * @returns Boolean indicating if customer is selected
 */
export const useIsCustomerSelected = (customerId: string) => {
  const selectedIds = useAppSelector(selectSelectedCustomerIds)
  return useMemo(
    () => selectedIds.includes(customerId),
    [selectedIds, customerId]
  )
}

/**
 * Hook to manage customer selection with actions
 * @returns Selection state and action methods
 */
export const useCustomerSelection = () => {
  const dispatch = useAppDispatch()
  const selectedIds = useAppSelector(selectSelectedCustomerIds)
  const selectedCount = useAppSelector(selectSelectedCount)
  const hasSelection = useAppSelector(selectHasSelection)

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
    selectedCount,
    hasSelection,
    select,
    deselect,
    toggle,
    selectAll,
    deselectAll,
    isSelected,
  }
}

// VIEW MODE HOOKS

/**
 * Hook to get current customer view mode
 * @returns Current view mode ('grid' | 'list' | 'compact')
 */
export const useCustomerViewMode = () => {
  return useAppSelector(selectCustomerViewMode)
}

/**
 * Hook to check if filters panel is visible
 * @returns Boolean indicating if filters are shown
 */
export const useShowCustomerFilters = () => {
  return useAppSelector(selectShowFilters)
}

/**
 * Hook to manage customer view settings
 * @returns View settings and action methods
 */
export const useCustomerViewSettings = () => {
  const dispatch = useAppDispatch()
  const viewMode = useAppSelector(selectCustomerViewMode)
  const showFilters = useAppSelector(selectShowFilters)

  const changeViewMode = useCallback(
    (mode: 'grid' | 'list' | 'compact') => {
      dispatch(setViewMode(mode))
    },
    [dispatch]
  )

  const toggleFiltersPanel = useCallback(() => {
    dispatch(toggleFilters())
  }, [dispatch])

  const setFiltersVisibility = useCallback(
    (visible: boolean) => {
      dispatch(setShowFilters(visible))
    },
    [dispatch]
  )

  return {
    viewMode,
    showFilters,
    changeViewMode,
    toggleFiltersPanel,
    setFiltersVisibility,
  }
}

// EXPORT HOOKS

/**
 * Hook to check if export is in progress
 * @returns Boolean indicating if export is running
 */
export const useIsExportingCustomers = () => {
  return useAppSelector(selectIsExporting)
}

/**
 * Hook to manage customer export state
 * @returns Export state and action methods
 */
export const useCustomerExport = () => {
  const dispatch = useAppDispatch()
  const isExporting = useAppSelector(selectIsExporting)

  const startExport = useCallback(() => {
    dispatch(setIsExporting(true))
  }, [dispatch])

  const stopExport = useCallback(() => {
    dispatch(setIsExporting(false))
  }, [dispatch])

  return {
    isExporting,
    startExport,
    stopExport,
  }
}

// FORM HOOKS

/**
 * Hook to get customer form state
 * @returns Form state (isOpen, mode, editingId)
 */
export const useCustomerFormState = () => {
  return useAppSelector(selectCustomerFormState)
}

/**
 * Hook to check if customer form is open
 * @returns Boolean indicating if form is open
 */
export const useIsCustomerFormOpen = () => {
  const formState = useAppSelector(selectCustomerFormState)
  return formState.isOpen
}

/**
 * Hook to get current form mode
 * @returns Form mode ('create' | 'edit')
 */
export const useCustomerFormMode = () => {
  const formState = useAppSelector(selectCustomerFormState)
  return formState.mode
}

/**
 * Hook to get editing customer ID
 * @returns Customer ID being edited or null
 */
export const useEditingCustomerId = () => {
  const formState = useAppSelector(selectCustomerFormState)
  return formState.editingId
}

/**
 * Hook to manage customer form with actions
 * @returns Form state and action methods
 */
export const useCustomerForm = () => {
  const dispatch = useAppDispatch()
  const formState = useAppSelector(selectCustomerFormState)

  const openCreate = useCallback(() => {
    dispatch(openCreateForm())
  }, [dispatch])

  const openEdit = useCallback(
    (customerId: string) => {
      dispatch(openEditForm(customerId))
    },
    [dispatch]
  )

  const close = useCallback(() => {
    dispatch(closeForm())
  }, [dispatch])

  return {
    ...formState,
    openCreate,
    openEdit,
    close,
  }
}

// UTILITY HOOKS

/**
 * Hook to reset all customer state
 * @returns Reset function
 */
export const useResetCustomerState = () => {
  const dispatch = useAppDispatch()

  return useCallback(() => {
    dispatch(resetCustomerState())
  }, [dispatch])
}

/**
 * Hook to get all customer UI state in one object
 * @returns Complete customer UI state
 */
export const useCustomerUIState = () => {
  const filters = useAppSelector(selectCustomerFilters)
  const pagination = useAppSelector(selectCustomerPagination)
  const selectedIds = useAppSelector(selectSelectedCustomerIds)
  const viewMode = useAppSelector(selectCustomerViewMode)
  const showFilters = useAppSelector(selectShowFilters)
  const isExporting = useAppSelector(selectIsExporting)
  const formState = useAppSelector(selectCustomerFormState)
  const hasActiveFilters = useAppSelector(selectHasActiveFilters)
  const hasSelection = useAppSelector(selectHasSelection)

  return {
    filters,
    pagination,
    selectedIds,
    viewMode,
    showFilters,
    isExporting,
    formState,
    hasActiveFilters,
    hasSelection,
  }
}

/**
 * Hook to build query parameters from current state
 * @param shopId - Shop ID to include in query
 * @returns Query parameters object for API calls
 */
export const useCustomerQueryParams = (shopId: string) => {
  const filters = useAppSelector(selectCustomerFilters)
  const pagination = useAppSelector(selectCustomerPagination)

  return useMemo(
    () => ({
      shopId,
      page: pagination.currentPage,
      limit: pagination.pageSize,
      sort: `${pagination.sortOrder === 'desc' ? '-' : ''}${pagination.sortBy}`,
      ...filters,
    }),
    [shopId, filters, pagination]
  )
}
