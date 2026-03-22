import { z } from 'zod'

export const MESSAGES = {
  businessName: {
    required: 'Business name is required',
    minLength: 'Business name must be at least 2 characters',
    maxLength: 'Business name must not exceed 200 characters',
  },
  contactPerson: {
    firstNameRequired: 'First name is required',
    firstNameMin: 'First name must be at least 2 characters',
    firstNameMax: 'First name must not exceed 50 characters',
    phoneRequired: 'Phone number is required',
    phoneInvalid: 'Invalid phone number (must be 10 digits starting with 6-9)',
  },
  phone: {
    invalid: 'Invalid phone number (must be 10 digits starting with 6-9)',
  },
  gst: { invalid: 'Invalid GST number format' },
  pan: { invalid: 'Invalid PAN number format' },
  ifsc: { invalid: 'Invalid IFSC code' },
  pincode: { invalid: 'Invalid pincode (must be 6 digits)' },
  upi: { invalid: 'Invalid UPI ID format' },
}

const contactPersonSchema = z.object({
  firstName: z
    .string({ error: MESSAGES.contactPerson.firstNameRequired })
    .trim()
    .min(1, MESSAGES.contactPerson.firstNameRequired)
    .min(2, MESSAGES.contactPerson.firstNameMin)
    .max(50, MESSAGES.contactPerson.firstNameMax),
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
    .string({ error: MESSAGES.contactPerson.phoneRequired })
    .trim()
    .min(1, MESSAGES.contactPerson.phoneRequired)
    .regex(/^[6-9][0-9]{9}$/, MESSAGES.contactPerson.phoneInvalid),
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

const addressSchema = z.object({
  street: z.string().trim().max(200).optional().or(z.literal('')),
  landmark: z.string().trim().max(100).optional().or(z.literal('')),
  area: z.string().trim().max(100).optional().or(z.literal('')),
  city: z.string().trim().max(100).optional().or(z.literal('')),
  state: z.string().trim().max(100).optional().or(z.literal('')),
  country: z.string().trim().max(100).optional().or(z.literal('')),
  pincode: z
    .string()
    .trim()
    .regex(/^[0-9]{6}$/, MESSAGES.pincode.invalid)
    .optional()
    .or(z.literal('')),
})

const bankDetailsSchema = z.object({
  bankName: z.string().trim().max(100).optional().or(z.literal('')),
  accountNumber: z.string().trim().max(20).optional().or(z.literal('')),
  ifscCode: z
    .string()
    .trim()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, MESSAGES.ifsc.invalid)
    .optional()
    .or(z.literal('')),
  accountHolderName: z.string().trim().max(100).optional().or(z.literal('')),
  branchName: z.string().trim().max(100).optional().or(z.literal('')),
  accountType: z.enum(['savings', 'current', 'overdraft']).optional(),
})

const certificationSchema = z.object({
  certificationType: z.enum(['bis', 'hallmarking', 'iso', 'gemological', 'other']),
  certificateNumber: z.string().trim().max(50).optional().or(z.literal('')),
  issuedBy: z.string().trim().max(100).optional().or(z.literal('')),
  issueDate: z
    .string()
    .refine(date => !date || !isNaN(Date.parse(date)), 'Invalid issue date')
    .optional(),
  expiryDate: z
    .string()
    .refine(date => !date || !isNaN(Date.parse(date)), 'Invalid expiry date')
    .optional(),
  documentUrl: z.string().url('Invalid document URL').optional().or(z.literal('')),
})

const documentSchema = z.object({
  documentType: z.enum(['gst_certificate', 'pan_card', 'trade_license', 'contract', 'other']),
  documentNumber: z.string().trim().max(50).optional().or(z.literal('')),
  documentUrl: z.string().url('Invalid document URL').optional().or(z.literal('')),
})

export const createSupplierSchema = z.object({
  businessName: z
    .string({ error: MESSAGES.businessName.required })
    .trim()
    .min(1, MESSAGES.businessName.required)
    .min(2, MESSAGES.businessName.minLength)
    .max(200, MESSAGES.businessName.maxLength),

  displayName: z.string().trim().max(200).optional().or(z.literal('')),

  // optional rakha hai — manual check handleSubmit mein hoga
  contactPerson: contactPersonSchema.optional(),

  businessEmail: z.string().trim().email('Invalid business email').optional().or(z.literal('')),
  businessPhone: z
    .string()
    .trim()
    .regex(/^[6-9][0-9]{9}$/, MESSAGES.phone.invalid)
    .optional()
    .or(z.literal('')),
  website: z.string().trim().url('Invalid website URL').optional().or(z.literal('')),
  address: addressSchema.optional(),

  gstNumber: z
    .string()
    .trim()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      MESSAGES.gst.invalid
    )
    .optional()
    .or(z.literal('')),

  panNumber: z
    .string()
    .trim()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, MESSAGES.pan.invalid)
    .optional()
    .or(z.literal('')),

  tanNumber: z.string().trim().max(20).optional().or(z.literal('')),
  registrationNumber: z.string().trim().max(50).optional().or(z.literal('')),

  supplierType: z
    .enum(['manufacturer', 'wholesaler', 'distributor', 'artisan', 'importer', 'other'])
    .default('wholesaler'),

  supplierCategory: z
    .enum(['gold', 'silver', 'diamond', 'platinum', 'gemstone', 'pearls', 'making', 'packaging', 'mixed'])
     .default('mixed'),

  productsSupplied: z.array(z.string().trim()).optional(),
  specialization: z.array(z.string().trim()).optional(),

  paymentTerms: z
    .enum(['immediate', 'cod', 'net15', 'net30', 'net45', 'net60', 'custom'])
    .default('net30'),

creditPeriod: z
  .coerce.number()
  .int('Credit period must be an integer')
  .min(0, 'Credit period must be positive')
  .max(365, 'Credit period must not exceed 365 days')
  .default(30),

creditLimit: z.coerce.number().min(0, 'Credit limit must be positive').default(0),

  bankDetails: bankDetailsSchema.optional(),

  upiId: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/, MESSAGES.upi.invalid)
    .optional()
    .or(z.literal('')),

  certifications: z.array(certificationSchema).optional(),
  documents: z.array(documentSchema).optional(),
  notes: z.string().trim().max(1000, 'Notes must not exceed 1000 characters').optional().or(z.literal('')),
  internalNotes: z.string().trim().max(1000, 'Internal notes must not exceed 1000 characters').optional().or(z.literal('')),
  tags: z.array(z.string().trim()).optional(),
})

export const updateSupplierSchema = createSupplierSchema.partial()

export const updateRatingSchema = z.object({
  qualityRating: z.number().min(1, 'Quality rating must be at least 1').max(5, 'Quality rating must not exceed 5'),
  deliveryRating: z.number().min(1, 'Delivery rating must be at least 1').max(5, 'Delivery rating must not exceed 5'),
  priceRating: z.number().min(1, 'Price rating must be at least 1').max(5, 'Price rating must not exceed 5'),
})

export const blacklistSupplierSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, 'Reason is required')
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason must not exceed 500 characters'),
})

export const updateBalanceSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  type: z.enum(['payment', 'purchase', 'adjustment']),
  note: z.string().trim().max(500).optional().or(z.literal('')),
})

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>
export type UpdateRatingInput = z.infer<typeof updateRatingSchema>
export type BlacklistSupplierInput = z.infer<typeof blacklistSupplierSchema>
export type UpdateBalanceInput = z.infer<typeof updateBalanceSchema>