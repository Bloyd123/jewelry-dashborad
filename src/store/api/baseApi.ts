// FILE: src/store/api/baseApi.ts
// RTK Query Base API Configuration

import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@/api/baseQuery'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,

  // Tag types for cache invalidation
  tagTypes: [
    // Customer Module
    'Customer',
    'CustomerList',
    'CustomerAnalytics',
    'CustomerSearch',

    // Product Module
    'Product',
    'ProductList',
    'ProductAnalytics',
    'ProductSearch',
    'ProductHistory',
    // Supplier Module
    'Supplier',
    'SupplierList',
    'SupplierSearch',
        'Purchase',           // Single purchase by ID
    'PurchaseList',       // List of purchases (with filters)
    'PurchaseAnalytics',  // Analytics & reports
    'PurchaseSearch',     // Search results
  ],

  endpoints: () => ({}), // Endpoints will be injected
})

export default baseApi
