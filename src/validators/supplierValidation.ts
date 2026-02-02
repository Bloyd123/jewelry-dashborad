// FILE: src/validations/supplierValidation.ts

import { z } from 'zod'

/**
 * 🎯 SUPPLIER VALIDATION SCHEMAS
 */

// ============================================
// SUB-SCHEMAS
// ============================================

// Contact Person Schema
const contactPersonSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: z
    .string()
    .trim()
    .max(50, 'Last name must not exceed 50 characters')
    .optional()
    .or(z.literal('')),
  designation: z
    .string()
    .trim()
    .max(100, 'Designation must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9][0-9]{9}$/, 'Invalid phone number (must be 10 digits starting with 6-9)'),
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
})

// Address Schema
const addressSchema = z.object({
  street: z
    .string()
    .trim()
    .max(200, 'Street must not exceed 200 characters')
    .optional()
    .or(z.literal('')),
  landmark: z
    .string()
    .trim()
    .max(100, 'Landmark must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  area: z
    .string()
    .trim()
    .max(100, 'Area must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .trim()
    .max(100, 'City must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  state: z
    .string()
    .trim()
    .max(100, 'State must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  country: z
    .string()
    .trim()
    .max(100, 'Country must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  pincode: z
    .string()
    .trim()
    .regex(/^[0-9]{6}$/, 'Invalid pincode (must be 6 digits)')
    .optional()
    .or(z.literal('')),
})

// Bank Details Schema
const bankDetailsSchema = z.object({
  bankName: z
    .string()
    .trim()
    .max(100, 'Bank name must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  accountNumber: z
    .string()
    .trim()
    .max(20, 'Account number must not exceed 20 characters')
    .optional()
    .or(z.literal('')),
  ifscCode: z
    .string()
    .trim()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code')
    .optional()
    .or(z.literal('')),
  accountHolderName: z
    .string()
    .trim()
    .max(100, 'Account holder name must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  branchName: z
    .string()
    .trim()
    .max(100, 'Branch name must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  accountType: z
    .enum(['savings', 'current', 'overdraft'])
    .optional(),
})

// Certification Schema
const certificationSchema = z.object({
  certificationType: z.enum(['bis', 'hallmarking', 'iso', 'gemological', 'other']),
  certificateNumber: z
    .string()
    .trim()
    .max(50, 'Certificate number must not exceed 50 characters')
    .optional()
    .or(z.literal('')),
  issuedBy: z
    .string()
    .trim()
    .max(100, 'Issued by must not exceed 100 characters')
    .optional()
    .or(z.literal('')),
  issueDate: z
    .string()
    .refine(date => !date || !isNaN(Date.parse(date)), 'Invalid issue date')
    .optional(),
  expiryDate: z
    .string()
    .refine(date => !date || !isNaN(Date.parse(date)), 'Invalid expiry date')
    .optional(),
  documentUrl: z
    .string()
    .url('Invalid document URL')
    .optional()
    .or(z.literal('')),
})

// Document Schema
const documentSchema = z.object({
  documentType: z.enum(['gst_certificate', 'pan_card', 'trade_license', 'contract', 'other']),
  documentNumber: z
    .string()
    .trim()
    .max(50, 'Document number must not exceed 50 characters')
    .optional()
    .or(z.literal('')),
  documentUrl: z
    .string()
    .url('Invalid document URL')
    .optional()
    .or(z.literal('')),
})

// ============================================
// CREATE SUPPLIER SCHEMA
// ============================================
export const createSupplierSchema = z.object({
  // Business Information (Required)
  businessName: z
    .string()
    .trim()
    .min(1, 'Business name is required')
    .min(2, 'Business name must be at least 2 characters')
    .max(200, 'Business name must not exceed 200 characters'),
  
  displayName: z
    .string()
    .trim()
    .max(200, 'Display name must not exceed 200 characters')
    .optional()
    .or(z.literal('')),

  // Contact Person (Required)
  contactPerson: contactPersonSchema,

  // Business Contact (Optional)
  businessEmail: z
    .string()
    .trim()
    .email('Invalid business email')
    .optional()
    .or(z.literal('')),
  
  businessPhone: z
    .string()
    .trim()
    .regex(/^[6-9][0-9]{9}$/, 'Invalid business phone number')
    .optional()
    .or(z.literal('')),
  
  website: z
    .string()
    .trim()
    .url('Invalid website URL')
    .optional()
    .or(z.literal('')),

  // Address (Optional)
  address: addressSchema.optional(),

  // Registration (Optional)
  gstNumber: z
    .string()
    .trim()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      'Invalid GST number format'
    )
    .optional()
    .or(z.literal('')),
  
  panNumber: z
    .string()
    .trim()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number format')
    .optional()
    .or(z.literal('')),
  
  tanNumber: z
    .string()
    .trim()
    .max(20, 'TAN number must not exceed 20 characters')
    .optional()
    .or(z.literal('')),
  
  registrationNumber: z
    .string()
    .trim()
    .max(50, 'Registration number must not exceed 50 characters')
    .optional()
    .or(z.literal('')),

  // Type & Category (Optional with defaults)
  supplierType: z
    .enum(['manufacturer', 'wholesaler', 'distributor', 'artisan', 'importer', 'other'])
    .optional(),
  
  supplierCategory: z
    .enum(['gold', 'silver', 'diamond', 'platinum', 'gemstone', 'pearls', 'making', 'packaging', 'mixed'])
    .optional(),

  // Products (Optional)
  productsSupplied: z.array(z.string().trim()).optional(),
  specialization: z.array(z.string().trim()).optional(),

  // Payment Terms (Optional with defaults)
  paymentTerms: z
    .enum(['immediate', 'cod', 'net15', 'net30', 'net45', 'net60', 'custom'])
    .optional(),
  
  creditPeriod: z
    .number()
    .int('Credit period must be an integer')
    .min(0, 'Credit period must be positive')
    .max(365, 'Credit period must not exceed 365 days')
    .optional(),
  
  creditLimit: z
    .number()
    .min(0, 'Credit limit must be positive')
    .optional(),

  // Bank Details (Optional)
  bankDetails: bankDetailsSchema.optional(),
  
  upiId: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/, 'Invalid UPI ID format')
    .optional()
    .or(z.literal('')),

  // Certifications & Documents (Optional)
  certifications: z.array(certificationSchema).optional(),
  documents: z.array(documentSchema).optional(),

  // Notes (Optional)
  notes: z
    .string()
    .trim()
    .max(1000, 'Notes must not exceed 1000 characters')
    .optional()
    .or(z.literal('')),
  
  internalNotes: z
    .string()
    .trim()
    .max(1000, 'Internal notes must not exceed 1000 characters')
    .optional()
    .or(z.literal('')),
  
  tags: z.array(z.string().trim()).optional(),
})

// ============================================
// UPDATE SUPPLIER SCHEMA (all optional)
// ============================================
export const updateSupplierSchema = createSupplierSchema.partial()

// ============================================
// RATING SCHEMA
// ============================================
export const updateRatingSchema = z.object({
  qualityRating: z
    .number()
    .min(1, 'Quality rating must be at least 1')
    .max(5, 'Quality rating must not exceed 5'),
  
  deliveryRating: z
    .number()
    .min(1, 'Delivery rating must be at least 1')
    .max(5, 'Delivery rating must not exceed 5'),
  
  priceRating: z
    .number()
    .min(1, 'Price rating must be at least 1')
    .max(5, 'Price rating must not exceed 5'),
})

// ============================================
// BLACKLIST SCHEMA
// ============================================
export const blacklistSupplierSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, 'Reason is required')
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason must not exceed 500 characters'),
})

// ============================================
// BALANCE UPDATE SCHEMA
// ============================================
export const updateBalanceSchema = z.object({
  amount: z
    .number()
    .min(0.01, 'Amount must be greater than 0'),
  
  type: z.enum(['payment', 'purchase', 'adjustment']),
  
  note: z
    .string()
    .trim()
    .max(500, 'Note must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
})

// ============================================
// TYPE EXPORTS
// ============================================
export type CreateSupplierInput = z.infer<typeof createSupplierSchema>
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>
export type UpdateRatingInput = z.infer<typeof updateRatingSchema>
export type BlacklistSupplierInput = z.infer<typeof blacklistSupplierSchema>
export type UpdateBalanceInput = z.infer<typeof updateBalanceSchema>