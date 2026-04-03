import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { DataTable } from '@/components/ui/data-display/DataTable'
import { salesTableColumns } from './SalesTableColumns'
import { getSalesRowActions, BulkActionsBar } from './SalesTableActions'
import { useSalesList } from '@/hooks/sales'
import { useSaleActions } from '@/hooks/sales'
import type { Sale } from '@/types/sale.types'
import { SalesFilters } from '@/components/sales/SalesFilters'
import type { SalesFilterValues } from '@/components/sales/SalesFilters/SalesFilters.tsx'
import type { SaleStatus, PaymentStatus, SaleType } from '@/types/sale.types'
import { useGetCustomersQuery } from '@/store/api/customerApi'
export const SalesTable: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { shopId } = useParams<{ shopId: string }>()
const { data: customersData } = useGetCustomersQuery(
  { shopId: shopId ?? '', limit: 100 },
  { skip: !shopId }
)

// customers transform karo CustomerFilter ke format mein
const customers = (customersData?.data?.customers || []).map(c => ({
  _id:          c._id,
  customerName: c.fullName || `${c.firstName} ${c.lastName}`,
  customerCode: c.customerCode,
  phone:        c.phone,
}))
  // ── State ─────────────────────────────────
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())
  const [filters, setFilters] = useState<SalesFilterValues>({
    search: '',
    customerId: undefined,
    salesPerson: undefined,
    status: undefined,
    paymentStatus: undefined,
    saleType: undefined,
    paymentMode: undefined,
    dateRange: undefined,
    amountRange: undefined,
  })

  // ── Real API ──────────────────────────────
const {
  sales,
  isLoading,
  pagination,
  setPage,
  setSearch,
  setStatus,
  setPaymentStatus,
  setSaleType,
  refetch,
} = useSalesList(shopId ?? '', {
  search:        filters.search,
  status:        filters.status as SaleStatus | undefined,
  paymentStatus: filters.paymentStatus as PaymentStatus | undefined,
  saleType:      filters.saleType as SaleType | undefined,
  customerId:    filters.customerId,
  salesPerson:   filters.salesPerson,
})

  const {
    deleteSale,
    cancelSale,
    completeSale,
    deliverSale,
    printInvoice,
  } = useSaleActions(shopId ?? '')

  // ── Filter Handlers ───────────────────────
const handleFiltersChange = (newFilters: SalesFilterValues) => {
  setFilters(newFilters)
  setSearch(newFilters.search || '')
  if (newFilters.status !== filters.status)
    setStatus((newFilters.status as SaleStatus) || '')
  if (newFilters.paymentStatus !== filters.paymentStatus)
    setPaymentStatus((newFilters.paymentStatus as PaymentStatus) || '')
  if (newFilters.saleType !== filters.saleType)
    setSaleType((newFilters.saleType as SaleType) || '')
}

const handleClearAllFilters = () => {
  setFilters({
    search: '',
    customerId: undefined,
    salesPerson: undefined,
    status: undefined,
    paymentStatus: undefined,
    saleType: undefined,
    paymentMode: undefined,
    dateRange: undefined,
    amountRange: undefined,
  })
  setSearch('')
  setStatus('' as SaleStatus)
  setPaymentStatus('' as PaymentStatus)
  setSaleType('' as SaleType)
}

  // ── Row Handlers ──────────────────────────
  const handleViewDetails = (sale: Sale) =>
    navigate(`/shops/${shopId}/sales/${sale._id}`)

  const handleEdit = (sale: Sale) =>
    navigate(`/shops/${shopId}/sales/${sale._id}/edit`)

  const handleAddPayment = (sale: Sale) => {
    // TODO: Open payment modal
    console.log('Add Payment:', sale._id)
  }

  const handleDeliver = async (sale: Sale) => {
    await deliverSale(sale._id, { deliveryType: 'immediate' })
  }

  const handleComplete = async (sale: Sale) => {
    await completeSale(sale._id)
  }

  const handleReturn = (sale: Sale) => {
    // TODO: Open return modal
    console.log('Return Sale:', sale._id)
  }

  const handleCancel = async (sale: Sale) => {
    await cancelSale(sale._id, 'Cancelled by user')
  }

  const handlePrint = async (sale: Sale) => {
    await printInvoice(sale._id)
  }

  const handleDelete = async (sale: Sale) => {
    await deleteSale(sale._id)
  }

  // ── Bulk Handlers ─────────────────────────
  const selectedSales = useMemo(
    () => sales.filter(s => selectedRows.has(s._id)),
    [sales, selectedRows]
  )

  const handleBulkViewDetails = () => {
    if (selectedSales.length === 1) handleViewDetails(selectedSales[0])
  }

  const handleBulkEdit = () => {
    if (selectedSales.length === 1) handleEdit(selectedSales[0])
  }

  const handleBulkPrint = () => console.log('Bulk Print:', selectedSales)
  const handleBulkExport = () => console.log('Bulk Export:', selectedSales)
  const handleBulkSendInvoice = () => console.log('Bulk Send Invoice:', selectedSales)
  const handleBulkReminders = () => console.log('Bulk Reminders:', selectedSales)
  const handleBulkDelete = () => console.log('Bulk Delete:', selectedSales)
  const handleClearSelection = () => setSelectedRows(new Set())

  // ── Row Actions ───────────────────────────
  const rowActions = useMemo(
    () => getSalesRowActions(
      handleViewDetails,
      handleEdit,
      handleAddPayment,
      handleDeliver,
      handleComplete,
      handleReturn,
      handleCancel,
      handlePrint,
      handleDelete
    ),
    [shopId]
  )

  // ── RENDER ────────────────────────────────
  return (
    <div className="w-full space-y-4">
<SalesFilters
  filters={filters}
  onFiltersChange={handleFiltersChange}
  onClearAll={handleClearAllFilters}
  customers={customers}
  salesPersons={[]}     // ← abhi empty rakhdo
/>

      {selectedRows.size > 0 && (
        <BulkActionsBar
          selectedCount={selectedRows.size}
          selectedSales={selectedSales}
          onViewDetails={handleBulkViewDetails}
          onEdit={handleBulkEdit}
          onBulkPrint={handleBulkPrint}
          onBulkExport={handleBulkExport}
          onBulkSendInvoice={handleBulkSendInvoice}
          onBulkReminders={handleBulkReminders}
          onBulkDelete={handleBulkDelete}
          onClearSelection={handleClearSelection}
        />
      )}

<DataTable
  data={sales}
  columns={salesTableColumns}
  loading={{ isLoading: isLoading }}
  sorting={{ enabled: true }}
  pagination={{
    enabled: true,
    pageSize: pagination.limit,
    pageSizeOptions: [10, 20, 50, 100],
    showPageSizeSelector: true,
    showPageInfo: true,
    showFirstLastButtons: true,
    pageIndex: pagination.page - 1,        // ← currentPage nahi, pageIndex
    totalItems: pagination.total,
    onPaginationChange: (newPagination) => {  // ← onPageChange nahi, onPaginationChange
      setPage(newPagination.pageIndex + 1)   // ← 0-indexed to 1-indexed
    },
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
        emptyState={{ message: t('table.noSales') }}
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
        onRowClick={sale => handleViewDetails(sale)}
        getRowId={row => row._id}
        testId="sales-table"
        ariaLabel={t('table.ariaLabel')}
      />
    </div>
  )
}

SalesTable.displayName = 'SalesTable'