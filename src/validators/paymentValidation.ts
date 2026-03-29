// FILE: src/validations/paymentValidation.ts
// Payment Module - Zod Validation Schemas
// Mirrors backend express-validator rules exactly

import { z } from 'zod'

// ─────────────────────────────────────────────
// ENUMS (match backend exactly)
// ─────────────────────────────────────────────

export const PaymentTypeEnum = z.enum([
  'sale_payment',
  'purchase_payment',
  'scheme_payment',
  'advance_payment',
  'refund',
  'other',
])

export const TransactionTypeEnum = z.enum(['receipt', 'payment'])

export const PaymentModeEnum = z.enum([
  'cash',
  'card',
  'upi',
  'cheque',
  'bank_transfer',
  'wallet',
  'other',
])

export const PaymentStatusEnum = z.enum([
  'pending',
  'completed',
  'failed',
  'cancelled',
  'refunded',
])

export const PartyTypeEnum = z.enum(['customer', 'supplier', 'other'])

export const ReferenceTypeEnum = z.enum([
  'sale',
  'purchase',
  'scheme_enrollment',
  'order',
  'none',
])

export const ChequeStatusEnum = z.enum(['pending', 'cleared', 'bounced', 'cancelled'])

export const ReceiptMethodEnum = z.enum(['email', 'sms', 'whatsapp'])

export const ExportFormatEnum = z.enum(['excel', 'csv'])

export const GroupByEnum = z.enum(['day', 'week', 'month'])

export const CardTypeEnum = z.enum(['credit', 'debit'])

export const CardNetworkEnum = z.enum(['visa', 'mastercard', 'rupay', 'amex', 'other'])

export const UpiAppEnum = z.enum(['gpay', 'phonepe', 'paytm', 'bhim', 'other'])

export const WalletProviderEnum = z.enum(['paytm', 'phonepe', 'mobikwik', 'other'])

export const BankTransferTypeEnum = z.enum(['neft', 'rtgs', 'imps', 'other'])

// ─────────────────────────────────────────────
// REUSABLE FIELD SCHEMAS
// ─────────────────────────────────────────────

const mongoId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID')

const indianPhone = z
  .string()
  .trim()
  .regex(/^[6-9][0-9]{9}$/, 'Invalid phone number (must be 10 digits starting with 6-9)')

const email = z
  .string()
  .trim()
  .email('Invalid email address')

const isoDate = z
  .string()
  .refine((v) => !isNaN(Date.parse(v)), 'Invalid date format')

const positiveAmount = z
  .number()
  .min(0.01, 'Amount must be greater than 0')

const optionalNotes = z
  .string()
  .trim()
  .max(1000, 'Notes cannot exceed 1000 characters')
  .optional()
  .or(z.literal(''))

const shortNotes = z
  .string()
  .trim()
  .max(500, 'Notes cannot exceed 500 characters')
  .optional()
  .or(z.literal(''))

// ─────────────────────────────────────────────
// PAYMENT DETAILS SUB-SCHEMAS
// ─────────────────────────────────────────────

const cashDetailsSchema = z
  .object({
    receivedAmount: z.number().min(0).optional(),
    returnAmount:   z.number().min(0).optional(),
  })
  .optional()

const cardDetailsSchema = z
  .object({
    cardType:          CardTypeEnum.optional(),
    cardNetwork:       CardNetworkEnum.optional(),
    last4Digits:       z
      .string()
      .regex(/^[0-9]{4}$/, 'Last 4 digits must be exactly 4 numbers')
      .optional()
      .or(z.literal('')),
    authorizationCode: z.string().trim().optional(),
    terminalId:        z.string().trim().optional(),
    merchantId:        z.string().trim().optional(),
    bankName:          z.string().trim().optional(),
  })
  .optional()

const upiDetailsSchema = z
  .object({
    upiId: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z]+$/, 'Invalid UPI ID format (e.g. name@bank)')
      .optional()
      .or(z.literal('')),
    transactionId: z.string().trim().optional(),
    appName:       UpiAppEnum.optional(),
  })
  .optional()

const chequeDetailsSchema = z
  .object({
    chequeNumber: z
      .string()
      .trim()
      .min(6,  'Cheque number must be at least 6 characters')
      .max(20, 'Cheque number cannot exceed 20 characters'),
    chequeDate: isoDate,
    bankName:   z.string().trim().min(1, 'Bank name is required'),
    branchName: z.string().trim().optional(),
    ifscCode:   z
      .string()
      .trim()
      .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code')
      .optional()
      .or(z.literal('')),
    accountNumber: z.string().trim().optional(),
  })

const bankTransferDetailsSchema = z
  .object({
    fromBank:          z.string().trim().optional(),
    fromAccountNumber: z.string().trim().optional(),
    toBank:            z.string().trim().optional(),
    toAccountNumber:   z.string().trim().optional(),
    ifscCode:          z
      .string()
      .trim()
      .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code')
      .optional()
      .or(z.literal('')),
    transactionId:   z.string().trim().optional(),
    referenceNumber: z.string().trim().optional(),
    transferType:    BankTransferTypeEnum.optional(),
  })
  .optional()

const walletDetailsSchema = z
  .object({
    walletProvider: WalletProviderEnum.optional(),
    walletNumber:   z.string().trim().optional(),
    transactionId:  z.string().trim().optional(),
  })
  .optional()

// ─────────────────────────────────────────────
// PARTY SCHEMA
// ─────────────────────────────────────────────

const partySchema = z.object({
  partyType: PartyTypeEnum,
  partyId:   mongoId,
  partyName: z
    .string()
    .trim()
    .min(2,   'Party name must be at least 2 characters')
    .max(100, 'Party name cannot exceed 100 characters'),
  partyCode: z.string().trim().optional(),
  phone:     indianPhone.optional().or(z.literal('')),
  email:     email.optional().or(z.literal('')),
})

// ─────────────────────────────────────────────
// REFERENCE SCHEMA
// ─────────────────────────────────────────────

const referenceSchema = z
  .object({
    referenceType:   ReferenceTypeEnum.optional(),
    referenceId:     mongoId.optional().or(z.literal('')),
    referenceNumber: z.string().trim().optional(),
  })
  .optional()

// ─────────────────────────────────────────────
// 1. CREATE PAYMENT
// ─────────────────────────────────────────────

export const createPaymentSchema = z
  .object({
    paymentType:     PaymentTypeEnum,
    transactionType: TransactionTypeEnum,
    amount:          positiveAmount,
    paymentMode:     PaymentModeEnum,
    party:           partySchema,
    reference:       referenceSchema,
    transactionId:   z.string().trim().optional(),
    idempotencyKey:  z.string().trim().optional(),
    notes:           optionalNotes,
    internalNotes:   z.string().trim().optional(),
    tags:            z.array(z.string().trim()).optional(),

    paymentDetails: z
      .object({
        cashDetails:         cashDetailsSchema,
        cardDetails:         cardDetailsSchema,
        upiDetails:          upiDetailsSchema,
        chequeDetails:       chequeDetailsSchema.optional(),
        bankTransferDetails: bankTransferDetailsSchema,
        walletDetails:       walletDetailsSchema,
      })
      .optional(),
  })
  // Cheque: chequeDetails required when paymentMode === 'cheque'
  .superRefine((data, ctx) => {
    if (data.paymentMode === 'cheque') {
      if (!data.paymentDetails?.chequeDetails) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['paymentDetails', 'chequeDetails'],
          message: 'Cheque details are required for cheque payments',
        })
        return
      }
      const cd = data.paymentDetails.chequeDetails
      if (!cd.chequeNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['paymentDetails', 'chequeDetails', 'chequeNumber'],
          message: 'Cheque number is required',
        })
      }
      if (!cd.chequeDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['paymentDetails', 'chequeDetails', 'chequeDate'],
          message: 'Cheque date is required',
        })
      }
    }

    // UPI: upiId format when provided
    if (
      data.paymentMode === 'upi' &&
      data.paymentDetails?.upiDetails?.upiId
    ) {
      const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/
      if (!upiRegex.test(data.paymentDetails.upiDetails.upiId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['paymentDetails', 'upiDetails', 'upiId'],
          message: 'Invalid UPI ID format',
        })
      }
    }
  })

// ─────────────────────────────────────────────
// 2. UPDATE PAYMENT
// ─────────────────────────────────────────────

export const updatePaymentSchema = z
  .object({
    amount:      positiveAmount.optional(),
    paymentMode: PaymentModeEnum.optional(),
    notes:       optionalNotes,

    paymentDetails: z
      .object({
        cashDetails:         cashDetailsSchema,
        cardDetails:         cardDetailsSchema,
        upiDetails:          upiDetailsSchema,
        chequeDetails:       chequeDetailsSchema.optional(),
        bankTransferDetails: bankTransferDetailsSchema,
        walletDetails:       walletDetailsSchema,
      })
      .optional(),
  })
  // Immutable fields — block them at form level too
  .refine((data) => !('paymentNumber' in data), {
    message: 'Payment number cannot be updated',
    path:    ['paymentNumber'],
  })
  .refine((data) => !('paymentDate' in data), {
    message: 'Payment date cannot be updated',
    path:    ['paymentDate'],
  })

// ─────────────────────────────────────────────
// 3. UPDATE PAYMENT STATUS
// ─────────────────────────────────────────────

export const updatePaymentStatusSchema = z.object({
  status: PaymentStatusEnum,
  reason: z
    .string()
    .trim()
    .max(500, 'Reason cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),
})

// ─────────────────────────────────────────────
// 4. CANCEL PAYMENT
// ─────────────────────────────────────────────

export const cancelPaymentSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1,   'Cancellation reason is required')
    .max(500, 'Reason cannot exceed 500 characters'),
})

// ─────────────────────────────────────────────
// 5. CHEQUE CLEARANCE
// ─────────────────────────────────────────────

export const chequeClearanceSchema = z.object({
  clearanceDate: isoDate.optional().or(z.literal('')),
  notes:         shortNotes,
})

// ─────────────────────────────────────────────
// 6. CHEQUE BOUNCE
// ─────────────────────────────────────────────

export const chequeBounceSchema = z.object({
  bounceReason: z
    .string()
    .trim()
    .min(10,  'Bounce reason must be at least 10 characters')
    .max(500, 'Bounce reason cannot exceed 500 characters'),
  notes: shortNotes,
})

// ─────────────────────────────────────────────
// 7. RECONCILE PAYMENT
// ─────────────────────────────────────────────

export const reconcilePaymentSchema = z.object({
  reconciledWith: z
    .string()
    .trim()
    .min(3,   'Bank statement reference must be at least 3 characters')
    .max(100, 'Bank statement reference cannot exceed 100 characters'),
  discrepancy: z.number().optional(),
  notes:       shortNotes,
})

// ─────────────────────────────────────────────
// 8. SEND RECEIPT
// ─────────────────────────────────────────────

export const sendReceiptSchema = z
  .object({
    method:    ReceiptMethodEnum,
    recipient: z.string().trim().min(1, 'Recipient is required'),
  })
  .superRefine((data, ctx) => {
    if (data.method === 'email') {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      if (!emailRegex.test(data.recipient)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['recipient'],
          message: 'Invalid email address',
        })
      }
    } else {
      // sms or whatsapp
      const phoneRegex = /^[6-9][0-9]{9}$/
      if (!phoneRegex.test(data.recipient)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['recipient'],
          message: 'Invalid phone number (10 digits starting with 6-9)',
        })
      }
    }
  })

// ─────────────────────────────────────────────
// 9. PROCESS REFUND
// ─────────────────────────────────────────────

export const processRefundSchema = z.object({
  refundAmount: positiveAmount,
  refundMode:   PaymentModeEnum,
  refundReason: z
    .string()
    .trim()
    .min(10,  'Refund reason must be at least 10 characters')
    .max(500, 'Refund reason cannot exceed 500 characters'),
})

// ─────────────────────────────────────────────
// 10. APPROVE PAYMENT
// ─────────────────────────────────────────────

export const approvePaymentSchema = z.object({
  notes: shortNotes,
})

// ─────────────────────────────────────────────
// 11. REJECT PAYMENT
// ─────────────────────────────────────────────

export const rejectPaymentSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(10,  'Rejection reason must be at least 10 characters')
    .max(500, 'Rejection reason cannot exceed 500 characters'),
})

// ─────────────────────────────────────────────
// 12. BULK RECONCILE
// ─────────────────────────────────────────────

export const bulkReconcileSchema = z.object({
  paymentIds: z
    .array(mongoId)
    .min(1,   'Select at least 1 payment')
    .max(100, 'Cannot reconcile more than 100 payments at once'),
  reconciledWith: z
    .string()
    .trim()
    .min(1, 'Bank statement reference is required'),
  notes: shortNotes,
})

// ─────────────────────────────────────────────
// 13. BULK EXPORT
// ─────────────────────────────────────────────

export const bulkExportSchema = z.object({
  paymentIds: z
    .array(mongoId)
    .min(1,    'Select at least 1 payment')
    .max(1000, 'Cannot export more than 1000 payments at once')
    .optional(),
  format: ExportFormatEnum,
})

// ─────────────────────────────────────────────
// 14. BULK PRINT RECEIPTS
// ─────────────────────────────────────────────

export const bulkPrintReceiptsSchema = z.object({
  paymentIds: z
    .array(mongoId)
    .min(1, 'Select at least 1 payment to print'),
})

// ─────────────────────────────────────────────
// 15. PAYMENT FILTERS (list page)
// ─────────────────────────────────────────────

export const paymentFiltersSchema = z
  .object({
    page:            z.number().int().min(1).optional(),
    limit:           z.number().int().min(1).max(100).optional(),
    sort:            z
      .enum([
        'paymentDate',
        '-paymentDate',
        'amount',
        '-amount',
        'status',
        '-status',
        'paymentNumber',
        '-paymentNumber',
      ])
      .optional(),
    paymentType:     PaymentTypeEnum.optional(),
    transactionType: TransactionTypeEnum.optional(),
    paymentMode:     PaymentModeEnum.optional(),
    status:          PaymentStatusEnum.optional(),
    partyId:         mongoId.optional().or(z.literal('')),
    partyType:       PartyTypeEnum.optional(),
    referenceType:   ReferenceTypeEnum.optional(),
    referenceId:     mongoId.optional().or(z.literal('')),
    startDate:       isoDate.optional().or(z.literal('')),
    endDate:         isoDate.optional().or(z.literal('')),
    minAmount:       z.number().min(0).optional(),
    maxAmount:       z.number().min(0).optional(),
    search:          z
      .string()
      .trim()
      .max(100, 'Search query cannot exceed 100 characters')
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate) {
      if (new Date(data.endDate) < new Date(data.startDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['endDate'],
          message: 'End date must be after start date',
        })
      }
    }
    if (data.minAmount != null && data.maxAmount != null) {
      if (data.maxAmount < data.minAmount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['maxAmount'],
          message: 'Max amount must be greater than min amount',
        })
      }
    }
  })

// ─────────────────────────────────────────────
// 16. DATE RANGE FILTER
// ─────────────────────────────────────────────

export const dateRangeSchema = z
  .object({
    startDate: isoDate,
    endDate:   isoDate,
    page:      z.number().int().min(1).optional(),
    limit:     z.number().int().min(1).max(100).optional(),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'End date must be after start date',
    path:    ['endDate'],
  })

// ─────────────────────────────────────────────
// 17. AMOUNT RANGE FILTER
// ─────────────────────────────────────────────

export const amountRangeSchema = z
  .object({
    minAmount: z.number().min(0, 'Min amount must be 0 or greater'),
    maxAmount: z.number().min(0, 'Max amount must be 0 or greater'),
    page:      z.number().int().min(1).optional(),
    limit:     z.number().int().min(1).max(100).optional(),
  })
  .refine((data) => data.maxAmount >= data.minAmount, {
    message: 'Max amount must be greater than or equal to min amount',
    path:    ['maxAmount'],
  })

// ─────────────────────────────────────────────
// 18. ANALYTICS FILTER
// ─────────────────────────────────────────────

export const analyticsFilterSchema = z
  .object({
    startDate: isoDate.optional().or(z.literal('')),
    endDate:   isoDate.optional().or(z.literal('')),
    groupBy:   GroupByEnum.optional().default('day'),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate) {
      if (new Date(data.endDate) < new Date(data.startDate)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['endDate'],
          message: 'End date must be after start date',
        })
      }
    }
  })

// ─────────────────────────────────────────────
// TYPE EXPORTS (inferred from schemas)
// ─────────────────────────────────────────────

export type CreatePaymentFormData    = z.infer<typeof createPaymentSchema>
export type UpdatePaymentFormData    = z.infer<typeof updatePaymentSchema>
export type UpdateStatusFormData     = z.infer<typeof updatePaymentStatusSchema>
export type CancelPaymentFormData    = z.infer<typeof cancelPaymentSchema>
export type ChequeClearanceFormData  = z.infer<typeof chequeClearanceSchema>
export type ChequeBounceFormData     = z.infer<typeof chequeBounceSchema>
export type ReconcileFormData        = z.infer<typeof reconcilePaymentSchema>
export type SendReceiptFormData      = z.infer<typeof sendReceiptSchema>
export type ProcessRefundFormData    = z.infer<typeof processRefundSchema>
export type ApprovePaymentFormData   = z.infer<typeof approvePaymentSchema>
export type RejectPaymentFormData    = z.infer<typeof rejectPaymentSchema>
export type BulkReconcileFormData    = z.infer<typeof bulkReconcileSchema>
export type BulkExportFormData       = z.infer<typeof bulkExportSchema>
export type BulkPrintFormData        = z.infer<typeof bulkPrintReceiptsSchema>
export type PaymentFiltersFormData   = z.infer<typeof paymentFiltersSchema>
export type DateRangeFormData        = z.infer<typeof dateRangeSchema>
export type AmountRangeFormData      = z.infer<typeof amountRangeSchema>
export type AnalyticsFilterFormData  = z.infer<typeof analyticsFilterSchema>