// FILE: src/validations/salesValidation.ts
// Complete Zod Validation Schemas for Sales Module (Zod v4)

import { z } from 'zod'

// ─────────────────────────────────────────────
// CONSTANTS (match backend enums exactly)
// ─────────────────────────────────────────────
const METAL_TYPES          = ['gold', 'silver', 'platinum', 'diamond', 'mixed'] as const
const WEIGHT_UNITS         = ['gram', 'kg', 'tola'] as const
const MAKING_TYPES         = ['per_gram', 'flat', 'percentage'] as const
const DISCOUNT_TYPES       = ['percentage', 'flat', 'none'] as const
const SALE_TYPES           = ['retail', 'wholesale', 'exchange', 'order_fulfillment', 'repair_billing', 'estimate'] as const
const PAYMENT_MODES        = ['cash', 'card', 'upi', 'cheque', 'bank_transfer', 'mixed', 'credit'] as const
const PAYMENT_MODES_SIMPLE = ['cash', 'card', 'upi', 'cheque', 'bank_transfer'] as const
const DELIVERY_TYPES       = ['immediate', 'scheduled', 'courier', 'pickup'] as const
const SALE_STATUSES        = ['draft', 'pending', 'confirmed', 'delivered', 'completed', 'cancelled', 'returned'] as const
const DOCUMENT_TYPES       = ['invoice', 'receipt', 'estimate', 'certificate', 'warranty', 'other'] as const
const PRINTER_TYPES        = ['thermal_80mm', 'thermal_58mm', 'A4', 'A5'] as const
const SEND_METHODS         = ['email', 'sms', 'whatsapp'] as const
const REFUND_MODES         = ['cash', 'card', 'upi', 'bank_transfer', 'store_credit'] as const

// ─────────────────────────────────────────────
// REUSABLE FIELD SCHEMAS
// Zod v4: use `error` instead of
// `required_error` / `invalid_type_error`
// ─────────────────────────────────────────────
const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, 'Invalid ID format')

// number that allows 0
const positiveNumber = z
  .number({ error: 'Must be a number' })
  .min(0, 'Must be 0 or greater')

const dateStringOptional = z
  .string()
  .trim()
  .refine((val) => !val || !isNaN(Date.parse(val)), 'Invalid date format')
  .optional()

// ─────────────────────────────────────────────
// 1. SALE ITEM SCHEMA
// ─────────────────────────────────────────────
export const saleItemSchema = z.object({
  productId: objectIdSchema.optional().nullable(),

  productName: z
    .string()
    .trim()
    .min(1, 'Product name is required')
    .max(200, 'Product name too long'),

  productCode: z.string().trim().optional(),
  category:    z.string().trim().optional(),
  hsnCode:     z.string().trim().optional(),

  metalType: z.enum(METAL_TYPES, { error: 'Metal type is required' }),

  purity: z.string().trim().optional(),

  grossWeight: z
    .number({ error: 'Gross weight is required' })
    .min(0.001, 'Gross weight must be greater than 0'),

  stoneWeight: positiveNumber.default(0),
  // netWeight:   positiveNumber.default(0),
  weightUnit:  z.enum(WEIGHT_UNITS).default('gram'),
  ratePerGram: positiveNumber.default(0),
  stoneValue:  positiveNumber.default(0),

  makingCharges:     positiveNumber.default(0),
  makingChargesType: z.enum(MAKING_TYPES).default('flat'),
  otherCharges:      positiveNumber.default(0),

  gstPercentage: z
    .number({ error: 'Must be a number' })
    .min(0, 'GST cannot be negative')
    .max(100, 'GST cannot exceed 100%')
    .default(3),

discount: z
  .object({
    type:   z.enum(DISCOUNT_TYPES).default('none'),
    value:  positiveNumber.default(0),
    amount: positiveNumber.default(0),  // ← ADD
  })
  .default({ type: 'none', value: 0, amount: 0 }),  // ← ADD amount here too

  quantity: z
    .number({ error: 'Quantity is required' })
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .default(1),

  huid:         z.string().trim().optional(),
  isHallmarked: z.boolean().default(false),

  warrantyPeriod: z
    .number()
    .int('Warranty period must be a whole number')
    .min(0)
    .optional(),

  warrantyExpiryDate: dateStringOptional,

  notes: z.string().trim().max(500, 'Notes too long').optional(),
})

// ─────────────────────────────────────────────
// 2. OLD GOLD ITEM SCHEMA
// ─────────────────────────────────────────────
export const oldGoldItemSchema = z.object({
  metalType: z.string().trim().min(1, 'Metal type is required'),
  purity:    z.string().trim().min(1, 'Purity is required'),

  grossWeight: z
    .number({ error: 'Gross weight is required' })
    .min(0.001, 'Gross weight must be greater than 0'),

  stoneWeight: positiveNumber.default(0),

  ratePerGram: z
    .number({ error: 'Rate per gram is required' })
    .min(0.01, 'Rate per gram must be greater than 0'),

  description: z.string().trim().optional(),
})

// ─────────────────────────────────────────────
// 3. CREATE SALE SCHEMA
// ─────────────────────────────────────────────
export const createSaleSchema = z.object({
  customerId: objectIdSchema,

  saleType: z.enum(SALE_TYPES).default('retail'),

  items: z
    .array(saleItemSchema)
    .min(1, 'At least one item is required'),

  payment: z.object({
    paymentMode: z.enum(PAYMENT_MODES, { error: 'Payment mode is required' }),
    paidAmount:  positiveNumber.default(0),
    dueDate:     dateStringOptional,
  }),

  oldGoldExchange: z
    .object({
      hasExchange: z.boolean().default(false),
      items:       z.array(oldGoldItemSchema).optional(),
    })
    .optional(),

  delivery: z
    .object({
      deliveryType:    z.enum(DELIVERY_TYPES).default('immediate'),
      deliveryDate:    dateStringOptional,
      deliveryAddress: z.string().trim().optional(),
    })
    .optional(),

  notes:              z.string().trim().max(1000, 'Notes cannot exceed 1000 characters').optional(),
  internalNotes:      z.string().trim().optional(),
  termsAndConditions: z.string().trim().optional(),
  tags:               z.array(z.string().trim()).optional(),
  schemeId:           objectIdSchema.optional().nullable(),
  orderId:            objectIdSchema.optional().nullable(),
})

// ─────────────────────────────────────────────
// 4. UPDATE SALE SCHEMA (all optional)
// ─────────────────────────────────────────────
export const updateSaleSchema = createSaleSchema
  .omit({ customerId: true })
  .partial()
  .extend({
    status: z.enum(['draft', 'pending'] as const).optional(),
  })

// ─────────────────────────────────────────────
// 5. ADD PAYMENT SCHEMA
// ─────────────────────────────────────────────
export const addPaymentSchema = z
  .object({
    amount: z
      .number({ error: 'Payment amount is required' })
      .min(0.01, 'Amount must be greater than 0'),

    paymentMode: z.enum(PAYMENT_MODES_SIMPLE, { error: 'Payment mode is required' }),

    paymentDate:     dateStringOptional,
    transactionId:   z.string().trim().optional(),
    referenceNumber: z.string().trim().optional(),
    bankName:        z.string().trim().optional(),

    cardLast4: z
      .string()
      .trim()
      .regex(/^\d{4}$/, 'Card last 4 digits must be exactly 4 numbers')
      .optional()
      .or(z.literal('')),

    upiId: z
      .string()
      .trim()
      .regex(/^[\w.-]+@[\w.-]+$/, 'Invalid UPI ID')
      .optional()
      .or(z.literal('')),

    chequeNumber: z.string().trim().optional(),
    chequeDate:   dateStringOptional,

    notes: z.string().trim().max(500, 'Notes cannot exceed 500 characters').optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMode === 'cheque' && !data.chequeNumber) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        path:    ['chequeNumber'],
        message: 'Cheque number is required for cheque payments',
      })
    }
    if (data.paymentMode === 'upi' && !data.upiId) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        path:    ['upiId'],
        message: 'UPI ID is required for UPI payments',
      })
    }
    if (data.paymentMode === 'card' && !data.cardLast4) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        path:    ['cardLast4'],
        message: 'Last 4 digits required for card payments',
      })
    }
  })

// ─────────────────────────────────────────────
// 6. CANCEL SALE SCHEMA
// ─────────────────────────────────────────────
export const cancelSaleSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason cannot exceed 500 characters'),

  refundAmount: positiveNumber.optional(),
})

// ─────────────────────────────────────────────
// 7. RETURN SALE SCHEMA
// ─────────────────────────────────────────────
export const returnSaleSchema = z.object({
  returnReason: z
    .string()
    .trim()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason cannot exceed 500 characters'),

  refundAmount: z
    .number({ error: 'Refund amount is required' })
    .min(0, 'Refund amount cannot be negative'),

  refundMode:  z.enum(REFUND_MODES).optional(),
  returnDate:  dateStringOptional,

  itemsToReturn: z
    .array(
      z.object({
        productId: objectIdSchema,
        quantity:  z.number().int().min(1, 'Quantity must be at least 1'),
      })
    )
    .optional(),
})

// ─────────────────────────────────────────────
// 8. DELIVER SALE SCHEMA
// ─────────────────────────────────────────────
export const deliverSaleSchema = z
  .object({
    deliveryType: z.enum(DELIVERY_TYPES, { error: 'Delivery type is required' }),

    deliveryAddress: z.string().trim().optional(),
    receivedBy:      z.string().trim().optional(),

    courierDetails: z
      .object({
        courierName:    z.string().trim().min(1, 'Courier name is required'),
        trackingNumber: z.string().trim().min(1, 'Tracking number is required'),
        awbNumber:      z.string().trim().optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryType === 'courier' && !data.courierDetails?.courierName) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        path:    ['courierDetails', 'courierName'],
        message: 'Courier details are required for courier delivery',
      })
    }
  })

// ─────────────────────────────────────────────
// 9. ADD OLD GOLD SCHEMA
// ─────────────────────────────────────────────
export const addOldGoldSchema = z.object({
  oldGoldItems: z
    .array(oldGoldItemSchema)
    .min(1, 'At least one old gold item is required'),

  totalOldGoldValue: z
    .number({ error: 'Total old gold value is required' })
    .min(0, 'Total value must be 0 or greater'),
})

// ─────────────────────────────────────────────
// 10. APPLY DISCOUNT SCHEMA
// ─────────────────────────────────────────────
export const applyDiscountSchema = z
  .object({
    discountType: z.enum(['percentage', 'flat'] as const, {
      error: 'Discount type is required',
    }),

    discountValue: z
      .number({ error: 'Discount value is required' })
      .min(0, 'Discount value must be 0 or greater'),

    discountReason: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.discountType === 'percentage' && data.discountValue > 100) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        path:    ['discountValue'],
        message: 'Discount percentage cannot exceed 100%',
      })
    }
  })

// ─────────────────────────────────────────────
// 11. SEND INVOICE SCHEMA
// ─────────────────────────────────────────────
export const sendInvoiceSchema = z
  .object({
    method: z.enum(SEND_METHODS, { error: 'Send method is required' }),

    recipient: z
      .string()
      .trim()
      .min(1, 'Recipient is required'),
  })
  .superRefine((data, ctx) => {
    if (data.method === 'email') {
      if (!/^\S+@\S+\.\S+$/.test(data.recipient)) {
        ctx.addIssue({
          code:    z.ZodIssueCode.custom,
          path:    ['recipient'],
          message: 'Invalid email address',
        })
      }
    } else {
      if (!/^[0-9]{10}$/.test(data.recipient)) {
        ctx.addIssue({
          code:    z.ZodIssueCode.custom,
          path:    ['recipient'],
          message: 'Invalid phone number (10 digits required)',
        })
      }
    }
  })

// ─────────────────────────────────────────────
// 12. PRINT INVOICE SCHEMA
// ─────────────────────────────────────────────
export const printInvoiceSchema = z.object({
  printerType: z.enum(PRINTER_TYPES).optional(),
})

// ─────────────────────────────────────────────
// 13. APPROVE / REJECT SCHEMA
// ─────────────────────────────────────────────
export const approveSaleSchema = z.object({
  notes: z.string().trim().max(500, 'Notes cannot exceed 500 characters').optional(),
})

export const rejectSaleSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason cannot exceed 500 characters'),
})

// ─────────────────────────────────────────────
// 14. CONFIRM SALE SCHEMA
// ─────────────────────────────────────────────
export const confirmSaleSchema = z.object({
  notes: z.string().trim().max(1000, 'Notes cannot exceed 1000 characters').optional(),
})

// ─────────────────────────────────────────────
// 15. UPLOAD DOCUMENT SCHEMA
// ─────────────────────────────────────────────
export const uploadDocumentSchema = z.object({
  documentType: z.enum(DOCUMENT_TYPES, { error: 'Document type is required' }),

  documentUrl: z
    .string()
    .trim()
    .url('Invalid document URL'),

  documentNumber: z.string().trim().optional(),
})

// ─────────────────────────────────────────────
// 16. BULK OPERATIONS SCHEMAS
// ─────────────────────────────────────────────
export const bulkDeleteSchema = z.object({
  saleIds: z.array(objectIdSchema).min(1, 'At least one sale is required'),
  reason:  z.string().trim().min(1, 'Reason is required'),
})

export const bulkPrintSchema = z.object({
  saleIds: z.array(objectIdSchema).min(1, 'At least one sale is required'),
})

export const bulkRemindersSchema = z.object({
  saleIds: z.array(objectIdSchema).min(1, 'At least one sale is required'),
  method:  z.enum(SEND_METHODS, { error: 'Send method is required' }),
})

// ─────────────────────────────────────────────
// 17. FILTERS / SEARCH SCHEMAS
// ─────────────────────────────────────────────
export const salesFiltersSchema = z
  .object({
    search:        z.string().trim().optional(),
    status:        z.enum(SALE_STATUSES).optional(),
    paymentStatus: z.enum(['paid', 'partial', 'unpaid', 'overdue'] as const).optional(),
    saleType:      z.enum(SALE_TYPES).optional(),
    startDate:     dateStringOptional,
    endDate:       dateStringOptional,
    minAmount:     positiveNumber.optional(),
    maxAmount:     positiveNumber.optional(),
    page:          z.number().int().min(1).default(1),
    limit:         z.number().int().min(1).max(100).default(10),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate) {
      if (new Date(data.endDate) < new Date(data.startDate)) {
        ctx.addIssue({
          code:    z.ZodIssueCode.custom,
          path:    ['endDate'],
          message: 'End date must be after start date',
        })
      }
    }
    if (data.minAmount !== undefined && data.maxAmount !== undefined) {
      if (data.maxAmount < data.minAmount) {
        ctx.addIssue({
          code:    z.ZodIssueCode.custom,
          path:    ['maxAmount'],
          message: 'Max amount must be greater than min amount',
        })
      }
    }
  })

export const dateRangeSchema = z
  .object({
    startDate: z
      .string()
      .trim()
      .refine((val) => !isNaN(Date.parse(val)), 'Invalid start date'),

    endDate: z
      .string()
      .trim()
      .refine((val) => !isNaN(Date.parse(val)), 'Invalid end date'),
  })
  .superRefine((data, ctx) => {
    if (new Date(data.endDate) < new Date(data.startDate)) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        path:    ['endDate'],
        message: 'End date must be after start date',
      })
    }
  })

export const amountRangeSchema = z
  .object({
    minAmount: z.number({ error: 'Min amount is required' }).min(0, 'Must be 0 or greater'),
    maxAmount: z.number({ error: 'Max amount is required' }).min(0, 'Must be 0 or greater'),
  })
  .superRefine((data, ctx) => {
    if (data.maxAmount < data.minAmount) {
      ctx.addIssue({
        code:    z.ZodIssueCode.custom,
        path:    ['maxAmount'],
        message: 'Max amount must be greater than min amount',
      })
    }
  })

// ─────────────────────────────────────────────
// TYPE EXPORTS
// ─────────────────────────────────────────────
export type CreateSaleInput      = z.infer<typeof createSaleSchema>
export type UpdateSaleInput      = z.infer<typeof updateSaleSchema>
export type SaleItemInput        = z.infer<typeof saleItemSchema>
export type OldGoldItemInput     = z.infer<typeof oldGoldItemSchema>
export type AddPaymentInput      = z.infer<typeof addPaymentSchema>
export type CancelSaleInput      = z.infer<typeof cancelSaleSchema>
export type ReturnSaleInput      = z.infer<typeof returnSaleSchema>
export type DeliverSaleInput     = z.infer<typeof deliverSaleSchema>
export type AddOldGoldInput      = z.infer<typeof addOldGoldSchema>
export type ApplyDiscountInput   = z.infer<typeof applyDiscountSchema>
export type SendInvoiceInput     = z.infer<typeof sendInvoiceSchema>
export type PrintInvoiceInput    = z.infer<typeof printInvoiceSchema>
export type ApproveSaleInput     = z.infer<typeof approveSaleSchema>
export type RejectSaleInput      = z.infer<typeof rejectSaleSchema>
export type ConfirmSaleInput     = z.infer<typeof confirmSaleSchema>
export type UploadDocumentInput  = z.infer<typeof uploadDocumentSchema>
export type BulkDeleteInput      = z.infer<typeof bulkDeleteSchema>
export type BulkPrintInput       = z.infer<typeof bulkPrintSchema>
export type BulkRemindersInput   = z.infer<typeof bulkRemindersSchema>
export type SalesFiltersInput    = z.infer<typeof salesFiltersSchema>
export type DateRangeInput       = z.infer<typeof dateRangeSchema>
export type AmountRangeInput     = z.infer<typeof amountRangeSchema>