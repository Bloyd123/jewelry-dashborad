// ============================================================================
// FILE: src/features/customer/components/CustomerTable/CustomerTable.tsx
// Customer Table Component - Uses DataTable from UI
// ============================================================================

import React, { useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { DataTable } from '@/components/ui/data-display/DataTable'
import type { DataTableColumn, RowAction, PaginationState } from '@/components/ui/data-display/DataTable'
import type { CustomerListItem } from '@/types'
import {
  getCustomerTableColumns,
  getCompactCustomerTableColumns,
} from './CustomerTableColumns'
import {
  getCustomerRowActions,
  copyCustomerDetails,
  openPhoneDialer,
  openEmailClient,
  openWhatsApp,
  type CustomerActionHandlers,
  type CustomerPermissions,
} from './CustomerTableActions'
import {
  selectCustomerPagination,
  selectSelectedCustomerIds,
  setCurrentPage,
  setPageSize,
  setSorting,
  toggleCustomerSelection,
  selectAllCustomers,
  deselectAllCustomers,
  openEditForm,
} from '@/store/slices/customerSlice'
import { useMediaQuery } from '@/hooks/useMediaQuery'

// ============================================================================
// PROPS
// ============================================================================

export interface CustomerTableProps {
  data: CustomerListItem[]
  isLoading?: boolean
  error?: string | null
  permissions?: CustomerPermissions
  onCustomerClick?: (customer: CustomerListItem) => void
  onDeleteCustomer?: (customer: CustomerListItem) => void
  onBlacklistCustomer?: (customer: CustomerListItem) => void
  onRemoveBlacklist?: (customer: CustomerListItem) => void
  onAddLoyaltyPoints?: (customer: CustomerListItem) => void
  onRedeemLoyaltyPoints?: (customer: CustomerListItem) => void
  onRecordPayment?: (customer: CustomerListItem) => void
  onMarkAsVIP?: (customer: CustomerListItem) => void
  compact?: boolean
  showSelection?: boolean
  showActions?: boolean
}

// ============================================================================
// CUSTOMER TABLE COMPONENT
// ============================================================================

export const CustomerTable: React.FC<CustomerTableProps> = ({
  data,
  isLoading = false,
  error = null,
  permissions = {},
  onCustomerClick,
  onDeleteCustomer,
  onBlacklistCustomer,
  onRemoveBlacklist,
  onAddLoyaltyPoints,
  onRedeemLoyaltyPoints,
  onRecordPayment,
  onMarkAsVIP,
  compact = false,
  showSelection = true,
  showActions = true,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // Selectors
  const pagination = useAppSelector(selectCustomerPagination)
  const selectedCustomerIds = useAppSelector(selectSelectedCustomerIds)

  // Responsive
  const isMobile = useMediaQuery('(max-width: 768px)')

  // ========================================================================
  // ACTION HANDLERS
  // ========================================================================

  const handleView = useCallback(
    (customer: CustomerListItem) => {
      navigate(`/customers/${customer._id}`)
    },
    [navigate]
  )

  const handleEdit = useCallback(
    (customer: CustomerListItem) => {
      dispatch(openEditForm(customer._id))
    },
    [dispatch]
  )

  const handleCall = useCallback((customer: CustomerListItem) => {
    openPhoneDialer(customer.phone)
  }, [])

  const handleEmail = useCallback((customer: CustomerListItem) => {
    if (customer.email) {
      openEmailClient(customer.email)
    }
  }, [])

  const handleWhatsApp = useCallback((customer: CustomerListItem) => {
    const phone = customer.whatsappNumber || customer.phone
    if (phone) {
      openWhatsApp(phone)
    }
  }, [])

  const handleViewOrders = useCallback(
    (customer: CustomerListItem) => {
      navigate(`/customers/${customer._id}/orders`)
    },
    [navigate]
  )

  const handleViewTransactions = useCallback(
    (customer: CustomerListItem) => {
      navigate(`/customers/${customer._id}/transactions`)
    },
    [navigate]
  )

  const handleCopyDetails = useCallback(
    async (customer: CustomerListItem) => {
      const success = await copyCustomerDetails(customer)
      if (success) {
        // Show success toast
        console.log('Customer details copied to clipboard')
      }
    },
    []
  )

  // ========================================================================
  // ROW ACTIONS
  // ========================================================================

  const actionHandlers: CustomerActionHandlers = useMemo(
    () => ({
      onView: handleView,
      onEdit: handleEdit,
      onDelete: onDeleteCustomer,
      onBlacklist: onBlacklistCustomer,
      onRemoveBlacklist: onRemoveBlacklist,
      onAddLoyaltyPoints: onAddLoyaltyPoints,
      onRedeemLoyaltyPoints: onRedeemLoyaltyPoints,
      onCall: handleCall,
      onEmail: handleEmail,
      onWhatsApp: handleWhatsApp,
      onRecordPayment: onRecordPayment,
      onViewOrders: handleViewOrders,
      onCopyDetails: handleCopyDetails,
      onMarkAsVIP: onMarkAsVIP,
      onViewTransactions: handleViewTransactions,
    }),
    [
      handleView,
      handleEdit,
      onDeleteCustomer,
      onBlacklistCustomer,
      onRemoveBlacklist,
      onAddLoyaltyPoints,
      onRedeemLoyaltyPoints,
      handleCall,
      handleEmail,
      handleWhatsApp,
      onRecordPayment,
      handleViewOrders,
      handleCopyDetails,
      onMarkAsVIP,
      handleViewTransactions,
    ]
  )

  const rowActions: RowAction<CustomerListItem>[] = useMemo(
    () => getCustomerRowActions(actionHandlers, permissions),
    [actionHandlers, permissions]
  )

  // ========================================================================
  // COLUMNS
  // ========================================================================

  const columns: DataTableColumn<CustomerListItem>[] = useMemo(() => {
    if (compact || isMobile) {
      return getCompactCustomerTableColumns()
    }
    return getCustomerTableColumns()
  }, [compact, isMobile])

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================

  const handlePaginationChange = useCallback(
    (newPagination: PaginationState) => {
      dispatch(setCurrentPage(newPagination.pageIndex))
      dispatch(setPageSize(newPagination.pageSize))
    },
    [dispatch]
  )

  const handleSortingChange = useCallback(
    (sorting: any) => {
      if (sorting && sorting.length > 0) {
        dispatch(
          setSorting({
            sortBy: sorting[0].columnId,
            sortOrder: sorting[0].direction || 'asc',
          })
        )
      }
    },
    [dispatch]
  )

  const handleSelectionChange = useCallback(
    (selection: Set<string | number>) => {
      const currentIds = Array.from(selectedCustomerIds)
      const newIds = Array.from(selection)

      // Find added and removed IDs
      const added = newIds.filter((id) => !currentIds.includes(String(id)))
      const removed = currentIds.filter((id) => !newIds.includes(id))

      // Dispatch actions for changes
      added.forEach((id) => dispatch(toggleCustomerSelection(String(id))))
      removed.forEach((id) => dispatch(toggleCustomerSelection(id)))
    },
    [dispatch, selectedCustomerIds]
  )

  const handleRowClick = useCallback(
    (customer: CustomerListItem) => {
      if (onCustomerClick) {
        onCustomerClick(customer)
      } else {
        handleView(customer)
      }
    },
    [onCustomerClick, handleView]
  )

  // ========================================================================
  // SELECTION STATE
  // ========================================================================

  const selectedRowsSet = useMemo(
    () => new Set(selectedCustomerIds),
    [selectedCustomerIds]
  )

  // ========================================================================
  // SORTING STATE
  // ========================================================================

  const sortingState = useMemo(
    () => [
      {
        columnId: pagination.sortBy,
        direction: pagination.sortOrder as 'asc' | 'desc',
      },
    ],
    [pagination.sortBy, pagination.sortOrder]
  )

  // ========================================================================
  // ERROR STATE
  // ========================================================================

  if (error) {
    return (
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-8 text-center">
        <p className="text-status-error text-sm">{error}</p>
      </div>
    )
  }

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <DataTable
      data={data}
      columns={columns}
      // Sorting
      sorting={{
        enabled: true,
        sortingState,
        onSortingChange: handleSortingChange,
      }}
      // Pagination
      pagination={{
        enabled: true,
        pageIndex: pagination.currentPage,
        pageSize: pagination.pageSize,
        pageSizeOptions: [10, 20, 50, 100],
        totalItems: data.length,
        onPaginationChange: handlePaginationChange,
        showPageSizeSelector: true,
        showPageInfo: true,
        showFirstLastButtons: !isMobile,
      }}
      // Selection
      selection={
        showSelection
          ? {
              enabled: true,
              selectedRows: selectedRowsSet,
              onSelectionChange: handleSelectionChange,
              getRowId: (row) => row._id,
              selectAllEnabled: true,
            }
          : undefined
      }
      // Row Actions
      rowActions={
        showActions
          ? {
              enabled: true,
              actions: rowActions,
              position: 'end',
              dropdownLabel: t('customer.actions.moreActions'),
            }
          : undefined
      }
      // Loading State
      loading={{
        isLoading,
        loadingRows: 10,
      }}
      // Empty State
      emptyState={{
        message: t('customer.list.noCustomers'),
        action: permissions.canCreateCustomers
          ? {
              label: t('customer.list.addFirstCustomer'),
              onClick: () => navigate('/customers/new'),
            }
          : undefined,
      }}
      // Styling
      style={{
        variant: 'default',
        size: compact ? 'sm' : 'md',
        stickyHeader: true,
        hoverEffect: true,
        zebraStripes: false,
        showBorder: true,
        rounded: true,
        shadow: false,
        rowClassName: (row) => {
          if (row.isBlacklisted) {
            return 'bg-status-error/5 hover:bg-status-error/10'
          }
          if (row.customerType === 'vip') {
            return 'bg-accent/5 hover:bg-accent/10'
          }
          return ''
        },
      }}
      // Row Events
      onRowClick={handleRowClick}
      // Misc
      getRowId={(row) => row._id}
      testId="customer-table"
      ariaLabel={t('customer.list.title')}
    />
  )
}

// ============================================================================
// DISPLAY NAME
// ============================================================================

CustomerTable.displayName = 'CustomerTable'

// ============================================================================
// EXPORT
// ============================================================================

export default CustomerTable