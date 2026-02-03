// FILE: src/types/customer.types.ts
// Customer Types and Interfaces (Based on Backend Validation)
// ✅ 100% ALIGNED WITH BACKEND

/**
 * MongoDB ID type
 */
export type ID = string

/**
 * Gender Enum
 */
export type Gender = 'male' | 'female' | 'other'

/**
 * Customer Type Enum
 */
export type CustomerType = 'retail' | 'wholesale' | 'vip' | 'regular'

/**
 * Customer Category Enum
 */
export type CustomerCategory =
  | 'gold'
  | 'silver'
  | 'diamond'
  | 'platinum'
  | 'mixed'

/**
 * Membership Tier Enum
 */
export type MembershipTier = 'standard' | 'silver' | 'gold' | 'platinum'

/**
 * Preferred Metal Enum
 */
export type PreferredMetal = 'gold' | 'silver' | 'platinum' | 'diamond'

/**
 * Communication Preference Enum
 */
export type CommunicationPreference =
  | 'email'
  | 'sms'
  | 'whatsapp'
  | 'call'
  | 'none'

/**
 * Customer Source Enum
 */
export type CustomerSource =
  | 'walk_in'
  | 'referral'
  | 'online'
  | 'phone'
  | 'social_media'
  | 'advertisement'
  | 'other'

/**
 * Address Interface
 */
export interface Address {
  street?: string
  city?: string
  state?: string
  pincode?: string
}

/**
 * Customer Preferences Interface
 */
export interface CustomerPreferences {
  preferredMetal?: PreferredMetal
  communicationPreference?: CommunicationPreference
}

/**
 * Customer Statistics Interface (from backend)
 */
export interface CustomerStatistics {
  totalOrders: number
  completedOrders: number
  cancelledOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrderDate: string | null
  lastVisitDate: string | null
  firstOrderDate: string | null
}

/**
 * Customer Interface (Main Entity)
 * ✅ MATCHES BACKEND EXACTLY
 */
export interface Customer {
  _id: ID
  organizationId: ID
  shopId: ID
  customerCode: string // Auto-generated: CUST00001

  // Basic Information
  firstName: string
  lastName?: string
  fullName: string // Virtual field: firstName + lastName
  phone: string
  alternatePhone?: string
  whatsappNumber?: string
  email?: string

  // Personal Details
  dateOfBirth?: string // ISO8601 format: YYYY-MM-DD
  gender?: Gender
  anniversaryDate?: string // ISO8601 format: YYYY-MM-DD

  // Address
  address?: Address

  // KYC Details
  aadharNumber?: string // 12 digits
  panNumber?: string // Format: ABCDE1234F
  gstNumber?: string // Format: 27ABCDE1234F1Z5

  // Customer Classification
  customerType?: CustomerType
  customerCategory?: CustomerCategory
  membershipTier: MembershipTier // Default: 'standard'

  // Financial
  creditLimit?: number
  currentBalance: number // Current outstanding
  totalPurchases: number // Lifetime purchases
  totalPaid: number // Total payments made
  totalDue: number // Outstanding balance
  lastPurchaseDate?: string // ISO8601 format
  loyaltyPoints: number

  // Preferences
  preferences?: CustomerPreferences

  // Source & Referral
  source?: CustomerSource
  referredBy?: ID

  // Additional Info
  notes?: string
  tags?: string[]

  // Blacklist
  isBlacklisted: boolean
  blacklistReason?: string
  blacklistedAt?: string
  blacklistedBy?: ID

  // Status
  isActive: boolean

  // Statistics
  statistics: CustomerStatistics

  // Audit Fields
  createdBy?: ID
  updatedBy?: ID

  // Timestamps
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

/**
 * Create Customer Request (for API calls)
 */
export interface CreateCustomerRequest {
  // Basic Information (firstName & phone are required)
  firstName: string
  lastName?: string
  phone: string // 10 digits, starts with 6-9
  alternatePhone?: string // 10 digits, starts with 6-9
  whatsappNumber?: string // 10 digits, starts with 6-9
  email?: string

  // Personal Details
  dateOfBirth?: string // ISO8601, age must be 18-120
  gender?: Gender
  anniversaryDate?: string

  // Address
  address?: Address

  // KYC Details
  aadharNumber?: string // 12 digits, starts with 2-9
  panNumber?: string // Format: ABCDE1234F (5 letters, 4 digits, 1 letter)
  gstNumber?: string // Format: 27ABCDE1234F1Z5

  // Customer Classification
  customerType?: CustomerType
  customerCategory?: CustomerCategory

  // Financial
  creditLimit?: number

  // Preferences
  preferences?: CustomerPreferences

  // Source & Referral
  source?: CustomerSource
  referredBy?: ID // MongoDB ID

  // Additional Info
  notes?: string // Max 1000 characters
  tags?: string[] // Each tag max 50 characters
}

/**
 * Update Customer Request (all fields optional)
 */
export interface UpdateCustomerRequest {
  firstName?: string
  lastName?: string
  phone?: string
  alternatePhone?: string
  whatsappNumber?: string
  email?: string
  dateOfBirth?: string
  gender?: Gender
  anniversaryDate?: string
  address?: Address
  aadharNumber?: string
  panNumber?: string
  gstNumber?: string
  customerType?: CustomerType
  customerCategory?: CustomerCategory
  creditLimit?: number
  preferences?: CustomerPreferences
  source?: CustomerSource
  notes?: string
  tags?: string[]
  isActive?: boolean

  // These fields CANNOT be updated directly (per backend validation)
  // customerCode - auto-generated
  // totalPurchases - updated via transactions
  // loyaltyPoints - updated via loyalty operations
}

/**
 * Customer Search Query Parameters
 */
export interface CustomerSearchParams {
  search?: string // General search (1-100 chars)
  phone?: string // 10 digits
  email?: string
  customerCode?: string
}

/**
 * Customer List Query Parameters
 */
export interface CustomerListParams {
  page?: number // Min: 1
  limit?: number // Min: 1, Max: 100
  search?: string // Max 100 chars
  customerType?: CustomerType
  membershipTier?: MembershipTier
  isActive?: boolean
  hasBalance?: boolean
  vipOnly?: boolean
  startDate?: string // ISO8601
  endDate?: string // ISO8601
  sort?: string // Format: "-firstName" or "totalPurchases"
}

/**
 * Blacklist Customer Request
 */
export interface BlacklistCustomerRequest {
  reason: string // 10-500 characters
}

/**
 * Loyalty Points Operation Request
 */
export interface LoyaltyPointsRequest {
  points: number // Positive integer
  reason?: string // Max 200 characters
}

/**
 * Bulk Import Customer Item
 */
export interface BulkImportCustomerItem {
  firstName: string
  lastName?: string
  phone: string // Required, 10 digits
  email?: string
  // ... other optional fields
}

/**
 * Bulk Import Request
 */
export interface BulkImportRequest {
  customers: BulkImportCustomerItem[] // 1-1000 items
}

/**
 * Export Customers Query Parameters
 */
export interface ExportCustomersParams {
  format?: 'csv' | 'excel' | 'pdf'
  fields?: string // Comma-separated field names
}

/**
 * Validation Constraints (for reference)
 */
export const VALIDATION_RULES = {
  firstName: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/, // Only letters and spaces
  },
  lastName: {
    maxLength: 50,
    pattern: /^[a-zA-Z\s]*$/, // Only letters and spaces
  },
  phone: {
    pattern: /^[6-9][0-9]{9}$/, // Indian phone: starts with 6-9, 10 digits total
  },
  email: {
    // Standard email validation
  },
  age: {
    min: 18,
    max: 120,
  },
  aadhar: {
    length: 12,
    pattern: /^[2-9][0-9]{11}$/, // 12 digits, starts with 2-9
  },
  pan: {
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, // ABCDE1234F
  },
  gst: {
    pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, // 27ABCDE1234F1Z5
  },
  pincode: {
    pattern: /^[1-9][0-9]{5}$/, // 6 digits, doesn't start with 0
  },
  street: {
    maxLength: 200,
  },
  city: {
    maxLength: 50,
  },
  state: {
    maxLength: 50,
  },
  notes: {
    maxLength: 1000,
  },
  tag: {
    maxLength: 50,
  },
  blacklistReason: {
    minLength: 10,
    maxLength: 500,
  },
  loyaltyReason: {
    maxLength: 200,
  },
  creditLimit: {
    min: 0,
  },
} as const

/**
 * Error Messages (matching backend)
 */
export const VALIDATION_MESSAGES = {
  firstName: {
    required: 'First name is required',
    length: 'First name must be between 2 and 50 characters',
    pattern: 'First name can only contain letters',
  },
  lastName: {
    length: 'Last name cannot exceed 50 characters',
    pattern: 'Last name can only contain letters',
  },
  phone: {
    required: 'Phone number is required',
    invalid:
      'Invalid Indian phone number (must start with 6-9 and be 10 digits)',
  },
  email: {
    invalid: 'Invalid email address',
  },
  age: {
    range: 'Customer must be between 18 and 120 years old',
  },
  aadhar: {
    invalid: 'Invalid Aadhar number (must be 12 digits)',
  },
  pan: {
    invalid: 'Invalid PAN format (e.g., ABCDE1234F)',
  },
  gst: {
    invalid: 'Invalid GST number format',
  },
  pincode: {
    invalid: 'Invalid pincode (must be 6 digits)',
  },
} as const

/**
 * Customer List API Response
 */
export interface CustomerListResponse {
  success: boolean
  message: string
  data: {
    customers: Customer[]
    summary: CustomerAnalytics
  }
  meta: {
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
}

/**
 * Single Customer API Response
 */
export interface CustomerResponse {
  success: boolean
  message: string
  data: {
    customer: Customer
  }
}

/**
 * Customer Search Response
 */
export interface CustomerSearchResponse {
  success: boolean
  message: string
  data: {
    exists: boolean
    customer: Customer | null
  }
}

/**
 * Customer Analytics/Summary
 */
export interface CustomerAnalytics {
  totalCustomers: number
  activeCustomers: number
  vipCustomers: number
  totalOutstanding: number
  totalLoyaltyPoints: number
  avgLifetimeValue: number
}

/**
 * Customer Analytics API Response
 */
export interface CustomerAnalyticsResponse {
  success: boolean
  message: string
  data: {
    summary: CustomerAnalytics
  }
}

/**
 * Customer Mutation Response (Create/Update/Delete)
 */
export interface CustomerMutationResponse {
  success: boolean
  message: string
  data: {
    customer: Customer
  }
}

/**
 * Blacklist Operation Response
 */
export interface BlacklistResponse {
  success: boolean
  message: string
  data: {
    customer: Customer
  }
}

/**
 * Loyalty Points Operation Response
 */
export interface LoyaltyPointsResponse {
  success: boolean
  message: string
  data: {
    customer: {
      _id: ID
      fullName: string
      loyaltyPoints: number
    }
  }
}

//
// 🆕 RTK QUERY INPUT TYPES
//

/**
 * Get Customers Query Input
 */
export interface GetCustomersInput extends CustomerListParams {
  shopId: string
}

/**
 * Get Customer By ID Input
 */
export interface GetCustomerByIdInput {
  shopId: string
  customerId: string
}

/**
 * Search Customer Input
 */
export interface SearchCustomerInput extends CustomerSearchParams {
  shopId: string
}

/**
 * Create Customer Input (with shopId)
 */
export interface CreateCustomerInput extends CreateCustomerRequest {
  shopId: string
}

/**
 * Update Customer Input (with shopId and customerId)
 */
export interface UpdateCustomerInput extends UpdateCustomerRequest {
  shopId: string
  customerId: string
}

/**
 * Delete Customer Input
 */
export interface DeleteCustomerInput {
  shopId: string
  customerId: string
}

/**
 * Blacklist Customer Input
 */
export interface BlacklistCustomerInput {
  shopId: string
  customerId: string
  reason: string
}

/**
 * Remove Blacklist Input
 */
export interface RemoveBlacklistInput {
  shopId: string
  customerId: string
}

/**
 * Add Loyalty Points Input
 */
export interface AddLoyaltyPointsInput {
  shopId: string
  customerId: string
  points: number
  reason?: string
}

/**
 * Redeem Loyalty Points Input
 */
export interface RedeemLoyaltyPointsInput {
  shopId: string
  customerId: string
  points: number
}

/**
 * Get Analytics Input
 */
export interface GetAnalyticsInput {
  shopId: string
}
