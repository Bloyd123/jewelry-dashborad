// ============================================================================
// FILE: store/hooks/shop.ts
// Shop-specific Redux Hooks
// ============================================================================

import { useAppDispatch, useAppSelector } from './base';
import { useCallback, useEffect } from 'react';
import {
  fetchShops,
  fetchShopById,
  createShop,
  updateShop,
  updateShopSettings,
  updateMetalRates,
  deleteShop,
  fetchShopStatistics,
  setFilters,
  clearFilters,
  clearError,
  setCurrentShop,
  clearCurrentShop,
} from '../slices/shopSlice';
import type {
  CreateShopRequest,
  UpdateShopRequest,
  UpdateShopSettingsRequest,
  UpdateMetalRatesRequest,
  ShopQueryParams,
} from '@/types';

// ============================================================================
// BASIC SELECTORS
// ============================================================================

/**
 * Hook to get all shops from state
 */
export const useShops = () => {
  return useAppSelector((state) => state.shop.shops);
};

/**
 * Hook to get current shop details
 */
export const useCurrentShopDetails = () => {
  return useAppSelector((state) => state.shop.currentShop);
};

/**
 * Hook to get shop pagination
 */
export const useShopPagination = () => {
  return useAppSelector((state) => state.shop.pagination);
};

/**
 * Hook to get shop filters
 */
export const useShopFilters = () => {
  return useAppSelector((state) => state.shop.filters);
};

/**
 * Hook to get shop loading states
 */
export const useShopLoading = () => {
  return useAppSelector((state) => ({
    isLoading: state.shop.isLoading,
    isCreating: state.shop.isCreating,
    isUpdating: state.shop.isUpdating,
    isDeleting: state.shop.isDeleting,
  }));
};

/**
 * Hook to get shop error
 */
export const useShopError = () => {
  return useAppSelector((state) => state.shop.error);
};

// ============================================================================
// ACTION HOOKS
// ============================================================================

/**
 * Hook to fetch shops with filters
 */
export const useFetchShops = () => {
  const dispatch = useAppDispatch();
  const filters = useShopFilters();

  const fetch = useCallback(
    (params?: ShopQueryParams) => {
      return dispatch(fetchShops(params || filters));
    },
    [dispatch, filters]
  );

  return fetch;
};

/**
 * Hook to fetch shop by ID
 */
export const useFetchShopById = () => {
  const dispatch = useAppDispatch();

  const fetch = useCallback(
    (shopId: string) => {
      return dispatch(fetchShopById(shopId));
    },
    [dispatch]
  );

  return fetch;
};

/**
 * Hook to create shop
 */
export const useCreateShop = () => {
  const dispatch = useAppDispatch();

  const create = useCallback(
    (shopData: CreateShopRequest) => {
      return dispatch(createShop(shopData));
    },
    [dispatch]
  );

  return create;
};

/**
 * Hook to update shop
 */
export const useUpdateShop = () => {
  const dispatch = useAppDispatch();

  const update = useCallback(
    (shopId: string, updates: UpdateShopRequest) => {
      return dispatch(updateShop({ shopId, updates }));
    },
    [dispatch]
  );

  return update;
};

/**
 * Hook to update shop settings
 */
export const useUpdateShopSettings = () => {
  const dispatch = useAppDispatch();

  const update = useCallback(
    (shopId: string, settings: UpdateShopSettingsRequest) => {
      return dispatch(updateShopSettings({ shopId, settings }));
    },
    [dispatch]
  );

  return update;
};

/**
 * Hook to update metal rates
 */
export const useUpdateMetalRates = () => {
  const dispatch = useAppDispatch();

  const update = useCallback(
    (shopId: string, rates: UpdateMetalRatesRequest) => {
      return dispatch(updateMetalRates({ shopId, rates }));
    },
    [dispatch]
  );

  return update;
};

/**
 * Hook to delete shop
 */
export const useDeleteShop = () => {
  const dispatch = useAppDispatch();

  const remove = useCallback(
    (shopId: string) => {
      return dispatch(deleteShop(shopId));
    },
    [dispatch]
  );

  return remove;
};

/**
 * Hook to fetch shop statistics
 */
export const useFetchShopStatistics = () => {
  const dispatch = useAppDispatch();

  const fetch = useCallback(
    (shopId: string) => {
      return dispatch(fetchShopStatistics(shopId));
    },
    [dispatch]
  );

  return fetch;
};

// ============================================================================
// FILTER MANAGEMENT HOOKS
// ============================================================================

/**
 * Hook to update shop filters
 */
export const useSetShopFilters = () => {
  const dispatch = useAppDispatch();

  const updateFilters = useCallback(
    (filters: ShopQueryParams) => {
      dispatch(setFilters(filters));
    },
    [dispatch]
  );

  return updateFilters;
};

/**
 * Hook to clear shop filters
 */
export const useClearShopFilters = () => {
  const dispatch = useAppDispatch();

  const clear = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  return clear;
};

// ============================================================================
// ERROR MANAGEMENT HOOKS
// ============================================================================

/**
 * Hook to clear shop error
 */
export const useClearShopError = () => {
  const dispatch = useAppDispatch();

  const clear = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return clear;
};

// ============================================================================
// CURRENT SHOP MANAGEMENT HOOKS
// ============================================================================

/**
 * Hook to set current shop
 */
export const useSetCurrentShop = () => {
  const dispatch = useAppDispatch();

  const setCurrent = useCallback(
    (shop: any) => {
      dispatch(setCurrentShop(shop));
    },
    [dispatch]
  );

  return setCurrent;
};

/**
 * Hook to clear current shop
 */
export const useClearCurrentShop = () => {
  const dispatch = useAppDispatch();

  const clear = useCallback(() => {
    dispatch(clearCurrentShop());
  }, [dispatch]);

  return clear;
};

// ============================================================================
// DERIVED STATE HOOKS
// ============================================================================

/**
 * Hook to get shop by ID from state
 */
export const useShopById = (shopId: string | undefined) => {
  const shops = useShops();

  if (!shopId) return null;

  return shops.find((shop) => shop._id === shopId) || null;
};

/**
 * Hook to check if any shop is loading
 */
export const useIsShopLoading = () => {
  const { isLoading, isCreating, isUpdating, isDeleting } = useShopLoading();

  return isLoading || isCreating || isUpdating || isDeleting;
};

/**
 * Hook to get shops count
 */
export const useShopsCount = () => {
  const shops = useShops();
  return shops.length;
};

/**
 * Hook to get active shops
 */
export const useActiveShops = () => {
  const shops = useShops();
  return shops.filter((shop) => shop.isActive);
};

/**
 * Hook to get inactive shops
 */
export const useInactiveShops = () => {
  const shops = useShops();
  return shops.filter((shop) => !shop.isActive);
};

/**
 * Hook to get verified shops
 */
export const useVerifiedShops = () => {
  const shops = useShops();
  return shops.filter((shop) => shop.isVerified);
};

/**
 * Hook to get shops by type
 */
export const useShopsByType = (shopType: string) => {
  const shops = useShops();
  return shops.filter((shop) => shop.shopType === shopType);
};

/**
 * Hook to get shops by category
 */
export const useShopsByCategory = (category: string) => {
  const shops = useShops();
  return shops.filter((shop) => shop.category === category);
};

// ============================================================================
// COMPUTED VALUES HOOKS
// ============================================================================

/**
 * Hook to get total inventory value across all shops
 */
export const useTotalInventoryValue = () => {
  const shops = useShops();

  return shops.reduce((total, shop) => {
    return total + (shop.statistics?.totalInventoryValue || 0);
  }, 0);
};

/**
 * Hook to get total products across all shops
 */
export const useTotalProducts = () => {
  const shops = useShops();

  return shops.reduce((total, shop) => {
    return total + (shop.statistics?.totalProducts || 0);
  }, 0);
};

/**
 * Hook to get total staff across all shops
 */
export const useTotalStaff = () => {
  const shops = useShops();

  return shops.reduce((total, shop) => {
    return total + (shop.statistics?.totalStaff || 0);
  }, 0);
};

/**
 * Hook to get shops summary statistics
 */
export const useShopsSummary = () => {
  const shops = useShops();
  const totalInventoryValue = useTotalInventoryValue();
  const totalProducts = useTotalProducts();
  const totalStaff = useTotalStaff();

  return {
    total: shops.length,
    active: shops.filter((s) => s.isActive).length,
    inactive: shops.filter((s) => !s.isActive).length,
    verified: shops.filter((s) => s.isVerified).length,
    totalInventoryValue,
    totalProducts,
    totalStaff,
  };
};

// ============================================================================
// COMBINED HOOKS (Fetch on Mount)
// ============================================================================

/**
 * Hook to fetch shops on component mount
 */
export const useShopsData = (params?: ShopQueryParams, refetch: boolean = true) => {
  const dispatch = useAppDispatch();
  const shops = useShops();
  const pagination = useShopPagination();
  const { isLoading } = useShopLoading();
  const error = useShopError();

  useEffect(() => {
    if (refetch) {
      dispatch(fetchShops(params));
    }
  }, [dispatch, refetch]);

  return {
    shops,
    pagination,
    isLoading,
    error,
    refetch: () => dispatch(fetchShops(params)),
  };
};

/**
 * Hook to fetch shop by ID on component mount
 */
export const useShopData = (shopId: string | undefined, refetch: boolean = true) => {
  const dispatch = useAppDispatch();
  const shop = useCurrentShopDetails();
  const { isLoading } = useShopLoading();
  const error = useShopError();

  useEffect(() => {
    if (shopId && refetch) {
      dispatch(fetchShopById(shopId));
    }
  }, [dispatch, shopId, refetch]);

  return {
    shop,
    isLoading,
    error,
    refetch: () => shopId && dispatch(fetchShopById(shopId)),
  };
};

// ============================================================================
// EXPORT ALL HOOKS
// ============================================================================

export default {
  // Basic Selectors
  useShops,
  useCurrentShopDetails,
  useShopPagination,
  useShopFilters,
  useShopLoading,
  useShopError,

  // Action Hooks
  useFetchShops,
  useFetchShopById,
  useCreateShop,
  useUpdateShop,
  useUpdateShopSettings,
  useUpdateMetalRates,
  useDeleteShop,
  useFetchShopStatistics,

  // Filter Management
  useSetShopFilters,
  useClearShopFilters,

  // Error Management
  useClearShopError,

  // Current Shop Management
  useSetCurrentShop,
  useClearCurrentShop,

  // Derived State
  useShopById,
  useIsShopLoading,
  useShopsCount,
  useActiveShops,
  useInactiveShops,
  useVerifiedShops,
  useShopsByType,
  useShopsByCategory,

  // Computed Values
  useTotalInventoryValue,
  useTotalProducts,
  useTotalStaff,
  useShopsSummary,

  // Combined Hooks
  useShopsData,
  useShopData,
};