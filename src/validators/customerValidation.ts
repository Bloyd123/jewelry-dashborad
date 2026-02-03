// FILE: src/validations/customerValidation.ts
// Customer Zod Validation Schemas

import { z } from 'zod'

/**
 * Custom validation messages
 */
const MESSAGES = {
  firstName: {
    required: 'First name is required',
    minLength: 'First name must be at least 2 characters',
    maxLength: 'First name cannot exceed 50 characters',
    pattern: 'First name can only contain letters and spaces',
  },
  lastName: {
    maxLength: 'Last name cannot exceed 50 characters',
    pattern: 'Last name can only contain letters and spaces',
  },
  phone: {
    required: 'Phone number is required',
    invalid:
      'Invalid Indian phone number (must start with 6-9 and be 10 digits)',
  },
  email: {
    invalid: 'Invalid email address',
  },
  age: {
    range: 'Customer must be between 18 and 120 years old',
  },
  aadhar: {
    invalid: 'Invalid Aadhar number (must be 12 digits starting with 2-9)',
  },
  pan: {
    invalid: 'Invalid PAN format (e.g., ABCDE1234F)',
  },
  gst: {
    invalid: 'Invalid GST number format',
  },
  pincode: {
    invalid: 'Invalid pincode (must be 6 digits)',
  },
  creditLimit: {
    positive: 'Credit limit must be a positive number',
  },
  notes: {
    maxLength: 'Notes cannot exceed 1000 characters',
  },
  tags: {
    maxLength: 'Each tag cannot exceed 50 characters',
  },
}

/**
 * Address Schema
 */
const addressSchema = z
  .object({
    street: z
      .string()
      .trim()
      .max(200, 'Street address cannot exceed 200 characters')
      .optional()
      .or(z.literal('')),
    city: z
      .string()
      .trim()
      .max(50, 'City name cannot exceed 50 characters')
      .optional()
      .or(z.literal('')),
    state: z
      .string()
      .trim()
      .max(50, 'State name cannot exceed 50 characters')
      .optional()
      .or(z.literal('')),
    pincode: z
      .string()
      .trim()
      .regex(/^[1-9][0-9]{5}$/, MESSAGES.pincode.invalid)
      .optional()
      .or(z.literal('')),
  })
  .optional()

/**
 * Customer Preferences Schema
 */
const preferencesSchema = z
  .object({
    preferredMetal: z
      .enum(['gold', 'silver', 'platinum', 'diamond'])
      .optional(),
    communicationPreference: z
      .enum(['email', 'sms', 'whatsapp', 'call', 'none'])
      .optional(),
  })
  .optional()

/**
 * Create Customer Schema
 */
export const createCustomerSchema = z.object({
  // Basic Information (Required)
  firstName: z
    .string()
    .trim()
    .min(1, MESSAGES.firstName.required)
    .min(2, MESSAGES.firstName.minLength)
    .max(50, MESSAGES.firstName.maxLength)
    .regex(/^[a-zA-Z\s]+$/, MESSAGES.firstName.pattern),

  lastName: z
    .string()
    .trim()
    .max(50, MESSAGES.lastName.maxLength)
    .regex(/^[a-zA-Z\s]*$/, MESSAGES.lastName.pattern)
    .optional()
    .or(z.literal('')),

  phone: z
    .string()
    .trim()
    .min(1, MESSAGES.phone.required)
    .regex(/^[6-9][0-9]{9}$/, MESSAGES.phone.invalid),

  // Optional Contact
  alternatePhone: z
    .string()
    .trim()
    .regex(/^[6-9][0-9]{9}$/, 'Invalid alternate phone number')
    .optional()
    .or(z.literal('')),

  whatsappNumber: z
    .string()
    .trim()
    .regex(/^[6-9][0-9]{9}$/, 'Invalid WhatsApp number')
    .optional()
    .or(z.literal('')),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email(MESSAGES.email.invalid)
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
    }, MESSAGES.age.range)
    .optional()
    .or(z.literal('')),

  gender: z.enum(['male', 'female', 'other']).optional(),

  anniversaryDate: z
    .string()
    .refine(date => {
      if (!date) return true
      return !isNaN(Date.parse(date))
    }, 'Invalid anniversary date')
    .optional()
    .or(z.literal('')),

  // Address
  address: addressSchema,

  // KYC Details
  aadharNumber: z
    .string()
    .trim()
    .regex(/^[2-9][0-9]{11}$/, MESSAGES.aadhar.invalid)
    .optional()
    .or(z.literal('')),

  panNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, MESSAGES.pan.invalid)
    .optional()
    .or(z.literal('')),

  gstNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      MESSAGES.gst.invalid
    )
    .optional()
    .or(z.literal('')),

  // Customer Classification
  customerType: z.enum(['retail', 'wholesale', 'vip', 'regular']).optional(),
  customerCategory: z
    .enum(['gold', 'silver', 'diamond', 'platinum', 'mixed'])
    .optional(),

  // Financial
  creditLimit: z.number().min(0, MESSAGES.creditLimit.positive).optional(),

  // Preferences
  preferences: preferencesSchema,

  // Source & Referral
  source: z
    .enum([
      'walk_in',
      'referral',
      'online',
      'phone',
      'social_media',
      'advertisement',
      'other',
    ])
    .optional(),

  referredBy: z
    .string()
    .optional()
    .transform(val => (val === '' ? undefined : val)) // ✅ Convert empty string to undefined
    .refine(
      val => !val || val.length === 24, // MongoDB ObjectId is 24 chars
      { message: 'Invalid customer reference ID' }
    ),

  // Additional Info
  notes: z
    .string()
    .trim()
    .max(1000, MESSAGES.notes.maxLength)
    .optional()
    .or(z.literal('')),

  tags: z.array(z.string().trim().max(50, MESSAGES.tags.maxLength)).optional(),
})

/**
 * Update Customer Schema (all fields optional)
 */
export const updateCustomerSchema = createCustomerSchema.partial()

/**
 * Blacklist Customer Schema
 */
export const blacklistCustomerSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, 'Blacklist reason is required')
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason cannot exceed 500 characters'),
})

/**
 * Loyalty Points Schema
 */
export const loyaltyPointsSchema = z.object({
  points: z
    .number()
    .int('Points must be a whole number')
    .positive('Points must be a positive number'),

  reason: z
    .string()
    .trim()
    .max(200, 'Reason cannot exceed 200 characters')
    .optional()
    .or(z.literal('')),
})

/**
 * Type Exports
 */
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>
export type BlacklistCustomerInput = z.infer<typeof blacklistCustomerSchema>
export type LoyaltyPointsInput = z.infer<typeof loyaltyPointsSchema>
