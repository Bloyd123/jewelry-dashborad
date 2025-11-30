// ============================================
// ENUMS & CONSTANTS
// ============================================

export enum ProductCategory {
  RING = 'ring',
  NECKLACE = 'necklace',
  EARRING = 'earring',
  BRACELET = 'bracelet',
  BANGLE = 'bangle',
  PENDANT = 'pendant',
  CHAIN = 'chain',
  MANGALSUTRA = 'mangalsutra',
  NOSE_PIN = 'nose_pin',
  ANKLET = 'anklet',
  COIN = 'coin',
  BAR = 'bar',
  BISCUIT = 'biscuit',
  OTHER = 'other',
}

export enum ProductType {
  READY_MADE = 'ready_made',
  CUSTOM_MADE = 'custom_made',
  ON_ORDER = 'on_order',
  REPAIR = 'repair',
  EXCHANGE = 'exchange',
}

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

export enum WeightUnit {
  GRAM = 'gram',
  KG = 'kg',
  TOLA = 'tola',
  OUNCE = 'ounce',
  CARAT = 'carat',
}

export enum StockUnit {
  PIECE = 'piece',
  PAIR = 'pair',
  SET = 'set',
  GRAM = 'gram',
  KG = 'kg',
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

export enum StoneQuality {
  VS = 'VS',
  VVS = 'VVS',
  SI = 'SI',
  IF = 'IF',
  FL = 'FL',
  A = 'A',
  AA = 'AA',
  AAA = 'AAA',
  B = 'B',
  C = 'C',
}

export enum StoneShape {
  ROUND = 'round',
  OVAL = 'oval',
  SQUARE = 'square',
  RECTANGULAR = 'rectangular',
  PEAR = 'pear',
  MARQUISE = 'marquise',
  HEART = 'heart',
  EMERALD_CUT = 'emerald_cut',
  OTHER = 'other',
}

export enum StoneCut {
  EXCELLENT = 'excellent',
  VERY_GOOD = 'very_good',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
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

export enum DimensionUnit {
  MM = 'mm',
  CM = 'cm',
  INCH = 'inch',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  UNISEX = 'unisex',
  KIDS = 'kids',
}

export enum Occasion {
  WEDDING = 'wedding',
  ENGAGEMENT = 'engagement',
  PARTY = 'party',
  DAILY_WEAR = 'daily_wear',
  FESTIVAL = 'festival',
  GIFT = 'gift',
  BRIDAL = 'bridal',
  TRADITIONAL = 'traditional',
  MODERN = 'modern',
  CASUAL = 'casual',
}

export enum DesignStyle {
  TRADITIONAL = 'traditional',
  MODERN = 'modern',
  ANTIQUE = 'antique',
  CONTEMPORARY = 'contemporary',
  ETHNIC = 'ethnic',
  WESTERN = 'western',
}

export enum WarrantyType {
  LIFETIME = 'lifetime',
  LIMITED = 'limited',
  NONE = 'none',
}

export enum CertificateType {
  HALLMARK = 'hallmark',
  DIAMOND = 'diamond',
  GEMSTONE = 'gemstone',
  PURITY = 'purity',
  AUTHENTICITY = 'authenticity',
  OTHER = 'other',
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

export enum RepairStatus {
  NONE = 'none',
  SENT = 'sent',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum LifecycleAction {
  CREATED = 'created',
  RESERVED = 'reserved',
  SOLD = 'sold',
  RETURNED = 'returned',
  REPAIRED = 'repaired',
  TRANSFERRED = 'transferred',
}

// ============================================
// SUB-INTERFACES
// ============================================

export interface IMetal {
  type: MetalType
  purity: MetalPurity
  purityPercentage?: number
  color: MetalColor
}

export interface IWastage {
  percentage: number
  weight: number
}

export interface IWeight {
  grossWeight: number
  stoneWeight: number
  netWeight?: number
  wastage: IWastage
  unit: WeightUnit
}

export interface IStoneCertificate {
  certificateNumber?: string
  certificateUrl?: string
  issuedBy?: string
}

export interface IStone {
  stoneType: StoneType
  stoneName?: string
  stoneQuality?: StoneQuality
  stoneColor?: string
  stoneShape?: StoneShape
  stoneCut?: StoneCut
  stoneClarity?: string
  caratWeight?: number
  stoneWeight?: number
  pieceCount: number
  stonePrice: number
  totalStonePrice: number
  stoneCertificate?: IStoneCertificate
}

export interface IMakingCharges {
  type: MakingChargesType
  value: number
  amount: number
}

export interface IGST {
  percentage: number
  amount: number
}

export interface IDiscount {
  type: DiscountType
  value: number
  amount: number
}

export interface IPricing {
  metalRate: number
  metalValue: number
  stoneValue: number
  makingCharges: number
  otherCharges: number
  subtotal: number
  gst: IGST
  totalPrice: number
  costPrice: number
  sellingPrice: number
  mrp: number
  discount: IDiscount
}

export interface ISize {
  value?: string
  unit: DimensionUnit
}

export interface IDimensions {
  length?: number
  width?: number
  height?: number
  unit: DimensionUnit
}

export interface IHallmarking {
  isHallmarked: boolean
  hallmarkNumber?: string
  hallmarkingCenter?: string
  bisLicenseNumber?: string
  huid?: string
  hallmarkDate?: Date
}

export interface IStockLocation {
  warehouse?: string
  rack?: string
  shelf?: string
  bin?: string
}

export interface IStock {
  quantity: number
  unit: StockUnit
  minStockLevel: number
  maxStockLevel: number
  reorderLevel: number
  location: IStockLocation
}

export interface ISupplierDetails {
  supplierName?: string
  supplierCode?: string
  purchaseDate?: Date
  purchasePrice?: number
  invoiceNumber?: string
}

export interface IProductImage {
  url: string
  isPrimary: boolean
  caption?: string
  uploadedAt: Date
}

export interface IDesign {
  designNumber?: string
  designer?: string
  collection?: string
  style?: DesignStyle
  pattern?: string
}

export interface IWarranty {
  hasWarranty: boolean
  warrantyPeriod: number
  warrantyType: WarrantyType
  warrantyTerms?: string
}

export interface ICertificate {
  certificateType: CertificateType
  certificateNumber?: string
  issuedBy?: string
  issueDate?: Date
  expiryDate?: Date
  certificateUrl?: string
}

export interface IReservedFor {
  customerId: string
  reservedDate: Date
  expiryDate: Date
}

export interface ICustomField {
  fieldName: string
  fieldValue: any
}

export interface ILifecycleHistory {
  action: LifecycleAction | string
  fromShop?: string
  toShop?: string
  user?: string
  date: Date
  notes?: string
}

export interface IRepair {
  status: RepairStatus
  sentAt?: Date
  completedAt?: Date
  repairNotes?: string
}

export interface IReturnDetails {
  returnedAt?: Date
  reason?: string
  refundAmount?: number
}

// ============================================
// MAIN PRODUCT INTERFACE
// ============================================

export interface IProduct {
  // Multi-tenant
  organizationId: string
  shopId: string

  // Product Identification
  productCode: string
  barcode?: string
  sku?: string
  huid?: string

  // Basic Information
  name: string
  description?: string

  // Category & Type
  category: ProductCategory
  subCategory?: string
  productType: ProductType

  // Metal Details
  metal: IMetal

  // Weight Details
  weight: IWeight

  // Stones/Diamonds Details
  stones: IStone[]

  // Making/Labor Charges
  makingCharges: IMakingCharges

  // Pricing
  pricing: IPricing

  // Size & Dimensions
  size?: ISize
  dimensions?: IDimensions

  // Hallmarking Details
  hallmarking: IHallmarking

  // Stock/Inventory
  stock: IStock

  // Supplier Information
  supplierId?: string
  supplierDetails?: ISupplierDetails

  // Images
  images: IProductImage[]
  primaryImage?: string

  // Gender & Occasion
  gender: Gender
  occasion: Occasion[]

  // Design Details
  design?: IDesign

  // Warranty & Certificate
  warranty: IWarranty
  certificates: ICertificate[]

  // Status
  status: ProductStatus
  isActive: boolean
  isFeatured: boolean
  isNewArrival: boolean
  isBestseller: boolean

  // Sale Status
  saleStatus: SaleStatus
  soldDate?: Date
  soldTo?: string
  reservedFor?: IReservedFor

  // Tags & Search
  tags: string[]
  keywords: string[]
  searchTerms?: string

  // Custom Fields
  customFields: ICustomField[]

  // Lifecycle & Repair
  lifecycleHistory: ILifecycleHistory[]
  repair: IRepair
  returnDetails?: IReturnDetails

  // Notes
  notes?: string
  internalNotes?: string

  // Audit Trail
  createdBy?: string
  updatedBy?: string
  deletedAt?: Date

  // Timestamps
  createdAt: Date
  updatedAt: Date

  // Virtual Fields
  profitMargin?: number
  isLowStock?: boolean
  isOutOfStock?: boolean
  totalStoneCount?: number
}

// ============================================
// REQUEST/RESPONSE INTERFACES
// ============================================

export interface ICreateProductDTO {
  name: string
  description?: string
  category: ProductCategory
  subCategory?: string
  productType?: ProductType
  metal: IMetal
  weight: Partial<IWeight>
  stones?: Partial<IStone>[]
  makingCharges?: Partial<IMakingCharges>
  pricing: Partial<IPricing>
  size?: ISize
  dimensions?: IDimensions
  hallmarking?: Partial<IHallmarking>
  stock?: Partial<IStock>
  supplierId?: string
  supplierDetails?: ISupplierDetails
  images?: Partial<IProductImage>[]
  gender?: Gender
  occasion?: Occasion[]
  design?: IDesign
  warranty?: Partial<IWarranty>
  certificates?: ICertificate[]
  tags?: string[]
  keywords?: string[]
  notes?: string
  internalNotes?: string
}

export interface IUpdateProductDTO extends Partial<ICreateProductDTO> {
  isActive?: boolean
  isFeatured?: boolean
  isNewArrival?: boolean
  isBestseller?: boolean
  status?: ProductStatus
  saleStatus?: SaleStatus
}

export interface IProductFilters {
  category?: ProductCategory
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
  isLowStock?: boolean
  supplierId?: string
}

export interface IProductQueryParams extends IProductFilters {
  page?: number
  limit?: number
  sort?: string
  fields?: string
}

export interface IStockUpdateDTO {
  operation: 'add' | 'subtract' | 'set'
  quantity: number
  reason?: string
  referenceType?: string
  referenceId?: string
}

export interface IReserveProductDTO {
  customerId: string
  reservationDays?: number
  notes?: string
}

export interface IMarkAsSoldDTO {
  customerId: string
  saleId?: string
}

export interface ICalculatePriceDTO {
  useCurrentRate?: boolean
  customRate?: number
}

export interface IBulkOperationDTO {
  productIds: string[]
  status?: ProductStatus
}

// ============================================
// METAL RATE INTERFACE
// ============================================

export interface IMetalRate {
  organizationId: string
  shopId?: string
  metalType: MetalType
  purity: MetalPurity
  buyingRate: number
  sellingRate: number
  unit: WeightUnit
  effectiveFrom: Date
  effectiveTo?: Date
  isActive: boolean
  updatedBy: string
  createdAt: Date
  updatedAt: Date
}

export interface IMetalRateDTO {
  metalType: MetalType
  purity: MetalPurity
  buyingRate: number
  sellingRate: number
  unit?: WeightUnit
  effectiveFrom?: Date
  effectiveTo?: Date
}

// ============================================
// CATEGORY INTERFACE
// ============================================

export interface ICategoryConfig {
  name: ProductCategory
  displayName: string
  description?: string
  icon?: string
  isActive: boolean
  sortOrder: number
  subCategories?: string[]
  defaultMakingCharges?: IMakingCharges
  defaultWastagePercentage?: number
}

// ============================================
// PURITY INTERFACE
// ============================================

export interface IPurityConfig {
  name: MetalPurity
  displayName: string
  percentage: number
  metalType: MetalType
  isActive: boolean
  sortOrder: number
}

// ============================================
// PRODUCT STATISTICS
// ============================================

export interface IProductStatistics {
  totalProducts: number
  activeProducts: number
  inStockProducts: number
  lowStockProducts: number
  outOfStockProducts: number
  totalValue: number
  categoryWise: {
    category: ProductCategory
    count: number
    value: number
  }[]
  metalWise: {
    metalType: MetalType
    count: number
    value: number
  }[]
}

// ============================================
// EXPORTS
// ============================================

export type {
  IProduct as Product,
  ICreateProductDTO as CreateProductDTO,
  IUpdateProductDTO as UpdateProductDTO,
  IProductFilters as ProductFilters,
  IProductQueryParams as ProductQueryParams,
  IStockUpdateDTO as StockUpdateDTO,
  IReserveProductDTO as ReserveProductDTO,
  IMarkAsSoldDTO as MarkAsSoldDTO,
  ICalculatePriceDTO as CalculatePriceDTO,
  IBulkOperationDTO as BulkOperationDTO,
  IMetalRate as MetalRate,
  IMetalRateDTO as MetalRateDTO,
  ICategoryConfig as CategoryConfig,
  IPurityConfig as PurityConfig,
  IProductStatistics as ProductStatistics,
}
