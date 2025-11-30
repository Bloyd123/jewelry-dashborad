// ============================================================================
// FILE: store/slices/shopSlice.ts
// Shop State Management
// ============================================================================

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

import * as authService from '@/api/services/shopService'
import type {
  JewelryShop,
  CreateShopRequest,
  UpdateShopRequest,
  UpdateShopSettingsRequest,
  UpdateMetalRatesRequest,
  ShopQueryParams,
  PaginationMeta,
} from '@/types'

import type { RootState } from '../index'

// ============================================================================
// STATE INTERFACE
// ============================================================================

interface ShopState {
  // Shop List
  shops: JewelryShop[]
  currentShop: JewelryShop | null

  // Pagination
  pagination: PaginationMeta | null

  // Loading States
  isLoading: boolean
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean

  // Error State
  error: string | null

  // Filters & Search
  filters: ShopQueryParams
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: ShopState = {
  shops: [],
  currentShop: null,

  pagination: null,

  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  error: null,

  filters: {
    page: 1,
    limit: 10,
    isActive: true,
  },
}

// ============================================================================
// ASYNC THUNKS
// ============================================================================

/**
 * Fetch all shops
 */
export const fetchShops = createAsyncThunk(
  'shop/fetchShops',
  async (params: ShopQueryParams | undefined, { rejectWithValue }) => {
    try {
      const response = await authService.getAllShops(params)
      return response
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch shops'
      )
    }
  }
)

/**
 * Fetch single shop by ID
 */
export const fetchShopById = createAsyncThunk(
  'shop/fetchShopById',
  async (shopId: string, { rejectWithValue }) => {
    try {
      const response = await authService.getShopById(shopId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch shop'
      )
    }
  }
)

/**
 * Create new shop
 */
export const createShop = createAsyncThunk(
  'shop/createShop',
  async (shopData: CreateShopRequest, { rejectWithValue }) => {
    try {
      const response = await authService.createShop(shopData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create shop'
      )
    }
  }
)

/**
 * Update shop
 */
export const updateShop = createAsyncThunk(
  'shop/updateShop',
  async (
    { shopId, updates }: { shopId: string; updates: UpdateShopRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.updateShop(shopId, updates)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update shop'
      )
    }
  }
)

/**
 * Update shop settings
 */
export const updateShopSettings = createAsyncThunk(
  'shop/updateShopSettings',
  async (
    {
      shopId,
      settings,
    }: { shopId: string; settings: UpdateShopSettingsRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.updateShopSettings(shopId, settings)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update settings'
      )
    }
  }
)

/**
 * Update metal rates
 */
export const updateMetalRates = createAsyncThunk(
  'shop/updateMetalRates',
  async (
    { shopId, rates }: { shopId: string; rates: UpdateMetalRatesRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.updateMetalRates(shopId, rates)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update metal rates'
      )
    }
  }
)

/**
 * Delete shop (soft delete)
 */
export const deleteShop = createAsyncThunk(
  'shop/deleteShop',
  async (shopId: string, { rejectWithValue }) => {
    try {
      await authService.deleteShop(shopId)
      return shopId
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete shop'
      )
    }
  }
)

/**
 * Get shop statistics
 */
export const fetchShopStatistics = createAsyncThunk(
  'shop/fetchShopStatistics',
  async (shopId: string, { rejectWithValue }) => {
    try {
      const response = await authService.getShopStatistics(shopId)
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch statistics'
      )
    }
  }
)

// ============================================================================
// SLICE
// ============================================================================

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    // Set filters
    setFilters: (state, action: PayloadAction<ShopQueryParams>) => {
      state.filters = { ...state.filters, ...action.payload }
    },

    // Clear filters
    clearFilters: state => {
      state.filters = { page: 1, limit: 10, isActive: true }
    },

    // Clear error
    clearError: state => {
      state.error = null
    },

    // Set current shop
    setCurrentShop: (state, action: PayloadAction<JewelryShop | null>) => {
      state.currentShop = action.payload
    },

    // Clear current shop
    clearCurrentShop: state => {
      state.currentShop = null
    },

    // Reset state
    resetShopState: state => {
      Object.assign(state, initialState)
    },
  },
  extraReducers: builder => {
    // ========================================
    // FETCH SHOPS
    // ========================================
    builder
      .addCase(fetchShops.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.isLoading = false
        state.shops = action.payload.data
        state.pagination = action.payload.pagination
      })
      .addCase(fetchShops.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // ========================================
    // FETCH SHOP BY ID
    // ========================================
    builder
      .addCase(fetchShopById.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchShopById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentShop = action.payload
      })
      .addCase(fetchShopById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // ========================================
    // CREATE SHOP
    // ========================================
    builder
      .addCase(createShop.pending, state => {
        state.isCreating = true
        state.error = null
      })
      .addCase(createShop.fulfilled, (state, action) => {
        state.isCreating = false
        state.shops.unshift(action.payload)
      })
      .addCase(createShop.rejected, (state, action) => {
        state.isCreating = false
        state.error = action.payload as string
      })

    // ========================================
    // UPDATE SHOP
    // ========================================
    builder
      .addCase(updateShop.pending, state => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateShop.fulfilled, (state, action) => {
        state.isUpdating = false
        const index = state.shops.findIndex(
          shop => shop._id === action.payload._id
        )
        if (index !== -1) {
          state.shops[index] = action.payload
        }
        if (state.currentShop?._id === action.payload._id) {
          state.currentShop = action.payload
        }
      })
      .addCase(updateShop.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload as string
      })

    // ========================================
    // UPDATE SHOP SETTINGS
    // ========================================
    builder
      .addCase(updateShopSettings.pending, state => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateShopSettings.fulfilled, (state, action) => {
        state.isUpdating = false
        const index = state.shops.findIndex(
          shop => shop._id === action.payload._id
        )
        if (index !== -1) {
          state.shops[index] = action.payload
        }
        if (state.currentShop?._id === action.payload._id) {
          state.currentShop = action.payload
        }
      })
      .addCase(updateShopSettings.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload as string
      })

    // ========================================
    // UPDATE METAL RATES
    // ========================================
    builder
      .addCase(updateMetalRates.pending, state => {
        state.isUpdating = true
        state.error = null
      })
      .addCase(updateMetalRates.fulfilled, (state, action) => {
        state.isUpdating = false
        const index = state.shops.findIndex(
          shop => shop._id === action.payload._id
        )
        if (index !== -1) {
          state.shops[index] = action.payload
        }
        if (state.currentShop?._id === action.payload._id) {
          state.currentShop = action.payload
        }
      })
      .addCase(updateMetalRates.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload as string
      })

    // ========================================
    // DELETE SHOP
    // ========================================
    builder
      .addCase(deleteShop.pending, state => {
        state.isDeleting = true
        state.error = null
      })
      .addCase(deleteShop.fulfilled, (state, action) => {
        state.isDeleting = false
        state.shops = state.shops.filter(shop => shop._id !== action.payload)
        if (state.currentShop?._id === action.payload) {
          state.currentShop = null
        }
      })
      .addCase(deleteShop.rejected, (state, action) => {
        state.isDeleting = false
        state.error = action.payload as string
      })

    // ========================================
    // FETCH SHOP STATISTICS
    // ========================================
    builder
      .addCase(fetchShopStatistics.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchShopStatistics.fulfilled, (state, action) => {
        state.isLoading = false
        if (state.currentShop) {
          state.currentShop.statistics = action.payload
        }
      })
      .addCase(fetchShopStatistics.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

// ============================================================================
// ACTIONS
// ============================================================================

export const {
  setFilters,
  clearFilters,
  clearError,
  setCurrentShop,
  clearCurrentShop,
  resetShopState,
} = shopSlice.actions

// ============================================================================
// SELECTORS
// ============================================================================

export const selectShop = (state: RootState) => state.shop
export const selectShops = (state: RootState) => state.shop.shops
export const selectCurrentShop = (state: RootState) => state.shop.currentShop
export const selectShopPagination = (state: RootState) => state.shop.pagination
export const selectShopFilters = (state: RootState) => state.shop.filters
export const selectShopLoading = (state: RootState) => state.shop.isLoading
export const selectShopError = (state: RootState) => state.shop.error

// ============================================================================
// EXPORT REDUCER
// ============================================================================

export default shopSlice.reducer
