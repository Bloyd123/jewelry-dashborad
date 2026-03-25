// FILE: src/validators/shopValidation.ts

import { z } from 'zod'

const objectId = z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid ID')

const coordinatesSchema = z
  .tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)])
  .optional()

const phoneSchema = z
  .string({ error: 'Phone number is required' })
  .trim()
  .regex(/^[0-9]{10}$/, 'Must be a valid 10-digit phone number')

// ============================================
// BANK DETAIL
// ============================================
const bankDetailSchema = z.object({
  bankName:          z.string({ error: 'Bank name is required' }).trim().min(1, 'Bank name is required'),
  accountNumber:     z.string({ error: 'Account number is required' }).trim().min(1, 'Account number is required'),
  ifscCode:          z.string({ error: 'IFSC code is required' }).trim().toUpperCase().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code'),
  accountHolderName: z.string({ error: 'Account holder name is required' }).trim().min(1, 'Account holder name is required'),
  branchName:        z.string().trim().optional(),
  accountType:       z.enum(['savings', 'current']).optional(),
  isPrimary:         z.boolean().optional(),
})

// ============================================
// UPI DETAIL
// ============================================
const upiDetailSchema = z.object({
  upiId:     z.string({ error: 'UPI ID is required' }).trim().regex(/^[\w.-]+@[\w.-]+$/, 'Invalid UPI ID'),
  name:      z.string().trim().optional(),
  isPrimary: z.boolean().optional(),
})

// ============================================
// CREATE SHOP SCHEMA
// ============================================
export const createShopSchema = z.object({
  name: z
    .string({ error: 'Shop name is required' })
    .trim()
    .min(3, 'Shop name must be at least 3 characters')
    .max(100, 'Shop name must be at most 100 characters'),

  displayName: z
    .string()
    .trim()
    .max(100)
    .optional()
    .or(z.literal('')),

  email: z
    .string()
    .trim()
    .email('Please provide a valid email')
    .optional()
    .or(z.literal('')),

  phone: phoneSchema,

  alternatePhone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, 'Must be a valid 10-digit phone number')
    .optional()
    .or(z.literal('')),

  whatsappNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, 'Must be a valid 10-digit phone number')
    .optional()
    .or(z.literal('')),

  website: z
    .string()
    .trim()
    .url('Invalid website URL')
    .optional()
    .or(z.literal('')),

  address: z.object(
    {
      street:   z.string({ error: 'Street address is required' }).trim().min(1, 'Street address is required'),
      city:     z.string({ error: 'City is required' }).trim().min(1, 'City is required'),
      state:    z.string({ error: 'State is required' }).trim().min(1, 'State is required'),
      country:  z.string().trim().optional(),
      pincode:  z.string({ error: 'Pincode is required' }).trim().regex(/^[0-9]{6}$/, 'Invalid pincode'),
      landmark: z.string().trim().optional(),
      coordinates: coordinatesSchema,
    },
    { error: 'Address is required' }
  ),

  gstNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      'Invalid GST number'
    )
    .optional()
    .or(z.literal('')),

  panNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number')
    .optional()
    .or(z.literal('')),

  tanNumber: z
    .string()
    .trim()
    .optional()
    .or(z.literal('')),

  shopType: z
    .enum(['retail', 'wholesale', 'manufacturing', 'showroom', 'workshop', 'warehouse', 'online'])
    .optional(),

  category: z
    .enum(['jewelry', 'gold', 'silver', 'diamond', 'gemstone', 'pearls', 'platinum', 'mixed'])
    .optional(),

  establishedYear: z
    .number()
    .int()
    .min(1900, 'Invalid year')
    .max(new Date().getFullYear(), 'Year cannot be in the future')
    .optional(),

  managerId:              objectId.optional(),
  organizationId:         objectId.optional(),
  copySettingsFromShopId: objectId.optional(),

  bankDetails: z.array(bankDetailSchema).optional(),
  upiDetails:  z.array(upiDetailSchema).optional(),
})

// ============================================
// UPDATE SHOP SCHEMA (all fields optional)
// ============================================
export const updateShopSchema = createShopSchema.partial()

// ============================================
// SHOP SETTINGS SCHEMA
// ============================================
export const shopSettingsSchema = z.object({
  settings: z.object({
    currency:           z.enum(['INR', 'USD', 'EUR', 'GBP', 'AED', 'SAR']).optional(),
    language:           z.enum(['en', 'hi', 'mr', 'gu', 'ta', 'te']).optional(),
    defaultWeightUnit:  z.enum(['gram', 'kg', 'tola', 'ounce', 'carat']).optional(),
    enableGST:          z.boolean().optional(),

    gstRates: z.object({
      gold:    z.number().min(0).max(100).optional(),
      silver:  z.number().min(0).max(100).optional(),
      diamond: z.number().min(0).max(100).optional(),
      making:  z.number().min(0).max(100).optional(),
      other:   z.number().min(0).max(100).optional(),
    }).optional(),

    enableBarcode:       z.boolean().optional(),
    enableQRCode:        z.boolean().optional(),
    autoGenerateInvoice: z.boolean().optional(),
    invoicePrefix:       z.string().trim().optional(),
    timezone:            z.string().optional(),
    dateFormat:          z.string().optional(),
    timeFormat:          z.enum(['12h', '24h']).optional(),

    printSettings: z.object({
      invoiceHeader:       z.string().optional(),
      invoiceFooter:       z.string().optional(),
      showLogo:            z.boolean().optional(),
      showQRCode:          z.boolean().optional(),
      showBankDetails:     z.boolean().optional(),
      showTermsConditions: z.boolean().optional(),
      paperSize:           z.enum(['A4', 'A5', 'thermal-3inch', 'thermal-2inch']).optional(),
    }).optional(),

    notifications: z.object({
      emailNotifications:    z.boolean().optional(),
      smsNotifications:      z.boolean().optional(),
      whatsappNotifications: z.boolean().optional(),
      notifyOnLowStock:      z.boolean().optional(),
      notifyOnSale:          z.boolean().optional(),
      notifyOnReturn:        z.boolean().optional(),
    }).optional(),
  }),
})

// ============================================
// SHOP FILTERS SCHEMA
// ============================================
export const shopFiltersSchema = z.object({
  search:         z.string().trim().optional(),
  isActive:       z.boolean().optional(),
  isVerified:     z.boolean().optional(),
  shopType:       z.enum(['retail', 'wholesale', 'manufacturing', 'showroom', 'workshop', 'warehouse', 'online']).optional(),
  category:       z.enum(['jewelry', 'gold', 'silver', 'diamond', 'gemstone', 'pearls', 'platinum', 'mixed']).optional(),
  city:           z.string().trim().optional(),
  state:          z.string().trim().optional(),
  organizationId: objectId.optional(),
  page:           z.number().int().min(1).optional(),
  limit:          z.number().int().min(1).max(100).optional(),
  sort:           z.string().optional(),
})

// ============================================
// TYPE EXPORTS
// ============================================
export type CreateShopInput   = z.infer<typeof createShopSchema>
export type UpdateShopInput   = z.infer<typeof updateShopSchema>
export type ShopSettingsInput = z.infer<typeof shopSettingsSchema>
export type ShopFiltersInput  = z.infer<typeof shopFiltersSchema>