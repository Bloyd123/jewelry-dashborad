// FILE: src/types/product.types.ts
// ================================================================
// BEFORE → AFTER CHANGES (marked with comments)
// ================================================================

// ================================================================
// ENUMS
// ================================================================

export enum MetalType {
  GOLD = 'gold',
  SILVER = 'silver',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond',
  GEMSTONE = 'gemstone',
  MIXED = 'mixed',
}

export enum MetalPurity {
  K24 = '24K',
  K22 = '22K',
  K18 = '18K',
  K14 = '14K',
  K10 = '10K',
  P916 = '916',
  P999 = '999',
  P925 = '925',
  P850 = '850',
  P950 = '950',
  OTHER = 'other',
}

export enum MetalColor {
  YELLOW = 'yellow',
  WHITE = 'white',
  ROSE = 'rose',
  MIXED = 'mixed',
}

export enum ProductType {
  READY_MADE = 'ready_made',
  CUSTOM_MADE = 'custom_made',
  ON_ORDER = 'on_order',
  REPAIR = 'repair',
  EXCHANGE = 'exchange',
}

export enum ProductStatus {
  IN_STOCK = 'in_stock',
  OUT_OF_STOCK = 'out_of_stock',
  LOW_STOCK = 'low_stock',
  ON_ORDER = 'on_order',
  DISCONTINUED = 'discontinued',
  SOLD = 'sold',
}

export enum SaleStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  SOLD = 'sold',
  ON_HOLD = 'on_hold',
  RETURNED = 'returned',
}

export enum StoneType {
  DIAMOND = 'diamond',
  RUBY = 'ruby',
  EMERALD = 'emerald',
  SAPPHIRE = 'sapphire',
  PEARL = 'pearl',
  TOPAZ = 'topaz',
  AMETHYST = 'amethyst',
  GARNET = 'garnet',
  OTHER = 'other',
}

export enum WeightUnit {
  GRAM = 'gram',
  KG = 'kg',
  TOLA = 'tola',
  OUNCE = 'ounce',
  CARAT = 'carat',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  UNISEX = 'unisex',
  KIDS = 'kids',
}

export enum MakingChargesType {
  PER_GRAM = 'per_gram',
  PERCENTAGE = 'percentage',
  FLAT = 'flat',
  NONE = 'none',
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FLAT = 'flat',
  NONE = 'none',
}

// ================================================================
// SUB-INTERFACES
// ================================================================

export interface ProductMetal {
  type: MetalType
  purity: MetalPurity
  purityPercentage?: number
  color?: MetalColor
}

export interface ProductWeight {
  grossWeight: number
  stoneWeight?: number
  netWeight?: number
  wastage?: {
    percentage?: number
    weight?: number
  }
  unit?: WeightUnit
}

export interface ProductStone {
  _id?: string
  stoneType: StoneType
  stoneName?: string
  stoneQuality?: 'VS' | 'VVS' | 'SI' | 'IF' | 'FL' | 'A' | 'AA' | 'AAA' | 'B' | 'C'
  stoneColor?: string
  stoneShape?: 'round' | 'oval' | 'square' | 'rectangular' | 'pear' | 'marquise' | 'heart' | 'emerald_cut' | 'other'
  stoneCut?: 'excellent' | 'very_good' | 'good' | 'fair' | 'poor'
  stoneClarity?: string
  caratWeight?: number
  stoneWeight?: number
  pieceCount?: number
  stonePrice?: number
  totalStonePrice?: number
  stoneCertificate?: {
    certificateNumber?: string
    certificateUrl?: string
    issuedBy?: string
  }
}

export interface ProductMakingCharges {
  type?: MakingChargesType
  value?: number
  amount?: number
}

export interface ProductDiscount {
  type?: DiscountType
  value?: number
  amount?: number
}

export interface ProductGST {
  percentage?: number
  amount?: number
}

export interface ProductPricing {
  metalRate?: number
  metalValue?: number
  stoneValue?: number
  makingCharges?: number
  otherCharges?: number
  subtotal?: number
  gst?: ProductGST
  totalPrice?: number
  costPrice?: number
  sellingPrice: number
  mrp?: number
  discount?: ProductDiscount
}

export interface ProductStock {
  quantity?: number
  unit?: 'piece' | 'pair' | 'set' | 'gram' | 'kg'
  minStockLevel?: number
  maxStockLevel?: number
  reorderLevel?: number
  location?: {
    warehouse?: string
    rack?: string
    shelf?: string
    bin?: string
  }
}

export interface ProductImage {
  _id?: string
  url: string
  isPrimary?: boolean
  caption?: string
  uploadedAt?: string
}

export interface ProductHallmarking {
  isHallmarked?: boolean
  hallmarkNumber?: string
  hallmarkingCenter?: string
  bisLicenseNumber?: string
  huid?: string
  hallmarkDate?: string
}

export interface ProductWarranty {
  hasWarranty?: boolean
  warrantyPeriod?: number
  warrantyType?: 'lifetime' | 'limited' | 'none'
  warrantyTerms?: string
}

export interface ProductCertificate {
  _id?: string
  certificateType?: 'hallmark' | 'diamond' | 'gemstone' | 'purity' | 'authenticity' | 'other'
  certificateNumber?: string
  issuedBy?: string
  issueDate?: string
  expiryDate?: string
  certificateUrl?: string
}

export interface ProductDesign {
  designNumber?: string
  designer?: string
  collection?: string
  style?: 'traditional' | 'modern' | 'antique' | 'contemporary' | 'ethnic' | 'western'
  pattern?: string
}

export interface ProductSize {
  value?: string
  unit?: 'mm' | 'cm' | 'inch'
}

export interface ProductDimensions {
  length?: number
  width?: number
  height?: number
  unit?: 'mm' | 'cm' | 'inch'
}

export interface ProductSupplierDetails {
  supplierName?: string
  supplierCode?: string
  purchaseDate?: string
  purchasePrice?: number
  invoiceNumber?: string
}

export interface ProductReservedFor {
  customerId?: string
  reservedDate?: string
  expiryDate?: string
}

export interface ProductRepair {
  status?: 'none' | 'sent' | 'in_progress' | 'completed'
  sentAt?: string
  completedAt?: string
  repairNotes?: string
}

export interface ProductReturnDetails {
  returnedAt?: string
  reason?: string
  refundAmount?: number
}

// ================================================================
// MAIN PRODUCT INTERFACE
// ================================================================

export interface Product {
  _id: string
  organizationId: string
  shopId: string

  // Identification
  productCode: string
  barcode?: string
  sku?: string
  huid?: string

  // Basic Info
  name: string
  description?: string

  // Category
  categoryId: string | { _id: string; name: string; code: string }
  subCategoryId?: string | { _id: string; name: string; code: string }
  productType?: ProductType

  // Metal
  metal: ProductMetal

  // Weight
  weight: ProductWeight

  // Stones
  stones?: ProductStone[]

  // Making Charges
  makingCharges?: ProductMakingCharges

  // Pricing
  pricing: ProductPricing

  // Size
  size?: ProductSize
  dimensions?: ProductDimensions

  // Hallmarking
  hallmarking?: ProductHallmarking

  // Stock
  stock: ProductStock

  // Supplier
  supplierId?: string | {
    _id: string
    name: string
    code: string
    contactPerson?: string
    phone?: string
    email?: string
  }
  supplierDetails?: ProductSupplierDetails

  // Images
  images?: ProductImage[]
  primaryImage?: string

  // Classification
  gender?: Gender
  occasion?: string[]

  // Design
  design?: ProductDesign

  // Warranty & Certificates
  warranty?: ProductWarranty
  certificates?: ProductCertificate[]

  // Status
  status: ProductStatus
  isActive: boolean
  isFeatured?: boolean
  isNewArrival?: boolean
  isBestseller?: boolean

  // Sale
  saleStatus: SaleStatus
  soldDate?: string
  soldTo?: string
  reservedFor?: ProductReservedFor

  // Tags
  tags?: string[]
  keywords?: string[]

  // Lifecycle
  repair?: ProductRepair
  returnDetails?: ProductReturnDetails

  // Notes
  notes?: string
  internalNotes?: string

  // Audit
  createdBy?: string | { _id: string; firstName: string; lastName: string; email: string }
  updatedBy?: string | { _id: string; firstName: string; lastName: string; email: string }
  createdAt: string
  updatedAt: string
  deletedAt?: string

  // Virtuals (backend computed)
  profitMargin?: number
  isLowStock?: boolean
  isOutOfStock?: boolean
  totalStoneCount?: number
}

// ================================================================
// PAGINATION META
// BEFORE: ShopPaginationMeta use ho rahi thi (totalDocs, totalPages, limit)
// AFTER:  Product-specific — backend sendPaginated ke exact fields
// ================================================================

export interface ProductPaginationMeta {
  currentPage: number    // BEFORE: 'page' tha
  totalPages: number
  pageSize: number       // BEFORE: 'limit' tha
  totalItems: number     // BEFORE: 'totalDocs' tha
  hasNextPage: boolean
  hasPrevPage: boolean
}

// ================================================================
// REQUEST TYPES — What you SEND to backend
// ================================================================

// CREATE
export interface CreateProductInput {
  name: string
  description?: string
  categoryId: string
  subCategoryId?: string
  productType?: ProductType
  metal: {
    type: MetalType
    purity: MetalPurity
    color?: MetalColor
    purityPercentage?: number
  }
  weight: {
    grossWeight: number
    stoneWeight?: number
    unit?: WeightUnit
  }
  makingCharges?: {
    type?: MakingChargesType
    value?: number
  }
  pricing: {
    sellingPrice: number
    costPrice?: number
    mrp?: number
    otherCharges?: number
    gst?: { percentage?: number }
    discount?: { type?: DiscountType; value?: number }
  }
  stock?: {
    quantity?: number
    unit?: 'piece' | 'pair' | 'set' | 'gram' | 'kg'
    reorderLevel?: number
    minStockLevel?: number
    maxStockLevel?: number
  }
  stones?: Omit<ProductStone, '_id'>[]
  images?: { url: string; isPrimary?: boolean; caption?: string }[]
  hallmarking?: ProductHallmarking
  warranty?: ProductWarranty
  gender?: Gender
  occasion?: string[]
  design?: ProductDesign
  size?: ProductSize
  dimensions?: ProductDimensions
  supplierId?: string
  supplierDetails?: ProductSupplierDetails
  tags?: string[]
  keywords?: string[]
  notes?: string
  isFeatured?: boolean
  isNewArrival?: boolean
  isBestseller?: boolean
}

// UPDATE
// BEFORE: No typed update input existed
// AFTER:  categoryId required (backend validation requires it even in update)
export interface UpdateProductInput {
  id: string
  categoryId: string
  name?: string
  description?: string
  subCategoryId?: string
  productType?: ProductType
  metal?: Partial<ProductMetal>
  weight?: Partial<ProductWeight>
  makingCharges?: Partial<ProductMakingCharges>
  pricing?: Partial<ProductPricing>
  stock?: Partial<ProductStock>
  stones?: Omit<ProductStone, '_id'>[]
  images?: { url: string; isPrimary?: boolean; caption?: string }[]
  hallmarking?: Partial<ProductHallmarking>
  warranty?: Partial<ProductWarranty>
  gender?: Gender
  occasion?: string[]
  design?: Partial<ProductDesign>
  size?: Partial<ProductSize>
  dimensions?: Partial<ProductDimensions>
  supplierId?: string
  supplierDetails?: Partial<ProductSupplierDetails>
  tags?: string[]
  keywords?: string[]
  notes?: string
  isActive?: boolean
  isFeatured?: boolean
  isNewArrival?: boolean
  isBestseller?: boolean
}

// GET LIST
export interface GetProductsInput {
  shopId: string
  page?: number
  limit?: number
  sort?: string
  category?: string
  metalType?: MetalType
  purity?: MetalPurity
  status?: ProductStatus
  saleStatus?: SaleStatus
  minPrice?: number
  maxPrice?: number
  search?: string
  gender?: Gender
  isActive?: boolean
  isFeatured?: boolean
}

// SEARCH
export interface SearchProductsInput {
  shopId: string
  q: string
  limit?: number
}

// STOCK UPDATE
export interface UpdateStockInput {
  id: string
  operation: 'add' | 'subtract' | 'set'
  quantity: number
  reason?: string
  referenceType?: 'product_creation' | 'sale' | 'purchase' | 'return' | 'manual_adjustment' | 'transfer' | 'damage' | 'reservation' | 'stock_update'
  referenceId?: string
}

// RESERVE
export interface ReserveProductInput {
  id: string
  customerId: string
  reservationDays?: number
  notes?: string
}

// MARK AS SOLD
export interface MarkAsSoldInput {
  id: string
  customerId: string
  saleId?: string
}

// CALCULATE PRICE
export interface CalculatePriceInput {
  id: string
  useCurrentRate?: boolean
  customRate?: number
  customRates?: {
    gold?: number
    silver?: number
    platinum?: number
  }
}

// BULK DELETE
export interface BulkDeleteInput {
  productIds: string[]
}

// BULK UPDATE STATUS
export interface BulkUpdateStatusInput {
  productIds: string[]
  status: Exclude<ProductStatus, ProductStatus.SOLD>
}

// LOW STOCK
export interface GetLowStockInput {
  shopId: string
  threshold?: number
}

// HISTORY
export interface GetProductHistoryInput {
  shopId: string
  id: string
  limit?: number
}

// ================================================================
// RESPONSE TYPES — What backend SENDS back
// BEFORE: No response types existed for product module
// AFTER:  Typed responses matching backend sendSuccess / sendPaginated
// ================================================================

// LIST
export interface ProductListResponse {
  success: boolean
  message: string
  data: Product[]
  pagination: ProductPaginationMeta
}

// SINGLE
export interface ProductDetailResponse {
  success: boolean
  message: string
  data: Product
}

// CREATE / UPDATE
export interface ProductMutationResponse {
  success: boolean
  message: string
  data: Product
}

// DELETE (204 No Content — no body)
export interface ProductDeleteResponse {
  success: boolean
  message?: string
}

// STOCK UPDATE
export interface StockUpdateResponse {
  success: boolean
  message: string
  data: {
    productId: string
    previousQuantity: number
    newQuantity: number
    status: ProductStatus
    transaction: {
      transactionType: string
      quantity: number
      referenceType?: string
      referenceId?: string
    }
  }
}

// RESERVE
export interface ReserveProductResponse {
  success: boolean
  message: string
  data: {
    saleStatus: SaleStatus
    reservedFor: ProductReservedFor
  }
}

// CANCEL RESERVATION
export interface CancelReservationResponse {
  success: boolean
  message: string
  data: {
    saleStatus: SaleStatus
  }
}

// MARK AS SOLD
export interface MarkAsSoldResponse {
  success: boolean
  message: string
  data: {
    saleStatus: SaleStatus
    soldDate: string
    stock: ProductStock
  }
}

// CALCULATE PRICE
export interface CalculatePriceResponse {
  success: boolean
  message: string
  data: {
    oldPrice: number
    newPrice: number
    difference: number
    differencePercentage: number
    pricing: ProductPricing
  }
}

// LOW STOCK
export interface LowStockResponse {
  success: boolean
  message: string
  data: Pick<
    Product,
    '_id' | 'name' | 'productCode' | 'categoryId' | 'subCategoryId' | 'stock' | 'pricing' | 'primaryImage'
  >[]
  totalLowStockItems: number
  criticalItems: number
}

// INVENTORY TRANSACTION (used in history)
export interface InventoryTransaction {
  _id: string
  transactionType: string
  quantity: number
  previousQuantity: number
  newQuantity: number
  reason?: string
  referenceType?: string
  referenceId?: string
  referenceNumber?: string
  value?: number
  transactionDate: string
  performedBy?: string
}

// HISTORY
export interface ProductHistoryResponse {
  success: boolean
  message: string
  data: {
    product: Pick<Product, '_id' | 'name' | 'productCode'>
    history: InventoryTransaction[]
  }
}

// ANALYTICS
export interface ProductAnalytics {
  overview: {
    totalProducts: number
    activeProducts: number
    inactiveProducts: number
    lowStockCount: number
    outOfStockCount: number
    totalInventoryValue: number
  }
  categoryBreakdown: {
    _id: string
    categoryName: string
    count: number
    totalValue: number
  }[]
}

export interface ProductAnalyticsResponse {
  success: boolean
  message: string
  data: ProductAnalytics
}

// BULK DELETE
export interface BulkDeleteResponse {
  success: boolean
  message: string
  data: {
    deletedCount: number
  }
}

// BULK UPDATE STATUS
export interface BulkUpdateStatusResponse {
  success: boolean
  message: string
  data: {
    modifiedCount: number
  }
}

// SEARCH
export interface ProductSearchResponse {
  success: boolean
  message: string
  data: Pick<
    Product,
    '_id' | 'name' | 'productCode' | 'categoryId' | 'subCategoryId' | 'metal' | 'weight' | 'pricing' | 'stock' | 'primaryImage' | 'saleStatus'
  >[]
}