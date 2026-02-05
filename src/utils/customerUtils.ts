// FILE: src/features/customer/utils/customerUtils.ts
// Customer Utility Helper Functions

import type {
  Customer,
  Gender,
  CustomerType,
  CustomerCategory,
  PreferredMetal,
  CommunicationPreference,
  CustomerSource,
} from '@/types/customer.types'

/**
 * ============================================
 * 👤 CUSTOMER FORMATTING UTILITIES
 * ============================================
 */

/**
 * Get customer's full name
 */
export const getCustomerFullName = (
  customer: Customer | Partial<Customer>
): string => {
  if (!customer.firstName) return 'Unknown Customer'

  const lastName = customer.lastName ? ` ${customer.lastName}` : ''
  return `${customer.firstName}${lastName}`.trim()
}

/**
 * Get customer's display name with code
 */
export const getCustomerDisplayName = (customer: Customer): string => {
  const fullName = getCustomerFullName(customer)
  return `${fullName} (${customer.customerCode || 'N/A'})`
}

/**
 * Get customer initials for avatar
 */
export const getCustomerInitials = (
  customer: Customer | Partial<Customer>
): string => {
  if (!customer.firstName) return '??'

  const firstInitial = customer.firstName.charAt(0).toUpperCase()
  const lastInitial = customer.lastName
    ? customer.lastName.charAt(0).toUpperCase()
    : ''

  return firstInitial + lastInitial
}

/**
 * ============================================
 * 📞 CONTACT FORMATTING UTILITIES
 * ============================================
 */

/**
 * Format phone number for display (Indian format)
 * Example: 9876543210 → +91 98765 43210
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return ''

  // Remove any existing formatting
  const cleaned = phone.replace(/\D/g, '')

  // Format as +91 XXXXX XXXXX
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`
  }

  return phone
}

/**
 * Format phone for WhatsApp link
 */
export const formatPhoneForWhatsApp = (phone: string): string => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  return `91${cleaned}` // Indian country code
}

/**
 * Get WhatsApp message URL
 */
export const getWhatsAppURL = (phone: string, message?: string): string => {
  const formattedPhone = formatPhoneForWhatsApp(phone)
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${formattedPhone}${encodedMessage}`
}

/**
 * Get email mailto link
 */
export const getEmailLink = (
  email: string,
  subject?: string,
  body?: string
): string => {
  if (!email) return ''

  const params = []
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`)
  if (body) params.push(`body=${encodeURIComponent(body)}`)

  const queryString = params.length > 0 ? `?${params.join('&')}` : ''
  return `mailto:${email}${queryString}`
}

/**
 * Get call link
 */
export const getCallLink = (phone: string): string => {
  if (!phone) return ''
  return `tel:+91${phone.replace(/\D/g, '')}`
}

/**
 * ============================================
 * 🎨 STATUS & TYPE UTILITIES
 * ============================================
 */

/**
 * Get customer type label
 */
export const getCustomerTypeLabel = (type: CustomerType): string => {
  const labels: Record<CustomerType, string> = {
    retail: 'Retail',
    wholesale: 'Wholesale',
    vip: 'VIP',
    regular: 'Regular',
  }
  return labels[type] || type
}

/**
 * Get customer type color class
 */
export const getCustomerTypeColor = (type: CustomerType): string => {
  const colors: Record<CustomerType, string> = {
    retail: 'text-blue-600 bg-blue-50',
    wholesale: 'text-purple-600 bg-purple-50',
    vip: 'text-gold-600 bg-gold-50',
    regular: 'text-gray-600 bg-gray-50',
  }
  return colors[type] || 'text-gray-600 bg-gray-50'
}

/**
 * Get customer category label
 */
export const getCustomerCategoryLabel = (
  category: CustomerCategory
): string => {
  const labels: Record<CustomerCategory, string> = {
    gold: 'Gold',
    silver: 'Silver',
    diamond: 'Diamond',
    platinum: 'Platinum',
    mixed: 'Mixed',
  }
  return labels[category] || category
}

/**
 * Get customer category color
 */
export const getCustomerCategoryColor = (
  category: CustomerCategory
): string => {
  const colors: Record<CustomerCategory, string> = {
    gold: 'text-yellow-600 bg-yellow-50',
    silver: 'text-gray-600 bg-gray-50',
    diamond: 'text-blue-600 bg-blue-50',
    platinum: 'text-purple-600 bg-purple-50',
    mixed: 'text-green-600 bg-green-50',
  }
  return colors[category] || 'text-gray-600 bg-gray-50'
}

/**
 * Get gender label
 */
export const getGenderLabel = (gender?: Gender): string => {
  if (!gender) return 'Not specified'

  const labels: Record<Gender, string> = {
    male: 'Male',
    female: 'Female',
    other: 'Other',
  }
  return labels[gender] || gender
}

/**
 * Get gender icon
 */
export const getGenderIcon = (gender?: Gender): string => {
  const icons: Record<Gender, string> = {
    male: '♂',
    female: '♀',
    other: '⚧',
  }
  return gender ? icons[gender] || '' : ''
}

/**
 * Get customer source label
 */
export const getCustomerSourceLabel = (source?: CustomerSource): string => {
  if (!source) return 'Unknown'

  const labels: Record<CustomerSource, string> = {
    walk_in: 'Walk-in',
    referral: 'Referral',
    online: 'Online',
    phone: 'Phone',
    social_media: 'Social Media',
    advertisement: 'Advertisement',
    other: 'Other',
  }
  return labels[source] || source
}

/**
 * Get active status badge
 */
export const getActiveStatusColor = (isActive: boolean): string => {
  return isActive
    ? 'text-status-success bg-status-success/10'
    : 'text-status-error bg-status-error/10'
}

/**
 * Get active status label
 */
export const getActiveStatusLabel = (isActive: boolean): string => {
  return isActive ? 'Active' : 'Inactive'
}

/**
 * ============================================
 *  FINANCIAL UTILITIES
 * ============================================
 */

/**
 * Format currency (Indian Rupee)
 */
export const formatCurrency = (amount: number): string => {
  if (amount === 0) return '₹0'
  if (!amount) return '₹0'

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format loyalty points
 */
export const formatLoyaltyPoints = (points: number): string => {
  if (!points) return '0 pts'
  return `${points.toLocaleString('en-IN')} pts`
}

/**
 * Calculate loyalty points from amount
 * Example: 1 point per ₹100 spent
 */
export const calculateLoyaltyPointsFromAmount = (
  amount: number,
  rate = 0.01
): number => {
  return Math.floor(amount * rate)
}

/**
 * Calculate discount from loyalty points
 * Example: 1 point = ₹1 discount
 */
export const calculateDiscountFromPoints = (
  points: number,
  conversionRate = 1
): number => {
  return points * conversionRate
}

/**
 * Get credit limit usage percentage
 */
export const getCreditLimitUsage = (
  totalDue: number,
  creditLimit?: number
): number => {
  if (!creditLimit || creditLimit === 0) return 0
  return Math.min((totalDue / creditLimit) * 100, 100)
}

/**
 * Get credit limit status color
 */
export const getCreditLimitColor = (usage: number): string => {
  if (usage >= 90) return 'text-status-error bg-status-error/10'
  if (usage >= 75) return 'text-status-warning bg-status-warning/10'
  return 'text-status-success bg-status-success/10'
}

/**
 * Check if customer has outstanding balance
 */
export const hasOutstandingBalance = (customer: Customer): boolean => {
  return (customer.totalDue || 0) > 0
}

/**
 * ============================================
 * 📅 DATE & TIME UTILITIES
 * ============================================
 */

/**
 * Calculate age from date of birth
 */
export const calculateAge = (dateOfBirth: string): number => {
  if (!dateOfBirth) return 0

  const dob = new Date(dateOfBirth)
  const today = new Date()

  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }

  return age
}

/**
 * Format date for display
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return 'N/A'

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

/**
 * Format relative date (e.g., "2 days ago")
 */
export const formatRelativeDate = (date: string | Date): string => {
  if (!date) return 'Never'

  const now = new Date()
  const past = new Date(date)
  const diffInMs = now.getTime() - past.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Today'
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
  return `${Math.floor(diffInDays / 365)} years ago`
}

/**
 * Check if birthday is today
 */
export const isBirthdayToday = (dateOfBirth?: string): boolean => {
  if (!dateOfBirth) return false

  const dob = new Date(dateOfBirth)
  const today = new Date()

  return (
    dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate()
  )
}

/**
 * Check if anniversary is today
 */
export const isAnniversaryToday = (anniversaryDate?: string): boolean => {
  if (!anniversaryDate) return false

  const anniversary = new Date(anniversaryDate)
  const today = new Date()

  return (
    anniversary.getMonth() === today.getMonth() &&
    anniversary.getDate() === today.getDate()
  )
}

/**
 * Get upcoming birthday (days remaining)
 */
export const getDaysUntilBirthday = (dateOfBirth?: string): number | null => {
  if (!dateOfBirth) return null

  const dob = new Date(dateOfBirth)
  const today = new Date()

  const thisYearBirthday = new Date(
    today.getFullYear(),
    dob.getMonth(),
    dob.getDate()
  )

  if (thisYearBirthday < today) {
    thisYearBirthday.setFullYear(today.getFullYear() + 1)
  }

  const diffInMs = thisYearBirthday.getTime() - today.getTime()
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
}

/**
 * Get upcoming anniversary (days remaining)
 */
export const getDaysUntilAnniversary = (
  anniversaryDate?: string
): number | null => {
  if (!anniversaryDate) return null

  const anniversary = new Date(anniversaryDate)
  const today = new Date()

  const thisYearAnniversary = new Date(
    today.getFullYear(),
    anniversary.getMonth(),
    anniversary.getDate()
  )

  if (thisYearAnniversary < today) {
    thisYearAnniversary.setFullYear(today.getFullYear() + 1)
  }

  const diffInMs = thisYearAnniversary.getTime() - today.getTime()
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
}

/**
 * ============================================
 * 🏷️ TAG UTILITIES
 * ============================================
 */

/**
 * Get tag color (deterministic based on tag name)
 */
export const getTagColor = (tag: string): string => {
  const colors = [
    'bg-blue-100 text-blue-700',
    'bg-green-100 text-green-700',
    'bg-yellow-100 text-yellow-700',
    'bg-red-100 text-red-700',
    'bg-purple-100 text-purple-700',
    'bg-pink-100 text-pink-700',
    'bg-indigo-100 text-indigo-700',
    'bg-teal-100 text-teal-700',
  ]

  // Use tag length for deterministic color
  const index = tag.length % colors.length
  return colors[index]
}

/**
 * ============================================
 * ✅ VALIDATION UTILITIES
 * ============================================
 */

/**
 * Validate Indian phone number
 */
export const isValidIndianPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '')
  return /^[6-9][0-9]{9}$/.test(cleaned)
}

/**
 * Validate Aadhar number
 */
export const isValidAadhar = (aadhar: string): boolean => {
  const cleaned = aadhar.replace(/\s/g, '')
  return /^[2-9][0-9]{11}$/.test(cleaned)
}

/**
 * Validate PAN number
 */
export const isValidPAN = (pan: string): boolean => {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase())
}

/**
 * Validate GST number
 */
export const isValidGST = (gst: string): boolean => {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
    gst.toUpperCase()
  )
}

/**
 * Validate age range (18-120)
 */
export const isValidAge = (dateOfBirth: string): boolean => {
  const age = calculateAge(dateOfBirth)
  return age >= 18 && age <= 120
}

/**
 * ============================================
 * 🔍 SEARCH & FILTER UTILITIES
 * ============================================
 */

/**
 * Filter customers by search query
 */
export const filterCustomersBySearch = (
  customers: Customer[],
  searchQuery: string
): Customer[] => {
  if (!searchQuery) return customers

  const query = searchQuery.toLowerCase().trim()

  return customers.filter(customer => {
    const fullName = getCustomerFullName(customer).toLowerCase()
    const phone = customer.phone || ''
    const email = (customer.email || '').toLowerCase()
    const code = (customer.customerCode || '').toLowerCase()

    return (
      fullName.includes(query) ||
      phone.includes(query) ||
      email.includes(query) ||
      code.includes(query)
    )
  })
}

/**
 * Sort customers by field
 */
export const sortCustomers = (
  customers: Customer[],
  sortBy: string,
  order: 'asc' | 'desc' = 'asc'
): Customer[] => {
  const sorted = [...customers].sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (sortBy) {
      case 'name':
        aValue = getCustomerFullName(a)
        bValue = getCustomerFullName(b)
        break
      case 'phone':
        aValue = a.phone
        bValue = b.phone
        break
      case 'totalPurchases':
        aValue = a.totalPurchases || 0
        bValue = b.totalPurchases || 0
        break
      case 'loyaltyPoints':
        aValue = a.loyaltyPoints || 0
        bValue = b.loyaltyPoints || 0
        break
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
        break
      default:
        return 0
    }

    if (aValue < bValue) return order === 'asc' ? -1 : 1
    if (aValue > bValue) return order === 'asc' ? 1 : -1
    return 0
  })

  return sorted
}

/**
 * Group customers by first letter
 */
export const groupCustomersByLetter = (
  customers: Customer[]
): Record<string, Customer[]> => {
  return customers.reduce(
    (groups, customer) => {
      const letter = customer.firstName?.charAt(0).toUpperCase() || '#'
      if (!groups[letter]) {
        groups[letter] = []
      }
      groups[letter].push(customer)
      return groups
    },
    {} as Record<string, Customer[]>
  )
}

/**
 * ============================================
 *  STATISTICS UTILITIES
 * ============================================
 */

/**
 * Calculate customer lifetime value (CLV)
 */
export const calculateCustomerLifetimeValue = (customer: Customer): number => {
  return customer.totalPurchases || 0
}

/**
 * Calculate average order value
 */
export const calculateAverageOrderValue = (
  totalSpent: number,
  orderCount: number
): number => {
  if (orderCount === 0) return 0
  return totalSpent / orderCount
}

/**
 * Get customer segment based on spending
 */
export const getCustomerSegment = (
  totalPurchases: number
): 'high-value' | 'medium-value' | 'low-value' => {
  if (totalPurchases >= 100000) return 'high-value'
  if (totalPurchases >= 50000) return 'medium-value'
  return 'low-value'
}

/**
 * ============================================
 * 📋 EXPORT UTILITIES
 * ============================================
 */

/**
 * Convert customer to CSV row
 */
export const customerToCSVRow = (customer: Customer): string[] => {
  return [
    customer.customerCode || '',
    getCustomerFullName(customer),
    customer.phone || '',
    customer.email || '',
    getCustomerTypeLabel(customer.customerType || 'regular'),
    formatCurrency(customer.totalPurchases || 0),
    formatLoyaltyPoints(customer.loyaltyPoints || 0),
    getActiveStatusLabel(customer.isActive),
    formatDate(customer.createdAt),
  ]
}

/**
 * Get CSV headers
 */
export const getCustomerCSVHeaders = (): string[] => {
  return [
    'Customer Code',
    'Name',
    'Phone',
    'Email',
    'Type',
    'Total Purchases',
    'Loyalty Points',
    'Status',
    'Joined Date',
  ]
}

/**
 * ============================================
 * 🎯 BUSINESS LOGIC UTILITIES
 * ============================================
 */

/**
 * Check if customer is VIP
 */
export const isVIPCustomer = (customer: Customer): boolean => {
  return (
    customer.customerType === 'vip' || (customer.totalPurchases || 0) >= 100000
  )
}

/**
 * Check if customer is at risk (no recent purchase)
 */
export const isAtRiskCustomer = (lastPurchaseDate?: string): boolean => {
  if (!lastPurchaseDate) return true

  const daysSinceLastPurchase = Math.floor(
    (Date.now() - new Date(lastPurchaseDate).getTime()) / (1000 * 60 * 60 * 24)
  )

  return daysSinceLastPurchase > 180 // 6 months
}

/**
 * Get customer engagement level
 */
export const getCustomerEngagement = (
  customer: Customer
): 'highly-engaged' | 'engaged' | 'at-risk' | 'inactive' => {
  const daysSinceLastPurchase = customer.lastPurchaseDate
    ? Math.floor(
        (Date.now() - new Date(customer.lastPurchaseDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 999

  if (daysSinceLastPurchase <= 30) return 'highly-engaged'
  if (daysSinceLastPurchase <= 90) return 'engaged'
  if (daysSinceLastPurchase <= 180) return 'at-risk'
  return 'inactive'
}

/**
 * Get recommended action for customer
 */
export const getRecommendedAction = (customer: Customer): string => {
  // Birthday/Anniversary
  if (isBirthdayToday(customer.dateOfBirth)) {
    return 'Send birthday wishes'
  }
  if (isAnniversaryToday(customer.anniversaryDate)) {
    return 'Send anniversary wishes'
  }

  // Outstanding balance
  if (hasOutstandingBalance(customer) && (customer.totalDue || 0) > 10000) {
    return 'Follow up on payment'
  }

  // At risk
  if (isAtRiskCustomer(customer.lastPurchaseDate)) {
    return 'Send re-engagement offer'
  }

  // High value customer
  if (isVIPCustomer(customer)) {
    return 'Provide VIP service'
  }

  return 'Keep engaged'
}

/**
 * ============================================
 * 🔐 KYC UTILITIES
 * ============================================
 */

/**
 * Mask Aadhar number for display
 */
export const maskAadhar = (aadhar: string): string => {
  if (!aadhar || aadhar.length !== 12) return ''
  return `XXXX XXXX ${aadhar.slice(-4)}`
}

/**
 * Mask PAN number for display
 */
export const maskPAN = (pan: string): string => {
  if (!pan || pan.length !== 10) return ''
  return `${pan.slice(0, 2)}XXXX${pan.slice(-4)}`
}

/**
 * Check KYC completion status
 */
export const getKYCStatus = (
  customer: Customer
): 'complete' | 'partial' | 'incomplete' => {
  const hasAadhar = Boolean(customer.aadharNumber)
  const hasPAN = Boolean(customer.panNumber)
  const hasAddress = Boolean(customer.address?.pincode)

  if (hasAadhar && hasPAN && hasAddress) return 'complete'
  if (hasAadhar || hasPAN) return 'partial'
  return 'incomplete'
}

/**
 * ============================================
 * 📱 COMMUNICATION UTILITIES
 * ============================================
 */

/**
 * Get preferred communication channel
 */
export const getPreferredCommunicationChannel = (
  customer: Customer
): 'whatsapp' | 'sms' | 'email' | 'call' | 'none' => {
  return customer.preferences?.communicationPreference || 'whatsapp'
}

/**
 * Can send WhatsApp message
 */
export const canSendWhatsApp = (customer: Customer): boolean => {
  return Boolean(customer.whatsappNumber || customer.phone)
}

/**
 * Can send email
 */
export const canSendEmail = (customer: Customer): boolean => {
  return Boolean(customer.email)
}

/**
 * Get contact methods available
 */
export const getAvailableContactMethods = (customer: Customer): string[] => {
  const methods: string[] = []

  if (customer.phone) methods.push('phone')
  if (customer.whatsappNumber || customer.phone) methods.push('whatsapp')
  if (customer.email) methods.push('email')

  return methods
}


// DEFAULT EXPORT


export default {
  // Name & Display
  getCustomerFullName,
  getCustomerDisplayName,
  getCustomerInitials,

  // Contact
  formatPhoneNumber,
  formatPhoneForWhatsApp,
  getWhatsAppURL,
  getEmailLink,
  getCallLink,

  // Status & Types
  getCustomerTypeLabel,
  getCustomerTypeColor,
  getCustomerCategoryLabel,
  getCustomerCategoryColor,
  getGenderLabel,
  getGenderIcon,
  getCustomerSourceLabel,
  getActiveStatusColor,
  getActiveStatusLabel,

  // Financial
  formatCurrency,
  formatLoyaltyPoints,
  calculateLoyaltyPointsFromAmount,
  calculateDiscountFromPoints,
  getCreditLimitUsage,
  getCreditLimitColor,
  hasOutstandingBalance,

  // Date & Time
  calculateAge,
  formatDate,
  formatRelativeDate,
  isBirthdayToday,
  isAnniversaryToday,
  getDaysUntilBirthday,
  getDaysUntilAnniversary,

  // Tags
  getTagColor,

  // Validation
  isValidIndianPhone,
  isValidAadhar,
  isValidPAN,
  isValidGST,
  isValidAge,

  // Search & Filter
  filterCustomersBySearch,
  sortCustomers,
  groupCustomersByLetter,

  // Statistics
  calculateCustomerLifetimeValue,
  calculateAverageOrderValue,
  getCustomerSegment,

  // Export
  customerToCSVRow,
  getCustomerCSVHeaders,

  // Business Logic
  isVIPCustomer,
  isAtRiskCustomer,
  getCustomerEngagement,
  getRecommendedAction,

  // KYC
  maskAadhar,
  maskPAN,
  getKYCStatus,

  // Communication
  getPreferredCommunicationChannel,
  canSendWhatsApp,
  canSendEmail,
  getAvailableContactMethods,
}
