// FILE: src/types/customer.types.ts
export type ID = string
export type Gender = 'male' | 'female' | 'other'
export type CustomerType = 'retail' | 'wholesale' | 'vip' | 'regular'
export type CustomerCategory =
  | 'gold'
  | 'silver'
  | 'diamond'
  | 'platinum'
  | 'mixed'
export type MembershipTier = 'standard' | 'silver' | 'gold' | 'platinum'
export type PreferredMetal = 'gold' | 'silver' | 'platinum' | 'diamond'
export type CommunicationPreference =
  | 'email'
  | 'sms'
  | 'whatsapp'
  | 'call'
  | 'none'
export type CustomerSource =
  | 'walk_in'
  | 'referral'
  | 'online'
  | 'phone'
  | 'social_media'
  | 'advertisement'
  | 'other'
export interface Address {
  street?: string
  city?: string
  state?: string
  pincode?: string
}
export interface CustomerPreferences {
  preferredMetal?: PreferredMetal
  communicationPreference?: CommunicationPreference
}
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
export interface Customer {
  _id: ID
  organizationId: ID
  shopId: ID
  customerCode: string 

  firstName: string
  lastName?: string
  fullName: string 
  phone: string
  alternatePhone?: string
  whatsappNumber?: string
  email?: string

  // Personal Details
  dateOfBirth?: string // ISO8601 format: YYYY-MM-DD
  gender?: Gender
  anniversaryDate?: string // ISO8601 format: YYYY-MM-DD
  address?: Address

  aadharNumber?: string 
  panNumber?: string 
  gstNumber?: string 

  // Customer Classification
  customerType?: CustomerType
  customerCategory?: CustomerCategory
  membershipTier: MembershipTier 

  // Financial
  creditLimit?: number
  currentBalance: number 
  totalPurchases: number 
  totalPaid: number 
  totalDue: number 
  lastPurchaseDate?: string 
  loyaltyPoints: number

  // Preferences
  preferences?: CustomerPreferences

  // Source & Referral
// Source & Referral
  source?: CustomerSource
  referredBy?: ID | {
    _id: ID
    firstName: string
    lastName?: string
    customerCode: string
    phone: string
  } | null

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
export interface CreateCustomerRequest {
  firstName: string
  lastName?: string
  phone: string 
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

  // Customer Classification
  customerType?: CustomerType
  customerCategory?: CustomerCategory

  // Financial
  creditLimit?: number

  // Preferences
  preferences?: CustomerPreferences

  // Source & Referral
  source?: CustomerSource
  referredBy?: ID 

  notes?: string 
  tags?: string[] 
}
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
}
export interface CustomerSearchParams {
  search?: string 
  phone?: string 
  email?: string
  customerCode?: string
}
export interface CustomerListParams {
  page?: number 
  limit?: number 
  search?: string 
  customerType?: CustomerType
  membershipTier?: MembershipTier
  isActive?: boolean
  hasBalance?: boolean
  vipOnly?: boolean
  startDate?: string 
  endDate?: string 
  sort?: string 
}

export interface BlacklistCustomerRequest {
  reason: string 
}
export interface LoyaltyPointsRequest {
  points: number 
  reason?: string 
}
export interface BulkImportCustomerItem {
  firstName: string
  lastName?: string
  phone: string 
  email?: string
}

export interface BulkImportRequest {
  customers: BulkImportCustomerItem[] 
}
export interface ExportCustomersParams {
  format?: 'csv' | 'excel' | 'pdf'
  fields?: string 
}
export const VALIDATION_RULES = {
  firstName: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/, 
  },
  lastName: {
    maxLength: 50,
    pattern: /^[a-zA-Z\s]*$/, 
  },
  phone: {
    pattern: /^[6-9][0-9]{9}$/, 
  },
  email: {
  },
  age: {
    min: 18,
    max: 120,
  },
  aadhar: {
    length: 12,
    pattern: /^[2-9][0-9]{11}$/, 
  },
  pan: {
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 
  },
  gst: {
    pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 
  },
  pincode: {
    pattern: /^[1-9][0-9]{5}$/, 
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
export interface CustomerResponse {
  success: boolean
  message: string
  data: {
    customer: Customer
  }
}

export interface CustomerSearchResponse {
  success: boolean
  message: string
  data: {
    exists: boolean
    customer: Customer | null
  }
}

export interface CustomerAnalytics {
  totalCustomers: number
  activeCustomers: number
  vipCustomers: number
  totalOutstanding: number
  totalLoyaltyPoints: number
  avgLifetimeValue: number
}
export interface CustomerAnalyticsResponse {
  success: boolean
  message: string
  data: {
    summary: CustomerAnalytics
  }
}
export interface CustomerMutationResponse {
  success: boolean
  message: string
  data: {
    customer: Customer
  }
}
export interface BlacklistResponse {
  success: boolean
  message: string
  data: {
    customer: Customer
  }
}
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
export interface GetCustomersInput extends CustomerListParams {
  shopId: string
}
export interface GetCustomerByIdInput {
  shopId: string
  customerId: string
}
export interface SearchCustomerInput extends CustomerSearchParams {
  shopId: string
}
export interface CreateCustomerInput extends CreateCustomerRequest {
  shopId: string
}
export interface UpdateCustomerInput extends UpdateCustomerRequest {
  shopId: string
  customerId: string
}
export interface DeleteCustomerInput {
  shopId: string
  customerId: string
}
export interface BlacklistCustomerInput {
  shopId: string
  customerId: string
  reason: string
}
export interface RemoveBlacklistInput {
  shopId: string
  customerId: string
}
export interface AddLoyaltyPointsInput {
  shopId: string
  customerId: string
  points: number
  reason?: string
}
export interface RedeemLoyaltyPointsInput {
  shopId: string
  customerId: string
  points: number
}
export interface GetAnalyticsInput {
  shopId: string
}
