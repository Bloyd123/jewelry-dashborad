// ============================================================================
// FILE: mocks/metal-rate.mock.ts
// Metal Rate Management - Mock Data for Frontend Development
// ============================================================================

import type {
  MetalRate,
  ApiResponse,
  TrendChartResponse,
  RateComparisonResult,
  AverageRateResult,
  SyncResult,
  RateForPurityResponse,
  PaginationMeta,
  TrendChartDataPoint,
} from '@/types/metalrate.types'

// ============================================================================
// MOCK CURRENT RATE
// ============================================================================

export const mockCurrentRate: MetalRate = {
  _id: '674a5b8c9d1234567890abcd',
  organizationId: '673abc123def456789012345',
  shopId: '674def456abc789012345678',
  rateDate: new Date().toISOString(),

  // Gold Rates
  gold: {
    gold24K: {
      buyingRate: 7250.0,
      sellingRate: 7350.0,
    },
    gold22K: {
      buyingRate: 6645.83,
      sellingRate: 6736.67,
    },
    gold18K: {
      buyingRate: 5437.5,
      sellingRate: 5512.5,
    },
    gold14K: {
      buyingRate: 4241.25,
      sellingRate: 4299.75,
    },
  },

  // Silver Rates
  silver: {
    pure: {
      buyingRate: 82.5,
      sellingRate: 85.0,
    },
    sterling925: {
      buyingRate: 76.31,
      sellingRate: 78.63,
    },
  },

  // Platinum Rates
  platinum: {
    buyingRate: 3250.0,
    sellingRate: 3350.0,
  },

  // Purity Configuration
  purity: {
    gold: {
      '24K': { percentage: 100 },
      '22K': { percentage: 91.6 },
      '20K': { percentage: 83.3 },
      '18K': { percentage: 75 },
      '14K': { percentage: 58.5 },
    },
    silver: {
      '999': { percentage: 99.9 },
      '925': { percentage: 92.5 },
      '900': { percentage: 90 },
    },
    platinum: {
      '950': { percentage: 95 },
    },
  },

  // Custom Purities
  customPurities: [
    {
      metalType: 'gold',
      purityName: '23K',
      purityPercentage: 95.83,
      buyingRate: 6947.3,
      sellingRate: 7044.3,
      description: 'High purity gold',
      isActive: true,
    },
  ],

  // Auto-converted Rates
  autoConvertedRates: {
    gold20K: {
      buyingRate: 6039.25,
      sellingRate: 6122.55,
    },
    silver900: {
      buyingRate: 74.25,
      sellingRate: 76.5,
    },
  },

  // Base Rates
  baseRates: {
    gold24K: 7350.0,
    silver999: 85.0,
    platinum950: 3350.0,
  },

  // Trend Data
  trendData: {
    gold: {
      ma7: 7325.5,
      ma30: 7280.2,
      ma90: 7150.8,
    },
    silver: {
      ma7: 84.2,
      ma30: 83.5,
      ma90: 81.8,
    },
    platinum: {
      ma7: 3340.0,
      ma30: 3325.0,
      ma90: 3300.0,
    },
  },

  // Configuration
  weightUnit: 'gram',
  currency: 'INR',
  metalTypes: ['gold', 'silver', 'platinum'],
  rateSource: 'manual',

  // Multi-shop Sync
  syncSource: 'shop',
  syncedFromRateId: null,

  // Market Reference
  marketReference: {
    internationalGoldPrice: 2035.5,
    internationalSilverPrice: 24.25,
    exchangeRate: 83.15,
    referenceSource: 'LBMA London',
  },

  // Rate Changes
  changes: {
    goldChange: 50.0,
    goldChangePercentage: 0.68,
    silverChange: 1.5,
    silverChangePercentage: 1.8,
  },

  // Status
  isActive: true,
  isCurrent: true,

  // Validity
  validFrom: new Date().toISOString(),
  validUntil: null,

  // Notes
  notes: 'Market rates updated based on international gold prices',
  internalNotes: 'Slight increase due to festive season demand',

  // Audit
  createdBy: '673user123abc456789012345',
  updatedBy: '673user123abc456789012345',
  deletedAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),

  // Virtuals
  gold24KSpread: 100.0,
  gold22KSpread: 90.84,
  silverSpread: 2.5,
}

// ============================================================================
// MOCK CURRENT RATE API RESPONSE
// ============================================================================

export const mockCurrentRateResponse: ApiResponse<MetalRate> = {
  success: true,
  data: mockCurrentRate,
  message: 'Current metal rates',
  cached: false,
}

// ============================================================================
// MOCK RATE HISTORY
// ============================================================================

export const mockRateHistory: MetalRate[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - i)
  const goldVariation = Math.random() * 100 - 50
  const silverVariation = Math.random() * 2 - 1

  return {
    ...mockCurrentRate,
    _id: `rate_${i}_${date.getTime()}`,
    rateDate: date.toISOString(),
    gold: {
      gold24K: {
        buyingRate: 7250 + goldVariation,
        sellingRate: 7350 + goldVariation,
      },
      gold22K: {
        buyingRate: 6645.83 + goldVariation * 0.916,
        sellingRate: 6736.67 + goldVariation * 0.916,
      },
      gold18K: {
        buyingRate: 5437.5 + goldVariation * 0.75,
        sellingRate: 5512.5 + goldVariation * 0.75,
      },
      gold14K: {
        buyingRate: 4241.25 + goldVariation * 0.585,
        sellingRate: 4299.75 + goldVariation * 0.585,
      },
    },
    silver: {
      pure: {
        buyingRate: 82.5 + silverVariation,
        sellingRate: 85.0 + silverVariation,
      },
      sterling925: {
        buyingRate: 76.31 + silverVariation * 0.925,
        sellingRate: 78.63 + silverVariation * 0.925,
      },
    },
    isCurrent: i === 0,
    changes: {
      goldChange: goldVariation,
      goldChangePercentage: (goldVariation / 7300) * 100,
      silverChange: silverVariation,
      silverChangePercentage: (silverVariation / 84) * 100,
    },
  }
})

export const mockRateHistoryResponse: ApiResponse<MetalRate[]> = {
  success: true,
  data: mockRateHistory.slice(0, 10),
  message: 'Rate history retrieved successfully',
  meta: {
    pagination: {
      currentPage: 1,
      totalPages: 3,
      pageSize: 10,
      totalItems: 30,
      hasNextPage: true,
      hasPrevPage: false,
    },
  },
}

// ============================================================================
// MOCK TREND CHART DATA
// ============================================================================

export const mockTrendChartData: TrendChartDataPoint[] = Array.from(
  { length: 90 },
  (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (89 - i))
    const baseRate = 7300
    const variation = Math.sin(i / 10) * 150 + Math.random() * 50

    return {
      date: date.toISOString(),
      rate: baseRate + variation,
      ma7: baseRate + variation * 0.9,
      ma30: baseRate + variation * 0.7,
      ma90: baseRate + variation * 0.5,
    }
  }
)

export const mockTrendChartResponse: ApiResponse<TrendChartResponse> = {
  success: true,
  data: {
    metalType: 'gold',
    period: 90,
    dataPoints: 90,
    trendData: mockTrendChartData,
    summary: {
      currentRate: 7350.0,
      startRate: 7150.0,
      highestRate: 7425.5,
      lowestRate: 7125.3,
      averageRate: 7280.2,
    },
  },
  message: 'Trend data retrieved successfully',
  cached: false,
}

// ============================================================================
// MOCK LATEST RATES (10)
// ============================================================================

export const mockLatestRatesResponse: ApiResponse<MetalRate[]> = {
  success: true,
  data: mockRateHistory.slice(0, 10),
  message: 'Latest rates retrieved',
}

// ============================================================================
// MOCK AVERAGE RATE
// ============================================================================

export const mockAverageRateResponse: ApiResponse<AverageRateResult> = {
  success: true,
  data: {
    metalType: 'gold',
    purity: '24K',
    period: '30 days',
    averageBuyingRate: 7245.5,
    averageSellingRate: 7345.8,
    samples: 30,
  },
  message: 'Average rate calculated',
}

// ============================================================================
// MOCK RATE COMPARISON
// ============================================================================

export const mockRateComparisonResponse: ApiResponse<RateComparisonResult> = {
  success: true,
  data: {
    fromDate: '2024-11-01',
    toDate: '2024-11-30',
    daysDifference: 29,
    gold24K: {
      startRate: 7150.0,
      endRate: 7350.0,
      change: 200.0,
      changePercentage: 2.8,
      trend: 'up',
    },
    gold22K: {
      startRate: 6549.4,
      endRate: 6736.67,
      change: 187.27,
      changePercentage: 2.86,
      trend: 'up',
    },
    gold18K: {
      startRate: 5362.5,
      endRate: 5512.5,
      change: 150.0,
      changePercentage: 2.8,
      trend: 'up',
    },
    silver999: {
      startRate: 82.0,
      endRate: 85.0,
      change: 3.0,
      changePercentage: 3.66,
      trend: 'up',
    },
    platinum: {
      startRate: 3250.0,
      endRate: 3350.0,
      change: 100.0,
      changePercentage: 3.08,
      trend: 'up',
    },
    trendComparison: {
      gold: {
        ma7Change: 25.5,
        ma30Change: 100.2,
        ma90Change: 180.8,
      },
      silver: {
        ma7Change: 1.2,
        ma30Change: 2.5,
        ma90Change: 3.8,
      },
    },
  },
  message: 'Rate comparison completed',
}

// ============================================================================
// MOCK SPECIFIC DATE RATE
// ============================================================================

export const mockDateRateResponse: ApiResponse<MetalRate> = {
  success: true,
  data: {
    ...mockCurrentRate,
    rateDate: '2024-11-15T00:00:00.000Z',
    gold: {
      gold24K: { buyingRate: 7200.0, sellingRate: 7300.0 },
      gold22K: { buyingRate: 6595.2, sellingRate: 6684.8 },
      gold18K: { buyingRate: 5400.0, sellingRate: 5475.0 },
      gold14K: { buyingRate: 4212.0, sellingRate: 4270.5 },
    },
    isCurrent: false,
  },
  message: 'Rate for 2024-11-15 retrieved successfully',
}

// ============================================================================
// MOCK SPECIFIC PURITY RATE
// ============================================================================

export const mockPurityRateResponse: ApiResponse<RateForPurityResponse> = {
  success: true,
  data: {
    metalType: 'gold',
    purity: '22K',
    buyingRate: 6645.83,
    sellingRate: 6736.67,
    rateDate: new Date().toISOString(),
  },
  message: 'Rate for purity retrieved',
}

// ============================================================================
// MOCK MULTI-SHOP SYNC
// ============================================================================

export const mockSyncResponse: ApiResponse<SyncResult> = {
  success: true,
  data: {
    totalShops: 5,
    syncedShops: 4,
    failedShops: 1,
    failures: [
      {
        shopId: '674shop999abc789012345678',
        shopName: 'Downtown Jewelers',
        error: 'Shop is currently inactive',
      },
    ],
  },
  message: 'Rates synced with 1 failure(s)',
}

// ============================================================================
// MOCK CREATE/UPDATE RATE RESPONSE
// ============================================================================

export const mockCreateRateResponse: ApiResponse<MetalRate> = {
  success: true,
  data: mockCurrentRate,
  message: 'Metal rates created successfully',
}

export const mockUpdateRateResponse: ApiResponse<MetalRate> = {
  success: true,
  data: mockCurrentRate,
  message: 'Metal rates updated successfully',
}

// ============================================================================
// MOCK DEACTIVATE RATE
// ============================================================================

export const mockDeactivateRateResponse: ApiResponse<MetalRate> = {
  success: true,
  data: {
    ...mockCurrentRate,
    isActive: false,
    isCurrent: false,
  },
  message: 'Metal rate deactivated successfully',
}

// ============================================================================
// MOCK DELETE RATE (204 No Content)
// ============================================================================

export const mockDeleteRateResponse = {
  success: true,
  message: 'Metal rate deleted successfully',
}

// ============================================================================
// MOCK API FUNCTIONS (Use these in your components)
// ============================================================================

export const mockMetalRateApi = {
  // GET Current Rate
  getCurrentRate: async (shopId: string): Promise<ApiResponse<MetalRate>> => {
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay
    return mockCurrentRateResponse
  },

  // GET Rate History
  getRateHistory: async (
    shopId: string,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<MetalRate[]>> => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return mockRateHistoryResponse
  },

  // GET Trend Chart Data
  getTrendChartData: async (
    shopId: string,
    metalType = 'gold',
    days = 90
  ): Promise<ApiResponse<TrendChartResponse>> => {
    await new Promise((resolve) => setTimeout(resolve, 700))
    return mockTrendChartResponse
  },

  // GET Latest Rates
  getLatestRates: async (
    shopId: string,
    limit = 10
  ): Promise<ApiResponse<MetalRate[]>> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockLatestRatesResponse
  },

  // GET Average Rate
  getAverageRate: async (
    shopId: string,
    metalType = 'gold',
    purity = '24K',
    days = 30
  ): Promise<ApiResponse<AverageRateResult>> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockAverageRateResponse
  },

  // GET Rate Comparison
  compareRates: async (
    shopId: string,
    fromDate: string,
    toDate: string
  ): Promise<ApiResponse<RateComparisonResult>> => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return mockRateComparisonResponse
  },

  // GET Rate by Date
  getRateByDate: async (
    shopId: string,
    date: string
  ): Promise<ApiResponse<MetalRate>> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockDateRateResponse
  },

  // GET Rate for Purity
  getRateForPurity: async (
    shopId: string,
    metalType: string,
    purity: string
  ): Promise<ApiResponse<RateForPurityResponse>> => {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return mockPurityRateResponse
  },

  // POST Create/Update Rate
  createOrUpdateRate: async (
    shopId: string,
    data: any
  ): Promise<ApiResponse<MetalRate>> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return mockCreateRateResponse
  },

  // POST Sync to All Shops
  syncToAllShops: async (
    organizationId: string,
    data: any
  ): Promise<ApiResponse<SyncResult>> => {
    await new Promise((resolve) => setTimeout(resolve, 1200))
    return mockSyncResponse
  },

  // PATCH Deactivate Rate
  deactivateRate: async (rateId: string): Promise<ApiResponse<MetalRate>> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockDeactivateRateResponse
  },

  // DELETE Rate
  deleteRate: async (rateId: string): Promise<any> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockDeleteRateResponse
  },
}
