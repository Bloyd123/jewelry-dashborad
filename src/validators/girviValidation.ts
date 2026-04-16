// FILE: src/validators/girviValidation.ts
// Girvi Module - Zod Validation Schemas
// Mirrors backend express-validator rules exactly

import { z } from 'zod'


export const girviItemSchema = z.object({
  itemName: z
    .string()
    .trim()
    .min(1, 'Item name is required')
    .max(200, 'Item name cannot exceed 200 characters'),

  itemType: z.enum(['gold', 'silver', 'diamond', 'platinum', 'other'], {
    error: 'Item type is required',
  }),

  description: z
    .string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),

  quantity: z
    .number({ error: 'Quantity must be a number' })
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .optional()
    .default(1),

  grossWeight: z
    .number({ error: 'Gross weight must be a number' })
    .min(0, 'Gross weight cannot be negative'),

  lessWeight: z
    .number({ error: 'Less weight must be a number' })
    .min(0, 'Less weight cannot be negative')
    .optional()
    .default(0),

  tunch: z
    .number({ error: 'Tunch must be a number' })
    .min(0, 'Tunch cannot be negative')
    .max(100, 'Tunch cannot exceed 100')
    .optional(),

  purity: z
    .string()
    .trim()
    .max(20, 'Purity cannot exceed 20 characters')
    .optional(),

  ratePerGram: z
    .number({ error: 'Rate per gram must be a number' })
    .min(0, 'Rate per gram cannot be negative')
    .optional(),

  userGivenValue: z
    .number({ error: 'Value must be a number' })
    .min(0, 'Value cannot be negative')
    .optional(),

  condition: z
    .enum(['good', 'fair', 'poor'])
    .optional()
    .default('good'),
})

export type GirviItemInput = z.infer<typeof girviItemSchema>


export const createGirviSchema = z.object({
  customerId: z
    .string()
    .min(1, 'Customer is required')
    .regex(/^[a-f\d]{24}$/i, 'Invalid customer ID'),

  items: z
    .array(girviItemSchema)
    .min(1, 'At least one item is required'),

  principalAmount: z
    .number({ error: 'Principal amount must be a number' })
    .min(1, 'Principal amount must be greater than 0'),

  interestRate: z
    .number({ error: 'Interest rate must be a number' })
    .min(0, 'Interest rate cannot be negative'),

  interestType: z
    .enum(['simple', 'compound'])
    .optional()
    .default('simple'),

  calculationBasis: z
    .enum(['monthly', 'daily'])
    .optional()
    .default('monthly'),

  girviDate: z
    .string()
    .min(1, 'Girvi date is required')
    .refine((d) => !isNaN(Date.parse(d)), 'Invalid girvi date'),

  dueDate: z
    .string()
    .refine((d) => !d || !isNaN(Date.parse(d)), 'Invalid due date')
    .optional(),

  gracePeriodDays: z
    .number({ error: 'Grace period must be a number' })
    .int('Grace period must be a whole number')
    .min(0, 'Grace period cannot be negative')
    .optional()
    .default(0),

  loanToValueRatio: z
    .number({ error: 'LTV ratio must be a number' })
    .min(0, 'LTV ratio cannot be negative')
    .max(100, 'LTV ratio cannot exceed 100')
    .optional(),

  paymentMode: z
    .enum(['cash', 'upi', 'bank_transfer', 'cheque'])
    .optional()
    .default('cash'),

  transactionReference: z
    .string()
    .trim()
    .max(200, 'Reference cannot exceed 200 characters')
    .optional(),

  girviSlipNumber: z
    .string()
    .trim()
    .max(100, 'Slip number cannot exceed 100 characters')
    .optional(),

  witnessName: z
    .string()
    .trim()
    .max(100, 'Witness name cannot exceed 100 characters')
    .optional(),

  notes: z
    .string()
    .trim()
    .max(1000, 'Notes cannot exceed 1000 characters')
    .optional(),

  internalNotes: z
    .string()
    .trim()
    .max(1000, 'Internal notes cannot exceed 1000 characters')
    .optional(),
})

export type CreateGirviInput = z.infer<typeof createGirviSchema>

// ─── Update Girvi Schema ───────────────────────────────────────────────────────
// Only fields the backend allows to be updated
// Backend BLOCKS: status, girviNumber, customerId, principalAmount

export const updateGirviSchema = z.object({
  interestRate: z
    .number({ error: 'Interest rate must be a number' })
    .min(0, 'Interest rate cannot be negative')
    .optional(),

  interestType: z
    .enum(['simple', 'compound'])
    .optional(),

  calculationBasis: z
    .enum(['monthly', 'daily'])
    .optional(),

  dueDate: z
    .string()
    .refine((d) => !d || !isNaN(Date.parse(d)), 'Invalid due date')
    .optional(),

  gracePeriodDays: z
    .number({ error: 'Grace period must be a number' })
    .int()
    .min(0)
    .optional(),

  girviSlipNumber: z
    .string()
    .trim()
    .max(100)
    .optional(),

  witnessName: z
    .string()
    .trim()
    .max(100)
    .optional(),

  notes: z
    .string()
    .trim()
    .max(1000)
    .optional(),

  internalNotes: z
    .string()
    .trim()
    .max(1000)
    .optional(),
})

export type UpdateGirviInput = z.infer<typeof updateGirviSchema>

// ─── Release Girvi Schema ──────────────────────────────────────────────────────

export const releaseGirviSchema = z.object({
  releaseInterestType: z.enum(['simple', 'compound'], {
    error: 'Interest type is required for release',
  }),

  interestReceived: z
    .number({ error: 'Interest received must be a number' })
    .min(0, 'Interest received cannot be negative'),

  principalReceived: z
    .number({ error: 'Principal received must be a number' })
    .min(0, 'Principal received cannot be negative'),

  discountGiven: z
    .number({ error: 'Discount must be a number' })
    .min(0, 'Discount cannot be negative')
    .optional()
    .default(0),

  paymentDate: z
    .string()
    .min(1, 'Payment date is required')
    .refine((d) => !isNaN(Date.parse(d)), 'Invalid payment date'),

  paymentMode: z.enum(['cash', 'upi', 'bank_transfer', 'cheque'], {
    error: 'Payment mode is required',
  }),

  transactionReference: z
    .string()
    .trim()
    .max(200)
    .optional(),

  remarks: z
    .string()
    .trim()
    .max(500)
    .optional(),
})

export type ReleaseGirviInput = z.infer<typeof releaseGirviSchema>

// ─── Interest Calculation Params Schema ────────────────────────────────────────

export const calculateInterestSchema = z.object({
  toDate: z
    .string()
    .refine((d) => !d || !isNaN(Date.parse(d)), 'Invalid date')
    .optional(),

  interestType: z
    .enum(['simple', 'compound'])
    .optional(),
})

export type CalculateInterestInput = z.infer<typeof calculateInterestSchema>