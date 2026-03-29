// FILE: src/features/sales/hooks/useSalesList.ts

import { useState } from 'react'
import {
  useGetSalesQuery,
  useGetTodaySalesQuery,
  useGetPendingSalesQuery,
  useGetUnpaidSalesQuery,
  useGetOverdueSalesQuery,
  useGetCustomerSalesQuery,
  useGetSalesPersonSalesQuery,
  useGetSalesByDateRangeQuery,
  useGetSalesByAmountRangeQuery,
  useBulkDeleteSalesMutation,
  useBulkPrintInvoicesMutation,
  useBulkSendRemindersMutation,
} from '@/store/api/salesApi'
import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import type { SalesFilters, SaleStatus, PaymentStatus, SaleType } from '@/types/sale.types'

export const useSalesList = (shopId: string, initialFilters?: Partial<SalesFilters>) => {
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()

  // ─── Local Filter State ───────────────────
  const [filters, setFilters] = useState<SalesFilters>({
    page: 1,
    limit: 10,
    ...initialFilters,
  })

  // ─── Main Sales List ──────────────────────
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetSalesQuery({ shopId, ...filters })

  // ─── Today / Pending / Unpaid / Overdue ──
  const { data: todaySales, isLoading: isTodayLoading } =
    useGetTodaySalesQuery({ shopId })

  const { data: pendingSales, isLoading: isPendingLoading } =
    useGetPendingSalesQuery({ shopId })

  const { data: unpaidSales, isLoading: isUnpaidLoading } =
    useGetUnpaidSalesQuery({ shopId })

  const { data: overdueSales, isLoading: isOverdueLoading } =
    useGetOverdueSalesQuery({ shopId })

  // ─── Bulk Operations ─────────────────────
  const [bulkDeleteMutation, bulkDeleteState] = useBulkDeleteSalesMutation()
  const [bulkPrintMutation,  bulkPrintState]  = useBulkPrintInvoicesMutation()
  const [bulkReminderMutation, bulkReminderState] = useBulkSendRemindersMutation()

  // ─── Filter Helpers ───────────────────────
  const setPage  = (page: number)              => setFilters((f) => ({ ...f, page }))
  const setLimit = (limit: number)             => setFilters((f) => ({ ...f, limit, page: 1 }))
  const setSearch = (search: string)           => setFilters((f) => ({ ...f, search, page: 1 }))
  const setStatus = (status: SaleStatus | '')  => setFilters((f) => ({ ...f, status: status || undefined, page: 1 }))
  const setPaymentStatus = (paymentStatus: PaymentStatus | '') =>
    setFilters((f) => ({ ...f, paymentStatus: paymentStatus || undefined, page: 1 }))
  const setSaleType = (saleType: SaleType | '') =>
    setFilters((f) => ({ ...f, saleType: saleType || undefined, page: 1 }))
  const setDateRange = (startDate: string, endDate: string) =>
    setFilters((f) => ({ ...f, startDate, endDate, page: 1 }))
  const setAmountRange = (minAmount: number, maxAmount: number) =>
    setFilters((f) => ({ ...f, minAmount, maxAmount, page: 1 }))
  const resetFilters = () =>
    setFilters({ page: 1, limit: filters.limit })

  // ─── Bulk Delete ─────────────────────────
  const bulkDelete = async (saleIds: string[], reason: string) => {
    try {
      const result = await bulkDeleteMutation({ shopId, saleIds, reason }).unwrap()
      showSuccess(`${result.deletedCount} sales deleted successfully`, 'Bulk Delete')
      return { success: true, data: result }
    } catch (error: any) {
      handleError(error)
      return { success: false }
    }
  }

  // ─── Bulk Print ──────────────────────────
  const bulkPrint = async (saleIds: string[]) => {
    try {
      const blob = await bulkPrintMutation({ shopId, saleIds }).unwrap()
      // Download the PDF
      const url = URL.createObjectURL(blob)
      const a   = document.createElement('a')
      a.href    = url
      a.download = 'bulk-invoices.pdf'
      a.click()
      URL.revokeObjectURL(url)
      return { success: true }
    } catch (error: any) {
      handleError(error)
      return { success: false }
    }
  }

  // ─── Bulk Reminders ──────────────────────
  const bulkSendReminders = async (
    saleIds: string[],
    method: 'email' | 'sms' | 'whatsapp'
  ) => {
    try {
      const result = await bulkReminderMutation({ shopId, saleIds, method }).unwrap()
      showSuccess(`Reminders sent to ${result.sentCount} customers`, 'Reminders Sent')
      return { success: true, data: result }
    } catch (error: any) {
      handleError(error)
      return { success: false }
    }
  }

  return {
    // ── Data ──────────────────────────────
    sales:      data?.data?.sales      || [],
    total:      data?.data?.total      || 0,
    pagination: {
      page:     data?.data?.page       || 1,
      limit:    data?.data?.limit      || 10,
      total:    data?.data?.total      || 0,
      pages:    Math.ceil((data?.data?.total || 0) / (data?.data?.limit || 10)),
      hasNext:  (data?.data?.page || 1) < Math.ceil((data?.data?.total || 0) / (data?.data?.limit || 10)),
      hasPrev:  (data?.data?.page || 1) > 1,
    },

    // ── Filtered Lists ────────────────────
    todaySales:   todaySales   || [],
    pendingSales: pendingSales || [],
    unpaidSales:  unpaidSales  || [],
    overdueSales: overdueSales || [],

    // ── Loading States ────────────────────
    isLoading:        isLoading || isFetching,
    isTodayLoading,
    isPendingLoading,
    isUnpaidLoading,
    isOverdueLoading,
    isBulkDeleting:   bulkDeleteState.isLoading,
    isBulkPrinting:   bulkPrintState.isLoading,
    isBulkReminding:  bulkReminderState.isLoading,

    // ── Filters ───────────────────────────
    filters,
    setPage,
    setLimit,
    setSearch,
    setStatus,
    setPaymentStatus,
    setSaleType,
    setDateRange,
    setAmountRange,
    resetFilters,

    // ── Bulk Actions ──────────────────────
    bulkDelete,
    bulkPrint,
    bulkSendReminders,

    // ── Utils ─────────────────────────────
    refetch,
    error,
  }
}