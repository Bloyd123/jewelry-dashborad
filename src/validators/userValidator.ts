// FILE: src/validators/userValidation.ts
// User Validation Logic using Zod

import { z } from 'zod'
import type {
  UserRole,
  Department,
  Language,
  Theme,
  DateFormat,
  Currency,
} from '@/types/user.types'

/**
 * Username Validation Schema
 */
const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username cannot exceed 30 characters')
  .regex(
    /^[a-zA-Z0-9_]+$/,
    'Username can only contain letters, numbers, and underscores'
  )

/**
 * Email Validation Schema
 */
const emailSchema = z
  .string()
  .email('Please provide a valid email address')
  .toLowerCase()

/**
 * Password Validation Schema
 */
const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  )

/**
 * Phone Validation Schema
 */
const phoneSchema = z
  .string()
  .regex(/^[0-9]{10}$/, 'Phone number must be a valid 10-digit number')
  .optional()
  .or(z.literal(''))

/**
 * Role Validation Schema
 */
const roleSchema = z.enum([
  'super_admin',
  'org_admin',
  'shop_admin',
  'manager',
  'staff',
  'accountant',
  'viewer',
])

/**
 * Department Validation Schema
 */
const departmentSchema = z.enum([
  'sales',
  'purchase',
  'inventory',
  'accounts',
  'management',
  'workshop',
  'quality_check',
  'customer_service',
  'other',
])

/**
 * User Preferences Schema
 */
const userPreferencesSchema = z.object({
  language: z.enum(['en', 'hi', 'mr', 'gu', 'ta', 'te']).optional(),
  timezone: z.string().optional(),
  currency: z.enum(['INR', 'USD', 'EUR', 'GBP', 'AED']).optional(),
  dateFormat: z.enum(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']).optional(),
  theme: z.enum(['light', 'dark', 'auto']).optional(),
  notificationsEnabled: z.boolean().optional(),
})

/**
 * Main User Validation Schema
 */
export const createUserSchema = z
  .object({
    // Basic Info
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    firstName: z
      .string()
      .min(1, 'First name is required')
      .max(50, 'First name cannot exceed 50 characters'),
    lastName: z
      .string()
      .max(50, 'Last name cannot exceed 50 characters')
      .optional()
      .or(z.literal('')),

    // Role & Access
    role: roleSchema,
    organizationId: z.string().optional().or(z.literal('')),
    primaryShop: z.string().optional().or(z.literal('')),

    // Contact
    phone: phoneSchema,

    // Employee Info
    designation: z
      .string()
      .max(100, 'Designation cannot exceed 100 characters')
      .optional()
      .or(z.literal('')),
    department: departmentSchema.optional(),
    employeeId: z
      .string()
      .max(50, 'Employee ID cannot exceed 50 characters')
      .optional()
      .or(z.literal('')),
    joiningDate: z.string().optional().or(z.literal('')),

    // Sales Info
    salesTarget: z
      .number()
      .min(0, 'Sales target cannot be negative')
      .optional()
      .or(z.literal(0)),
    commissionRate: z
      .number()
      .min(0, 'Commission rate cannot be negative')
      .max(100, 'Commission rate cannot exceed 100%')
      .optional()
      .or(z.literal(0)),

    // Preferences
    preferences: userPreferencesSchema.optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine(
    data => {
      // Super admin cannot have organization or shop
      if (data.role === 'super_admin') {
        return !data.organizationId && !data.primaryShop
      }
      return true
    },
    {
      message: 'Super admin cannot have organization or shop assignments',
      path: ['role'],
    }
  )
  .refine(
    data => {
      // Org admin must have organization
      if (data.role === 'org_admin') {
        return !!data.organizationId
      }
      return true
    },
    {
      message: 'Organization is required for org admin',
      path: ['organizationId'],
    }
  )
  .refine(
    data => {
      // Shop-level users must have primary shop
      if (
        ['shop_admin', 'manager', 'staff', 'accountant', 'viewer'].includes(
          data.role
        )
      ) {
        return !!data.primaryShop
      }
      return true
    },
    {
      message: 'Primary shop is required for shop-level users',
      path: ['primaryShop'],
    }
  )

/**
 * TypeScript Type from Zod Schema
 */
export type CreateUserInput = z.infer<typeof createUserSchema>

/**
 * Validation Result Interface
 */
export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

/**
 * Field Validation Result Interface
 */
export interface FieldValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Validate Complete User Form
 */
export const validateUser = (
  data: Partial<CreateUserInput>
): ValidationResult => {
  try {
    createUserSchema.parse(data)
    return {
      isValid: true,
      errors: {},
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.issues.forEach(err => {
        // CORRECT: error.issues
        const path = err.path.join('.')
        errors[path] = err.message
      })
      return {
        isValid: false,
        errors,
      }
    }
    return {
      isValid: false,
      errors: { _form: 'Validation failed' },
    }
  }
}

/**
 * Validate Single Field
 */
export const validateField = (
  name: keyof CreateUserInput,
  value: any
): FieldValidationResult => {
  try {
    // Get the schema for this specific field
    const fieldSchema = createUserSchema.shape[name]

    if (!fieldSchema) {
      return { isValid: true }
    }

    fieldSchema.parse(value)
    return { isValid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.issues[0]?.message || 'Invalid value',
      }
    }
    return { isValid: true }
  }
}

/**
 * Validate Password Strength
 */
export const validatePasswordStrength = (
  password: string
): {
  isStrong: boolean
  strength: 'weak' | 'medium' | 'strong'
  feedback: string[]
} => {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (password.length < 6) feedback.push('Password is too short')
  if (!/[a-z]/.test(password)) feedback.push('Add lowercase letters')
  if (!/[A-Z]/.test(password)) feedback.push('Add uppercase letters')
  if (!/[0-9]/.test(password)) feedback.push('Add numbers')
  if (!/[^a-zA-Z0-9]/.test(password))
    feedback.push('Add special characters for better security')

  let strength: 'weak' | 'medium' | 'strong' = 'weak'
  if (score >= 5) strength = 'strong'
  else if (score >= 3) strength = 'medium'

  return {
    isStrong: score >= 3,
    strength,
    feedback,
  }
}

/**
 * Validate Username Availability (Mock - Replace with API call)
 */
export const validateUsernameAvailability = async (
  username: string
): Promise<boolean> => {
  // Mock validation - Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 500))
  const unavailableUsernames = ['admin', 'root', 'test', 'user']
  return !unavailableUsernames.includes(username.toLowerCase())
}

/**
 * Validate Email Availability (Mock - Replace with API call)
 */
export const validateEmailAvailability = async (
  email: string
): Promise<boolean> => {
  // Mock validation - Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 500))
  const unavailableEmails = ['admin@example.com', 'test@example.com']
  return !unavailableEmails.includes(email.toLowerCase())
}

export default {
  createUserSchema,
  validateUser,
  validateField,
  validatePasswordStrength,
  validateUsernameAvailability,
  validateEmailAvailability,
}
