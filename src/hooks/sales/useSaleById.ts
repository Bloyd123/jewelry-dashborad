// FILE: src/features/sales/hooks/useSaleById.ts

import {
  useGetSaleByIdQuery,
  useGetSalePaymentsQuery,
  useGetReturnDetailsQuery,
  useGetSaleDocumentsQuery,
  useGenerateReceiptQuery,
} from '@/store/api/salesApi'

export const useSaleById = (shopId: string, saleId: string) => {
  // ─── Sale Detail ──────────────────────────
  const {
    data: sale,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetSaleByIdQuery(
    { shopId, saleId },
    { skip: !saleId }
  )

  // ─── Payments for this sale ───────────────
  const {
    data: payments,
    isLoading: isPaymentsLoading,
    refetch: refetchPayments,
  } = useGetSalePaymentsQuery(
    { shopId, saleId },
    { skip: !saleId }
  )

  // ─── Return Details ───────────────────────
  const {
    data: returnDetails,
    isLoading: isReturnLoading,
  } = useGetReturnDetailsQuery(
    { shopId, saleId },
    { skip: !saleId }
  )

  // ─── Documents ────────────────────────────
  const {
    data: documents,
    isLoading: isDocumentsLoading,
    refetch: refetchDocuments,
  } = useGetSaleDocumentsQuery(
    { shopId, saleId },
    { skip: !saleId }
  )

  // ─── Receipt ─────────────────────────────
  const {
    data: receipt,
    isLoading: isReceiptLoading,
  } = useGenerateReceiptQuery(
    { shopId, saleId },
    { skip: !saleId }
  )

  return {
    // ── Data ──────────────────────────────
    sale,
    payments:      payments      || [],
    returnDetails: returnDetails || null,
    documents:     documents     || [],
    receipt:       receipt       || null,

    // ── Computed ──────────────────────────
    isReturned:    sale?.return?.isReturned   || false,
    hasOldGold:    sale?.oldGoldExchange?.hasExchange || false,
    isPaid:        sale?.payment?.paymentStatus === 'paid',
    isOverdue:     sale?.payment?.paymentStatus === 'overdue',
    isDraft:       sale?.status === 'draft',
    isCancelled:   sale?.status === 'cancelled',
    isCompleted:   sale?.status === 'completed',

    // ── Loading States ────────────────────
    isLoading:          isLoading || isFetching,
    isPaymentsLoading,
    isReturnLoading,
    isDocumentsLoading,
    isReceiptLoading,

    // ── Utils ─────────────────────────────
    refetch,
    refetchPayments,
    refetchDocuments,
    error,
  }
}