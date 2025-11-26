// ============================================================================
// FILE: src/types/shop.types.ts
// Shop-related TypeScript interfaces (Frontend)
// ============================================================================

// ============================================================================
// 1. SHOP INTERFACE
// ============================================================================

export interface Shop {
  _id: string
  name: string
  displayName?: string
  code: string
  organizationId: string

  // Contact
  email?: string
  phone: string
  alternatePhone?: string
  whatsappNumber?: string

  // Address
  address: {
    street: string
    landmark?: string
    area?: string
    city: string
    state: string
    country: string
    pincode: string
    location?: {
      type: 'Point'
      coordinates: [number, number] // [longitude, latitude]
    }
  }

  // Business Registration
  gstNumber?: string
  panNumber?: string
  tanNumber?: string
  udyamNumber?: string

  // Shop Type
  shopType: 'retail' | 'wholesale' | 'manufacturing' | 'showroom' | 'workshop' | 'warehouse' | 'online'
  category: 'jewelry' | 'gold' | 'silver' | 'diamond' | 'gemstone' | 'pearls' | 'platinum' | 'mixed'
  establishedYear?: number

  // Branding
  logo?: string
  favicon?: string
  banner?: string
  images?: Array<{
    url: string
    caption?: string
    isPrimary: boolean
  }>

  // Manager
  managerId: string
  manager?: any // Populated User object

  // Business Hours
  businessHours: {
    monday: DayHours
    tuesday: DayHours
    wednesday: DayHours
    thursday: DayHours
    friday: DayHours
    saturday: DayHours
    sunday: DayHours
  }

  holidays?: Array<{
    date: Date | string
    occasion: string
    isRecurring: boolean
  }>

  // Settings
  settings: ShopSettings

  // Banking
  bankDetails?: BankDetail[]
  upiDetails?: UpiDetail[]

  // Compliance
  compliance?: {
    bis?: {
      certified: boolean
      certificateNumber?: string
      expiryDate?: Date | string
    }
    hallmarking?: {
      certified: boolean
      certificateNumber?: string
      licenseNumber?: string
      hallmarkingCenter?: string
      expiryDate?: Date | string
    }
    iso?: {
      certified: boolean
      certificateNumber?: string
      expiryDate?: Date | string
    }
  }

  // Statistics
  statistics?: {
    totalProducts: number
    totalInventoryValue: number
    totalSales: number
    totalPurchases: number
    totalCustomers: number
    totalSuppliers: number
    totalStaff: number
    lastSaleDate?: Date | string
    lastPurchaseDate?: Date | string
    averageSaleValue: number
    lastUpdated: Date | string
  }

  // Features Enabled
  features?: {
    inventoryManagement: boolean
    purchaseManagement: boolean
    salesManagement: boolean
    billingInvoicing: boolean
    customerManagement: boolean
    supplierManagement: boolean
    partyManagement: boolean
    orderManagement: boolean
    repairManagement: boolean
    schemeManagement: boolean
    hallmarkingManagement: boolean
    oldGoldExchange: boolean
    barcodeScanning: boolean
    reports: boolean
    analytics: boolean
  }

  // Social Media
  socialMedia?: {
    facebook?: string
    instagram?: string
    twitter?: string
    youtube?: string
    linkedin?: string
  }
  website?: string

  // Status
  isActive: boolean
  isVerified: boolean
  verifiedAt?: Date | string
  verifiedBy?: string

  // Temporary Closure
  temporaryClosure?: {
    isClosed: boolean
    reason?: string
    closedFrom?: Date | string
    closedUntil?: Date | string
  }

  // Dates
  openingDate: Date | string
  closingDate?: Date | string
  createdAt: Date | string
  updatedAt: Date | string
  deletedAt?: Date | string

  // Audit
  createdBy?: string
  updatedBy?: string

  // Metadata
  tags?: string[]
  notes?: string
}

// ============================================================================
// 2. ORGANIZATION INTERFACE
// ============================================================================

export interface Organization {
  _id: string
  name: string
  displayName?: string
  code: string

  // Contact
  email?: string
  phone: string
  alternatePhone?: string

  // Address
  address: {
    street: string
    city: string
    state: string
    country: string
    pincode: string
  }

  // Registration
  gstNumber?: string
  panNumber?: string
  cinNumber?: string
  registrationNumber?: string

  // Organization Type
  organizationType: 'single_shop' | 'chain' | 'franchise' | 'enterprise'
  industry: 'jewelry' | 'gold' | 'diamond' | 'retail' | 'wholesale'

  // Admin
  ownerId: string
  owner?: any // Populated User

  // Branding
  logo?: string
  website?: string

  // Subscription
  subscription?: {
    plan: 'free' | 'basic' | 'pro' | 'enterprise'
    status: 'active' | 'inactive' | 'trial' | 'expired'
    startDate: Date | string
    endDate?: Date | string
    maxShops: number
    maxUsers: number
  }

  // Settings
  settings?: {
    currency: string
    timezone: string
    dateFormat: string
    language: string
  }

  // Status
  isActive: boolean
  isVerified: boolean

  // Stats
  totalShops: number
  totalUsers: number

  // Dates
  createdAt: Date | string
  updatedAt: Date | string
  deletedAt?: Date | string
}

// ============================================================================
// 3. USER SHOP ACCESS INTERFACE
// ============================================================================

export interface UserShopAccess {
  _id: string
  userId: string
  shopId: string
  organizationId: string

  // Role
  role: 'shop_admin' | 'manager' | 'staff' | 'viewer' | 'accountant'

  // Permissions
  permissions: ShopPermissions

  // Access Status
  isActive: boolean

  // Access Period
  accessStartDate: Date | string
  accessEndDate?: Date | string

  // Assignment
  assignedBy?: string
  assignedAt: Date | string

  // Last Access
  lastAccessedAt?: Date | string
  lastAccessIP?: string

  // Revocation
  revokedAt?: Date | string
  revokedBy?: string
  revocationReason?: string

  // Additional Settings
  canAccessOutsideBusinessHours: boolean
  allowedIPAddresses?: string[]

  // Notes
  notes?: string

  // Audit
  updatedBy?: string

  // Dates
  createdAt: Date | string
  updatedAt: Date | string
  deletedAt?: Date | string

  // Populated fields (optional)
  user?: any
  shop?: Shop
  organization?: Organization

  // Virtual fields
  isExpired?: boolean
  isValid?: boolean
}

// ============================================================================
// 4. SHOP SETTINGS INTERFACE
// ============================================================================

export interface ShopSettings {
  // Regional
  currency: 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'SAR'
  language: 'en' | 'hi' | 'mr' | 'gu' | 'ta' | 'te'
  timezone: string

  // Weight & Measurement
  defaultWeightUnit: 'gram' | 'kg' | 'tola' | 'ounce' | 'carat'
  defaultPurityUnit: 'karat' | 'percentage' | 'purity_916' | 'purity_999'
  enableStoneWeight: boolean
  enableNetWeight: boolean

  // Pricing
  enableMakingCharges: boolean
  makingChargesType: 'per_gram' | 'percentage' | 'fixed' | 'flat' | 'per_piece'
  defaultMakingCharges: number

  // Metal Rates
  metalRates: {
    gold: {
      rate24K: number
      rate22K: number
      rate18K: number
      lastUpdated: Date | string
    }
    silver: {
      rate999: number
      rate925: number
      lastUpdated: Date | string
    }
    platinum: {
      rate: number
      lastUpdated: Date | string
    }
    updatedBy?: string
  }

  // Stone
  enableStoneManagement: boolean
  stoneChargesType: 'per_piece' | 'per_carat' | 'fixed'

  // Wastage
  enableWastage: boolean
  wastageType: 'percentage' | 'fixed_gram'
  defaultWastage: number

  // Invoice
  invoicePrefix: string
  invoiceStartNumber: number
  currentInvoiceNumber: number

  // Estimate/Quotation
  estimatePrefix: string
  estimateStartNumber: number
  quotationPrefix: string

  // Purchase
  purchasePrefix: string
  purchaseStartNumber: number

  // Order
  orderPrefix: string
  orderStartNumber: number

  // Tax
  enableGST: boolean
  gstRates: {
    gold: number
    silver: number
    diamond: number
    platinum: number
    gemstone: number
    makingCharges: number
    stoneCharges: number
    other: number
  }

  // Discount
  allowDiscounts: boolean
  maxDiscountPercentage: number

  // Hallmarking
  enableHallmarking: boolean
  hallmarkingCenter?: string
  huidPrefix?: string

  // Old Gold Exchange
  enableOldGoldExchange: boolean
  oldGoldDeductionPercentage: number

  // Repair
  enableRepairManagement: boolean
  repairPrefix: string

  // Barcode
  enableBarcode: boolean
  barcodeType: 'CODE128' | 'CODE39' | 'EAN13' | 'QR'

  // Printing
  printSettings: {
    headerText?: string
    footerText?: string
    showLogo: boolean
    showTermsConditions: boolean
    termsConditions?: string
    showBankDetails: boolean
    paperSize: 'A4' | 'A5' | 'thermal_80mm' | 'thermal_58mm'
  }

  // Inventory
  enableLowStockAlerts: boolean
  lowStockThreshold: number
  enableBatchTracking: boolean
  enableSerialNumberTracking: boolean

  // Payment Modes
  acceptedPaymentModes: {
    cash: boolean
    card: boolean
    upi: boolean
    netBanking: boolean
    cheque: boolean
    emi: boolean
    goldExchange: boolean
    silverExchange: boolean
  }

  // Notifications
  notifications: {
    lowStockAlert: boolean
    expiryAlert: boolean
    expiryAlertDays: number
    smsNotifications: boolean
    emailNotifications: boolean
    whatsappNotifications: boolean
  }

  // Feature Flags
  enableSchemes: boolean
  enableCustomOrderManagement: boolean
  enableHallmarkingTracking: boolean
  enableOldGoldPurchase: boolean

  // Multi-currency
  enableMultiCurrency: boolean
  acceptedCurrencies?: Array<'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'SAR'>
}

// ============================================================================
// HELPER INTERFACES
// ============================================================================

export interface DayHours {
  isOpen: boolean
  openTime: string // "10:00"
  closeTime: string // "20:00"
}

export interface BankDetail {
  _id?: string
  bankName: string
  accountNumber: string
  ifscCode: string
  accountHolderName: string
  branchName?: string
  accountType: 'savings' | 'current' | 'overdraft'
  isPrimary: boolean
}

export interface UpiDetail {
  _id?: string
  upiId: string
  upiName?: string
  provider: 'googlepay' | 'phonepe' | 'paytm' | 'bhim' | 'other'
  qrCode?: string
  isActive: boolean
  isPrimary: boolean
}

export interface ShopPermissions {
  // Inventory
  canViewInventory: boolean
  canEditInventory: boolean
  canManageProducts: boolean
  canDeleteProducts: boolean
  canImportProducts: boolean
  canExportProducts: boolean

  // Purchase
  canViewPurchases: boolean
  canCreatePurchases: boolean
  canEditPurchases: boolean
  canDeletePurchases: boolean
  canApprovePurchases: boolean

  // Sales
  canViewSales: boolean
  canCreateSales: boolean
  canEditSales: boolean
  canDeleteSales: boolean
  canApproveSales: boolean
  canGenerateInvoices: boolean
  canCancelInvoices: boolean
  canApplyDiscounts: boolean

  // Orders
  canManageOrders: boolean
  canViewOrders: boolean
  canCreateOrders: boolean
  canEditOrders: boolean
  canCancelOrders: boolean

  // Customers
  canManageCustomers: boolean
  canViewCustomers: boolean
  canCreateCustomers: boolean
  canEditCustomers: boolean
  canDeleteCustomers: boolean
  canViewCustomerHistory: boolean
  canBlacklistCustomer: boolean
  canRemoveCustomerBlacklist: boolean
  canAddLoyaltyPoints: boolean
  canRedeemLoyaltyPoints: boolean
  canViewCustomerAnalytics: boolean

  // Suppliers
  canManageSuppliers: boolean
  canViewSuppliers: boolean
  canCreateSuppliers: boolean
  canEditSuppliers: boolean
  canDeleteSuppliers: boolean
  canRestoreSupplier: boolean
  canUpdateSupplierRating: boolean
  canBlacklistSupplier: boolean
  canRemoveSupplierBlacklist: boolean
  canMarkPreferredSupplier: boolean
  canRemovePreferredSupplier: boolean
  canUpdateSupplierBalance: boolean
  canViewSupplierStatistics: boolean
  canViewTopSuppliers: boolean

  // Parties
  canManageParties: boolean
  canViewPartyLedger: boolean

  // Financial
  canViewBilling: boolean
  canViewFinancials: boolean
  canApproveTransactions: boolean
  canViewPayments: boolean
  canReceivePayments: boolean
  canMakePayments: boolean
  canViewProfitLoss: boolean

  // Schemes
  canManageSchemes: boolean
  canViewSchemes: boolean
  canCreateSchemes: boolean
  canEditSchemes: boolean
  canDeleteSchemes: boolean

  // Reports
  canViewReports: boolean
  canGenerateReports: boolean
  canExportReports: boolean
  canViewAnalytics: boolean
  canViewDashboard: boolean

  // Users
  canManageUsers: boolean
  canViewUsers: boolean
  canCreateUsers: boolean
  canEditUsers: boolean
  canDeleteUsers: boolean
  canAssignRoles: boolean

  // Settings
  canManageShopSettings: boolean
  canUpdateMetalRates: boolean
  canManageTaxSettings: boolean
  canManageSettings: boolean
  canManageMetalRates: boolean

  // Advanced
  canManageRepairs: boolean
  canManageCustomOrders: boolean
  canManageHallmarking: boolean
  canManageOldGold: boolean

  // System
  canViewAuditLog: boolean
  canBackupData: boolean
  canRestoreData: boolean
  canExportData: boolean
  canDeleteRecords: boolean
  canAccessPOS: boolean
  canManageBilling: boolean

  // Composite
  canManageInventory: boolean
  canManageSales: boolean
  canManagePurchases: boolean
  canManageExpenses: boolean
  canManageReports: boolean

  // Shop Management
  canCreateShop: boolean
  canViewShops: boolean
  canViewSingleShop: boolean
  canUpdateShop: boolean
  canDeleteShop: boolean
  canViewShopStatistics: boolean
  canTransferInventory: boolean
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export interface CreateShopRequest {
  name: string
  displayName?: string
  email?: string
  phone: string
  alternatePhone?: string
  whatsappNumber?: string
  address: {
    street: string
    landmark?: string
    area?: string
    city: string
    state: string
    country?: string
    pincode: string
    location?: {
      coordinates: [number, number]
    }
  }
  gstNumber?: string
  panNumber?: string
  shopType?: ShopSettings['currency']
  category?: string
  establishedYear?: number
  managerId?: string
  copySettingsFromShopId?: string
  bankDetails?: BankDetail[]
  upiDetails?: UpiDetail[]
}

export interface UpdateShopRequest {
  name?: string
  displayName?: string
  email?: string
  phone?: string
  alternatePhone?: string
  whatsappNumber?: string
  address?: Partial<CreateShopRequest['address']>
  gstNumber?: string
  panNumber?: string
  shopType?: string
  category?: string
  establishedYear?: number
  managerId?: string
  bankDetails?: BankDetail[]
  upiDetails?: UpiDetail[]
  isActive?: boolean
}

export interface UpdateShopSettingsRequest {
  settings?: Partial<ShopSettings>
}

export interface UpdateMetalRatesRequest {
  gold?: {
    rate24K?: number
    rate22K?: number
    rate18K?: number
  }
  silver?: {
    rate999?: number
    rate925?: number
  }
  platinum?: {
    rate?: number
  }
}

export interface GetShopsQuery {
  page?: number
  limit?: number
  sort?: string
  fields?: string
  search?: string
  isActive?: boolean
  isVerified?: boolean
  shopType?: string
  category?: string
  city?: string
  state?: string
  organizationId?: string
}

// ============================================================================
// FORM TYPES (for React Hook Form)
// ============================================================================

export interface ShopFormData {
  name: string
  displayName: string
  email: string
  phone: string
  alternatePhone: string
  whatsappNumber: string
  street: string
  landmark: string
  area: string
  city: string
  state: string
  country: string
  pincode: string
  gstNumber: string
  panNumber: string
  shopType: string
  category: string
  establishedYear: number
  bankDetails: BankDetail[]
  upiDetails: UpiDetail[]
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type ShopStatus = 'active' | 'inactive' | 'closed' | 'temporarily_closed'

export type ShopRole = 'shop_admin' | 'manager' | 'staff' | 'viewer' | 'accountant'

// ============================================================================
// EXPORTS
// ============================================================================

// export type {
//   Shop,
//   Organization,
//   UserShopAccess,
//   ShopSettings,
//   DayHours,
//   BankDetail,
//   UpiDetail,
//   ShopPermissions,
//   CreateShopRequest,
//   UpdateShopRequest,
//   UpdateShopSettingsRequest,
//   UpdateMetalRatesRequest,
//   GetShopsQuery,
//   ShopFormData,
// }

// export { ShopType, ShopCategory }