// // ============================================================================
// // FILE: src/api/services/shopService.ts
// // Shop API Service
// // ============================================================================

// import { api } from '@/api/axios';
// import { API_ENDPOINTS } from '@/api/endpoints';
// import { buildQueryString, replacePathParams } from '@/utils/api';
// import type { 
//   ApiResponse, 
//   Shop, 
//   ShopSettings,
//   MetalRates,
//   ShopStatistics,
//   PaginatedResponse
// } from '@/types';

// // ============================================================================
// // TYPES
// // ============================================================================

// interface CreateShopRequest {
//   name: string;
//   displayName?: string;
//   email?: string;
//   phone: string;
//   alternatePhone?: string;
//   whatsappNumber?: string;
//   address: {
//     street: string;
//     city: string;
//     state: string;
//     country?: string;
//     pincode: string;
//     location?: {
//       type: 'Point';
//       coordinates: [number, number]; // [longitude, latitude]
//     };
//   };
//   gstNumber?: string;
//   panNumber?: string;
//   shopType?: 'retail' | 'wholesale' | 'manufacturing' | 'showroom' | 'workshop' | 'warehouse' | 'online';
//   category?: 'jewelry' | 'gold' | 'silver' | 'diamond' | 'gemstone' | 'pearls' | 'platinum' | 'mixed';
//   establishedYear?: number;
//   managerId?: string;
//   organizationId?: string;
//   copySettingsFromShopId?: string;
//   bankDetails?: Array<{
//     bankName: string;
//     accountNumber: string;
//     ifscCode: string;
//     accountHolderName: string;
//     accountType?: string;
//     branchName?: string;
//     isPrimary?: boolean;
//   }>;
//   upiDetails?: Array<{
//     upiId: string;
//     provider?: string;
//     isPrimary?: boolean;
//   }>;
// }

// interface UpdateShopRequest extends Partial<CreateShopRequest> {}

// interface GetShopsParams {
//   page?: number;
//   limit?: number;
//   sort?: string;
//   fields?: string;
//   search?: string;
//   isActive?: boolean;
//   isVerified?: boolean;
//   shopType?: string;
//   category?: string;
//   city?: string;
//   state?: string;
//   organizationId?: string;
// }

// // ============================================================================
// // SHOP SERVICE
// // ============================================================================

// class ShopService {
//   /**
//    * Create a new shop
//    */
//   async create(shopData: CreateShopRequest): Promise<ApiResponse<Shop>> {
//     const response = await api.post<ApiResponse<Shop>>(
//       API_ENDPOINTS.SHOPS.BASE,
//       shopData
//     );
//     return response.data;
//   }

//   /**
//    * Get all shops with filtering and pagination
//    */
//   async getAll(params?: GetShopsParams): Promise<ApiResponse<PaginatedResponse<Shop>>> {
//     const queryString = params ? buildQueryString(params) : '';
//     const response = await api.get<ApiResponse<PaginatedResponse<Shop>>>(
//       `${API_ENDPOINTS.SHOPS.BASE}${queryString}`
//     );
//     return response.data;
//   }

//   /**
//    * Get single shop by ID
//    */
//   async getById(shopId: string, includeSettings = false): Promise<ApiResponse<Shop>> {
//     const queryString = buildQueryString({ includeSettings });
//     const url = replacePathParams(API_ENDPOINTS.SHOPS.BY_ID, { id: shopId });
//     const response = await api.get<ApiResponse<Shop>>(
//       `${url}${queryString}`
//     );
//     return response.data;
//   }

//   /**
//    * Update shop details
//    */
//   async update(shopId: string, updateData: UpdateShopRequest): Promise<ApiResponse<Shop>> {
//     const url = replacePathParams(API_ENDPOINTS.SHOPS.BY_ID, { id: shopId });
//     const response = await api.put<ApiResponse<Shop>>(
//       url,
//       updateData
//     );
//     return response.data;
//   }

//   /**
//    * Delete shop (soft delete)
//    */
//   async delete(shopId: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
//     const url = replacePathParams(API_ENDPOINTS.SHOPS.BY_ID, { id: shopId });
//     const response = await api.delete<ApiResponse<{ success: boolean; message: string }>>(
//       url
//     );
//     return response.data;
//   }

//   /**
//    * Update shop settings
//    */
//   async updateSettings(shopId: string, settings: Partial<ShopSettings>): Promise<ApiResponse<Shop>> {
//     const url = replacePathParams(API_ENDPOINTS.SHOPS.SETTINGS, { id: shopId });
//     const response = await api.patch<ApiResponse<Shop>>(
//       url,
//       { settings }
//     );
//     return response.data;
//   }

//   /**
//    * Update metal rates
//    */
//   async updateMetalRates(shopId: string, rates: MetalRates): Promise<ApiResponse<Shop>> {
//     const url = replacePathParams(API_ENDPOINTS.SHOPS.METAL_RATES, { id: shopId });
//     const response = await api.patch<ApiResponse<Shop>>(
//       url,
//       rates
//     );
//     return response.data;
//   }

//   /**
//    * Get shop statistics
//    */
//   async getStatistics(shopId: string): Promise<ApiResponse<ShopStatistics>> {
//     const url = replacePathParams(API_ENDPOINTS.SHOPS.STATISTICS, { id: shopId });
//     const response = await api.get<ApiResponse<ShopStatistics>>(
//       url
//     );
//     return response.data;
//   }

//   /**
//    * Get shops for dropdown/select (simplified response)
//    */
//   async getShopsForDropdown(): Promise<ApiResponse<Array<{ _id: string; name: string; code: string }>>> {
//     const response = await api.get<ApiResponse<PaginatedResponse<Shop>>>(
//       `${API_ENDPOINTS.SHOPS.BASE}?fields=name,code&limit=100`
//     );
    
//     // Transform to simplified format
//     const shops = response.data.data.map(shop => ({
//       _id: shop._id,
//       name: shop.name,
//       code: shop.code
//     }));
    
//     return {
//       ...response.data,
//       data: shops
//     };
//   }

//   /**
//    * Transfer inventory between shops
//    */
//   async transferInventory(
//     shopId: string,
//     transferData: {
//       toShopId: string;
//       items: Array<{
//         productId: string;
//         quantity: number;
//         notes?: string;
//       }>;
//       notes?: string;
//     }
//   ): Promise<ApiResponse<any>> {
//     const url = replacePathParams(API_ENDPOINTS.SHOPS.TRANSFER_INVENTORY, { id: shopId });
//     const response = await api.post<ApiResponse<any>>(
//       url,
//       transferData
//     );
//     return response.data;
//   }
// }

// // ============================================================================
// // EXPORT SINGLETON INSTANCE
// // ============================================================================

// export const shopService = new ShopService();
// export default shopService;