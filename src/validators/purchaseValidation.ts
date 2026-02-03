// FILE: src/validations/purchaseValidation.ts
// Purchase Module Validation Schemas

import { z } from 'zod'


// PURCHASE ITEM SCHEMA

export const purchaseItemSchema = z.object({
  productId: z.string().optional().nullable(),
  productCode: z.string().optional(),
  productName: z
    .string()
    .trim()
    .min(1, 'Product name is required')
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must not exceed 100 characters'),
  category: z.string().optional(),
  metalType: z.enum(['gold', 'silver', 'platinum', 'diamond', 'mixed']),
  purity: z.string().trim().min(1, 'Purity is required'),
  grossWeight: z
    .number()
    .min(0.001, 'Gross weight must be greater than 0')
    .max(100000, 'Gross weight is too large'),
  stoneWeight: z
    .number()
    .min(0, 'Stone weight cannot be negative')
    .max(100000, 'Stone weight is too large')
    .optional()
    .default(0),
  netWeight: z
    .number()
    .min(0.001, 'Net weight must be greater than 0')
    .max(100000, 'Net weight is too large'),
  weightUnit: z.enum(['gram', 'kg', 'tola']).optional().default('gram'),
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(10000, 'Quantity is too large')
    .optional()
    .default(1),
  ratePerGram: z
    .number()
    .min(0, 'Rate per gram cannot be negative')
    .optional()
    .default(0),
  makingCharges: z
    .number()
    .min(0, 'Making charges cannot be negative')
    .optional()
    .default(0),
  stoneCharges: z
    .number()
    .min(0, 'Stone charges cannot be negative')
    .optional()
    .default(0),
  otherCharges: z
    .number()
    .min(0, 'Other charges cannot be negative')
    .optional()
    .default(0),
  huid: z.string().trim().optional().or(z.literal('')),
  isHallmarked: z.boolean().optional().default(false),
  description: z
    .string()
    .trim()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
})


// PAYMENT SCHEMA

export const paymentSchema = z.object({
  paymentMode: z
    .enum(['cash', 'card', 'upi', 'cheque', 'bank_transfer', 'mixed', 'credit'])
    .optional()
    .default('cash'),
  paidAmount: z
    .number()
    .min(0, 'Paid amount cannot be negative')
    .optional()
    .default(0),
  paymentTerms: z
    .string()
    .trim()
    .max(200, 'Payment terms must not exceed 200 characters')
    .optional()
    .or(z.literal('')),
  dueDate: z
    .string()
    .refine(
      date => {
        if (!date) return true
        return !isNaN(Date.parse(date))
      },
      { message: 'Invalid due date' }
    )
    .optional()
    .or(z.literal('')),
})


// DELIVERY SCHEMA

export const deliverySchema = z.object({
  expectedDate: z
    .string()
    .refine(
      date => {
        if (!date) return true
        return !isNaN(Date.parse(date))
      },
      { message: 'Invalid expected date' }
    )
    .optional()
    .or(z.literal('')),
  deliveryAddress: z
    .string()
    .trim()
    .max(300, 'Delivery address must not exceed 300 characters')
    .optional()
    .or(z.literal('')),
})


// CREATE PURCHASE SCHEMA

export const createPurchaseSchema = z.object({
  supplierId: z.string().trim().min(1, 'Supplier is required'),
  purchaseDate: z
    .string()
    .refine(
      date => {
        if (!date) return true
        return !isNaN(Date.parse(date))
      },
      { message: 'Invalid purchase date' }
    )
    .optional(),
  purchaseType: z
    .enum(['new_stock', 'old_gold', 'exchange', 'consignment', 'repair_return', 'sample'])
    .optional()
    .default('new_stock'),
  items: z
    .array(purchaseItemSchema)
    .min(1, 'At least one item is required')
    .max(100, 'Cannot add more than 100 items'),
  payment: paymentSchema.optional(),
  delivery: deliverySchema.optional(),
  notes: z
    .string()
    .trim()
    .max(1000, 'Notes must not exceed 1000 characters')
    .optional()
    .or(z.literal('')),
  tags: z.array(z.string()).optional(),
})


// UPDATE PURCHASE SCHEMA (all optional)

export const updatePurchaseSchema = createPurchaseSchema.partial()


// RECEIVE PURCHASE SCHEMA

export const receivePurchaseSchema = z.object({
  receivedBy: z.string().optional(),
  receivedDate: z
    .string()
    .refine(
      date => {
        if (!date) return true
        return !isNaN(Date.parse(date))
      },
      { message: 'Invalid received date' }
    )
    .optional(),
  notes: z
    .string()
    .trim()
    .max(500, 'Notes must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
})


// ADD PAYMENT SCHEMA

export const addPaymentSchema = z.object({
  amount: z
    .number()
    .min(0.01, 'Payment amount must be greater than 0')
    .max(10000000, 'Payment amount is too large'),
  paymentMode: z.enum(['cash', 'card', 'upi', 'cheque', 'bank_transfer']),
  paymentDate: z
    .string()
    .refine(
      date => {
        if (!date) return true
        return !isNaN(Date.parse(date))
      },
      { message: 'Invalid payment date' }
    )
    .optional(),
  transactionId: z
    .string()
    .trim()
    .max(100, 'Transaction ID must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  referenceNumber: z
    .string()
    .trim()
    .max(100, 'Reference number must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  chequeNumber: z
    .string()
    .trim()
    .max(50, 'Cheque number must not exceed 50 characters')
    .optional()
    .or(z.literal('')),
  chequeDate: z
    .string()
    .refine(
      date => {
        if (!date) return true
        return !isNaN(Date.parse(date))
      },
      { message: 'Invalid cheque date' }
    )
    .optional()
    .or(z.literal('')),
  bankName: z
    .string()
    .trim()
    .max(100, 'Bank name must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  notes: z
    .string()
    .trim()
    .max(300, 'Notes must not exceed 300 characters')
    .optional()
    .or(z.literal('')),
})


// CANCEL/REJECT REASON SCHEMA

export const reasonSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, 'Reason must be at least 5 characters')
    .max(500, 'Reason must not exceed 500 characters'),
})


// APPROVAL NOTES SCHEMA

export const approvalNotesSchema = z.object({
  notes: z
    .string()
    .trim()
    .max(500, 'Notes must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
})


// UPLOAD DOCUMENT SCHEMA

export const uploadDocumentSchema = z.object({
  documentType: z.enum(['invoice', 'receipt', 'delivery_note', 'certificate', 'other']),
  documentUrl: z.string().trim().url('Invalid document URL'),
  documentNumber: z
    .string()
    .trim()
    .max(50, 'Document number must not exceed 50 characters')
    .optional()
    .or(z.literal('')),
})


// TYPE EXPORTS

export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>
export type UpdatePurchaseInput = z.infer<typeof updatePurchaseSchema>
export type ReceivePurchaseInput = z.infer<typeof receivePurchaseSchema>
export type AddPaymentInput = z.infer<typeof addPaymentSchema>
export type ReasonInput = z.infer<typeof reasonSchema>
export type ApprovalNotesInput = z.infer<typeof approvalNotesSchema>
export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>
export type PurchaseItemInput = z.infer<typeof purchaseItemSchema>