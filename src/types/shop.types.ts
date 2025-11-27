// ============================================================================
// FILE: shop.types.ts
// Jewelry Shop Types
// ============================================================================

/**
 * Shop Type Options
 */
export type ShopType = 
  | 'retail' 
  | 'wholesale' 
  | 'manufacturing' 
  | 'showroom' 
  | 'workshop' 
  | 'warehouse' 
  | 'online';

/**
 * Shop Category Options
 */
export type ShopCategory = 
  | 'jewelry' 
  | 'gold' 
  | 'silver' 
  | 'diamond' 
  | 'gemstone' 
  | 'pearls' 
  | 'platinum' 
  | 'mixed';

/**
 * Weight Unit Options
 */
export type WeightUnit = 
  | 'gram' 
  | 'kg' 
  | 'tola' 
  | 'ounce' 
  | 'carat';

/**
 * Purity Unit Options
 */
export type PurityUnit = 
  | 'karat' 
  | 'percentage' 
  | 'purity_916' 
  | 'purity_999';

/**
 * Making Charges Type
 */
export type MakingChargesType = 
  | 'per_gram' 
  | 'percentage' 
  | 'fixed' 
  | 'flat' 
  | 'per_piece';

/**
 * Stone Charges Type
 */
export type StoneChargesType = 
  | 'per_piece' 
  | 'per_carat' 
  | 'fixed';

/**
 * Wastage Type
 */
export type WastageType = 
  | 'percentage' 
  | 'fixed_gram';

/**
 * Account Type
 */
export type AccountType = 
  | 'savings' 
  | 'current' 
  | 'overdraft';

/**
 * UPI Provider
 */
export type UpiProvider = 
  | 'googlepay' 
  | 'phonepe' 
  | 'paytm' 
  | 'bhim' 
  | 'other';

/**
 * Barcode Type
 */
export type BarcodeType = 
  | 'CODE128' 
  | 'CODE39' 
  | 'EAN13' 
  | 'QR';

/**
 * Paper Size
 */
export type PaperSize = 
  | 'A4' 
  | 'A5' 
  | 'thermal_80mm' 
  | 'thermal_58mm';

/**
 * Warehouse Unit
 */
export type WarehouseUnit = 
  | 'sqft' 
  | 'sqm';

/**
 * Currency Options
 */
export type Currency = 
  | 'INR' 
  | 'USD' 
  | 'EUR' 
  | 'GBP' 
  | 'AED' 
  | 'SAR';

/**
 * Language Options
 */
export type Language = 
  | 'en' 
  | 'hi' 
  | 'mr' 
  | 'gu' 
  | 'ta' 
  | 'te';

// ============================================================================
// NESTED INTERFACES
// ============================================================================

/**
 * Location Coordinates
 */
export interface LocationCoordinates {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

/**
 * Shop Address
 */
export interface ShopAddress {
  street: string;
  landmark?: string;
  area?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  location: LocationCoordinates;
}

/**
 * Shop Image
 */
export interface ShopImage {
  url: string;
  caption?: string;
  isPrimary: boolean;
}

/**
 * Day Business Hours
 */
export interface DayBusinessHours {
  isOpen: boolean;
  openTime: string; // Format: "HH:MM"
  closeTime: string; // Format: "HH:MM"
}

/**
 * Business Hours
 */
export interface BusinessHours {
  monday: DayBusinessHours;
  tuesday: DayBusinessHours;
  wednesday: DayBusinessHours;
  thursday: DayBusinessHours;
  friday: DayBusinessHours;
  saturday: DayBusinessHours;
  sunday: DayBusinessHours;
}

/**
 * Holiday
 */
export interface Holiday {
  date: Date | string;
  occasion: string;
  isRecurring: boolean;
}

/**
 * Metal Rates - Gold
 */
export interface GoldRates {
  rate24K: number;
  rate22K: number;
  rate18K: number;
  lastUpdated: Date | string;
}

/**
 * Metal Rates - Silver
 */
export interface SilverRates {
  rate999: number;
  rate925: number;
  lastUpdated: Date | string;
}

/**
 * Metal Rates - Platinum
 */
export interface PlatinumRates {
  rate: number;
  lastUpdated: Date | string;
}

/**
 * Metal Rates
 */
export interface MetalRates {
  gold: GoldRates;
  silver: SilverRates;
  platinum: PlatinumRates;
  updatedBy?: string | null;
}

/**
 * GST Rates
 */
export interface GstRates {
  gold: number;
  silver: number;
  diamond: number;
  platinum: number;
  gemstone: number;
  makingCharges: number;
  stoneCharges: number;
  other: number;
}

/**
 * Accepted Payment Modes
 */
export interface AcceptedPaymentModes {
  cash: boolean;
  card: boolean;
  upi: boolean;
  netBanking: boolean;
  cheque: boolean;
  emi: boolean;
  goldExchange: boolean;
  silverExchange: boolean;
}

/**
 * Notification Settings
 */
export interface NotificationSettings {
  lowStockAlert: boolean;
  expiryAlert: boolean;
  expiryAlertDays: number;
  smsNotifications: boolean;
  emailNotifications: boolean;
  whatsappNotifications: boolean;
}

/**
 * Print Settings
 */
export interface PrintSettings {
  headerText?: string;
  footerText?: string;
  showLogo: boolean;
  showTermsConditions: boolean;
  termsConditions?: string;
  showBankDetails: boolean;
  paperSize: PaperSize;
}

/**
 * Shop Settings
 */
export interface ShopSettings {
  // Regional Settings
  currency: Currency;
  language: Language;
  timezone: string;
  
  // Weight & Measurement Settings
  defaultWeightUnit: WeightUnit;
  defaultPurityUnit: PurityUnit;
  enableStoneWeight: boolean;
  enableNetWeight: boolean;
  
  // Pricing Settings
  enableMakingCharges: boolean;
  makingChargesType: MakingChargesType;
  defaultMakingCharges: number;
  
  // Metal Rates
  metalRates: MetalRates;
  
  // Stone Settings
  enableStoneManagement: boolean;
  stoneChargesType: StoneChargesType;
  
  // Wastage Settings
  enableWastage: boolean;
  wastageType: WastageType;
  defaultWastage: number;
  
  // Invoice Settings
  invoicePrefix: string;
  invoiceStartNumber: number;
  currentInvoiceNumber: number;
  
  // Estimate/Quotation Settings
  estimatePrefix: string;
  estimateStartNumber: number;
  quotationPrefix: string;
  
  // Purchase Settings
  purchasePrefix: string;
  purchaseStartNumber: number;
  
  // Order Settings
  orderPrefix: string;
  orderStartNumber: number;
  
  // Tax Settings
  enableGST: boolean;
  gstRates: GstRates;
  
  // Discount Settings
  allowDiscounts: boolean;
  maxDiscountPercentage: number;
  
  // Hallmarking Settings
  enableHallmarking: boolean;
  hallmarkingCenter?: string;
  huidPrefix?: string;
  
  // Old Gold Exchange Settings
  enableOldGoldExchange: boolean;
  oldGoldDeductionPercentage: number;
  
  // Repair Settings
  enableRepairManagement: boolean;
  repairPrefix: string;
  
  // Barcode Settings
  enableBarcode: boolean;
  barcodeType: BarcodeType;
  
  // Printing Settings
  printSettings: PrintSettings;
  
  // Inventory Settings
  enableLowStockAlerts: boolean;
  lowStockThreshold: number;
  enableBatchTracking: boolean;
  enableSerialNumberTracking: boolean;
  
  // Payment Settings
  acceptedPaymentModes: AcceptedPaymentModes;
  
  // Notification Settings
  notifications: NotificationSettings;
  
  // Feature Flags
  enableSchemes: boolean;
  enableCustomOrderManagement: boolean;
  enableHallmarkingTracking: boolean;
  enableOldGoldPurchase: boolean;
  
  // Multi-currency Support
  enableMultiCurrency: boolean;
  acceptedCurrencies: Currency[];
}

/**
 * Bank Details
 */
export interface BankDetails {
  _id?: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  branchName?: string;
  accountType: AccountType;
  isPrimary: boolean;
}

/**
 * UPI Details
 */
export interface UpiDetails {
  _id?: string;
  upiId: string;
  upiName?: string;
  provider: UpiProvider;
  qrCode?: string;
  isActive: boolean;
  isPrimary: boolean;
}

/**
 * BIS Compliance
 */
export interface BisCompliance {
  certified: boolean;
  certificateNumber?: string;
  expiryDate?: Date | string;
}

/**
 * Hallmarking Compliance
 */
export interface HallmarkingCompliance {
  certified: boolean;
  certificateNumber?: string;
  licenseNumber?: string;
  hallmarkingCenter?: string;
  hallmarkingCenterId?: string;
  expiryDate?: Date | string;
}

/**
 * ISO Compliance
 */
export interface IsoCompliance {
  certified: boolean;
  certificateNumber?: string;
  expiryDate?: Date | string;
}

/**
 * FSSAI Compliance
 */
export interface FssaiCompliance {
  certified: boolean;
  licenseNumber?: string;
  expiryDate?: Date | string;
}

/**
 * Compliance Details
 */
export interface ComplianceDetails {
  bis: BisCompliance;
  hallmarking: HallmarkingCompliance;
  iso: IsoCompliance;
  fssai: FssaiCompliance;
}

/**
 * Warehouse Details
 */
export interface WarehouseDetails {
  hasWarehouse: boolean;
  warehouseAddress?: string;
  warehouseCapacity: number;
  warehouseUnit: WarehouseUnit;
}

/**
 * Shop Statistics
 */
export interface ShopStatistics {
  totalProducts: number;
  totalInventoryValue: number;
  totalSales: number;
  totalPurchases: number;
  totalCustomers: number;
  totalSuppliers: number;
  totalStaff: number;
  lastSaleDate?: Date | string | null;
  lastPurchaseDate?: Date | string | null;
  averageSaleValue: number;
  lastUpdated: Date | string;
}

/**
 * Shop Features
 */
export interface ShopFeatures {
  inventoryManagement: boolean;
  purchaseManagement: boolean;
  salesManagement: boolean;
  billingInvoicing: boolean;
  customerManagement: boolean;
  supplierManagement: boolean;
  partyManagement: boolean;
  orderManagement: boolean;
  repairManagement: boolean;
  schemeManagement: boolean;
  hallmarkingManagement: boolean;
  oldGoldExchange: boolean;
  barcodeScanning: boolean;
  reports: boolean;
  analytics: boolean;
}

/**
 * Social Media Links
 */
export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
}

/**
 * Temporary Closure
 */
export interface TemporaryClosure {
  isClosed: boolean;
  reason?: string;
  closedFrom?: Date | string;
  closedUntil?: Date | string;
}

// ============================================================================
// MAIN JEWELRY SHOP INTERFACE
// ============================================================================

/**
 * Jewelry Shop - Complete Model
 */
export interface JewelryShop {
  _id: string;
  
  // Basic Shop Information
  name: string;
  displayName?: string;
  code: string;
  
  // Multi-tenant & Organization
  organizationId: string;
  
  // Contact Information
  email?: string;
  phone: string;
  alternatePhone?: string;
  fax?: string;
  whatsappNumber?: string;
  
  // Address
  address: ShopAddress;
  
  // Business Registration
  gstNumber?: string;
  panNumber?: string;
  tanNumber?: string;
  udyamNumber?: string;
  fssaiNumber?: string;
  tradeLicenseNumber?: string;
  registrationNumber?: string;
  
  // Shop Type & Category
  shopType: ShopType;
  category: ShopCategory;
  establishedYear?: number;
  
  // Branding & Media
  logo?: string | null;
  favicon?: string | null;
  banner?: string | null;
  images: ShopImage[];
  
  // Shop Manager/Owner
  managerId: string;
  
  // Business Hours
  businessHours: BusinessHours;
  holidays: Holiday[];
  
  // Shop Settings
  settings: ShopSettings;
  
  // Banking Details
  bankDetails: BankDetails[];
  
  // UPI Details
  upiDetails: UpiDetails[];
  
  // Compliance & Certifications
  compliance: ComplianceDetails;
  
  // Warehouse/Storage Info
  warehouseDetails: WarehouseDetails;
  
  // Shop Statistics
  statistics: ShopStatistics;
  
  // Features Enabled
  features: ShopFeatures;
  
  // Social Media & Website
  socialMedia: SocialMedia;
  website?: string;
  
  // Shop Status
  isActive: boolean;
  isVerified: boolean;
  verifiedAt?: Date | string | null;
  verifiedBy?: string | null;
  
  // Temporary Closure
  temporaryClosure: TemporaryClosure;
  
  // Opening/Closing Details
  openingDate: Date | string;
  closingDate?: Date | string | null;
  
  // Audit Trail
  createdBy?: string | null;
  updatedBy?: string | null;
  
  // Metadata
  tags: string[];
  notes?: string;
  deletedAt?: Date | string | null;
  
  // Timestamps
  createdAt: Date | string;
  updatedAt: Date | string;
  
  // Virtuals (computed fields)
  fullAddress?: string;
  isCurrentlyOpen?: boolean;
}

// ============================================================================
// POPULATED/EXTENDED INTERFACES
// ============================================================================

/**
 * Shop with Populated Relations
 */
export interface JewelryShopWithRelations extends JewelryShop {
  organization?: any; // Organization type
  manager?: any; // User type
  staff?: any[]; // UserShopAccess[]
  products?: any[]; // Product[]
  customers?: any[]; // Party[]
  suppliers?: any[]; // Party[]
  sales?: any[]; // Sale[]
  purchases?: any[]; // Purchase[]
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

/**
 * Create Shop Request
 */
export interface CreateShopRequest {
  // Basic Information
  name: string;
  displayName?: string;
  
  // Contact Information
  email?: string;
  phone: string;
  alternatePhone?: string;
  whatsappNumber?: string;
  
  // Address
  address: {
    street: string;
    landmark?: string;
    area?: string;
    city: string;
    state: string;
    country?: string;
    pincode: string;
    location?: {
      coordinates: [number, number];
    };
  };
  
  // Business Registration
  gstNumber?: string;
  panNumber?: string;
  tanNumber?: string;
  udyamNumber?: string;
  tradeLicenseNumber?: string;
  
  // Shop Type & Category
  shopType?: ShopType;
  category?: ShopCategory;
  establishedYear?: number;
  
  // Manager
  managerId?: string; // Optional - defaults to current user
  
  // Settings
  copySettingsFromShopId?: string; // Copy settings from existing shop
  settings?: Partial<ShopSettings>;
  
  // Banking & UPI
  bankDetails?: Omit<BankDetails, '_id'>[];
  upiDetails?: Omit<UpiDetails, '_id'>[];
  
  // Additional
  logo?: string;
  website?: string;
  socialMedia?: SocialMedia;
}

/**
 * Update Shop Request
 */
export interface UpdateShopRequest {
  name?: string;
  displayName?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  whatsappNumber?: string;
  address?: Partial<ShopAddress>;
  gstNumber?: string;
  panNumber?: string;
  tanNumber?: string;
  shopType?: ShopType;
  category?: ShopCategory;
  establishedYear?: number;
  managerId?: string;
  logo?: string;
  favicon?: string;
  banner?: string;
  website?: string;
  socialMedia?: Partial<SocialMedia>;
  businessHours?: Partial<BusinessHours>;
  bankDetails?: BankDetails[];
  upiDetails?: UpiDetails[];
  compliance?: Partial<ComplianceDetails>;
  warehouseDetails?: Partial<WarehouseDetails>;
  features?: Partial<ShopFeatures>;
  tags?: string[];
  notes?: string;
}

/**
 * Update Shop Settings Request
 */
export interface UpdateShopSettingsRequest {
  settings: Partial<ShopSettings>;
}

/**
 * Update Metal Rates Request
 */
export interface UpdateMetalRatesRequest {
  gold?: Partial<Omit<GoldRates, 'lastUpdated'>>;
  silver?: Partial<Omit<SilverRates, 'lastUpdated'>>;
  platinum?: Partial<Omit<PlatinumRates, 'lastUpdated'>>;
}

/**
 * Shop Query Parameters
 */
export interface ShopQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  fields?: string;
  search?: string;
  isActive?: boolean;
  isVerified?: boolean;
  shopType?: ShopType;
  category?: ShopCategory;
  city?: string;
  state?: string;
  organizationId?: string;
  managerId?: string;
  includeDeleted?: boolean;
  includeSettings?: boolean;
  populate?: string; // Comma-separated: 'manager,organization,staff'
}

/**
 * Shop List Item (for tables/lists)
 */
export interface ShopListItem {
  _id: string;
  name: string;
  code: string;
  phone: string;
  city: string;
  state: string;
  shopType: ShopType;
  category: ShopCategory;
  isActive: boolean;
  isVerified: boolean;
  managerName?: string;
  totalProducts: number;
  totalStaff: number;
  createdAt: Date | string;
}

/**
 * Shop Statistics Summary
 */
export interface ShopStatisticsSummary extends ShopStatistics {
  growthMetrics?: {
    salesGrowth: number; // percentage
    customerGrowth: number; // percentage
    inventoryGrowth: number; // percentage
  };
}

/**
 * Generate Shop Code Request
 */
export interface GenerateShopCodeRequest {
  name: string;
  organizationId: string;
}

/**
 * Generate Shop Code Response
 */
export interface GenerateShopCodeResponse {
  success: boolean;
  data: {
    code: string;
  };
}

/**
 * Temporary Close Shop Request
 */
export interface TemporaryCloseShopRequest {
  reason: string;
  closedFrom?: Date | string;
  closedUntil?: Date | string;
}

/**
 * Shop Nearby Search Request
 */
export interface ShopNearbySearchRequest {
  longitude: number;
  latitude: number;
  maxDistance?: number; // in meters, default: 10000
}

/**
 * Shop Verification Request
 */
export interface ShopVerificationRequest {
  verified: boolean;
  notes?: string;
}

/**
 * Shop Transfer Request (Transfer ownership)
 */
export interface ShopTransferRequest {
  newManagerId: string;
  reason?: string;
  effectiveDate?: Date | string;
}

// ============================================================================
// FORM STATE TYPES
// ============================================================================

/**
 * Shop Form State (for create/edit forms)
 */
export interface ShopFormState {
  // Basic
  name: string;
  displayName: string;
  shopType: ShopType;
  category: ShopCategory;
  establishedYear: string;
  
  // Contact
  email: string;
  phone: string;
  alternatePhone: string;
  whatsappNumber: string;
  
  // Address
  address: {
    street: string;
    landmark: string;
    area: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    longitude: string;
    latitude: string;
  };
  
  // Registration
  gstNumber: string;
  panNumber: string;
  tanNumber: string;
  udyamNumber: string;
  tradeLicenseNumber: string;
  
  // Manager
  managerId: string;
  
  // Media
  logo: string;
  favicon: string;
  banner: string;
  website: string;
  
  // Social Media
  facebook: string;
  instagram: string;
  twitter: string;
  
  // Copy Settings
  copySettingsFromShopId: string;
}

/**
 * Shop Settings Form State
 */
export interface ShopSettingsFormState {
  currency: Currency;
  language: Language;
  timezone: string;
  defaultWeightUnit: WeightUnit;
  enableGST: boolean;
  invoicePrefix: string;
  enableMakingCharges: boolean;
  makingChargesType: MakingChargesType;
  defaultMakingCharges: string;
  enableWastage: boolean;
  wastageType: WastageType;
  defaultWastage: string;
  allowDiscounts: boolean;
  maxDiscountPercentage: string;
}

/**
 * Metal Rates Form State
 */
export interface MetalRatesFormState {
  gold24K: string;
  gold22K: string;
  gold18K: string;
  silver999: string;
  silver925: string;
  platinum: string;
}

/**
 * Business Hours Form State
 */
export interface BusinessHoursFormState {
  monday: { isOpen: boolean; openTime: string; closeTime: string };
  tuesday: { isOpen: boolean; openTime: string; closeTime: string };
  wednesday: { isOpen: boolean; openTime: string; closeTime: string };
  thursday: { isOpen: boolean; openTime: string; closeTime: string };
  friday: { isOpen: boolean; openTime: string; closeTime: string };
  saturday: { isOpen: boolean; openTime: string; closeTime: string };
  sunday: { isOpen: boolean; openTime: string; closeTime: string };
}

/**
 * Bank Details Form State
 */
export interface BankDetailsFormState {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  branchName: string;
  accountType: AccountType;
  isPrimary: boolean;
}

/**
 * UPI Details Form State
 */
export interface UpiDetailsFormState {
  upiId: string;
  upiName: string;
  provider: UpiProvider;
  qrCode: string;
  isActive: boolean;
  isPrimary: boolean;
}

// ============================================================================
// FILTER & EXPORT TYPES
// ============================================================================

/**
 * Shop Filter Options
 */
export interface ShopFilterOptions {
  shopTypes?: ShopType[];
  categories?: ShopCategory[];
  cities?: string[];
  states?: string[];
  isActive?: boolean;
  isVerified?: boolean;
  hasWarehouse?: boolean;
  establishedYearFrom?: number;
  establishedYearTo?: number;
}

/**
 * Shop Export Data
 */
export interface ShopExportData {
  code: string;
  name: string;
  shopType: string;
  category: string;
  phone: string;
  email?: string;
  city: string;
  state: string;
  pincode: string;
  gstNumber?: string;
  panNumber?: string;
  isActive: boolean;
  isVerified: boolean;
  totalProducts: number;
  totalStaff: number;
  createdAt: string;
}

/**
 * Shop Import Row
 */
export interface ShopImportRow {
  name: string;
  phone: string;
  email?: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  gstNumber?: string;
  panNumber?: string;
  shopType?: string;
  category?: string;
}