// ============================================================================
// FILE: src/store/slices/shopSlice.ts
// Shop State Management
// ============================================================================

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { shopService } from '@/api/services/shopService';
import type { Shop, ShopSettings } from '@/types/shop.types';

// ============================================================================
// STATE INTERFACE
// ============================================================================

interface ShopState {
  currentShop: Shop | null;
  shops: Shop[];
  isLoading: boolean;
  error: string | null;
  totalShops: number;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const getStoredShop = (): Shop | null => {
  try {
    const shopData = localStorage.getItem('currentShop');
    return shopData ? JSON.parse(shopData) : null;
  } catch {
    return null;
  }
};

const initialState: ShopState = {
  currentShop: getStoredShop(),
  shops: [],
  isLoading: false,
  error: null,
  totalShops: 0,
};

// ============================================================================
// ASYNC THUNKS
// ============================================================================

// Get all shops (for dropdown/list)
export const getShopsAction = createAsyncThunk(
  'shop/getShops',
  async (_, { rejectWithValue }) => {
    try {
      const response = await shopService.getAll();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch shops'
      );
    }
  }
);

// Get single shop by ID
export const getShopByIdAction = createAsyncThunk(
  'shop/getShopById',
  async (shopId: string, { rejectWithValue }) => {
    try {
      const response = await shopService.getById(shopId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch shop details'
      );
    }
  }
);

// Update shop settings
export const updateShopSettingsAction = createAsyncThunk(
  'shop/updateSettings',
  async (
    { shopId, settings }: { shopId: string; settings: Partial<ShopSettings> },
    { rejectWithValue }
  ) => {
    try {
      const response = await shopService.updateSettings(shopId, settings);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update shop settings'
      );
    }
  }
);

// Update metal rates
export const updateMetalRatesAction = createAsyncThunk(
  'shop/updateMetalRates',
  async (
    { shopId, rates }: { shopId: string; rates: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await shopService.updateMetalRates(shopId, rates);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update metal rates'
      );
    }
  }
);

// ============================================================================
// SLICE
// ============================================================================

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    // Set current shop (user switches shop)
    setCurrentShop: (state, action: PayloadAction<Shop>) => {
      state.currentShop = action.payload;
      // Save to localStorage
      localStorage.setItem('currentShop', JSON.stringify(action.payload));
    },
    
    // Set shop list
    setShopList: (state, action: PayloadAction<Shop[]>) => {
      state.shops = action.payload;
      state.totalShops = action.payload.length;
    },
    
    // Clear current shop
    clearCurrentShop: (state) => {
      state.currentShop = null;
      localStorage.removeItem('currentShop');
    },
    
    // Update shop settings locally (optimistic update)
    updateShopSettingsLocal: (state, action: PayloadAction<Partial<ShopSettings>>) => {
      if (state.currentShop) {
        state.currentShop.settings = {
          ...state.currentShop.settings,
          ...action.payload,
        };
        localStorage.setItem('currentShop', JSON.stringify(state.currentShop));
      }
    },
    
    // Clear error
    clearShopError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ========================================
    // GET SHOPS
    // ========================================
    builder.addCase(getShopsAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getShopsAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.shops = action.payload.shops || action.payload;
      state.totalShops = action.payload.total || action.payload.length;
      state.error = null;
    });
    builder.addCase(getShopsAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // ========================================
    // GET SHOP BY ID
    // ========================================
    builder.addCase(getShopByIdAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getShopByIdAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentShop = action.payload;
      localStorage.setItem('currentShop', JSON.stringify(action.payload));
      state.error = null;
    });
    builder.addCase(getShopByIdAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // ========================================
    // UPDATE SHOP SETTINGS
    // ========================================
    builder.addCase(updateShopSettingsAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateShopSettingsAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentShop = action.payload;
      localStorage.setItem('currentShop', JSON.stringify(action.payload));
      state.error = null;
    });
    builder.addCase(updateShopSettingsAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // ========================================
    // UPDATE METAL RATES
    // ========================================
    builder.addCase(updateMetalRatesAction.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateMetalRatesAction.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentShop = action.payload;
      localStorage.setItem('currentShop', JSON.stringify(action.payload));
      state.error = null;
    });
    builder.addCase(updateMetalRatesAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

// ============================================================================
// EXPORT ACTIONS & REDUCER
// ============================================================================

export const {
  setCurrentShop,
  setShopList,
  clearCurrentShop,
  updateShopSettingsLocal,
  clearShopError,
} = shopSlice.actions;

export default shopSlice.reducer;