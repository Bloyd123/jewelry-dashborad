// FILE: src/components/customer/CustomerTable/CustomerTable.tsx
// Main Customer Table Component

import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DataTable } from '@/components/ui/data-display/DataTable'
import { customerTableColumns } from './CustomerTableColumns'
import { getCustomerRowActions, BulkActionsBar } from './CustomerTableActions'
// import { MOCK_CUSTOMERS, type Customer } from './CustomerTable.types'
import type { Customer } from '@/types/customer.types'
// ADD THIS IMPORT
import { CustomerFilters } from '@/components/customer/CustomerFilters'
import type { CustomerFilterValues } from '@/components/customer/CustomerFilters'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/auth'
import { useCustomersList } from '@/hooks/customer/useCustomersList'

// MAIN COMPONENT

export const CustomerTable: React.FC = () => {
  const { t } = useTranslation()

  // STATE

  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set()
  )
  // ADD FILTER STATE
  const [filters, setFilters] = useState<CustomerFilterValues>({
    search: '',
    customerType: undefined,
    membershipTier: undefined,
    status: undefined,
    balance: undefined,
    vipOnly: undefined,
    dateRange: undefined,
  })
  const navigate = useNavigate()

  // HANDLERS
  const { currentShopId } = useAuth()
const {
  customers,
  pagination,
  isLoading,
  error,
} = useCustomersList(
  currentShopId!,
  {
    page: 1,
    limit: 10,
    search: filters.search || undefined,
customerType: filters.customerType as
  | 'retail'
  | 'wholesale'
  | 'vip'
  | 'regular'
  | undefined,

membershipTier: filters.membershipTier as
  | 'standard'
  | 'silver'
  | 'gold'
  | 'platinum'
  | undefined,

    isActive:
      filters.status === 'active'
        ? true
        : filters.status === 'inactive'
        ? false
        : undefined,
    hasBalance:
      filters.balance === 'due'
        ? true
        : filters.balance === 'clear'
        ? false
        : undefined,
    vipOnly:
  filters.vipOnly === 'true'
    ? true
    : filters.vipOnly === 'false'
    ? false
    : undefined,

  }
)


  const handleViewDetails = (customer: Customer) => {
    console.log('View Details:', customer)
    // TODO: Open customer details modal/drawer
  }

  const handleEdit = (customer: Customer) => {
    console.log('Edit Customer:', customer)
    navigate(`/customers/edit/${customer._id}`) // Fixed!
  }

  const handleAddPoints = (customer: Customer) => {
    console.log('Add Loyalty Points:', customer)
    // TODO: Open add points modal
  }

  const handleBlacklist = (customer: Customer) => {
    console.log('Blacklist/Remove Blacklist:', customer)
    // TODO: Handle blacklist action
  }

  const handleDelete = (customer: Customer) => {
    console.log('Delete Customer:', customer)
    // TODO: Show confirmation and delete
  }

  // Bulk Actions Handlers
  const handleBulkViewDetails = () => {
const selected = customers.filter(c => selectedRows.has(c._id))

    if (selected.length === 1) {
      handleViewDetails(selected[0])
    }
  }

  // const handleBulkEdit = () => {
  //   const selected = MOCK_CUSTOMERS.filter((c) => selectedRows.has(c._id))
  //   if (selected.length === 1) {
  //     handleEdit(selected[0])
  //   }
  // }
  const handleBulkEdit = () => {
    if (selectedCustomers.length === 1) {
      navigate(`/customers/edit/${selectedCustomers[0]._id}`) // Fixed!
    }
  }

  const handleBulkAddPoints = () => {
    const selected = customers.filter(c => selectedRows.has(c._id))
    console.log('Bulk Add Points:', selected)
    // TODO: Open bulk add points modal
  }

  const handleBulkBlacklist = () => {
    const selected = customers.filter(c => selectedRows.has(c._id))
    console.log('Bulk Blacklist:', selected)
    // TODO: Handle bulk blacklist
  }

  const handleBulkDelete = () => {
    const selected = customers.filter(c => selectedRows.has(c._id))
    console.log('Bulk Delete:', selected)
    // TODO: Show confirmation and bulk delete
  }

  const handleClearSelection = () => {
    setSelectedRows(new Set())
  }
  const handleFiltersChange = (newFilters: CustomerFilterValues) => {
    setFilters(newFilters)
    // TODO: Call API with filters or filter MOCK_CUSTOMERS locally
    console.log('Filters changed:', newFilters)
  }
  const handleClearAllFilters = () => {
    setFilters({
      search: '',
      customerType: undefined,
      membershipTier: undefined,
      status: undefined,
      balance: undefined,
      vipOnly: undefined,
      dateRange: undefined,
    })
  }

  // ROW ACTIONS

const rowActions = useMemo(
  () =>
    getCustomerRowActions(
      handleViewDetails,
      handleEdit,
      handleAddPoints,
      handleBlacklist,
      handleDelete
    ),
  [
    handleViewDetails,
    handleEdit,
    handleAddPoints,
    handleBlacklist,
    handleDelete,
  ]
)


  // SELECTED CUSTOMERS

const selectedCustomers = useMemo(() => {
  return customers.filter(customer =>
    selectedRows.has(customer._id)
  )
}, [customers, selectedRows])


  // RENDER

  return (
    <div className="w-full space-y-4">
      <CustomerFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearAll={handleClearAllFilters}
      />
      {/* Bulk Actions Bar - Shows when rows are selected */}
      {selectedRows.size > 0 && (
        <BulkActionsBar
          selectedCount={selectedRows.size}
          selectedCustomers={selectedCustomers}
          onViewDetails={handleBulkViewDetails}
          onEdit={handleBulkEdit}
          onAddPoints={handleBulkAddPoints}
          onBlacklist={handleBulkBlacklist}
          onDelete={handleBulkDelete}
          onClearSelection={handleClearSelection}
        />
      )}

      {/* DataTable */}
      <DataTable
        data={customers}
        columns={customerTableColumns}
        // Sorting Configuration
        sorting={{
          enabled: true,
        }}
        // Pagination Configuration
        pagination={{
          enabled: true,
          pageSize: 10,
          pageSizeOptions: [10, 20, 50],
          showPageSizeSelector: true,
          showPageInfo: true,
          showFirstLastButtons: true,
        }}
        // Selection Configuration
        selection={{
          enabled: true,
          selectedRows,
          onSelectionChange: setSelectedRows,
          getRowId: row => row._id,
          selectAllEnabled: true,
        }}
        // Row Actions Configuration
        rowActions={{
          enabled: true,
          actions: rowActions,
          position: 'end',
        }}
        // Empty State Configuration
emptyState={{
  message: isLoading
    ? t('table.loading')
    : t('table.noCustomers'),
}}

        // Style Configuration
        style={{
          variant: 'default',
          size: 'md',
          stickyHeader: true,
          hoverEffect: true,
          zebraStripes: false,
          showBorder: true,
          rounded: true,
          shadow: true,
          fullWidth: true,
        }}
        // Row Click Handler
        onRowClick={customer => {
          console.log('Row clicked:', customer)
          // Optional: Open details on row click
          // handleViewDetails(customer)
        }}
        // Get Row ID
        getRowId={row => row._id}
        // Test ID
        testId="customer-table"
        ariaLabel={t('table.ariaLabel')}
      />
    </div>
  )
}

CustomerTable.displayName = 'CustomerTable'
