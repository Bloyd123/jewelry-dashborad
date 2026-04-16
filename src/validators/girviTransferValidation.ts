// FILE: src/validators/girviTransferValidation.ts

import { z } from 'zod'

// ─── Party Schema ─────────────────────────────────────────────────────────────
const partySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Party name is required')
    .max(200, 'Name cannot exceed 200 characters'),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, 'Phone must be 10 digits')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .trim()
    .max(500, 'Address cannot exceed 500 characters')
    .optional(),
  type: z
    .enum(['shop', 'external'])
    .optional(),
  interestRate: z
    .number()
    .min(0, 'Interest rate must be positive')
    .optional(),
  interestType: z
    .enum(['simple', 'compound'])
    .optional(),
})

// ─── Transfer Out Schema ──────────────────────────────────────────────────────
export const transferOutSchema = z.object({
  fromParty: partySchema,
  toParty: partySchema.extend({
    interestRate: z
     .number({ error: 'Interest rate is required' })
      .min(0, 'Interest rate must be positive'),
    interestType: z.enum(['simple', 'compound'], { error: 'Interest type is required' })

  }),
  transferDate: z
    .string()
    .min(1, 'Transfer date is required'),
  ourInterestTillTransfer: z
    .number()
    .min(0, 'Interest must be positive')
    .optional(),
  ourInterestType: z
    .enum(['simple', 'compound'])
    .optional(),
  partyPrincipalAmount: z
    .number({ error: 'Party principal amount is required' })
    .min(1, 'Party principal amount must be greater than 0'),
  transferAmount: z
    .number()
    .min(0, 'Transfer amount must be positive')
    .optional(),
  commission: z
    .number()
    .min(0, 'Commission must be positive')
    .optional(),
  paymentMode: z
    .enum(['cash', 'upi', 'bank_transfer', 'cheque'])
    .optional(),
  transactionReference: z
    .string()
    .trim()
    .max(200)
    .optional(),
  notes: z
    .string()
    .trim()
    .max(1000, 'Notes cannot exceed 1000 characters')
    .optional(),
})

// ─── Transfer Return Schema ───────────────────────────────────────────────────
export const transferReturnSchema = z.object({
  returnDate: z
    .string()
    .min(1, 'Return date is required'),
  partyInterestCharged: z
    .number({ error: 'Party interest charged is required' })
    .min(0, 'Party interest must be positive'),
  returnAmount: z
    .number({ error: 'Return amount is required' })
    .min(0, 'Return amount must be positive'),
  returnPaymentMode: z.enum(['cash', 'upi', 'bank_transfer', 'cheque'], {
    error: 'Payment mode is required',
  }),
  returnTransactionReference: z
    .string()
    .trim()
    .max(200)
    .optional(),
  returnReason: z
    .string()
    .trim()
    .max(500)
    .optional(),
  returnRemarks: z
    .string()
    .trim()
    .max(500)
    .optional(),
})

// ─── Type Exports ─────────────────────────────────────────────────────────────
export type TransferOutFormData    = z.infer<typeof transferOutSchema>
export type TransferReturnFormData = z.infer<typeof transferReturnSchema>