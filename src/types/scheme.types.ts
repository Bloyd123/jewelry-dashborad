// FILE: src/types/scheme.types.ts

export type SchemeType =
  | 'gold_saving'
  | 'installment'
  | 'advance_booking'
  | 'festival_scheme'
  | 'custom'

export type SchemeStatus = 'draft' | 'active' | 'paused' | 'expired' | 'archived'

export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export type InstallmentFrequency = 'weekly' | 'monthly' | 'custom'

export type BonusType = 'percentage' | 'flat_amount' | 'free_making' | 'discount'

export type PenaltyType = 'percentage' | 'flat' | 'none'

export type RedemptionMode = 'cash' | 'jewelry'

export type PaymentMode = 'cash' | 'card' | 'upi' | 'cheque' | 'bank_transfer'

export type EnrollmentStatus = 'active' | 'matured' | 'cancelled' | 'redeemed'

export type ReminderMethod = 'sms' | 'email' | 'whatsapp'

// ─────────────────────────────────────────────
// SUB-TYPES
// ─────────────────────────────────────────────

export interface SchemeDuration {
  months: number
  weeks?: number
}

export interface SchemeInstallments {
  totalInstallments: number
  installmentAmount: number
  frequency: InstallmentFrequency
  dueDay?: number
}

export interface SchemeBonus {
  hasBonus: boolean
  bonusType: BonusType
  bonusValue: number
  bonusDescription?: string
}

export interface SchemeMaturity {
  totalSchemeAmount: number
  bonusAmount: number
  totalMaturityValue: number
  canWithdrawCash: boolean
  withdrawalCharges: number
}

export interface SchemeEligibility {
  minAge: number
  maxAge?: number
  minInstallmentAmount: number
  requiresKYC: boolean
}

export interface SchemeRedemption {
  canRedeemEarly: boolean
  earlyRedemptionPenalty: {
    type: PenaltyType
    value: number
  }
  gracePeriodDays: number
  missedInstallmentPenalty: number
}

export interface SchemePricing {
  useCurrentMetalRate: boolean
  fixedMetalRate?: number
  makingChargesDiscount: number
  waiveMakingCharges: boolean
}

export interface SchemeLimits {
  maxEnrollments?: number
  currentEnrollments: number
  maxEnrollmentsPerCustomer: number
}

export interface SchemeValidity {
  startDate: string
  endDate: string
  enrollmentDeadline?: string
  isActive: boolean
}

export interface SchemeMarketing {
  isFeatured: boolean
  displayOrder: number
  imageUrl?: string
  bannerUrl?: string
  highlights: string[]
}

export interface SchemeStatistics {
  totalEnrollments: number
  activeEnrollments: number
  completedEnrollments: number
  totalRevenue: number
  averageInstallmentCollection: number
}

export interface TermsAndCondition {
  condition: string
  order: number
}

// ─────────────────────────────────────────────
// MAIN SCHEME ENTITY
// ─────────────────────────────────────────────

export interface Scheme {
  _id: string
  organizationId: string
  shopId: string

  schemeCode: string
  schemeName: string
  description?: string
  schemeType: SchemeType

  duration: SchemeDuration
  installments: SchemeInstallments
  bonus: SchemeBonus
  maturity: SchemeMaturity
  eligibility: SchemeEligibility
  termsAndConditions: TermsAndCondition[]
  redemption: SchemeRedemption
  pricing: SchemePricing
  limits: SchemeLimits
  validity: SchemeValidity
  marketing: SchemeMarketing
  statistics: SchemeStatistics

  status: SchemeStatus
  approvalStatus: ApprovalStatus
  approvedBy?: string
  approvedAt?: string
  rejectionReason?: string

  notes?: string
  internalNotes?: string
  tags: string[]

  createdBy: string
  updatedBy?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string

  // Virtual from backend
  enrollmentStats?: {
    totalEnrollments: number
    activeEnrollments: number
    completedEnrollments: number
  }
}

// ─────────────────────────────────────────────
// ENROLLMENT ENTITY
// ─────────────────────────────────────────────

export interface ScheduleItem {
  installmentNumber: number
  dueDate: string
  amount: number
  status: 'pending' | 'paid' | 'overdue' | 'missed'
  paidDate?: string
  paidAmount?: number
  paymentId?: string
}

export interface EnrollmentCustomerDetails {
  customerName: string
  customerCode: string
  phone: string
  email?: string
}

export interface EnrollmentMaturity {
  totalSchemeAmount: number
  bonusAmount: number
  totalMaturityValue: number
  goldEquivalentGrams: number
  isCalculated: boolean
  calculatedAt?: string
}

export interface EnrollmentRedemption {
  isRedeemed: boolean
  redemptionDate?: string
  redemptionType?: 'early' | 'normal'
  redemptionMode?: RedemptionMode
  redemptionValue?: number
  penaltyApplied?: number
  netRedemptionValue?: number
  linkedSaleId?: string
  notes?: string
}

export interface EnrollmentCancellation {
  isCancelled: boolean
  cancelledAt?: string
  cancelledBy?: string
  cancellationReason?: string
  refundAmount?: number
  refundStatus?: 'pending' | 'completed' | 'not_applicable'
}

export interface SchemeEnrollment {
  _id: string
  organizationId: string
  shopId: string
  enrollmentNumber: string

  schemeId: string | Scheme
  customerId: string | {
    _id: string
    firstName: string
    lastName?: string
    phone: string
    customerCode: string
  }
  customerDetails: EnrollmentCustomerDetails

  installmentAmount: number
  totalInstallments: number
  frequency: InstallmentFrequency
  startDate: string
  expectedEndDate: string
  maturityDate: string
  actualEndDate?: string
  nextDueDate?: string

  paidInstallments: number
  totalPaidAmount: number

  schedule: ScheduleItem[]

  status: EnrollmentStatus
  maturity?: EnrollmentMaturity
  redemption?: EnrollmentRedemption
  cancellation?: EnrollmentCancellation

  metalRateAtEnrollment?: {
    gold24K: number
    gold22K: number
    silver: number
    rateDate: string
  }

  kyc?: {
    isVerified: boolean
    documents: any[]
  }

  enrolledBy?: string
  createdBy: string
  updatedBy?: string
  notes?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

// ─────────────────────────────────────────────
// REQUEST TYPES
// ─────────────────────────────────────────────

export interface CreateSchemeInput {
  shopId: string
  schemeName: string
  description?: string
  schemeType: SchemeType
  duration: SchemeDuration
  installments: SchemeInstallments
  bonus?: Partial<SchemeBonus>
  eligibility?: Partial<SchemeEligibility>
  termsAndConditions?: TermsAndCondition[]
  redemption?: Partial<SchemeRedemption>
  pricing?: Partial<SchemePricing>
  limits?: Partial<SchemeLimits>
  validity: Pick<SchemeValidity, 'startDate' | 'endDate' | 'enrollmentDeadline'>
  marketing?: Partial<SchemeMarketing>
  notes?: string
  tags?: string[]
}

export interface UpdateSchemeInput {
  shopId: string
  schemeId: string
  schemeName?: string
  description?: string
  installments?: Partial<SchemeInstallments>
  bonus?: Partial<SchemeBonus>
  eligibility?: Partial<SchemeEligibility>
  termsAndConditions?: TermsAndCondition[]
  redemption?: Partial<SchemeRedemption>
  pricing?: Partial<SchemePricing>
  limits?: Partial<SchemeLimits>
  validity?: Partial<SchemeValidity>
  marketing?: Partial<SchemeMarketing>
  notes?: string
  tags?: string[]
}

export interface GetSchemesInput {
  shopId: string
  page?: number
  limit?: number
  sort?: string
  status?: SchemeStatus
  schemeType?: SchemeType
  isActive?: boolean
  isFeatured?: boolean
  startDate?: string
  endDate?: string
}

export interface EnrollCustomerInput {
  shopId: string
  schemeId: string
  customerId: string
  installmentAmount?: number
  startDate?: string
  notes?: string
  initialPayment?: {
    amount: number
    paymentMode: PaymentMode
  }
  kyc?: {
    documents: any[]
  }
}

export interface RecordPaymentInput {
  shopId: string
  enrollmentId: string
  amount: number
  paymentMode: PaymentMode
  paymentDate?: string
  transactionId?: string
  notes?: string
}

export interface CancelEnrollmentInput {
  shopId: string
  enrollmentId: string
  reason: string
  refundAmount?: number
}

export interface RedeemEnrollmentInput {
  shopId: string
  enrollmentId: string
  redemptionMode: RedemptionMode
  linkedSaleId?: string
  notes?: string
}

export interface BulkReminderInput {
  shopId: string
  enrollmentIds: string[]
  method: ReminderMethod
}

export interface BulkExportInput {
  shopId: string
  schemeIds?: string[]
  format: 'excel' | 'csv'
}

// ─────────────────────────────────────────────
// RESPONSE TYPES
// ─────────────────────────────────────────────

export interface SchemeListResponse {
  success: boolean
  message: string
  data: Scheme[]// ← dono support karo
  meta: {
    pagination: {
      page?:        number
      currentPage?: number
      limit?:       number
      pageSize?:    number
      total?:       number
      totalItems?:  number
      pages?:       number
      totalPages?:  number
      hasNext?:     boolean
      hasNextPage?: boolean
      hasPrev?:     boolean
      hasPrevPage?: boolean
    }
  }
}

export interface SchemeResponse {
  success: boolean
  message: string
  data: Scheme
}

export interface EnrollmentListResponse {
  success: boolean
  message: string
  data: {
    enrollments: SchemeEnrollment[]
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

export interface EnrollmentResponse {
  success: boolean
  message: string
  data: SchemeEnrollment
}

export interface MaturityValueResponse {
  success: boolean
  message: string
  data: {
    enrollmentNumber: string
    paidInstallments: number
    totalInstallments: number
    totalPaidAmount: number
    bonusAmount: number
    totalMaturityValue: number
    goldEquivalentGrams: number
    maturityDate: string
    status: EnrollmentStatus
  }
}

export interface CustomerSchemeSummary {
  totalEnrollments: number
  activeEnrollments: number
  completedEnrollments: number
  cancelledEnrollments: number
  redeemedEnrollments: number
  totalAmountPaid: number
  totalMaturityValue: number
  nextDueInstallments: Array<{
    enrollmentNumber: string
    nextDueDate: string
    amount: number
    schemeId: string
  }>
}

export interface SchemeDashboard {
  activeSchemes: number
  totalEnrollments: number
  dueCollectionsToday: { count: number; amount: number }
  dueCollectionsThisWeek: { count: number; amount: number }
  maturingThisMonth: { count: number }
  recentEnrollments: SchemeEnrollment[]
}

export interface SchemeAnalyticsData {
  schemeStats: {
    totalSchemes: number
    activeSchemes: number
    pausedSchemes: number
    draftSchemes: number
  }
  enrollmentStats: {
    totalEnrollments: number
    activeEnrollments: number
    completedEnrollments: number
    cancelledEnrollments: number
    totalRevenue: number
  }
  totalCollected: number
  topSchemes: Array<{
    schemeId: string
    schemeName: string
    schemeCode: string
    enrollments: number
    totalRevenue: number
  }>
  monthlyTrend: Array<{
    _id: { year: number; month: number }
    newEnrollments: number
    revenue: number
  }>
}

export interface SchemeSpecificAnalytics {
  scheme: { _id: string; schemeName: string; schemeCode: string }
  totalEnrollments: number
  activeEnrollments: number
  completedEnrollments: number
  cancelledEnrollments: number
  totalRevenue: number
  avgCollectionPerMonth: number
  completionRate: number
  earlyRedemptionRate: number
}

export interface DueEnrollment extends SchemeEnrollment {
  daysOverdue?: number
  penaltyAmount?: number
}