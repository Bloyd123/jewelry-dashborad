// FILE: src/features/purchase/hooks/usePurchasePayments.ts
// Purchase Module - Payment Management Hook

import { useGetPaymentsQuery } from '@/store/api/purchaseApi'
import { useMemo } from 'react'
import type { IPaymentRecord } from '@/types/purchase.types'

/**
 * 🎯 PURCHASE PAYMENTS HOOK
 * Get all payments for a specific purchase
 */
export const usePurchasePayments = (shopId: string, purchaseId: string) => {
  const {
    data: payments,
    isLoading,
    error,
    refetch,
  } = useGetPaymentsQuery(
    { shopId, purchaseId },
    { skip: !purchaseId }
  )

  // Calculate payment statistics
  const paymentStats = useMemo(() => {
    if (!payments || payments.length === 0) {
      return {
        totalPayments: 0,
        totalPaid: 0,
        lastPaymentDate: null,
        lastPaymentAmount: 0,
        paymentModes: [],
      }
    }

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)
    const lastPayment = payments[payments.length - 1]

    // Count payment modes
    const modeCount = payments.reduce((acc, p) => {
      acc[p.paymentMode] = (acc[p.paymentMode] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const paymentModes = Object.entries(modeCount).map(([mode, count]) => ({
      mode,
      count,
    }))

    return {
      totalPayments: payments.length,
      totalPaid,
      lastPaymentDate: lastPayment?.paymentDate || null,
      lastPaymentAmount: lastPayment?.amount || 0,
      paymentModes,
    }
  }, [payments])

  return {
    payments: payments || [],
    paymentStats,
    isLoading,
    error,
    refetch,
  }
}

/**
 * 🎯 PAYMENT HISTORY HOOK
 * Get payment history with sorting and filtering
 */
export const usePaymentHistory = (
  shopId: string,
  purchaseId: string,
  options?: {
    sortBy?: 'date' | 'amount'
    sortOrder?: 'asc' | 'desc'
    paymentMode?: string
  }
) => {
  const { payments, isLoading, error, refetch } = usePurchasePayments(
    shopId,
    purchaseId
  )

  const filteredPayments = useMemo(() => {
    let result = [...payments]

    // Filter by payment mode
    if (options?.paymentMode) {
      result = result.filter(p => p.paymentMode === options.paymentMode)
    }

    // Sort
    const sortBy = options?.sortBy || 'date'
    const sortOrder = options?.sortOrder || 'desc'

    result.sort((a, b) => {
      let comparison = 0

      if (sortBy === 'date') {
        const dateA = new Date(a.paymentDate).getTime()
        const dateB = new Date(b.paymentDate).getTime()
        comparison = dateA - dateB
      } else if (sortBy === 'amount') {
        comparison = a.amount - b.amount
      }

      return sortOrder === 'desc' ? -comparison : comparison
    })

    return result
  }, [payments, options])

  return {
    payments: filteredPayments,
    isLoading,
    error,
    refetch,
  }
}

/**
 * 🎯 PAYMENT SUMMARY HOOK
 * Quick payment summary for a purchase
 */
export const usePaymentSummary = (shopId: string, purchaseId: string) => {
  const { payments, paymentStats, isLoading } = usePurchasePayments(
    shopId,
    purchaseId
  )

  const summary = useMemo(() => {
    if (!payments || payments.length === 0) return null

    // Group by payment mode
    const byMode = payments.reduce((acc, payment) => {
      if (!acc[payment.paymentMode]) {
        acc[payment.paymentMode] = {
          mode: payment.paymentMode,
          count: 0,
          total: 0,
        }
      }
      acc[payment.paymentMode].count += 1
      acc[payment.paymentMode].total += payment.amount
      return acc
    }, {} as Record<string, { mode: string; count: number; total: number }>)

    return {
      totalPayments: paymentStats.totalPayments,
      totalAmount: paymentStats.totalPaid,
      lastPayment: {
        date: paymentStats.lastPaymentDate,
        amount: paymentStats.lastPaymentAmount,
      },
      byMode: Object.values(byMode),
    }
  }, [payments, paymentStats])

  return {
    summary,
    isLoading,
  }
}

/**
 * 🎯 RECENT PAYMENTS HOOK
 * Get most recent payments across all purchases
 */
export const useRecentPayments = (
  shopId: string,
  purchaseId: string,
  limit: number = 5
) => {
  const { payments, isLoading, error } = usePurchasePayments(shopId, purchaseId)

  const recentPayments = useMemo(() => {
    if (!payments) return []

    return [...payments]
      .sort(
        (a, b) =>
          new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
      )
      .slice(0, limit)
  }, [payments, limit])

  return {
    recentPayments,
    isLoading,
    error,
  }
}

/**
 * 🎯 PAYMENT MODE ANALYTICS HOOK
 * Analyze payment mode usage
 */
export const usePaymentModeAnalytics = (shopId: string, purchaseId: string) => {
  const { payments, isLoading } = usePurchasePayments(shopId, purchaseId)

  const analytics = useMemo(() => {
    if (!payments || payments.length === 0) return null

    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)

    const modeAnalytics = payments.reduce((acc, payment) => {
      if (!acc[payment.paymentMode]) {
        acc[payment.paymentMode] = {
          mode: payment.paymentMode,
          count: 0,
          totalAmount: 0,
          percentage: 0,
        }
      }

      acc[payment.paymentMode].count += 1
      acc[payment.paymentMode].totalAmount += payment.amount

      return acc
    }, {} as Record<string, { mode: string; count: number; totalAmount: number; percentage: number }>)

    // Calculate percentages
    Object.values(modeAnalytics).forEach(item => {
      item.percentage = totalAmount > 0 ? (item.totalAmount / totalAmount) * 100 : 0
    })

    // Sort by amount
    const sorted = Object.values(modeAnalytics).sort(
      (a, b) => b.totalAmount - a.totalAmount
    )

    return {
      byMode: sorted,
      mostUsedMode: sorted[0]?.mode || null,
      totalModes: sorted.length,
    }
  }, [payments])

  return {
    analytics,
    isLoading,
  }
}

/**
 * 🎯 PAYMENT VALIDATION HOOK
 * Validate payment details before submission
 */
export const usePaymentValidation = (
  shopId: string,
  purchaseId: string,
  totalAmount: number,
  paidAmount: number
) => {
  const dueAmount = totalAmount - paidAmount

  const validatePayment = (amount: number) => {
    const errors: string[] = []

    if (amount <= 0) {
      errors.push('Payment amount must be greater than 0')
    }

    if (amount > dueAmount) {
      errors.push(
        `Payment amount cannot exceed due amount of ₹${dueAmount.toFixed(2)}`
      )
    }

    return {
      isValid: errors.length === 0,
      errors,
      maxAllowedAmount: dueAmount,
    }
  }

  return {
    dueAmount,
    validatePayment,
    canAddPayment: dueAmount > 0,
  }
}

/**
 * 🎯 PAYMENT TIMELINE HOOK
 * Get chronological payment timeline
 */
export const usePaymentTimeline = (shopId: string, purchaseId: string) => {
  const { payments, isLoading } = usePurchasePayments(shopId, purchaseId)

  const timeline = useMemo(() => {
    if (!payments) return []

    let runningTotal = 0

    return payments
      .sort(
        (a, b) =>
          new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime()
      )
      .map((payment, index) => {
        runningTotal += payment.amount

        return {
          ...payment,
          sequence: index + 1,
          runningTotal,
        }
      })
  }, [payments])

  return {
    timeline,
    isLoading,
  }
}

export default usePurchasePayments