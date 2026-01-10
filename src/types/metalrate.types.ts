// FILE: types/metalrate.types.ts
// Metal Rate Management - Complete Frontend TypeScript Types

/**
 * Weight unit options
 */
export type WeightUnit = 'gram' | 'kg' | 'tola'

/**
 * Currency options
 */
export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED'

/**
 * Rate source options
 */
export type RateSource = 'manual' | 'market' | 'api' | 'association'

/**
 * Metal type options
 */
export type MetalType = 'gold' | 'silver' | 'platinum' | 'palladium'

/**
 * Sync source options
 */
export type SyncSource = 'shop' | 'organization'

/**
 * Gold purity options
 */
export type GoldPurity = '24K' | '22K' | '20K' | '18K' | '14K'

/**
 * Silver purity options
 */
export type SilverPurity = '999' | '925' | '900' | 'pure' | 'sterling'

/**
 * Platinum purity options
 */
export type PlatinumPurity = '950'

/**
 * Trend direction
 */
export type TrendDirection = 'up' | 'down' | 'stable'

// CORE DATA STRUCTURES

/**
 * Rate pair (buying and selling)
 */
export interface RatePair {
  buyingRate: number
  sellingRate: number
}

/**
 * Gold rates structure
 */
export interface GoldRates {
  gold24K: RatePair
  gold22K: RatePair
  gold18K: RatePair
  gold14K: RatePair
}

/**
 * Silver rates structure
 */
export interface SilverRates {
  pure: RatePair
  sterling925: RatePair
}

/**
 * Market reference data
 */
export interface MarketReference {
  internationalGoldPrice?: number
  internationalSilverPrice?: number
  exchangeRate?: number
  referenceSource?: string
}

/**
 * Rate changes data
 */
export interface RateChanges {
  goldChange: number
  goldChangePercentage: number
  silverChange: number
  silverChangePercentage: number
}

/**
 * Purity percentage structure
 */
export interface PurityPercentage {
  percentage: number
}

/**
 * Purity configuration
 */
export interface Purity {
  gold: {
    '24K': PurityPercentage
    '22K': PurityPercentage
    '20K': PurityPercentage
    '18K': PurityPercentage
    '14K': PurityPercentage
  }
  silver: {
    '999': PurityPercentage
    '925': PurityPercentage
    '900': PurityPercentage
  }
  platinum: {
    '950': PurityPercentage
  }
}

/**
 * Custom purity configuration
 */
export interface CustomPurity {
  metalType: MetalType
  purityName: string
  purityPercentage: number
  buyingRate: number
  sellingRate: number
  description?: string
  isActive: boolean
}

/**
 * Auto-converted rates
 */
export interface AutoConvertedRates {
  gold20K: RatePair
  silver900: RatePair
}

/**
 * Base rates for analytics
 */
export interface BaseRates {
  gold24K: number
  silver999: number
  platinum950: number
}

/**
 * Moving average data
 */
export interface MovingAverageData {
  ma7: number
  ma30: number
  ma90: number
}

/**
 * Trend data structure
 */
export interface TrendData {
  gold: MovingAverageData
  silver: MovingAverageData
  platinum: MovingAverageData
}

// MAIN METAL RATE INTERFACE

/**
 * Main Metal Rate interface
 */
export interface MetalRate {
  _id: string
  organizationId: string
  shopId: string
  rateDate: string

  // Metal rates
  gold: GoldRates
  silver: SilverRates
  platinum: RatePair

  // Purity and custom purities
  purity: Purity
  customPurities: CustomPurity[]

  // Auto-calculated data
  autoConvertedRates: AutoConvertedRates
  baseRates: BaseRates
  trendData: TrendData

  // Configuration
  weightUnit: WeightUnit
  currency: Currency
  metalTypes: MetalType[]
  rateSource: RateSource

  // Multi-shop sync
  syncSource: SyncSource
  syncedFromRateId?: string | null

  // Market reference
  marketReference?: MarketReference

  // Rate changes
  changes: RateChanges

  // Status
  isActive: boolean
  isCurrent: boolean

  // Validity
  validFrom: string
  validUntil?: string | null

  // Notes
  notes?: string
  internalNotes?: string

  // Audit
  createdBy: string
  updatedBy?: string
  deletedAt?: string | null
  createdAt: string
  updatedAt: string

  // Virtuals
  gold24KSpread?: number
  gold22KSpread?: number
  silverSpread?: number
}

// API REQUEST PAYLOADS

/**
 * Request payload for creating/updating metal rate
 */
export interface CreateMetalRatePayload {
  gold: GoldRates
  silver: SilverRates
  platinum?: RatePair
  customPurities?: CustomPurity[]
  weightUnit?: WeightUnit
  currency?: Currency
  rateSource?: RateSource
  metalTypes?: MetalType[]
  marketReference?: MarketReference
  notes?: string
  internalNotes?: string
  rateDate?: string
  validFrom?: string
}

/**
 * Sync to all shops payload
 */
export interface SyncToAllShopsPayload extends CreateMetalRatePayload {
  organizationId: string
}

// API QUERY PARAMETERS

/**
 * Rate history query parameters
 */
export interface RateHistoryParams {
  shopId: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
  sort?: string
}

/**
 * Rate comparison query parameters
 */
export interface RateComparisonParams {
  shopId: string
  fromDate: string
  toDate: string
}

/**
 * Trend data query parameters
 */
export interface TrendDataParams {
  shopId: string
  metalType?: MetalType
  days?: number
}

/**
 * Average rate query parameters
 */
export interface AverageRateParams {
  shopId: string
  metalType?: MetalType
  purity?: string
  days?: number
}

/**
 * Filter options for rate history
 */
export interface RateFilterOptions {
  dateRange?: {
    start: string
    end: string
  }
  metalType?: MetalType
  rateSource?: RateSource
  isActive?: boolean
  isCurrent?: boolean
  syncSource?: SyncSource
}

// API RESPONSE STRUCTURES

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  cached?: boolean
  meta?: {
    pagination?: PaginationMeta
  }
}

/**
 * Rate comparison result
 */
export interface RateComparisonResult {
  fromDate: string
  toDate: string
  daysDifference: number
  gold24K: RateChangeDetail
  gold22K: RateChangeDetail
  gold18K: RateChangeDetail
  silver999: RateChangeDetail
  platinum: RateChangeDetail
  trendComparison: {
    gold: TrendChangeDetail
    silver: TrendChangeDetail
  }
}

/**
 * Rate change detail
 */
export interface RateChangeDetail {
  startRate: number
  endRate: number
  change: number
  changePercentage: number
  trend: TrendDirection
}

/**
 * Trend change detail
 */
export interface TrendChangeDetail {
  ma7Change: number
  ma30Change: number
  ma90Change: number
}

/**
 * Trend chart data point
 */
export interface TrendChartDataPoint {
  date: string
  rate: number
  ma7: number
  ma30: number
  ma90: number
}

/**
 * Trend chart response
 */
export interface TrendChartResponse {
  metalType: MetalType
  period: number
  dataPoints: number
  trendData: TrendChartDataPoint[]
  summary: {
    currentRate: number
    startRate: number
    highestRate: number
    lowestRate: number
    averageRate: number
  }
}

/**
 * Rate for specific purity response
 */
export interface RateForPurityResponse {
  metalType: MetalType
  purity: string
  buyingRate: number
  sellingRate: number
  rateDate: string
}

/**
 * Average rate result
 */
export interface AverageRateResult {
  metalType: MetalType
  purity: string
  period: string
  averageBuyingRate: number
  averageSellingRate: number
  samples: number
}

/**
 * Multi-shop sync result
 */
export interface SyncResult {
  totalShops: number
  syncedShops: number
  failedShops: number
  failures: ShopSyncFailure[]
}

/**
 * Shop sync failure detail
 */
export interface ShopSyncFailure {
  shopId: string
  shopName: string
  error: string
}

/**
 * Dashboard summary data
 */
export interface RateDashboardSummary {
  currentRate: MetalRate
  todayChange: {
    gold: number
    goldPercentage: number
    silver: number
    silverPercentage: number
  }
  weekTrend: TrendChartDataPoint[]
  monthTrend: TrendChartDataPoint[]
}

// FORM STATE INTERFACES

/**
 * Rate pair form input (strings for controlled inputs)
 */
export interface RatePairInput {
  buying: string
  selling: string
}

/**
 * Form state for metal rate entry
 */
export interface MetalRateFormState {
  // Required IDs
  shopId: string
  organizationId: string
  rateDate: string

  // Gold rates
  gold: {
    gold24K: RatePairInput
    gold22K: RatePairInput
    gold18K: RatePairInput
    gold14K: RatePairInput
  }

  // Silver rates
  silver: {
    pure: RatePairInput
    sterling925: RatePairInput
  }

  // Platinum rates
  platinum: RatePairInput

  // Custom purities
  customPurities: CustomPurityInput[]

  // Configuration
  weightUnit: WeightUnit
  currency: Currency
  rateSource: RateSource

  // Notes
  notes: string
  internalNotes: string

  // Market reference
  marketReference: {
    internationalGoldPrice: string
    internationalSilverPrice: string
    exchangeRate: string
    referenceSource: string
  }
}

/**
 * Custom purity form input
 */
export interface CustomPurityInput {
  metalType: MetalType
  purityName: string
  purityPercentage: string
  buyingRate: string
  sellingRate: string
  description: string
  isActive: boolean
}

/**
 * Form validation errors
 */
export interface FormValidationErrors {
  [field: string]: string
}

/**
 * Form submission state
 */
export interface FormSubmissionState {
  isSubmitting: boolean
  isSuccess: boolean
  isError: boolean
  error?: string
}

// UI STATE INTERFACES

/**
 * Rate card display data
 */
export interface RateCardData {
  metalType: MetalType
  purity: string
  buyingRate: number
  sellingRate: number
  change: number
  changePercentage: number
  trend: TrendDirection
  lastUpdated: string
}

/**
 * Rate history table row
 */
export interface RateHistoryRow {
  _id: string
  rateDate: string
  gold24K: number
  gold22K: number
  silver999: number
  goldChange: number
  silverChange: number
  isCurrent: boolean
  isActive: boolean
}

/**
 * Chart data for visualization
 */
export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

/**
 * Chart dataset
 */
export interface ChartDataset {
  label: string
  data: number[]
  borderColor?: string
  backgroundColor?: string
  fill?: boolean
}

/**
 * Filter panel state
 */
export interface FilterPanelState {
  isOpen: boolean
  filters: RateFilterOptions
  appliedFilters: RateFilterOptions
}

/**
 * Loading state for async operations
 */
export interface LoadingState {
  isLoading: boolean
  loadingMessage?: string
}

/**
 * Toast notification
 */
export interface ToastNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

// VALIDATION TYPES

/**
 * Validation error
 */
export interface ValidationError {
  field: string
  message: string
  value?: any
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  success: false
  message: string
  errors?: ValidationError[]
}

// UTILITY TYPES

/**
 * Partial metal rate for updates
 */
export type PartialMetalRate = Partial<
  Omit<MetalRate, '_id' | 'createdAt' | 'updatedAt'>
>

/**
 * Metal rate without audit fields (for display)
 */
export type MetalRateDisplay = Omit<
  MetalRate,
  'createdBy' | 'updatedBy' | 'deletedAt' | 'internalNotes'
>

/**
 * Rate comparison type guard
 */
export function isRateComparison(data: any): data is RateComparisonResult {
  return (
    data &&
    typeof data.fromDate === 'string' &&
    typeof data.toDate === 'string' &&
    typeof data.daysDifference === 'number'
  )
}

/**
 * Trend chart type guard
 */
export function isTrendChartResponse(data: any): data is TrendChartResponse {
  return (
    data &&
    typeof data.metalType === 'string' &&
    Array.isArray(data.trendData) &&
    data.summary
  )
}

// CONSTANTS

/**
 * Weight unit labels
 */
export const WEIGHT_UNIT_LABELS: Record<WeightUnit, string> = {
  gram: 'Gram',
  kg: 'Kilogram',
  tola: 'Tola',
}

/**
 * Currency symbols
 */
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'د.إ',
}

/**
 * Metal type labels
 */
export const METAL_TYPE_LABELS: Record<MetalType, string> = {
  gold: 'Gold',
  silver: 'Silver',
  platinum: 'Platinum',
  palladium: 'Palladium',
}

/**
 * Gold purity labels
 */
export const GOLD_PURITY_LABELS: Record<GoldPurity, string> = {
  '24K': '24 Karat (Pure)',
  '22K': '22 Karat',
  '20K': '20 Karat',
  '18K': '18 Karat',
  '14K': '14 Karat',
}

/**
 * Silver purity labels
 */
export const SILVER_PURITY_LABELS: Record<SilverPurity, string> = {
  '999': '999 (Pure)',
  '925': '925 (Sterling)',
  '900': '900',
  pure: 'Pure Silver',
  sterling: 'Sterling Silver',
}

/**
 * Rate source labels
 */
export const RATE_SOURCE_LABELS: Record<RateSource, string> = {
  manual: 'Manual Entry',
  market: 'Market Rate',
  api: 'API Integration',
  association: 'Association Rate',
}

/**
 * Trend direction colors
 */
export const TREND_COLORS: Record<TrendDirection, string> = {
  up: '#22c55e',
  down: '#ef4444',
  stable: '#64748b',
}

/**
 * Default form values
 */
export const DEFAULT_METAL_RATE_FORM: MetalRateFormState = {
  shopId: '',
  organizationId: '',
  rateDate: new Date().toISOString().split('T')[0],
  gold: {
    gold24K: { buying: '', selling: '' },
    gold22K: { buying: '', selling: '' },
    gold18K: { buying: '', selling: '' },
    gold14K: { buying: '', selling: '' },
  },
  silver: {
    pure: { buying: '', selling: '' },
    sterling925: { buying: '', selling: '' },
  },
  platinum: { buying: '', selling: '' },
  customPurities: [],
  weightUnit: 'gram',
  currency: 'INR',
  rateSource: 'manual',
  notes: '',
  internalNotes: '',
  marketReference: {
    internationalGoldPrice: '',
    internationalSilverPrice: '',
    exchangeRate: '',
    referenceSource: '',
  },
}
