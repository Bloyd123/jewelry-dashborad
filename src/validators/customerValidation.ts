// ============================================================================
// FILE: src/validations/customerValidation.ts
// Customer Validation Schema for Frontend
// ============================================================================

import { z } from 'zod'
import { VALIDATION_MESSAGES, getRequiredMessage } from '@/constants/messages'
import type { FormValidationResult } from '@/types'

/**
 * Indian phone number regex (10 digits starting with 6-9)
 */
const indianPhoneRegex = /^[6-9][0-9]{9}$/

/**
 * Indian pincode regex (6 digits, first digit 1-9)
 */
const pincodeRegex = /^[1-9][0-9]{5}$/

/**
 * Aadhar number regex (12 digits starting with 2-9)
 */
const aadharRegex = /^[2-9][0-9]{11}$/

/**
 * PAN number regex (e.g., ABCDE1234F)
 */
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/

/**
 * GST number regex
 */
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/

/**
 * Address Schema
 */
const addressSchema = z
  .object({
    street: z
      .string()
      .max(200, VALIDATION_MESSAGES.MAX_LENGTH('Street address', 200))
      .optional(),
    city: z
      .string()
      .max(50, VALIDATION_MESSAGES.MAX_LENGTH('City name', 50))
      .optional(),
    state: z
      .string()
      .max(50, VALIDATION_MESSAGES.MAX_LENGTH('State name', 50))
      .optional(),
    pincode: z
      .string()
      .regex(pincodeRegex, 'Invalid pincode (must be 6 digits)')
      .optional()
      .or(z.literal('')),
  })
  .optional()

/**
 * Preferences Schema
 */
const preferencesSchema = z
  .object({
    preferredMetal: z
      .enum(['gold', 'silver', 'platinum', 'diamond'], {
        message: 'Invalid preferred metal',
      })
      .optional(),
    communicationPreference: z
      .enum(['email', 'sms', 'whatsapp', 'call', 'none'], {
        message: 'Invalid communication preference',
      })
      .optional(),
  })
  .optional()

/**
 * Main Customer Creation Schema
 */
export const createCustomerSchema = z.object({
  // Basic Information (Required)
  firstName: z
    .string()
    .trim()
    .min(1, getRequiredMessage('First name'))
    .min(2, VALIDATION_MESSAGES.MIN_LENGTH('First name', 2))
    .max(50, VALIDATION_MESSAGES.MAX_LENGTH('First name', 50))
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters'),

  lastName: z
    .string()
    .trim()
    .max(50, VALIDATION_MESSAGES.MAX_LENGTH('Last name', 50))
    .regex(/^[a-zA-Z\s]*$/, 'Last name can only contain letters')
    .optional()
    .or(z.literal('')),

  phone: z
    .string()
    .trim()
    .min(1, getRequiredMessage('Phone number'))
    .regex(indianPhoneRegex, VALIDATION_MESSAGES.INVALID_PHONE),

  alternatePhone: z
    .string()
    .trim()
    .regex(indianPhoneRegex, 'Invalid alternate phone number')
    .optional()
    .or(z.literal('')),

  whatsappNumber: z
    .string()
    .trim()
    .regex(indianPhoneRegex, 'Invalid WhatsApp number')
    .optional()
    .or(z.literal('')),

  email: z
    .string()
    .trim()
    .email(VALIDATION_MESSAGES.INVALID_EMAIL)
    .toLowerCase()
    .optional()
    .or(z.literal('')),

  // Personal Details
  dateOfBirth: z
    .string()
    .refine(date => {
      if (!date) return true
      const dob = new Date(date)
      const now = new Date()
      const age = now.getFullYear() - dob.getFullYear()
      return age >= 18 && age <= 120
    }, 'Customer must be between 18 and 120 years old')
    .optional()
    .or(z.literal('')),

  gender: z
    .enum(['male', 'female', 'other'], {
      message: 'Gender must be male, female, or other',
    })
    .optional(),

  anniversaryDate: z.string().optional().or(z.literal('')),

  // Address
  address: addressSchema,

  // KYC Details
  aadharNumber: z
    .string()
    .trim()
    .regex(aadharRegex, 'Invalid Aadhar number (must be 12 digits)')
    .refine(val => {
      if (!val) return true
      const cleaned = val.replace(/\s/g, '')
      return cleaned.length === 12
    }, 'Aadhar must be exactly 12 digits')
    .optional()
    .or(z.literal('')),

  panNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(panRegex, 'Invalid PAN format (e.g., ABCDE1234F)')
    .optional()
    .or(z.literal('')),

  gstNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(gstRegex, VALIDATION_MESSAGES.INVALID_GST)
    .optional()
    .or(z.literal('')),

  // Customer Type
  customerType: z
    .enum(['retail', 'wholesale', 'vip', 'regular'], {
      message: 'Invalid customer type',
    })
    .optional(),

  customerCategory: z
    .enum(['gold', 'silver', 'diamond', 'platinum', 'mixed'], {
      message: 'Invalid customer category',
    })
    .optional(),

  // Financial
  creditLimit: z
    .number()
    .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
    .optional()
    .or(z.literal(0)),

  // Preferences
  preferences: preferencesSchema,

  // Source
  source: z
    .enum(
      [
        'walk_in',
        'referral',
        'online',
        'phone',
        'social_media',
        'advertisement',
        'other',
      ],
      {
        message: 'Invalid customer source',
      }
    )
    .optional(),

  referredBy: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid referral customer ID')
    .optional()
    .or(z.literal('')),

  // Notes & Tags
  notes: z
    .string()
    .trim()
    .max(1000, VALIDATION_MESSAGES.MAX_LENGTH('Notes', 1000))
    .optional()
    .or(z.literal('')),

  tags: z
    .array(
      z.string().trim().max(50, VALIDATION_MESSAGES.MAX_LENGTH('Each tag', 50))
    )
    .optional(),
})

/**
 * Customer Update Schema (all fields optional)
 */
export const updateCustomerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, VALIDATION_MESSAGES.MIN_LENGTH('First name', 2))
    .max(50, VALIDATION_MESSAGES.MAX_LENGTH('First name', 50))
    .optional(),

  lastName: z
    .string()
    .trim()
    .max(50, VALIDATION_MESSAGES.MAX_LENGTH('Last name', 50))
    .optional(),

  phone: z
    .string()
    .trim()
    .regex(indianPhoneRegex, VALIDATION_MESSAGES.INVALID_PHONE)
    .optional(),

  email: z.string().trim().email(VALIDATION_MESSAGES.INVALID_EMAIL).optional(),

  customerType: z.enum(['retail', 'wholesale', 'vip', 'regular']).optional(),

  isActive: z.boolean().optional(),

  creditLimit: z
    .number()
    .min(0, VALIDATION_MESSAGES.POSITIVE_NUMBER)
    .optional(),

  // Prevent updating these fields
  customerCode: z.never().optional(),
  totalPurchases: z.never().optional(),
  loyaltyPoints: z.never().optional(),
})

/**
 * Search Customer Schema
 */
export const searchCustomerSchema = z.object({
  search: z
    .string()
    .trim()
    .min(1, VALIDATION_MESSAGES.MIN_LENGTH('Search query', 1))
    .max(100, VALIDATION_MESSAGES.MAX_LENGTH('Search query', 100))
    .optional(),

  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, VALIDATION_MESSAGES.INVALID_PHONE)
    .optional(),

  email: z.string().trim().email(VALIDATION_MESSAGES.INVALID_EMAIL).optional(),

  customerCode: z.string().trim().toUpperCase().optional(),
})

/**
 * Blacklist Customer Schema
 */
export const blacklistCustomerSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(10, VALIDATION_MESSAGES.MIN_LENGTH('Reason', 10))
    .max(500, VALIDATION_MESSAGES.MAX_LENGTH('Reason', 500)),
})

/**
 * Loyalty Points Schema
 */
export const loyaltyPointsSchema = z.object({
  points: z
    .number()
    .int(VALIDATION_MESSAGES.INVALID_NUMBER)
    .min(1, VALIDATION_MESSAGES.MIN_VALUE('Points', 1)),

  reason: z
    .string()
    .trim()
    .max(200, VALIDATION_MESSAGES.MAX_LENGTH('Reason', 200))
    .optional(),
})

/**
 * Type exports
 */
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>
export type SearchCustomerInput = z.infer<typeof searchCustomerSchema>
export type BlacklistCustomerInput = z.infer<typeof blacklistCustomerSchema>
export type LoyaltyPointsInput = z.infer<typeof loyaltyPointsSchema>

/**
 * Helper function to validate customer data
 */
export const validateCustomer = (
  data: unknown
): FormValidationResult<CreateCustomerInput> => {
  const result = createCustomerSchema.safeParse(data)

  if (result.success) {
    return {
      isValid: true,
      errors: {},
    }
  }

  const errors = getValidationErrors(result.error)
  return {
    isValid: false,
    errors,
  }
}

/**
 * Helper function to validate customer update
 */
export const validateCustomerUpdate = (
  data: unknown
): FormValidationResult<UpdateCustomerInput> => {
  const result = updateCustomerSchema.safeParse(data)

  if (result.success) {
    return {
      isValid: true,
      errors: {},
    }
  }

  const errors = getValidationErrors(result.error)
  return {
    isValid: false,
    errors,
  }
}

/**
 * Helper function to validate search
 */
export const validateCustomerSearch = (
  data: unknown
): FormValidationResult<SearchCustomerInput> => {
  const result = searchCustomerSchema.safeParse(data)

  if (result.success) {
    return {
      isValid: true,
      errors: {},
    }
  }

  const errors = getValidationErrors(result.error)
  return {
    isValid: false,
    errors,
  }
}

/**
 * Helper function to get validation errors in a formatted way
 */
export const getValidationErrors = (error: z.ZodError) => {
  return error.issues.reduce(
    (acc, err) => {
      const path = err.path.join('.')
      acc[path] = err.message
      return acc
    },
    {} as Record<string, string>
  )
}

/**
 * Helper function to validate a single field
 */
export const validateField = (
  fieldName: keyof CreateCustomerInput,
  value: any
): { isValid: boolean; error?: string } => {
  try {
    const fieldSchema = createCustomerSchema.shape[fieldName]
    if (!fieldSchema) {
      return { isValid: true }
    }

    fieldSchema.parse(value)
    return { isValid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.issues[0]?.message || 'Invalid input',
      }
    }
    return {
      isValid: false,
      error: 'Invalid input',
    }
  }
}

/**
 * Check if customer data has required fields
 */
export const hasRequiredFields = (
  data: Partial<CreateCustomerInput>
): boolean => {
  return Boolean(data.firstName && data.phone)
}

/**
 * Get list of missing required fields
 */
export const getMissingRequiredFields = (
  data: Partial<CreateCustomerInput>
): string[] => {
  const missing: string[] = []

  if (!data.firstName) missing.push('First Name')
  if (!data.phone) missing.push('Phone')

  return missing
}
