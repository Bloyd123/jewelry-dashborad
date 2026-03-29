// FILE: src/features/payment/hooks/usePaymentById.ts

import {
  useGetPaymentByIdQuery,
  useGetReceiptQuery,
  useGetPartyPaymentSummaryQuery,
} from '@/store/api/paymentApi'

// ─────────────────────────────────────────────
// SINGLE PAYMENT
// ─────────────────────────────────────────────
export const usePaymentById = (shopId: string, paymentId: string) => {
  const { data: payment, isLoading, error, refetch } = useGetPaymentByIdQuery(
    { shopId, paymentId },
    { skip: !shopId || !paymentId }
  )

  return {
    payment,
    isLoading,
    error,
    refetch,
    // Computed helpers
    isPending:   payment?.status === 'pending',
    isCompleted: payment?.status === 'completed',
    isFailed:    payment?.status === 'failed',
    isCancelled: payment?.status === 'cancelled',
    isRefunded:  payment?.status === 'refunded',
    isCheque:    payment?.paymentMode === 'cheque',
    isReceipt:   payment?.transactionType === 'receipt',
    isPayment:   payment?.transactionType === 'payment',
  }
}

// ─────────────────────────────────────────────
// RECEIPT
// ─────────────────────────────────────────────
export const usePaymentReceipt = (shopId: string, paymentId: string) => {
  const { data: receipt, isLoading, error, refetch } = useGetReceiptQuery(
    { shopId, paymentId },
    { skip: !shopId || !paymentId }
  )

  return {
    receipt,
    isLoading,
    error,
    refetch,
    isGenerated: receipt?.receipt?.receiptGenerated ?? false,
    receiptUrl:  receipt?.receipt?.receiptUrl,
  }
}

// ─────────────────────────────────────────────
// PARTY PAYMENT SUMMARY
// ─────────────────────────────────────────────
export const usePartyPaymentSummary = (shopId: string, partyId: string) => {
  const { data: summary, isLoading, error, refetch } = useGetPartyPaymentSummaryQuery(
    { shopId, partyId },
    { skip: !shopId || !partyId }
  )

  return {
    summary,
    isLoading,
    error,
    refetch,
    totalReceived: summary?.totalReceived ?? 0,
    totalPaid:     summary?.totalPaid     ?? 0,
    totalPending:  summary?.totalPending  ?? 0,
    netBalance:    (summary?.totalReceived ?? 0) - (summary?.totalPaid ?? 0),
  }
}