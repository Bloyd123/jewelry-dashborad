// ============================================================================
// FILE: src/store/slices/customerSlice.ts
// Customer UI State Slice (for filters, selections, etc.)
// ============================================================================

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CustomerType, MembershipTier } from '@/types'
import type { RootState } from '@/store'
interface CustomerFilters {
  search: string
  customerType?: CustomerType
  membershipTier?: MembershipTier
  isActive?: boolean
  hasBalance?: boolean
  startDate?: string
  endDate?: string
}

interface CustomerUIState {
  // Filters (UI-only state)
  filters: CustomerFilters

  // Pagination (UI-only state)
  currentPage: number
  pageSize: number
  sortBy: string
  sortOrder: 'asc' | 'desc'

  // Selected customers (for bulk operations)
  selectedCustomerIds: string[]

  // UI states
  viewMode: 'grid' | 'list' | 'compact'
  showFilters: boolean
  isExporting: boolean

  // Form states
  isFormOpen: boolean
  editingCustomerId: string | null
  formMode: 'create' | 'edit'
}

const initialState: CustomerUIState = {
  filters: {
    search: '',
    customerType: undefined,
    membershipTier: undefined,
    isActive: undefined,
    hasBalance: undefined,
    startDate: undefined,
    endDate: undefined,
  },
  currentPage: 1,
  pageSize: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  selectedCustomerIds: [],
  viewMode: 'list',
  showFilters: false,
  isExporting: false,
  isFormOpen: false,
  editingCustomerId: null,
  formMode: 'create',
}

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    // ========================================================================
    // FILTER ACTIONS
    // ========================================================================
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload
      state.currentPage = 1 // Reset to first page on search
    },

    setCustomerTypeFilter: (
      state,
      action: PayloadAction<CustomerType | undefined>
    ) => {
      state.filters.customerType = action.payload
      state.currentPage = 1
    },

    setMembershipTierFilter: (
      state,
      action: PayloadAction<MembershipTier | undefined>
    ) => {
      state.filters.membershipTier = action.payload
      state.currentPage = 1
    },

    setActiveFilter: (state, action: PayloadAction<boolean | undefined>) => {
      state.filters.isActive = action.payload
      state.currentPage = 1
    },

    setBalanceFilter: (state, action: PayloadAction<boolean | undefined>) => {
      state.filters.hasBalance = action.payload
      state.currentPage = 1
    },

    setDateRangeFilter: (
      state,
      action: PayloadAction<{ startDate?: string; endDate?: string }>
    ) => {
      state.filters.startDate = action.payload.startDate
      state.filters.endDate = action.payload.endDate
      state.currentPage = 1
    },

    setFilters: (state, action: PayloadAction<Partial<CustomerFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
      state.currentPage = 1
    },

    clearFilters: state => {
      state.filters = initialState.filters
      state.currentPage = 1
    },

    // ========================================================================
    // PAGINATION ACTIONS
    // ========================================================================
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },

    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload
      state.currentPage = 1
    },

    nextPage: state => {
      state.currentPage += 1
    },

    previousPage: state => {
      if (state.currentPage > 1) {
        state.currentPage -= 1
      }
    },

    // ========================================================================
    // SORTING ACTIONS
    // ========================================================================
    setSorting: (
      state,
      action: PayloadAction<{ sortBy: string; sortOrder: 'asc' | 'desc' }>
    ) => {
      state.sortBy = action.payload.sortBy
      state.sortOrder = action.payload.sortOrder
    },

    toggleSortOrder: state => {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc'
    },

    // ========================================================================
    // SELECTION ACTIONS
    // ========================================================================
    selectCustomer: (state, action: PayloadAction<string>) => {
      if (!state.selectedCustomerIds.includes(action.payload)) {
        state.selectedCustomerIds.push(action.payload)
      }
    },

    deselectCustomer: (state, action: PayloadAction<string>) => {
      state.selectedCustomerIds = state.selectedCustomerIds.filter(
        id => id !== action.payload
      )
    },

    toggleCustomerSelection: (state, action: PayloadAction<string>) => {
      const index = state.selectedCustomerIds.indexOf(action.payload)
      if (index > -1) {
        state.selectedCustomerIds.splice(index, 1)
      } else {
        state.selectedCustomerIds.push(action.payload)
      }
    },

    selectAllCustomers: (state, action: PayloadAction<string[]>) => {
      state.selectedCustomerIds = action.payload
    },

    deselectAllCustomers: state => {
      state.selectedCustomerIds = []
    },

    // ========================================================================
    // VIEW MODE ACTIONS
    // ========================================================================
    setViewMode: (
      state,
      action: PayloadAction<'grid' | 'list' | 'compact'>
    ) => {
      state.viewMode = action.payload
    },

    toggleFilters: state => {
      state.showFilters = !state.showFilters
    },

    setShowFilters: (state, action: PayloadAction<boolean>) => {
      state.showFilters = action.payload
    },

    // ========================================================================
    // EXPORT ACTIONS
    // ========================================================================
    setIsExporting: (state, action: PayloadAction<boolean>) => {
      state.isExporting = action.payload
    },

    // ========================================================================
    // FORM ACTIONS
    // ========================================================================
    openCreateForm: state => {
      state.isFormOpen = true
      state.formMode = 'create'
      state.editingCustomerId = null
    },

    openEditForm: (state, action: PayloadAction<string>) => {
      state.isFormOpen = true
      state.formMode = 'edit'
      state.editingCustomerId = action.payload
    },

    closeForm: state => {
      state.isFormOpen = false
      state.editingCustomerId = null
    },

    // ========================================================================
    // RESET ACTIONS
    // ========================================================================
    resetCustomerState: () => initialState,
  },
})

export const {
  // Filters
  setSearchFilter,
  setCustomerTypeFilter,
  setMembershipTierFilter,
  setActiveFilter,
  setBalanceFilter,
  setDateRangeFilter,
  setFilters,
  clearFilters,

  // Pagination
  setCurrentPage,
  setPageSize,
  nextPage,
  previousPage,

  // Sorting
  setSorting,
  toggleSortOrder,

  // Selection
  selectCustomer,
  deselectCustomer,
  toggleCustomerSelection,
  selectAllCustomers,
  deselectAllCustomers,

  // View
  setViewMode,
  toggleFilters,
  setShowFilters,

  // Export
  setIsExporting,

  // Form
  openCreateForm,
  openEditForm,
  closeForm,

  // Reset
  resetCustomerState,
} = customerSlice.actions

// ============================================================================
// SELECTORS (Keep with slice for better organization)
// ============================================================================

// Basic selectors
export const selectCustomerFilters = (state: RootState) =>
  state.customer.filters
export const selectCustomerSearch = (state: RootState) =>
  state.customer.filters.search
export const selectCustomerTypeFilter = (state: RootState) =>
  state.customer.filters.customerType
export const selectMembershipTierFilter = (state: RootState) =>
  state.customer.filters.membershipTier

export const selectCustomerPagination = (state: RootState) => ({
  currentPage: state.customer.currentPage,
  pageSize: state.customer.pageSize,
  sortBy: state.customer.sortBy,
  sortOrder: state.customer.sortOrder,
})

export const selectSelectedCustomerIds = (state: RootState) =>
  state.customer.selectedCustomerIds

export const selectCustomerViewMode = (state: RootState) =>
  state.customer.viewMode
export const selectShowFilters = (state: RootState) =>
  state.customer.showFilters
export const selectIsExporting = (state: RootState) =>
  state.customer.isExporting

export const selectCustomerFormState = (state: RootState) => ({
  isOpen: state.customer.isFormOpen,
  mode: state.customer.formMode,
  editingId: state.customer.editingCustomerId,
})

// Computed/Memoized selectors (using reselect pattern if needed)
export const selectHasActiveFilters = (state: RootState) => {
  const filters = state.customer.filters
  return (
    filters.search !== '' ||
    filters.customerType !== undefined ||
    filters.membershipTier !== undefined ||
    filters.isActive !== undefined ||
    filters.hasBalance !== undefined ||
    filters.startDate !== undefined ||
    filters.endDate !== undefined
  )
}

export const selectSelectedCount = (state: RootState) =>
  state.customer.selectedCustomerIds.length

export const selectHasSelection = (state: RootState) =>
  state.customer.selectedCustomerIds.length > 0

// Export reducer as default
export default customerSlice.reducer
