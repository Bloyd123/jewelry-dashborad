// FILE: src/validators/schemeValidation.ts

import { z } from 'zod'

export const createSchemeSchema = z.object({
  // Basic
  schemeName: z
    .string()
    .trim()
    .min(3,   'Scheme name must be at least 3 characters')
    .max(100, 'Scheme name cannot exceed 100 characters'),

  description: z
    .string()
    .trim()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional()
    .or(z.literal('')),

  schemeType: z.enum([
    'gold_saving',
    'installment',
    'advance_booking',
    'festival_scheme',
    'custom',
 ] as const, { message: 'Scheme type is required' }), 

  // Duration
  duration: z.object({
    months: z.number().min(1, 'Duration must be at least 1 month'),
    weeks:  z.number().min(0).optional().default(0),
  }),

  // Installments
  installments: z.object({
    totalInstallments: z
      .number()
      .min(1, 'Total installments must be at least 1'),
    installmentAmount: z
      .number()
      .min(1, 'Installment amount must be greater than 0'),
    frequency: z
      .enum(['weekly', 'monthly', 'custom'])
      .default('monthly'),
    dueDay: z
      .number()
      .min(1)
      .max(31)
      .optional(),
  }),

  // Bonus
  bonus: z.object({
    hasBonus: z.boolean().default(false),
    bonusType: z
      .enum(['percentage', 'flat_amount', 'free_making', 'discount'])
      .default('percentage'),
    bonusValue: z.number().min(0).default(0),
    bonusDescription: z.string().optional(),
  }).optional(),

  // Eligibility
  eligibility: z.object({
    minAge:               z.number().min(0).max(120).default(18),
    maxAge:               z.number().min(0).max(120).optional().nullable(),
    minInstallmentAmount: z.number().min(0).default(0),
    requiresKYC:          z.boolean().default(true),
  }).optional(),

  // Terms
  termsAndConditions: z.array(z.object({
    condition: z.string(),
    order:     z.number(),
  })).optional(),

  // Redemption
  redemption: z.object({
    canRedeemEarly: z.boolean().default(false),
    earlyRedemptionPenalty: z.object({
      type:  z.enum(['percentage', 'flat', 'none']).default('none'),
      value: z.number().min(0).default(0),
    }).optional(),
    gracePeriodDays:          z.number().min(0).default(30),
    missedInstallmentPenalty: z.number().min(0).default(0),
  }).optional(),

  // Pricing
  pricing: z.object({
    useCurrentMetalRate:  z.boolean().default(true),
    fixedMetalRate:       z.number().optional().nullable(),
    makingChargesDiscount:z.number().min(0).max(100).default(0),
    waiveMakingCharges:   z.boolean().default(false),
  }).optional(),

  // Limits
  limits: z.object({
    maxEnrollments:            z.number().min(1).optional().nullable(),
    maxEnrollmentsPerCustomer: z.number().min(1).default(3),
  }).optional(),

  // Validity
  validity: z.object({
    startDate:          z.string().min(1, 'Start date is required'),
    endDate:            z.string().min(1, 'End date is required'),
    enrollmentDeadline: z.string().optional(),
  }),

  // Marketing
  marketing: z.object({
    isFeatured:   z.boolean().default(false),
    displayOrder: z.number().min(0).default(0),
    imageUrl:     z.string().optional(),
    bannerUrl:    z.string().optional(),
    highlights:   z.array(z.string()).optional(),
  }).optional(),

  // Notes
  notes: z
    .string()
    .max(1000)
    .optional()
    .or(z.literal('')),

  tags: z.array(z.string()).optional(),
})

export type CreateSchemeInput = z.infer<typeof createSchemeSchema>