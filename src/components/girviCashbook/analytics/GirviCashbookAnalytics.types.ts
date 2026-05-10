// FILE: src/components/girviCashbook/analytics/GirviCashbookAnalytics.types.ts

export interface TrendValue {
  value:     number
  direction: 'up' | 'down'
}

export interface GirviCashbookStatistics {

  // ── Stat Cards ─────────────────────────────────────────────────────────────
  currentBalance:      number
  totalInflow:         number
  totalOutflow:        number
  totalEntries:        number
  totalInterestEarned: number
  totalPrincipalGiven: number
  totalDiscount:       number

  trends?: {
    currentBalance?:      TrendValue
    totalInflow?:         TrendValue
    totalOutflow?:        TrendValue
    totalInterestEarned?: TrendValue
  }

  // ── Charts ──────────────────────────────────────────────────────────────────
  monthlyTrendData?: Array<{
    month:        string
    totalInflow:  number
    totalOutflow: number
    netFlow:      number
    totalInterest: number
    totalEntries: number
  }>

  yearlyBreakdown?: Array<{
    year:         number
    totalInflow:  number
    totalOutflow: number
    newGirvis:    number
    releases:     number
    totalEntries: number
    netFlow:      number
  }>

  // ── Donut Charts ────────────────────────────────────────────────────────────
  segmentationData?: {
    byEntryType?: Array<{
      name:   string
      value:  number
      amount: number
    }>
    byPaymentMode?: Array<{
      name:   string
      value:  number
      amount: number
    }>
  }

  // ── Tables ──────────────────────────────────────────────────────────────────
  topCustomers?: Array<{
    _id:               string
    customerName:      string
    customerPhone?:    string
    totalGirvis:       number
    totalPrincipal:    number
    totalInterestPaid: number
    lastGirviDate?:    string
  }>

  // ── Year Breakdown ──────────────────────────────────────────────────────────
  girvisByYear?: Array<{
    year:        number
    count:       number
    totalAmount: number
  }>
}

export interface GirviCashbookAnalyticsProps {
  shopId:      string
  statistics?: GirviCashbookStatistics
  loading?:    boolean
  onRefresh?:  () => void
  className?:  string
}

// ── API Response Type ────────────────────────────────────────────────────────
export interface IGirviCashbookAnalytics extends GirviCashbookStatistics {}

export interface IGirviCashbookAnalyticsResponse {
  success:    boolean
  message:    string
  data:       IGirviCashbookAnalytics
  statusCode: number
}