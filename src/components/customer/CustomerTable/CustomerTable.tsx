// FILE: src/components/customer/CustomerTable/CustomerTable.tsx

import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DataTable } from '@/components/ui/data-display/DataTable'
import { customerTableColumns } from './CustomerTableColumns'
import { getCustomerRowActions, BulkActionsBar } from './CustomerTableActions'
import type { Customer } from '@/types/customer.types'
import { CustomerFilters } from '@/components/customer/CustomerFilters'
import type { CustomerFilterValues } from '@/components/customer/CustomerFilters'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/auth'
import { useCustomersList } from '@/hooks/customer/useCustomersList'
import { useCustomerActions } from '@/hooks/customer/useCustomerActions'
import { usePermissionCheck } from '@/hooks/auth/usePermissions'
import { ConfirmDialog } from '@/components/ui/overlay/Dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
export const CustomerTable: React.FC = () => {
  const { t } = useTranslation()
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; customer: Customer | null }>({ open: false, customer: null })
const [blacklistDialog, setBlacklistDialog] = useState<{ open: boolean; customer: Customer | null; reason: string }>({ open: false, customer: null, reason: '' })
const [loyaltyDialog, setLoyaltyDialog] = useState<{ open: boolean; customer: Customer | null; points: number; reason: string }>({ 
  open: false, customer: null, points: 0, reason: '' 
})  
const [removeBlacklistDialog, setRemoveBlacklistDialog] = useState<{ open: boolean; customer: Customer | null }>({ open: false, customer: null })

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
  const { can } = usePermissionCheck()
  
  const { currentShopId } = useAuth()
  
  const { deleteCustomer, isDeleting, blacklistCustomer, removeBlacklist, isBlacklisting, addLoyaltyPoints, isAddingLoyalty } = useCustomerActions(currentShopId!)
  const { customers, pagination, isLoading, error } = useCustomersList(
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
vipOnly: filters.vipOnly === 'vip' ? true : undefined,
startDate: filters.dateRange?.from?.toISOString(),
endDate: filters.dateRange?.to?.toISOString(),
    }
  )

const handleViewDetails = (customer: Customer) => {
  navigate(`/customers/${customer._id}`)
}

  const handleEdit = (customer: Customer) => {
    console.log('Edit Customer:', customer)
    navigate(`/customers/edit/${customer._id}`)
  }

const handleAddPoints = (customer: Customer) => {
  setLoyaltyDialog({ open: true, customer, points: 0, reason: '' })
}

const handleConfirmAddPoints = async () => {
  if (!loyaltyDialog.customer || loyaltyDialog.points <= 0) return
  await addLoyaltyPoints(loyaltyDialog.customer._id, loyaltyDialog.points, loyaltyDialog.reason)
  setLoyaltyDialog({ open: false, customer: null, points: 0, reason: '' })
}

const handleBlacklist = (customer: Customer) => {
  setBlacklistDialog({ open: true, customer, reason: '' })
}

const handleConfirmBlacklist = async () => {
  if (!blacklistDialog.customer || !blacklistDialog.reason.trim()) return
  await blacklistCustomer(blacklistDialog.customer._id, blacklistDialog.reason)
  setBlacklistDialog({ open: false, customer: null, reason: '' })
}

const handleDelete = (customer: Customer) => {
  setDeleteDialog({ open: true, customer })
}
const handleConfirmDelete = async () => {
  if (!deleteDialog.customer) return
  await deleteCustomer(deleteDialog.customer._id)
  setDeleteDialog({ open: false, customer: null })
}

  const handleBulkViewDetails = () => {
    const selected = customers.filter(c => selectedRows.has(c._id))

    if (selected.length === 1) {
      handleViewDetails(selected[0])
    }
  }

  const handleBulkEdit = () => {
    if (selectedCustomers.length === 1) {
      navigate(`/customers/edit/${selectedCustomers[0]._id}`)
    }
  }

  const handleBulkAddPoints = () => {
    const selected = customers.filter(c => selectedRows.has(c._id))
    console.log('Bulk Add Points:', selected)
  }

  const handleBulkBlacklist = () => {
    const selected = customers.filter(c => selectedRows.has(c._id))
    console.log('Bulk Blacklist:', selected)
  }

  const handleBulkDelete = () => {
    const selected = customers.filter(c => selectedRows.has(c._id))
    console.log('Bulk Delete:', selected)
  }

  const handleClearSelection = () => {
    setSelectedRows(new Set())
  }

const handleRemoveBlacklist = (customer: Customer) => {
  setRemoveBlacklistDialog({ open: true, customer })
}

const handleConfirmRemoveBlacklist = async () => {
  if (!removeBlacklistDialog.customer) return
  await removeBlacklist(removeBlacklistDialog.customer._id)
  setRemoveBlacklistDialog({ open: false, customer: null })
}
  const handleFiltersChange = (newFilters: CustomerFilterValues) => {
    setFilters(newFilters)
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

  const rowActions = useMemo(
    () =>
      getCustomerRowActions(
        handleViewDetails,
        can('canUpdateCustomer') ? handleEdit : () => {},
        can('canAddLoyaltyPoints') ? handleAddPoints : () => {},
        can('canBlacklistCustomer') ? handleBlacklist : () => {},
        can('canBlacklistCustomer') ? handleRemoveBlacklist : () => {},
        can('canDeleteCustomers') ? handleDelete : () => {}
      ),
    [
      handleViewDetails,
      handleEdit,
      handleAddPoints,
       handleRemoveBlacklist,
      handleBlacklist,
      handleDelete,
      can,
    ]
  )

  const selectedCustomers = useMemo(() => {
    return customers.filter(customer => selectedRows.has(customer._id))
  }, [customers, selectedRows])

  return (
    <div className="w-full space-y-4">
      <CustomerFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearAll={handleClearAllFilters}
      />
      {selectedRows.size > 0 && can('canManageCustomers') && (
        <BulkActionsBar
          selectedCount={selectedRows.size}
          selectedCustomers={selectedCustomers}
          onViewDetails={handleBulkViewDetails}
          onEdit={handleBulkEdit}
          onAddPoints={handleBulkAddPoints}
           onBlacklist={handleBulkBlacklist}
           onRemoveBlacklist={() => {}}
          onDelete={handleBulkDelete}
          onClearSelection={handleClearSelection}
        />
      )}

      <DataTable
        data={customers}
        columns={customerTableColumns}
        sorting={{
          enabled: true,
        }}
        pagination={{
          enabled: true,
          pageSize: 10,
          pageSizeOptions: [10, 20, 50],
          showPageSizeSelector: true,
          showPageInfo: true,
          showFirstLastButtons: true,
        }}
        selection={{
          enabled: true,
          selectedRows,
          onSelectionChange: setSelectedRows,
          getRowId: row => row._id,
          selectAllEnabled: true,
        }}
        rowActions={{
          enabled: true,
          actions: rowActions,
          position: 'end',
        }}
        emptyState={{
          message: isLoading ? t('table.loading') : t('table.noCustomers'),
        }}
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
        onRowClick={customer => {
          console.log('Row clicked:', customer)
        }}
        getRowId={row => row._id}
        testId="customer-table"
        ariaLabel={t('table.ariaLabel')}
      />
      <ConfirmDialog
  open={removeBlacklistDialog.open}
  onOpenChange={(open) => setRemoveBlacklistDialog(prev => ({ ...prev, open }))}
  title={t('customer.actions.removeBlacklist')}
  description={t('customer.confirmRemoveBlacklis')}
  variant="info"
  
  confirmLabel={t('customer.actions.removeBlacklist')}
  cancelLabel={t('common.cancel')}
  onConfirm={handleConfirmRemoveBlacklist}
/>
      <ConfirmDialog
  open={blacklistDialog.open}
  onOpenChange={(open) => setBlacklistDialog(prev => ({ ...prev, open }))}
  title={t('customer.actions.blacklist')}
  variant="warning"
  confirmLabel={t('customer.actions.blacklist')}
  cancelLabel={t('common.cancel')}
  onConfirm={handleConfirmBlacklist}
  loading={isBlacklisting}
>
<div className="px-6 pb-4">
  <Label className="mb-1">{t('customer.blacklistReason')} *</Label>
  <Textarea
    value={blacklistDialog.reason}
    onChange={(e) => setBlacklistDialog(prev => ({ ...prev, reason: e.target.value }))}
    rows={3}
    placeholder="Enter reason (min 10 characters)"
  />
</div>
</ConfirmDialog>
<ConfirmDialog
  open={loyaltyDialog.open}
  onOpenChange={(open) => setLoyaltyDialog(prev => ({ ...prev, open }))}
  title={t('customer.actions.addPoints')}
  variant="success"
  confirmLabel={t('customer.actions.addPoints')}
  cancelLabel={t('common.cancel')}
  onConfirm={handleConfirmAddPoints}
  loading={isAddingLoyalty}
  disabled={loyaltyDialog.points <= 0}
>
<div className="space-y-3 px-6 pb-2">
  <div>
    <Label className="mb-1">{t('customer.loyaltyPoints')} *</Label>
    <Input
      type="number"
      min={1}
      value={loyaltyDialog.points || ''}
      onChange={(e) => setLoyaltyDialog(prev => ({ ...prev, points: Number(e.target.value) }))}
      placeholder="Enter points"
    />
  </div>
  <div>
    <Label className="mb-1">{t('customer.notes')}</Label>
    <Textarea
      value={loyaltyDialog.reason}
      onChange={(e) => setLoyaltyDialog(prev => ({ ...prev, reason: e.target.value }))}
      rows={2}
      placeholder="Optional reason"
    />
  </div>
</div>
</ConfirmDialog>
      <ConfirmDialog
  open={deleteDialog.open}
  onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}
  title={t('customer.actions.delete')}
  description={t('customer.deleteConfirm', { name: deleteDialog.customer?.fullName })}
  variant="danger"
  confirmLabel={t('common.delete')}
  cancelLabel={t('common.cancel')}
  onConfirm={handleConfirmDelete}
  loading={isDeleting}
/>

    </div>
    
  )
  
}

CustomerTable.displayName = 'CustomerTable'
