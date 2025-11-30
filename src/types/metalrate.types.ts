// ============================================================================
// Metal Rate Management - TypeScript Types
// ============================================================================

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
  internationalGoldPrice?: number // USD per ounce
  internationalSilverPrice?: number // USD per ounce
  exchangeRate?: number // INR per USD
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
  ma7: number // 7-day moving average
  ma30: number // 30-day moving average
  ma90: number // 90-day moving average
}

/**
 * Trend data structure
 */
export interface TrendData {
  gold: MovingAverageData
  silver: MovingAverageData
  platinum: MovingAverageData
}

/**
 * Main Metal Rate interface
 */
export interface MetalRate {
  _id: string
  organizationId: string
  shopId: string
  rateDate: Date | string

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
  validFrom: Date | string
  validUntil?: Date | string | null

  // Notes
  notes?: string
  internalNotes?: string

  // Audit
  createdBy: string
  updatedBy?: string
  deletedAt?: Date | string | null
  createdAt: Date | string
  updatedAt: Date | string

  // Virtuals
  gold24KSpread?: number
  gold22KSpread?: number
  silverSpread?: number
}

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
  rateDate?: Date | string
  validFrom?: Date | string
}

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
 * Rate comparison result
 */
export interface RateComparison {
  gold24K: {
    start: number
    end: number
    change: number
    changePercentage: number
  }
  silver999: {
    start: number
    end: number
    change: number
    changePercentage: number
  }
}

/**
 * Trend chart data point
 */
export interface TrendChartDataPoint {
  date: Date | string
  rate: number
  ma7: number
  ma30: number
  ma90: number
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
 * Average rate result
 */
export interface AverageRateResult {
  averageBuyingRate: number
  averageSellingRate: number
  samples: number
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
 * Sync to all shops payload
 */
export interface SyncToAllShopsPayload extends CreateMetalRatePayload {
  organizationId: string
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Array<{
    field: string
    message: string
    value?: any
  }>
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

/**
 * Rate for specific purity response
 */
export interface RateForPurityResponse {
  metalType: MetalType
  purity: string
  rates: RatePair
  rateDate: Date | string
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

/**
 * Validation error
 */
export interface ValidationError {
  field: string
  message: string
  value?: any
}

/**
 * Form state for metal rate entry
 */
export interface MetalRateFormState {
  gold: {
    gold24K: { buying: string; selling: string }
    gold22K: { buying: string; selling: string }
    gold18K: { buying: string; selling: string }
    gold14K: { buying: string; selling: string }
  }
  silver: {
    pure: { buying: string; selling: string }
    sterling925: { buying: string; selling: string }
  }
  platinum: { buying: string; selling: string }
  weightUnit: WeightUnit
  currency: Currency
  rateSource: RateSource
  notes: string
  internalNotes: string
  marketReference: {
    internationalGoldPrice: string
    internationalSilverPrice: string
    exchangeRate: string
    referenceSource: string
  }
}

/**
 * Filter options for rate history
 */
export interface RateFilterOptions {
  dateRange?: {
    start: Date | string
    end: Date | string
  }
  metalType?: MetalType
  rateSource?: RateSource
  isActive?: boolean
  isCurrent?: boolean
}
