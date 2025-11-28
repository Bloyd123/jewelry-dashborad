// FILE: services/api/shopAPI.ts

import { api } from '@/api/axios';
import { replacePathParams } from '@/utils/api';
import type {
  ApiResponse,
  PaginatedResponse,
  JewelryShop,
  CreateShopRequest,
  UpdateShopRequest,
  UpdateShopSettingsRequest,
  UpdateMetalRatesRequest,
  ShopQueryParams,
} from '@/types';
import { API_ENDPOINTS } from '@/api/endpoints';

// Get all shops
export const getAllShops = async (params?: ShopQueryParams): Promise<PaginatedResponse<JewelryShop>> => {
  const response = await api.get(API_ENDPOINTS.SHOPS.BASE, { params });
  return response.data;
};

// Get shop by ID
export const getShopById = async (shopId: string): Promise<ApiResponse<JewelryShop>> => {
  const url = replacePathParams(API_ENDPOINTS.SHOPS.BY_ID, { id: shopId });
  const response = await api.get(url);
  return response.data;
};

// Create shop
export const createShop = async (data: CreateShopRequest): Promise<ApiResponse<JewelryShop>> => {
  const response = await api.post(API_ENDPOINTS.SHOPS.BASE, data);
  return response.data;
};

// Update shop
export const updateShop = async (shopId: string, data: UpdateShopRequest): Promise<ApiResponse<JewelryShop>> => {
  const url = replacePathParams(API_ENDPOINTS.SHOPS.BY_ID, { id: shopId });
  const response = await api.put(url, data);
  return response.data;
};

// Update shop settings
export const updateShopSettings = async (shopId: string, data: UpdateShopSettingsRequest): Promise<ApiResponse<JewelryShop>> => {
  const url = replacePathParams(API_ENDPOINTS.SHOPS.SETTINGS, { id: shopId });
  const response = await api.patch(url, data);
  return response.data;
};

// Update metal rates

export const updateMetalRates = async (shopId: string, data: UpdateMetalRatesRequest): Promise<ApiResponse<JewelryShop>> => {
  const url = replacePathParams(API_ENDPOINTS.SHOPS.METAL_RATES, { id: shopId });
  const response = await api.patch(url, data);
  return response.data;
};

// Delete shop
export const deleteShop = async (shopId: string): Promise<ApiResponse<void>> => {
  const url = replacePathParams(API_ENDPOINTS.SHOPS.BY_ID, { id: shopId });
  const response = await api.delete(url);
  return response.data;
};

// Get shop statistics

export const getShopStatistics = async (shopId: string): Promise<ApiResponse<any>> => {
  const url = replacePathParams(API_ENDPOINTS.SHOPS.STATISTICS, { id: shopId });
  const response = await api.get(url);
  return response.data;

};

export default {
  getAllShops,
  getShopById,
  createShop,
  updateShop,
  updateShopSettings,
  updateMetalRates,
  deleteShop,
  getShopStatistics,
};