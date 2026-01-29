// FILE: src/validations/productValidation.ts
import { z } from 'zod'

// 
// SUB-SCHEMAS
// 

const metalSchema = z.object({
  type: z.enum(['gold', 'silver', 'platinum', 'diamond', 'gemstone', 'mixed']),
  purity: z.enum([
    '24K',
    '22K',
    '18K',
    '14K',
    '10K',
    '916',
    '999',
    '925',
    '850',
    '950',
    'other',
  ]),
  purityPercentage: z.number().min(0).max(100).optional(),
  color: z
    .enum(['yellow', 'white', 'rose', 'mixed'])
    .optional()
    .default('yellow'),
})

const weightSchema = z.object({
  grossWeight: z.number().min(0.001, 'Gross weight must be greater than 0'),
  stoneWeight: z.number().min(0).optional().default(0),
  wastage: z
    .object({
      percentage: z.number().min(0).max(100).optional().default(0),
      weight: z.number().min(0).optional().default(0),
    })
    .optional(),
  unit: z
    .enum(['gram', 'kg', 'tola', 'ounce', 'carat'])
    .optional()
    .default('gram'),
})

const stoneCertificateSchema = z
  .object({
    certificateNumber: z.string().optional(),
    certificateUrl: z.string().url().optional(),
    issuedBy: z.string().optional(),
  })
  .optional()

const stoneSchema = z.object({
  stoneType: z.enum([
    'diamond',
    'ruby',
    'emerald',
    'sapphire',
    'pearl',
    'topaz',
    'amethyst',
    'garnet',
    'other',
  ]),
  stoneName: z.string().optional(),
  stoneQuality: z
    .enum(['VS', 'VVS', 'SI', 'IF', 'FL', 'A', 'AA', 'AAA', 'B', 'C'])
    .optional(),
  stoneColor: z.string().optional(),
  stoneShape: z
    .enum([
      'round',
      'oval',
      'square',
      'rectangular',
      'pear',
      'marquise',
      'heart',
      'emerald_cut',
      'other',
    ])
    .optional(),
  stoneCut: z
    .enum(['excellent', 'very_good', 'good', 'fair', 'poor'])
    .optional(),
  stoneClarity: z.string().optional(),
  caratWeight: z.number().min(0).optional(),
  stoneWeight: z.number().min(0).optional(),
  pieceCount: z.number().int().min(0).default(1),
  stonePrice: z.number().min(0).default(0),
  stoneCertificate: stoneCertificateSchema,
})

const makingChargesSchema = z.object({
  type: z.enum(['per_gram', 'percentage', 'flat', 'none']).default('per_gram'),
  value: z.number().min(0).default(0),
})

const discountSchema = z.object({
  type: z.enum(['percentage', 'flat', 'none']).default('none'),
  value: z.number().min(0).default(0),
})

const gstSchema = z.object({
  percentage: z.number().min(0).max(100).default(3),
})

const pricingSchema = z.object({
  costPrice: z.number().min(0).optional(),
  sellingPrice: z.number().min(0),
  mrp: z.number().min(0).optional(),
  otherCharges: z.number().min(0).optional().default(0),
  gst: gstSchema.optional(),
  discount: discountSchema.optional(),
})

const stockSchema = z.object({
  quantity: z.number().int().min(0).default(1),
  unit: z.enum(['piece', 'pair', 'set', 'gram', 'kg']).default('piece'),
  minStockLevel: z.number().int().min(0).optional().default(0),
  maxStockLevel: z.number().int().min(0).optional().default(0),
  reorderLevel: z.number().int().min(0).optional().default(0),
})

const sizeSchema = z
  .object({
    value: z.string(),
    unit: z.enum(['mm', 'cm', 'inch']).default('mm'),
  })
  .optional()

const dimensionsSchema = z
  .object({
    length: z.number().min(0),
    width: z.number().min(0),
    height: z.number().min(0),
    unit: z.enum(['mm', 'cm', 'inch']).default('mm'),
  })
  .optional()

const hallmarkingSchema = z
  .object({
    isHallmarked: z.boolean().default(false),
    hallmarkNumber: z.string().optional(),
    hallmarkingCenter: z.string().optional(),
    bisLicenseNumber: z.string().optional(),
    huid: z.string().optional(),
    hallmarkDate: z.string().optional(),
  })
  .optional()

const supplierDetailsSchema = z
  .object({
    supplierName: z.string().optional(),
    supplierCode: z.string().optional(),
    purchaseDate: z.string().optional(),
    purchasePrice: z.number().min(0).optional(),
    invoiceNumber: z.string().optional(),
  })
  .optional()

const imageSchema = z.object({
  url: z.string().url(),
  isPrimary: z.boolean().default(false),
  caption: z.string().optional(),
})

const designSchema = z
  .object({
    designNumber: z.string().optional(),
    designer: z.string().optional(),
    collection: z.string().optional(),
    style: z
      .enum([
        'traditional',
        'modern',
        'antique',
        'contemporary',
        'ethnic',
        'western',
      ])
      .optional(),
    pattern: z.string().optional(),
  })
  .optional()

const warrantySchema = z
  .object({
    hasWarranty: z.boolean().default(false),
    warrantyPeriod: z.number().int().min(0).default(0),
    warrantyType: z.enum(['lifetime', 'limited', 'none']).default('none'),
    warrantyTerms: z.string().optional(),
  })
  .optional()

const certificateSchema = z.object({
  certificateType: z.enum([
    'hallmark',
    'diamond',
    'gemstone',
    'purity',
    'authenticity',
    'other',
  ]),
  certificateNumber: z.string().optional(),
  issuedBy: z.string().optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  certificateUrl: z.string().url().optional(),
})

// 
// CREATE PRODUCT SCHEMA
// 
export const createProductSchema = z.object({
  // Basic Info
  name: z
    .string()
    .trim()
    .min(3, 'Product name must be at least 3 characters')
    .max(200, 'Product name cannot exceed 200 characters'),
  description: z.string().trim().max(2000).optional(),

  // Category
  categoryId: z.string().min(1, 'Category is required'),
  subCategoryId: z.string().optional(),
  productType: z
    .enum(['ready_made', 'custom_made', 'on_order', 'repair', 'exchange'])
    .default('ready_made'),

  // Identification
  barcode: z.string().trim().optional(),
  sku: z.string().trim().optional(),
  huid: z.string().trim().optional(),

  // Product Details
  metal: metalSchema,
  weight: weightSchema,
  stones: z.array(stoneSchema).optional(),
  makingCharges: makingChargesSchema.optional(),
  pricing: pricingSchema,
  stock: stockSchema.optional(),

  // Physical Attributes
  size: sizeSchema,
  dimensions: dimensionsSchema,
  hallmarking: hallmarkingSchema,

  // Supplier
  supplierId: z.string().optional(),
  supplierDetails: supplierDetailsSchema,

  // Media
  images: z.array(imageSchema).optional(),

  // Classification
  gender: z.enum(['male', 'female', 'unisex', 'kids']).default('unisex'),
  occasion: z
    .array(
      z.enum([
        'wedding',
        'engagement',
        'party',
        'daily_wear',
        'festival',
        'gift',
        'bridal',
        'traditional',
        'modern',
        'casual',
      ])
    )
    .optional(),
  design: designSchema,

  // Warranty & Certificates
  warranty: warrantySchema,
  certificates: z.array(certificateSchema).optional(),

  // Status
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  isNewArrival: z.boolean().optional().default(false),
  isBestseller: z.boolean().optional().default(false),

  // Search & Tags
  tags: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),

  // Notes
  notes: z.string().max(1000).optional(),
  internalNotes: z.string().optional(),
})

// 
// UPDATE PRODUCT SCHEMA (All fields optional)
// 
export const updateProductSchema = createProductSchema.partial()

// 
// STOCK UPDATE SCHEMA
// 
export const stockUpdateSchema = z.object({
  operation: z.enum(['add', 'subtract', 'set']),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  reason: z.string().max(500).optional(),
  referenceType: z
    .enum([
      'product_creation',
      'sale',
      'purchase',
      'return',
      'manual_adjustment',
      'transfer',
      'damage',
      'reservation',
      'stock_update',
    ])
    .optional(),
  referenceId: z.string().optional(),
})

// 
// RESERVATION SCHEMA
// 
export const reservationSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  reservationDays: z.number().int().min(1).max(365).optional().default(7),
  notes: z.string().max(500).optional(),
})

// 
// MARK AS SOLD SCHEMA
// 
export const markAsSoldSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  saleId: z.string().optional(),
})

// 
// PRICE CALCULATION SCHEMA
// 
export const priceCalculationSchema = z
  .object({
    useCurrentRate: z.boolean().optional().default(true),
    customRate: z.number().min(0).optional(),
  })
  .refine(data => data.useCurrentRate || data.customRate !== undefined, {
    message: 'Either useCurrentRate or customRate must be provided',
  })

// 
// BULK DELETE SCHEMA
// 
export const bulkDeleteSchema = z.object({
  productIds: z.array(z.string()).min(1, 'At least one product ID is required'),
})

// 
// BULK UPDATE STATUS SCHEMA
// 
export const bulkUpdateStatusSchema = z.object({
  productIds: z.array(z.string()).min(1, 'At least one product ID is required'),
  status: z.enum([
    'in_stock',
    'out_of_stock',
    'low_stock',
    'on_order',
    'discontinued',
  ]),
})

// 
// TYPE EXPORTS
// 
export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type StockUpdateInput = z.infer<typeof stockUpdateSchema>
export type ReservationInput = z.infer<typeof reservationSchema>
export type MarkAsSoldInput = z.infer<typeof markAsSoldSchema>
export type PriceCalculationInput = z.infer<typeof priceCalculationSchema>
export type BulkDeleteInput = z.infer<typeof bulkDeleteSchema>
export type BulkUpdateStatusInput = z.infer<typeof bulkUpdateStatusSchema>
