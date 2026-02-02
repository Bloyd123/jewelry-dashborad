// SUPPLIER MODULE - COMPLETE TYPESCRIPT TYPES

// Enums
export enum SupplierType {
  MANUFACTURER = 'manufacturer',
  WHOLESALER = 'wholesaler',
  DISTRIBUTOR = 'distributor',
  ARTISAN = 'artisan',
  IMPORTER = 'importer',
  OTHER = 'other',
}

export enum SupplierCategory {
  GOLD = 'gold',
  SILVER = 'silver',
  DIAMOND = 'diamond',
  PLATINUM = 'platinum',
  GEMSTONE = 'gemstone',
  PEARLS = 'pearls',
  MAKING = 'making',
  PACKAGING = 'packaging',
  MIXED = 'mixed',
}

export enum PaymentTerms {
  IMMEDIATE = 'immediate',
  COD = 'cod',
  NET15 = 'net15',
  NET30 = 'net30',
  NET45 = 'net45',
  NET60 = 'net60',
  CUSTOM = 'custom',
}

export enum CertificationType {
  BIS = 'bis',
  HALLMARKING = 'hallmarking',
  ISO = 'iso',
  GEMOLOGICAL = 'gemological',
  OTHER = 'other',
}

export enum DocumentType {
  GST_CERTIFICATE = 'gst_certificate',
  PAN_CARD = 'pan_card',
  TRADE_LICENSE = 'trade_license',
  CONTRACT = 'contract',
  OTHER = 'other',
}

export enum AccountType {
  SAVINGS = 'savings',
  CURRENT = 'current',
  OVERDRAFT = 'overdraft',
}

export enum BalanceUpdateType {
  PAYMENT = 'payment',
  PURCHASE = 'purchase',
  ADJUSTMENT = 'adjustment',
}

// Sub-types
export interface ContactPerson {
  firstName: string
  lastName?: string
  designation?: string
  email?: string
  phone: string
  alternatePhone?: string
  whatsappNumber?: string
}

export interface Address {
  street?: string
  landmark?: string
  area?: string
  city?: string
  state?: string
  country?: string
  pincode?: string
}

export interface BankDetails {
  bankName?: string
  accountNumber?: string
  ifscCode?: string
  accountHolderName?: string
  branchName?: string
  accountType?: AccountType
}

export interface Certification {
  _id?: string
  certificationType: CertificationType
  certificateNumber?: string
  issuedBy?: string
  issueDate?: string
  expiryDate?: string
  documentUrl?: string
}

export interface Document {
  _id?: string
  documentType: DocumentType
  documentNumber?: string
  documentUrl?: string
  uploadedAt?: string
}

export interface Statistics {
  totalOrders: number
  completedOrders: number
  pendingOrders: number
  cancelledOrders: number
  totalPurchased: number
  averageOrderValue: number
  lastOrderDate?: string
  firstOrderDate?: string
  averageDeliveryTime: number
  onTimeDeliveryPercentage: number
}

// Main Supplier Interface
export interface Supplier {
  _id: string
  organizationId: string
  shopId: string
  supplierCode: string

  // Business Information
  businessName: string
  displayName?: string

  // Contact
  contactPerson: ContactPerson
  businessEmail?: string
  businessPhone?: string
  website?: string

  // Address
  address?: Address

  // Registration
  gstNumber?: string
  panNumber?: string
  tanNumber?: string
  registrationNumber?: string

  // Type & Category
  supplierType: SupplierType
  supplierCategory: SupplierCategory

  // Products
  productsSupplied?: string[]
  specialization?: string[]

  // Payment Terms
  paymentTerms: PaymentTerms
  creditPeriod: number
  creditLimit: number

  // Financial
  currentBalance: number
  totalPurchases: number
  totalPaid: number
  totalDue: number
  advancePayment: number

  // Ratings
  rating?: number
  qualityRating?: number
  deliveryRating?: number
  priceRating?: number

  // Statistics
  statistics: Statistics

  // Bank Details
  bankDetails?: BankDetails
  upiId?: string

  // Certifications & Documents
  certifications?: Certification[]
  documents?: Document[]

  // Status
  isActive: boolean
  isVerified: boolean
  verifiedAt?: string
  isPreferred: boolean
  isBlacklisted: boolean
  blacklistReason?: string
  blacklistedAt?: string

  // Notes
  notes?: string
  internalNotes?: string
  tags?: string[]

  // Audit
  createdBy?: string
  updatedBy?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

// Create/Update DTOs
export interface CreateSupplierDto {
  businessName: string
  displayName?: string
  contactPerson: ContactPerson
  businessEmail?: string
  businessPhone?: string
  website?: string
  address?: Address
  gstNumber?: string
  panNumber?: string
  tanNumber?: string
  registrationNumber?: string
  supplierType?: SupplierType
  supplierCategory?: SupplierCategory
  productsSupplied?: string[]
  specialization?: string[]
  paymentTerms?: PaymentTerms
  creditPeriod?: number
  creditLimit?: number
  bankDetails?: BankDetails
  upiId?: string
  certifications?: Certification[]
  documents?: Document[]
  notes?: string
  internalNotes?: string
  tags?: string[]
  shopId?: string
}

export interface UpdateSupplierDto extends Partial<CreateSupplierDto> {
  isActive?: boolean
  isVerified?: boolean
  isPreferred?: boolean
}
export interface DeleteSupplierResponse {
  success: boolean
  message: string
}

// Query/Filter Types
export interface SupplierFilters {
  page?: number
  limit?: number
  search?: string
  supplierType?: SupplierType
  supplierCategory?: SupplierCategory
  isActive?: boolean
  isPreferred?: boolean
  isBlacklisted?: boolean
  sort?: string
  shopId?: string
}

// API Response Types
export interface PaginationMeta {
  total: number
  page: number
  limit: number
  pages: number
    hasNext?: boolean    // ✅ NEW - Next page hai ya nahi
  hasPrev?: boolean 
}

export interface SupplierListResponse {
  success: boolean
  message: string
  data: Supplier[]
  pagination: PaginationMeta
}

export interface SingleSupplierResponse {
  success: boolean
  message: string
  data: Supplier
}

export interface SupplierStatsResponse {
  success: boolean
  message: string
  data: {
    totalSuppliers: number
    activeSuppliers: number
    preferredSuppliers: number
    blacklistedSuppliers: number
    totalPurchases: number
    totalDue: number
    totalAdvance: number
  }
}

export interface TopSuppliersResponse {
  success: boolean
  message: string
  data: Supplier[]
}

// Rating Update
export interface UpdateRatingDto {
  qualityRating: number
  deliveryRating: number
  priceRating: number
}

// Blacklist
export interface BlacklistSupplierDto {
  reason: string
}

// Balance Update
export interface UpdateBalanceDto {
  amount: number
  type: BalanceUpdateType
  note?: string
  shopId?: string
}

// Form State Types (for React forms)
export interface SupplierFormState extends CreateSupplierDto {
  errors?: Record<string, string>
  touched?: Record<string, boolean>
}

// Table Column Type (for data tables)
export interface SupplierTableColumn {
  key: keyof Supplier | string
  label: string
  sortable?: boolean
  render?: (value: any, supplier: Supplier) => React.ReactNode
}

// Export all types
export type {
  Supplier as ISupplier,
  CreateSupplierDto as ICreateSupplier,
  UpdateSupplierDto as IUpdateSupplier,
  SupplierFilters as ISupplierFilters,
}
