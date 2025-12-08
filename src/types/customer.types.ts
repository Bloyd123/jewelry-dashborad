// ============================================================================
// FILE: src/types/customer.types.ts
// Customer Types and Interfaces
// ============================================================================

import type { ID, Timestamp } from './common.types'

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
export type CustomerCategory = 'gold' | 'silver' | 'diamond' | 'platinum' | 'mixed'

/**
 * Membership Tier Enum
 */
export type MembershipTier = 'standard' | 'silver' | 'gold' | 'platinum'

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
 * Communication Preference Enum
 */
export type CommunicationPreference = 'email' | 'sms' | 'whatsapp' | 'call' | 'none'

/**
 * Preferred Metal Enum
 */
export type PreferredMetal = 'gold' | 'silver' | 'platinum' | 'diamond'

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
 * Main Customer Interface
 */
export interface Customer {
  _id: ID
  shopId: ID
  customerCode: string
  
  // Basic Information
  firstName: string
  lastName?: string
  phone: string
  alternatePhone?: string
  whatsappNumber?: string
  email?: string
  
  // Personal Details
  dateOfBirth?: Timestamp
  gender?: Gender
  anniversaryDate?: Timestamp
  
  // Address
  address?: Address
  
  // KYC Details
  aadharNumber?: string
  panNumber?: string
  gstNumber?: string
  
  // Customer Type & Category
  customerType?: CustomerType
  customerCategory?: CustomerCategory
  membershipTier?: MembershipTier
  
  // Financial
  creditLimit?: number
  totalPurchases: number
  outstandingBalance: number
  loyaltyPoints: number
  
  // Preferences
  preferences?: CustomerPreferences
  
  // Source & Referral
  source?: CustomerSource
  referredBy?: ID
  
  // Notes & Tags
  notes?: string
  tags?: string[]
  
  // Status
  isActive: boolean
  isBlacklisted: boolean
  blacklistReason?: string
  blacklistedAt?: Timestamp
  
  // Metadata
  createdBy: ID
  updatedBy?: ID
  createdAt: Timestamp
  updatedAt: Timestamp
}

/**
 * Customer with Relations (for detailed view)
 */
export interface CustomerWithRelations extends Customer {
  shop?: {
    _id: ID
    name: string
    code: string
  }
  referredByCustomer?: {
    _id: ID
    firstName: string
    lastName?: string
    customerCode: string
  }
  createdByUser?: {
    _id: ID
    firstName: string
    lastName?: string
  }
}

/**
 * Customer List Item (for list view)
 */
export interface CustomerListItem {
  _id: ID
  customerCode: string
  firstName: string
  lastName?: string
  phone: string
  email?: string
  customerType?: CustomerType
  membershipTier?: MembershipTier
  totalPurchases: number
  loyaltyPoints: number
  isActive: boolean
  isBlacklisted: boolean
  createdAt: Timestamp
}

/**
 * Create Customer Request
 */
export interface CreateCustomerRequest {
  shopId: ID
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
  customerType?: CustomerType
  customerCategory?: CustomerCategory
  creditLimit?: number
  preferences?: CustomerPreferences
  source?: CustomerSource
  referredBy?: ID
  notes?: string
  tags?: string[]
}

/**
 * Update Customer Request
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
}

/**
 * Customer Query Parameters
 */
export interface CustomerQueryParams {
  shopId: ID
  page?: number
  limit?: number
  search?: string
  customerType?: CustomerType
  membershipTier?: MembershipTier
  isActive?: boolean
  hasBalance?: boolean
  startDate?: string
  endDate?: string
  sort?: string
}

/**
 * Customer Statistics
 */
export interface CustomerStatistics {
  totalCustomers: number
  activeCustomers: number
  inactiveCustomers: number
  blacklistedCustomers: number
  vipCustomers: number
  totalPurchases: number
  totalOutstanding: number
  averagePurchaseValue: number
  customersByType: Record<CustomerType, number>
  customersByTier: Record<MembershipTier, number>
}

/**
 * Blacklist Customer Request
 */
export interface BlacklistCustomerRequest {
  reason: string
}

/**
 * Loyalty Points Request
 */
export interface LoyaltyPointsRequest {
  points: number
  reason?: string
}

/**
 * Customer Search Result
 */
export interface CustomerSearchResult {
  _id: ID
  customerCode: string
  firstName: string
  lastName?: string
  phone: string
  email?: string
  totalPurchases: number
  isBlacklisted: boolean
}