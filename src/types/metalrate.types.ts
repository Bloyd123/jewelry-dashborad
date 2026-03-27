// FILE: types/metalrate.types.ts
export type WeightUnit = 'gram' | 'kg' | 'tola'

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED'

export type RateSource = 'manual' | 'market' | 'api' | 'association'

export type MetalType = 'gold' | 'silver' | 'platinum' | 'palladium'

export type SyncSource = 'shop' | 'organization'

export type GoldPurity = '24K' | '22K' | '20K' | '18K' | '14K'

export type SilverPurity = '999' | '925' | '900' | 'pure' | 'sterling'

export type PlatinumPurity = '950'

export type TrendDirection = 'up' | 'down' | 'stable'

export interface RatePair {
  buyingRate: number
  sellingRate: number
}

export interface GoldRates {
  gold24K: RatePair
  gold22K: RatePair
  gold18K: RatePair
  gold14K: RatePair
}

export interface SilverRates {
  pure: RatePair
  sterling925: RatePair
}

export interface MarketReference {
  internationalGoldPrice?: number
  internationalSilverPrice?: number
  exchangeRate?: number
  referenceSource?: string
}
export interface RateChanges {
  goldChange: number
  goldChangePercentage: number
  silverChange: number
  silverChangePercentage: number
}

export interface PurityPercentage {
  percentage: number
}

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

export interface CustomPurity {
  metalType: MetalType
  purityName: string
  purityPercentage: number
  buyingRate: number
  sellingRate: number
  description?: string
  isActive: boolean
}

export interface AutoConvertedRates {
  gold20K: RatePair
  silver900: RatePair
}

export interface BaseRates {
  gold24K: number
  silver999: number
  platinum950: number
}

export interface MovingAverageData {
  ma7: number
  ma30: number
  ma90: number
}

export interface TrendData {
  gold: MovingAverageData
  silver: MovingAverageData
  platinum: MovingAverageData
}

export interface MetalRate {
  _id: string
  organizationId: string
  shopId: string
  rateDate: string

  gold: GoldRates
  silver: SilverRates
  platinum: RatePair
  purity: Purity
  customPurities: CustomPurity[]
  autoConvertedRates: AutoConvertedRates
  baseRates: BaseRates
  trendData: TrendData
  weightUnit: WeightUnit
  currency: Currency
  metalTypes: MetalType[]
  rateSource: RateSource
  syncSource: SyncSource
  syncedFromRateId?: string | null
  marketReference?: MarketReference
  changes: RateChanges
  isActive: boolean
  isCurrent: boolean
  validFrom: string
  validUntil?: string | null
  notes?: string
  internalNotes?: string
  createdBy: string
  updatedBy?: string
  deletedAt?: string | null
  createdAt: string
  updatedAt: string
  gold24KSpread?: number
  gold22KSpread?: number
  silverSpread?: number
}

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
export interface SyncToAllShopsPayload extends CreateMetalRatePayload {
  organizationId: string
}
export interface RateHistoryParams {
  shopId: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
  sort?: string
}

export interface RateComparisonParams {
  shopId: string
  fromDate: string
  toDate: string
}

export interface TrendDataParams {
  shopId: string
  metalType?: MetalType
  days?: number
}
export interface AverageRateParams {
  shopId: string
  metalType?: MetalType
  purity?: string
  days?: number
}
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
export interface PaginationMeta {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  hasNextPage: boolean
  hasPrevPage: boolean
}
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  cached?: boolean
  meta?: {
    pagination?: PaginationMeta
  }
}

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

export interface RateChangeDetail {
  startRate: number
  endRate: number
  change: number
  changePercentage: number
  trend: TrendDirection
}
export interface TrendChangeDetail {
  ma7Change: number
  ma30Change: number
  ma90Change: number
}
export interface TrendChartDataPoint {
  date: string
  rate: number
  ma7: number
  ma30: number
  ma90: number
}
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
export interface RateForPurityResponse {
  metalType: MetalType
  purity: string
  buyingRate: number
  sellingRate: number
  rateDate: string
}
export interface AverageRateResult {
  metalType: MetalType
  purity: string
  period: string
  averageBuyingRate: number
  averageSellingRate: number
  samples: number
}
export interface SyncResult {
  totalShops: number
  syncedShops: number
  failedShops: number
  failures: ShopSyncFailure[]
}
export interface ShopSyncFailure {
  shopId: string
  shopName: string
  error: string
}
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
export interface RatePairInput {
  buying: string
  selling: string
}
export interface MetalRateFormState {
  shopId: string
  organizationId: string
  rateDate: string
  gold: {
    gold24K: RatePairInput
    gold22K: RatePairInput
    gold18K: RatePairInput
    gold14K: RatePairInput
  }
  silver: {
    pure: RatePairInput
    sterling925: RatePairInput
  }
  platinum: RatePairInput
  customPurities: CustomPurityInput[]
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
export interface CustomPurityInput {
  metalType: MetalType
  purityName: string
  purityPercentage: string
  buyingRate: string
  sellingRate: string
  description: string
  isActive: boolean
}
export interface FormValidationErrors {
  [field: string]: string
}

export interface FormSubmissionState {
  isSubmitting: boolean
  isSuccess: boolean
  isError: boolean
  error?: string
}
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
export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}
export interface ChartDataset {
  label: string
  data: number[]
  borderColor?: string
  backgroundColor?: string
  fill?: boolean
}
export interface FilterPanelState {
  isOpen: boolean
  filters: RateFilterOptions
  appliedFilters: RateFilterOptions
}
export interface LoadingState {
  isLoading: boolean
  loadingMessage?: string
}
export interface ToastNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}
export interface ValidationError {
  field: string
  message: string
  value?: any
}
export interface ApiErrorResponse {
  success: false
  message: string
  errors?: ValidationError[]
}
export type PartialMetalRate = Partial<
  Omit<MetalRate, '_id' | 'createdAt' | 'updatedAt'>
>
export type MetalRateDisplay = Omit<
  MetalRate,
  'createdBy' | 'updatedBy' | 'deletedAt' | 'internalNotes'
>
export function isRateComparison(data: any): data is RateComparisonResult {
  return (
    data &&
    typeof data.fromDate === 'string' &&
    typeof data.toDate === 'string' &&
    typeof data.daysDifference === 'number'
  )
}
export function isTrendChartResponse(data: any): data is TrendChartResponse {
  return (
    data &&
    typeof data.metalType === 'string' &&
    Array.isArray(data.trendData) &&
    data.summary
  )
}
export const WEIGHT_UNIT_LABELS: Record<WeightUnit, string> = {
  gram: 'Gram',
  kg: 'Kilogram',
  tola: 'Tola',
}
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'د.إ',
}

export const METAL_TYPE_LABELS: Record<MetalType, string> = {
  gold: 'Gold',
  silver: 'Silver',
  platinum: 'Platinum',
  palladium: 'Palladium',
}

export const GOLD_PURITY_LABELS: Record<GoldPurity, string> = {
  '24K': '24 Karat (Pure)',
  '22K': '22 Karat',
  '20K': '20 Karat',
  '18K': '18 Karat',
  '14K': '14 Karat',
}

export const SILVER_PURITY_LABELS: Record<SilverPurity, string> = {
  '999': '999 (Pure)',
  '925': '925 (Sterling)',
  '900': '900',
  pure: 'Pure Silver',
  sterling: 'Sterling Silver',
}

export const RATE_SOURCE_LABELS: Record<RateSource, string> = {
  manual: 'Manual Entry',
  market: 'Market Rate',
  api: 'API Integration',
  association: 'Association Rate',
}
export const TREND_COLORS: Record<TrendDirection, string> = {
  up: '#22c55e',
  down: '#ef4444',
  stable: '#64748b',
}

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
