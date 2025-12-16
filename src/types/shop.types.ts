// ============================================================================
// FILE: src/types/shop.types.ts
// Shop Type Definitions for Frontend
// ============================================================================

// ============================================================================
// ENUMS
// ============================================================================

export enum ShopType {
  RETAIL = 'retail',
  WHOLESALE = 'wholesale',
  MANUFACTURING = 'manufacturing',
  SHOWROOM = 'showroom',
  WORKSHOP = 'workshop',
  WAREHOUSE = 'warehouse',
  ONLINE = 'online',
}

export enum ShopCategory {
  JEWELRY = 'jewelry',
  GOLD = 'gold',
  SILVER = 'silver',
  DIAMOND = 'diamond',
  GEMSTONE = 'gemstone',
  PEARLS = 'pearls',
  PLATINUM = 'platinum',
  MIXED = 'mixed',
}

export enum ShopStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  CLOSED = 'closed',
}

export enum ShopCurrency {
  INR = 'INR',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  AED = 'AED',
  SAR = 'SAR',
}

export enum ShopLanguage {
  EN = 'en',
  HI = 'hi',
  MR = 'mr',
  GU = 'gu',
  TA = 'ta',
  TE = 'te',
}

export enum WeightUnit {
  GRAM = 'gram',
  KG = 'kg',
  TOLA = 'tola',
  OUNCE = 'ounce',
  CARAT = 'carat',
}

// ============================================================================
// ADDRESS TYPES
// ============================================================================

export interface Coordinates {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface ShopAddress {
  street: string;
  city: string;
  state: string;
  country?: string;
  pincode: string;
  landmark?: string;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

// ============================================================================
// BANK & UPI DETAILS
// ============================================================================

export interface BankDetail {
  _id?: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  branchName?: string;
  accountType?: 'savings' | 'current';
  isActive?: boolean;
  isPrimary?: boolean;
}

export interface UpiDetail {
  _id?: string;
  upiId: string;
  name?: string;
  isActive?: boolean;
  isPrimary?: boolean;
}

// ============================================================================
// BUSINESS HOURS
// ============================================================================

export interface TimeSlot {
  open: string; // Format: "HH:MM" (24-hour)
  close: string;
}

export interface BusinessHours {
  monday?: TimeSlot;
  tuesday?: TimeSlot;
  wednesday?: TimeSlot;
  thursday?: TimeSlot;
  friday?: TimeSlot;
  saturday?: TimeSlot;
  sunday?: TimeSlot;
  holidays?: string[]; // Array of dates
}

// ============================================================================
// METAL RATES
// ============================================================================

export interface MetalRate {
  rate24K?: number;
  rate22K?: number;
  rate18K?: number;
  rate14K?: number;
}

export interface SilverRate {
  rate999?: number;
  rate925?: number;
  rate900?: number;
}

export interface PlatinumRate {
  rate?: number;
}

export interface MetalRates {
  gold?: MetalRate;
  silver?: SilverRate;
  platinum?: PlatinumRate;
  lastUpdated?: Date | string;
  updatedBy?: string | ShopUser;
}

export interface MetalRateHistory {
  _id: string;
  gold?: MetalRate;
  silver?: SilverRate;
  platinum?: PlatinumRate;
  updatedBy: string | ShopUser;
  updatedAt: Date | string;
  notes?: string;
}

// ============================================================================
// SHOP SETTINGS
// ============================================================================

export interface GSTRates {
  gold?: number;
  silver?: number;
  diamond?: number;
  making?: number;
  other?: number;
}

export interface PrintSettings {
  invoiceHeader?: string;
  invoiceFooter?: string;
  showLogo?: boolean;
  showQRCode?: boolean;
  showBankDetails?: boolean;
  showTermsConditions?: boolean;
  paperSize?: 'A4' | 'A5' | 'thermal-3inch' | 'thermal-2inch';
}

export interface NotificationSettings {
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  whatsappNotifications?: boolean;
  notifyOnLowStock?: boolean;
  notifyOnSale?: boolean;
  notifyOnReturn?: boolean;
}

export interface ShopSettings {
  currency?: ShopCurrency;
  language?: ShopLanguage;
  defaultWeightUnit?: WeightUnit;
  enableGST?: boolean;
  gstRates?: GSTRates;
  enableBarcode?: boolean;
  enableQRCode?: boolean;
  autoGenerateInvoice?: boolean;
  invoicePrefix?: string;
  printSettings?: PrintSettings;
  metalRates?: MetalRates;
  metalRateHistory?: MetalRateHistory[];
  notifications?: NotificationSettings;
  timezone?: string;
  dateFormat?: string;
  timeFormat?: '12h' | '24h';
}

// ============================================================================
// SHOP FEATURES
// ============================================================================

export interface ShopFeatures {
  enableInventory?: boolean;
  enablePOS?: boolean;
  enableECommerce?: boolean;
  enableRepairs?: boolean;
  enableCustomOrders?: boolean;
  enableSchemes?: boolean;
  enableLoyalty?: boolean;
  enableMultiBranch?: boolean;
  enableWarehouse?: boolean;
}

// ============================================================================
// SHOP STATISTICS
// ============================================================================

export interface ShopStatistics {
  totalProducts?: number;
  totalInventoryValue?: number;
  totalSales?: number;
  totalSalesAmount?: number;
  totalCustomers?: number;
  totalOrders?: number;
  averageOrderValue?: number;
  lowStockItems?: number;
  lastUpdated?: Date | string;
}

// ============================================================================
// COMPLIANCE
// ============================================================================

export interface Compliance {
  isGSTRegistered?: boolean;
  gstVerificationDate?: Date | string;
  panVerificationDate?: Date | string;
  lastAuditDate?: Date | string;
  nextAuditDate?: Date | string;
  licenses?: Array<{
    name: string;
    number: string;
    issuedDate?: Date | string;
    expiryDate?: Date | string;
    isActive?: boolean;
  }>;
}

// ============================================================================
// USER REFERENCE (Minimal)
// ============================================================================

export interface ShopUser {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  profileImage?: string;
}

// ============================================================================
// ORGANIZATION REFERENCE (Minimal)
// ============================================================================

export interface Organization {
  _id: string;
  name: string;
  displayName?: string;
  email?: string;
  phone?: string;
  logo?: string;
}

// ============================================================================
// MAIN SHOP INTERFACE
// ============================================================================

export interface Shop {
  _id: string;
  code: string;
  name: string;
  displayName?: string;
  
  // Organization & Manager
  organizationId: string | Organization;
  managerId: string | ShopUser;
  
  // Contact Information
  email?: string;
  phone: string;
  alternatePhone?: string;
  whatsappNumber?: string;
  website?: string;
  
  // Address
  address: ShopAddress;
  
  // Business Registration
  gstNumber?: string;
  panNumber?: string;
  tanNumber?: string;
  
  // Shop Classification
  shopType?: ShopType;
  category?: ShopCategory;
  status?: ShopStatus;
  
  // Business Details
  establishedYear?: number;
  openingDate?: Date | string;
  closingDate?: Date | string;
  
  // Bank & Payment Details
  bankDetails?: BankDetail[];
  upiDetails?: UpiDetail[];
  
  // Settings & Configuration
  settings?: ShopSettings;
  features?: ShopFeatures;
  businessHours?: BusinessHours;
  
  // Statistics
  statistics?: ShopStatistics;
  
  // Compliance
  compliance?: Compliance;
  
  // Status Flags
  isActive?: boolean;
  isVerified?: boolean;
  isFeatured?: boolean;
  
  // Audit Fields
  createdBy?: string | ShopUser;
  updatedBy?: string | ShopUser;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string;
}

// ============================================================================
// SHOP FORM DATA (for Create/Update)
// ============================================================================

export interface ShopFormData {
  name: string;
  displayName?: string;
  email?: string;
  phone: string;
  alternatePhone?: string;
  whatsappNumber?: string;
  website?: string;
  
  address: {
    street: string;
    city: string;
    state: string;
    country?: string;
    pincode: string;
    landmark?: string;
    coordinates?: [number, number];
  };
  
  gstNumber?: string;
  panNumber?: string;
  tanNumber?: string;
  
  shopType?: ShopType;
  category?: ShopCategory;
  establishedYear?: number;
  
  managerId?: string;
  organizationId?: string;
  copySettingsFromShopId?: string;
  
  bankDetails?: BankDetail[];
  upiDetails?: UpiDetail[];
}

// ============================================================================
// SHOP FILTERS (for List Page)
// ============================================================================

export interface ShopFilters {
  search?: string;
  isActive?: boolean;
  isVerified?: boolean;
  shopType?: ShopType;
  category?: ShopCategory;
  city?: string;
  state?: string;
  organizationId?: string;
}

// ============================================================================
// SHOP QUERY PARAMS (with Pagination)
// ============================================================================

export interface ShopQueryParams extends ShopFilters {
  page?: number;
  limit?: number;
  sort?: string;
  fields?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ShopPaginationMeta {
  totalDocs: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface ShopListResponse {
  success: boolean;
  results: number;
  data: Shop[];
  pagination: ShopPaginationMeta;
}

export interface ShopDetailResponse {
  success: boolean;
  data: Shop;
}

export interface ShopCreateResponse {
  success: boolean;
  message: string;
  data: Shop;
}

export interface ShopUpdateResponse {
  success: boolean;
  message: string;
  data: Shop;
}

export interface ShopDeleteResponse {
  success: boolean;
  message: string;
}

export interface ShopStatisticsResponse {
  success: boolean;
  data: ShopStatistics;
}

// ============================================================================
// METAL RATES UPDATE PAYLOAD
// ============================================================================

export interface MetalRatesUpdatePayload {
  gold?: {
    rate24K?: number;
    rate22K?: number;
    rate18K?: number;
    rate14K?: number;
  };
  silver?: {
    rate999?: number;
    rate925?: number;
    rate900?: number;
  };
  platinum?: {
    rate?: number;
  };
}

// ============================================================================
// SHOP SETTINGS UPDATE PAYLOAD
// ============================================================================

export interface ShopSettingsUpdatePayload {
  settings: Partial<ShopSettings>;
}

// ============================================================================
// SHOP TABLE COLUMN TYPE
// ============================================================================

export interface ShopTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

// ============================================================================
// SHOP CARD PROPS (for Grid View)
// ============================================================================

export interface ShopCardProps {
  shop: Shop;
  onView?: (shop: Shop) => void;
  onEdit?: (shop: Shop) => void;
  onDelete?: (shop: Shop) => void;
  onToggleStatus?: (shop: Shop) => void;
}

// ============================================================================
// SHOP VALIDATION ERROR
// ============================================================================

export interface ShopValidationError {
  field: string;
  message: string;
}

// ============================================================================
// SHOP ACTION TYPES (for State Management)
// ============================================================================

export enum ShopActionType {
  FETCH_SHOPS_REQUEST = 'FETCH_SHOPS_REQUEST',
  FETCH_SHOPS_SUCCESS = 'FETCH_SHOPS_SUCCESS',
  FETCH_SHOPS_FAILURE = 'FETCH_SHOPS_FAILURE',
  
  FETCH_SHOP_DETAIL_REQUEST = 'FETCH_SHOP_DETAIL_REQUEST',
  FETCH_SHOP_DETAIL_SUCCESS = 'FETCH_SHOP_DETAIL_SUCCESS',
  FETCH_SHOP_DETAIL_FAILURE = 'FETCH_SHOP_DETAIL_FAILURE',
  
  CREATE_SHOP_REQUEST = 'CREATE_SHOP_REQUEST',
  CREATE_SHOP_SUCCESS = 'CREATE_SHOP_SUCCESS',
  CREATE_SHOP_FAILURE = 'CREATE_SHOP_FAILURE',
  
  UPDATE_SHOP_REQUEST = 'UPDATE_SHOP_REQUEST',
  UPDATE_SHOP_SUCCESS = 'UPDATE_SHOP_SUCCESS',
  UPDATE_SHOP_FAILURE = 'UPDATE_SHOP_FAILURE',
  
  DELETE_SHOP_REQUEST = 'DELETE_SHOP_REQUEST',
  DELETE_SHOP_SUCCESS = 'DELETE_SHOP_SUCCESS',
  DELETE_SHOP_FAILURE = 'DELETE_SHOP_FAILURE',
  
  UPDATE_METAL_RATES_REQUEST = 'UPDATE_METAL_RATES_REQUEST',
  UPDATE_METAL_RATES_SUCCESS = 'UPDATE_METAL_RATES_SUCCESS',
  UPDATE_METAL_RATES_FAILURE = 'UPDATE_METAL_RATES_FAILURE',
  
  SET_FILTERS = 'SET_FILTERS',
  RESET_FILTERS = 'RESET_FILTERS',
  CLEAR_ERRORS = 'CLEAR_ERRORS',
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export type {
  Shop as default,
};