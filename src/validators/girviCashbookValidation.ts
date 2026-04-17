// FILE: src/validators/girviCashbookValidation.ts

import { z } from 'zod'

const ENTRY_TYPES = [
  'girvi_jama',
  'interest_received',
  'principal_received',
  'release_received',
  'discount_given',
  'transfer_out',
  'transfer_in',
  'transfer_return_in',
  'transfer_return_out',
] as const

const PAYMENT_MODES = [
  'cash',
  'upi',
  'bank_transfer',
  'cheque',
] as const

const FLOW_TYPES = ['inflow', 'outflow'] as const
const breakdownSchema = z.object({
  principalAmount: z
    .number()
    .min(0, 'Principal amount must be positive')
    .optional(),
  interestAmount: z
    .number()
    .min(0, 'Interest amount must be positive')
    .optional(),
  discountAmount: z
    .number()
    .min(0, 'Discount amount must be positive')
    .optional(),
}).optional()

export const createManualEntrySchema = z.object({
  entryType: z.enum(ENTRY_TYPES, {
    error: 'Entry type is required',
  }),

  flowType: z.enum(FLOW_TYPES, {
    error: 'Flow type is required',
  }),

  amount: z
    .number({ error: 'Amount is required' })
    .min(0.01, 'Amount must be greater than 0'),

  paymentMode: z.enum(PAYMENT_MODES, {
    error: 'Payment mode is required',
  }),

  transactionReference: z
    .string()
    .trim()
    .max(200, 'Transaction reference cannot exceed 200 characters')
    .optional()
    .or(z.literal('')),

  entryDate: z
    .string()
    .min(1, 'Entry date is required'),

  girviId: z
    .string()
    .trim()
    .optional()
    .or(z.literal('')),

  customerId: z
    .string()
    .trim()
    .optional()
    .or(z.literal('')),

  breakdown: breakdownSchema,

  remarks: z
    .string()
    .trim()
    .max(500, 'Remarks cannot exceed 500 characters')
    .optional(),
})

export const cashbookFilterSchema = z.object({
  page:  z.number().min(1).optional(),
  limit: z.number().min(1).max(200).optional(),
  sort:  z.string().optional(),

  entryType:   z.enum(ENTRY_TYPES).optional(),
  flowType:    z.enum(FLOW_TYPES).optional(),
  paymentMode: z.enum(PAYMENT_MODES).optional(),

  startDate:  z.string().optional(),
  endDate:    z.string().optional(),
  customerId: z.string().optional(),
  girviId:    z.string().optional(),
})

export type CreateManualEntryInput = z.infer<typeof createManualEntrySchema>
export type CashbookFilterInput    = z.infer<typeof cashbookFilterSchema>

export const ENTRY_TYPE_LABELS: Record<string, string> = {
  girvi_jama:          'Girvi Jama',
  interest_received:   'Interest Received',
  principal_received:  'Principal Received',
  release_received:    'Release Received',
  discount_given:      'Discount Given',
  transfer_out:        'Transfer Out',
  transfer_in:         'Transfer In',
  transfer_return_in:  'Transfer Return In',
  transfer_return_out: 'Transfer Return Out',
}

// Backend logic ke sath match karta hai
export const ENTRY_TYPE_FLOW: Record<string, 'inflow' | 'outflow'> = {
  girvi_jama:          'outflow',  
  interest_received:   'inflow',   
  principal_received:  'inflow',   
  release_received:    'inflow',   
  discount_given:      'outflow',  
  transfer_out:        'outflow',  
  transfer_in:         'inflow',   
  transfer_return_in:  'outflow',  
  transfer_return_out: 'inflow',   
}