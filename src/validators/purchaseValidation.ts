// FILE: src/validations/purchaseValidation.ts

import { z } from 'zod'

// ─────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────
const metalTypeEnum = z.enum(['gold', 'silver', 'platinum', 'diamond', 'mixed'])
const purchaseTypeEnum = z.enum(['new_stock', 'old_gold', 'exchange', 'consignment', 'repair_return', 'sample'])
const paymentModeEnum = z.enum(['cash', 'card', 'upi', 'cheque', 'bank_transfer', 'mixed', 'credit'])

// ─────────────────────────────────────────────
// PURCHASE ITEM SCHEMA
// ─────────────────────────────────────────────
export const purchaseItemSchema = z.object({
  productName:    z.string().trim().min(1, 'Product name is required'),
  metalType:      metalTypeEnum,
  purity:         z.string().trim().min(1, 'Purity is required'),
  grossWeight:    z.number().min(0, 'Gross weight must be positive'),
  stoneWeight:    z.number().min(0).optional().default(0),
  netWeight:      z.number().min(0, 'Net weight must be positive'),
  quantity:       z.number().int().min(1).optional().default(1),
  ratePerGram:    z.number().min(0).optional().default(0),
  makingCharges:  z.number().min(0).optional().default(0),
  stoneCharges:   z.number().min(0).optional().default(0),
  otherCharges:   z.number().min(0).optional().default(0),
  huid:           z.string().trim().optional(),
  isHallmarked:   z.boolean().optional().default(false),
  category:       z.string().trim().optional(),
  description:    z.string().trim().optional(),
})

// ─────────────────────────────────────────────
// CREATE PURCHASE SCHEMA
// ─────────────────────────────────────────────
export const createPurchaseSchema = z.object({
  supplierId: z
    .string()
    .trim()
    .min(1, 'Supplier is required')
    .regex(/^[a-fA-F0-9]{24}$/, 'Invalid supplier ID'),

  purchaseDate: z
    .string()
    .optional()
    .refine(d => !d || !isNaN(Date.parse(d)), 'Invalid purchase date'),

  purchaseType: purchaseTypeEnum.optional().default('new_stock'),

  items: z
    .array(purchaseItemSchema)
    .min(1, 'At least one item is required'),

  payment: z.object({
    paymentMode:  paymentModeEnum.optional(),
    paidAmount:   z.number().min(0).optional().default(0),
    paymentTerms: z.string().optional(),
    dueDate:      z.string().optional(),
  }).optional(),

  delivery: z.object({
    expectedDate:    z.string().optional(),
    deliveryAddress: z.string().optional(),
  }).optional(),

  notes:    z.string().trim().max(1000).optional(),
  tags:     z.array(z.string()).optional(),
})

// ─────────────────────────────────────────────
// UPDATE PURCHASE SCHEMA
// ─────────────────────────────────────────────
export const updatePurchaseSchema = createPurchaseSchema.partial()

// ─────────────────────────────────────────────
// RECEIVE PURCHASE SCHEMA
// ─────────────────────────────────────────────
export const receivePurchaseSchema = z.object({
  receivedBy:   z.string().optional(),
  receivedDate: z.string().optional(),
  notes:        z.string().trim().max(500).optional(),
})

// ─────────────────────────────────────────────
// CANCEL / RETURN SCHEMA
// ─────────────────────────────────────────────
export const cancelReturnSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, 'Reason must be at least 5 characters')
    .max(500, 'Reason must be under 500 characters'),
})

// ─────────────────────────────────────────────
// APPROVE SCHEMA
// ─────────────────────────────────────────────
export const approvePurchaseSchema = z.object({
  notes: z.string().trim().optional(),
})

// ─────────────────────────────────────────────
// REJECT SCHEMA
// ─────────────────────────────────────────────
export const rejectPurchaseSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, 'Reason must be at least 5 characters')
    .max(500, 'Reason must be under 500 characters'),
})

// ─────────────────────────────────────────────
// ADD PAYMENT SCHEMA
// ─────────────────────────────────────────────
export const addPaymentSchema = z.object({
  amount: z
    .number()
    .min(0.01, 'Amount must be greater than 0'),

  paymentMode: z.enum(['cash', 'card', 'upi', 'cheque', 'bank_transfer']),

  paymentDate:     z.string().optional(),
  transactionId:   z.string().trim().optional(),
  referenceNumber: z.string().trim().optional(),
  chequeNumber:    z.string().trim().optional(),
  chequeDate:      z.string().optional(),
  bankName:        z.string().trim().optional(),
  notes:           z.string().trim().max(500).optional(),
})

// ─────────────────────────────────────────────
// UPLOAD DOCUMENT SCHEMA
// ─────────────────────────────────────────────
export const uploadDocumentSchema = z.object({
  documentType: z.enum(['invoice', 'receipt', 'delivery_note', 'certificate', 'other']),
  documentUrl:  z.string().url('Invalid document URL'),
  documentNumber: z.string().trim().optional(),
})

// ─────────────────────────────────────────────
// TYPE EXPORTS
// ─────────────────────────────────────────────
export type CreatePurchaseInput  = z.infer<typeof createPurchaseSchema>
export type UpdatePurchaseInput  = z.infer<typeof updatePurchaseSchema>
export type ReceivePurchaseInput = z.infer<typeof receivePurchaseSchema>
export type CancelReturnInput    = z.infer<typeof cancelReturnSchema>
export type AddPaymentInput      = z.infer<typeof addPaymentSchema>
export type UploadDocumentInput  = z.infer<typeof uploadDocumentSchema>