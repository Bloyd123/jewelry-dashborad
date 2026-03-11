// FILE: src/features/purchase/utils/purchaseUtils.ts
// Purchase Module Utility Functions

import type {
  IPurchase,
  IPurchaseItem,
  IFinancials,
  PurchaseStatus,
  PaymentStatus,
  PurchaseType,
} from '@/types/purchase.types'

/**
 * 🎯 FINANCIAL CALCULATIONS
 */

/**
 * Calculate item total from components
 */
export const calculateItemTotal = (item: Partial<IPurchaseItem>): number => {
  const netWeight = (item.grossWeight || 0) - (item.stoneWeight || 0)
  const metalValue = netWeight * (item.ratePerGram || 0)
  const taxableAmount =
    metalValue +
    (item.stoneCharges || 0) +
    (item.makingCharges || 0) +
    (item.otherCharges || 0)

  // GST calculation (typically 3% for gold/silver)
  const gstAmount = taxableAmount * 0.03
  const itemTotal = (taxableAmount + gstAmount) * (item.quantity || 1)

  return Math.round(itemTotal * 100) / 100
}

/**
 * Calculate purchase financials from items
 */
export const calculatePurchaseFinancials = (
  items: IPurchaseItem[]
): IFinancials => {
  let subtotal = 0
  let cgst = 0
  let sgst = 0
  let igst = 0

  items.forEach(item => {
    const netWeight = item.grossWeight - item.stoneWeight
    const metalValue = netWeight * item.ratePerGram
    const itemSubtotal =
      (metalValue + item.stoneCharges + item.makingCharges + item.otherCharges) *
      item.quantity

    subtotal += itemSubtotal

    // GST calculation (assuming 3% for jewelry)
    const gstAmount = itemSubtotal * 0.03
    cgst += gstAmount / 2
    sgst += gstAmount / 2
  })

  const totalGst = cgst + sgst + igst
  const rawTotal = subtotal + totalGst
  const grandTotal = Math.round(rawTotal)
  const roundOff = grandTotal - rawTotal

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
    igst: Math.round(igst * 100) / 100,
    totalGst: Math.round(totalGst * 100) / 100,
    roundOff: Math.round(roundOff * 100) / 100,
    grandTotal,
    totalPaid: 0,
    totalDue: grandTotal,
  }
}

/**
 * Calculate net weight from gross and stone weight
 */
export const calculateNetWeight = (
  grossWeight: number,
  stoneWeight: number
): number => {
  return Math.max(0, grossWeight - stoneWeight)
}

/**
 * Format currency (Indian Rupee)
 */
export const formatCurrency = (
  amount: number,
  showSymbol: boolean = true
): string => {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)

  return formatted
}

/**
 * Format weight with unit
 */
export const formatWeight = (
  weight: number,
  unit: string = 'gram'
): string => {
  return `${weight.toFixed(3)} ${unit}`
}

/**
 * 🎯 STATUS UTILITIES
 */

/**
 * Get status color class
 */
export const getStatusColor = (status: PurchaseStatus): string => {
  const statusColors: Record<PurchaseStatus, string> = {
    draft: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    ordered: 'bg-blue-100 text-blue-800',
    received: 'bg-green-100 text-green-800',
    partial_received: 'bg-orange-100 text-orange-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    returned: 'bg-purple-100 text-purple-800',
  }

  return statusColors[status] || 'bg-gray-100 text-gray-800'
}

/**
 * Get payment status color class
 */
export const getPaymentStatusColor = (status: PaymentStatus): string => {
  const statusColors: Record<PaymentStatus, string> = {
    paid: 'bg-green-100 text-green-800',
    partial: 'bg-yellow-100 text-yellow-800',
    unpaid: 'bg-red-100 text-red-800',
    overdue: 'bg-red-200 text-red-900',
  }

  return statusColors[status] || 'bg-gray-100 text-gray-800'
}

/**
 * Get status label
 */
export const getStatusLabel = (status: PurchaseStatus): string => {
  const statusLabels: Record<PurchaseStatus, string> = {
    draft: 'Draft',
    pending: 'Pending',
    ordered: 'Ordered',
    received: 'Received',
    partial_received: 'Partially Received',
    completed: 'Completed',
    cancelled: 'Cancelled',
    returned: 'Returned',
  }

  return statusLabels[status] || status
}

/**
 * Get payment status label
 */
export const getPaymentStatusLabel = (status: PaymentStatus): string => {
  const statusLabels: Record<PaymentStatus, string> = {
    paid: 'Paid',
    partial: 'Partially Paid',
    unpaid: 'Unpaid',
    overdue: 'Overdue',
  }

  return statusLabels[status] || status
}

/**
 * Check if purchase can be edited
 */
export const canEditPurchase = (status: PurchaseStatus): boolean => {
  return ['draft', 'pending'].includes(status)
}

/**
 * Check if purchase can be deleted
 */
export const canDeletePurchase = (status: PurchaseStatus): boolean => {
  return status === 'draft'
}

/**
 * Check if purchase can be received
 */
export const canReceivePurchase = (status: PurchaseStatus): boolean => {
  return ['pending', 'ordered'].includes(status)
}

/**
 * Check if purchase can be cancelled
 */
export const canCancelPurchase = (status: PurchaseStatus): boolean => {
  return !['completed', 'cancelled', 'returned'].includes(status)
}

/**
 * 🎯 DATE UTILITIES
 */

/**
 * Format date for display
 */
export const formatDate = (
  date: Date | string,
  format: 'short' | 'long' | 'full' = 'short'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  const options: Intl.DateTimeFormatOptions = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
    full: {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  }[format]

  return new Intl.DateFormat('en-IN', options).format(dateObj)
}

/**
 * Check if payment is overdue
 */
export const isPaymentOverdue = (
  dueDate?: Date | string,
  paymentStatus?: PaymentStatus
): boolean => {
  if (!dueDate || paymentStatus === 'paid') return false

  const dueDateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
  return dueDateObj < new Date()
}

/**
 * Get days until due date
 */
export const getDaysUntilDue = (dueDate?: Date | string): number | null => {
  if (!dueDate) return null

  const dueDateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
  const today = new Date()
  const diffTime = dueDateObj.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

/**
 * 🎯 VALIDATION UTILITIES
 */

/**
 * Validate purchase item
 */
export const validatePurchaseItem = (
  item: Partial<IPurchaseItem>
): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!item.productName?.trim()) {
    errors.push('Product name is required')
  }

  if (!item.metalType) {
    errors.push('Metal type is required')
  }

  if (!item.purity?.trim()) {
    errors.push('Purity is required')
  }

  if (!item.grossWeight || item.grossWeight <= 0) {
    errors.push('Gross weight must be greater than 0')
  }

  if (item.stoneWeight && item.stoneWeight < 0) {
    errors.push('Stone weight cannot be negative')
  }

  if (item.stoneWeight && item.grossWeight && item.stoneWeight > item.grossWeight) {
    errors.push('Stone weight cannot exceed gross weight')
  }

  if (!item.quantity || item.quantity < 1) {
    errors.push('Quantity must be at least 1')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Validate payment amount
 */
export const validatePaymentAmount = (
  amount: number,
  dueAmount: number
): { valid: boolean; error?: string } => {
  if (amount <= 0) {
    return { valid: false, error: 'Payment amount must be greater than 0' }
  }

  if (amount > dueAmount) {
    return {
      valid: false,
      error: 'Payment amount cannot exceed due amount',
    }
  }

  return { valid: true }
}

/**
 * 🎯 FILTERING UTILITIES
 */

/**
 * Filter purchases by status
 */
export const filterByStatus = (
  purchases: IPurchase[],
  status: PurchaseStatus
): IPurchase[] => {
  return purchases.filter(p => p.status === status)
}

/**
 * Filter purchases by payment status
 */
export const filterByPaymentStatus = (
  purchases: IPurchase[],
  paymentStatus: PaymentStatus
): IPurchase[] => {
  return purchases.filter(p => p.payment.paymentStatus === paymentStatus)
}

/**
 * Filter purchases by date range
 */
export const filterByDateRange = (
  purchases: IPurchase[],
  startDate: Date,
  endDate: Date
): IPurchase[] => {
  return purchases.filter(p => {
    const purchaseDate = new Date(p.purchaseDate)
    return purchaseDate >= startDate && purchaseDate <= endDate
  })
}

/**
 * Search purchases by term
 */
export const searchPurchases = (
  purchases: IPurchase[],
  searchTerm: string
): IPurchase[] => {
  const term = searchTerm.toLowerCase().trim()

  if (!term) return purchases

  return purchases.filter(
    p =>
      p.purchaseNumber.toLowerCase().includes(term) ||
      p.supplierDetails.supplierName.toLowerCase().includes(term) ||
      p.items.some(item => item.productName.toLowerCase().includes(term))
  )
}

/**
 * 🎯 SORTING UTILITIES
 */

/**
 * Sort purchases by date
 */
export const sortByDate = (
  purchases: IPurchase[],
  order: 'asc' | 'desc' = 'desc'
): IPurchase[] => {
  return [...purchases].sort((a, b) => {
    const dateA = new Date(a.purchaseDate).getTime()
    const dateB = new Date(b.purchaseDate).getTime()
    return order === 'desc' ? dateB - dateA : dateA - dateB
  })
}

/**
 * Sort purchases by amount
 */
export const sortByAmount = (
  purchases: IPurchase[],
  order: 'asc' | 'desc' = 'desc'
): IPurchase[] => {
  return [...purchases].sort((a, b) => {
    const amountA = a.financials.grandTotal
    const amountB = b.financials.grandTotal
    return order === 'desc' ? amountB - amountA : amountA - amountB
  })
}

/**
 * 🎯 AGGREGATION UTILITIES
 */

/**
 * Calculate total purchase value
 */
export const calculateTotalPurchaseValue = (purchases: IPurchase[]): number => {
  return purchases.reduce((sum, p) => sum + p.financials.grandTotal, 0)
}

/**
 * Calculate total due amount
 */
export const calculateTotalDueAmount = (purchases: IPurchase[]): number => {
  return purchases.reduce((sum, p) => sum + p.payment.dueAmount, 0)
}

/**
 * Calculate total paid amount
 */
export const calculateTotalPaidAmount = (purchases: IPurchase[]): number => {
  return purchases.reduce((sum, p) => sum + p.payment.paidAmount, 0)
}

/**
 * Get purchase statistics
 */
export const getPurchaseStatistics = (purchases: IPurchase[]) => {
  const total = purchases.length
  const totalValue = calculateTotalPurchaseValue(purchases)
  const totalDue = calculateTotalDueAmount(purchases)
  const totalPaid = calculateTotalPaidAmount(purchases)

  const byStatus = purchases.reduce(
    (acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1
      return acc
    },
    {} as Record<PurchaseStatus, number>
  )

  const byPaymentStatus = purchases.reduce(
    (acc, p) => {
      acc[p.payment.paymentStatus] = (acc[p.payment.paymentStatus] || 0) + 1
      return acc
    },
    {} as Record<PaymentStatus, number>
  )

  return {
    total,
    totalValue,
    totalDue,
    totalPaid,
    averageValue: total > 0 ? totalValue / total : 0,
    byStatus,
    byPaymentStatus,
  }
}

/**
 * 🎯 EXPORT UTILITIES
 */

/**
 * Prepare purchase data for CSV export
 */
export const preparePurchaseForCSV = (purchase: IPurchase) => {
  return {
    'Purchase Number': purchase.purchaseNumber,
    'Purchase Date': formatDate(purchase.purchaseDate),
    'Supplier Name': purchase.supplierDetails.supplierName,
    'Supplier Code': purchase.supplierDetails.supplierCode || '',
    'Purchase Type': purchase.purchaseType,
    Status: getStatusLabel(purchase.status),
    'Total Items': purchase.items.length,
    'Subtotal': purchase.financials.subtotal,
    'Total GST': purchase.financials.totalGst,
    'Grand Total': purchase.financials.grandTotal,
    'Paid Amount': purchase.payment.paidAmount,
    'Due Amount': purchase.payment.dueAmount,
    'Payment Status': getPaymentStatusLabel(purchase.payment.paymentStatus),
  }
}

/**
 * Prepare multiple purchases for CSV export
 */
export const preparePurchasesForCSV = (purchases: IPurchase[]) => {
  return purchases.map(preparePurchaseForCSV)
}

/**
 * 🎯 PRINT UTILITIES
 */

/**
 * Format purchase for printing
 */
export const formatPurchaseForPrint = (purchase: IPurchase) => {
  return {
    header: {
      purchaseNumber: purchase.purchaseNumber,
      purchaseDate: formatDate(purchase.purchaseDate, 'long'),
      status: getStatusLabel(purchase.status),
    },
    supplier: {
      name: purchase.supplierDetails.supplierName,
      code: purchase.supplierDetails.supplierCode,
      contact: purchase.supplierDetails.phone,
      email: purchase.supplierDetails.email,
      address: purchase.supplierDetails.address,
      gst: purchase.supplierDetails.gstNumber,
    },
    items: purchase.items.map(item => ({
      name: item.productName,
      metalType: item.metalType,
      purity: item.purity,
      grossWeight: formatWeight(item.grossWeight),
      stoneWeight: formatWeight(item.stoneWeight),
      netWeight: formatWeight(item.netWeight),
      quantity: item.quantity,
      rate: formatCurrency(item.ratePerGram),
      total: formatCurrency(item.itemTotal),
    })),
    financials: {
      subtotal: formatCurrency(purchase.financials.subtotal),
      cgst: formatCurrency(purchase.financials.cgst),
      sgst: formatCurrency(purchase.financials.sgst),
      totalGst: formatCurrency(purchase.financials.totalGst),
      roundOff: formatCurrency(purchase.financials.roundOff),
      grandTotal: formatCurrency(purchase.financials.grandTotal),
    },
    payment: {
      paidAmount: formatCurrency(purchase.payment.paidAmount),
      dueAmount: formatCurrency(purchase.payment.dueAmount),
      paymentStatus: getPaymentStatusLabel(purchase.payment.paymentStatus),
    },
  }
}

/**
 * 🎯 PURCHASE TYPE UTILITIES
 */

/**
 * Get purchase type label
 */
export const getPurchaseTypeLabel = (type: PurchaseType): string => {
  const typeLabels: Record<PurchaseType, string> = {
    new_stock: 'New Stock',
    old_gold: 'Old Gold',
    exchange: 'Exchange',
    consignment: 'Consignment',
    repair_return: 'Repair Return',
    sample: 'Sample',
  }

  return typeLabels[type] || type
}

/**
 * Get purchase type color
 */
export const getPurchaseTypeColor = (type: PurchaseType): string => {
  const typeColors: Record<PurchaseType, string> = {
    new_stock: 'bg-blue-100 text-blue-800',
    old_gold: 'bg-yellow-100 text-yellow-800',
    exchange: 'bg-purple-100 text-purple-800',
    consignment: 'bg-green-100 text-green-800',
    repair_return: 'bg-orange-100 text-orange-800',
    sample: 'bg-pink-100 text-pink-800',
  }

  return typeColors[type] || 'bg-gray-100 text-gray-800'
}