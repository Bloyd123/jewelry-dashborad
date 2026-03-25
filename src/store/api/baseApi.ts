// FILE: src/store/api/baseApi.ts
// RTK Query Base API Configuration

import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@/api/baseQuery'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,

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

    // Purchase Module
    'Purchase',
    'PurchaseList',
    'PurchaseSearch',
    'PurchaseAnalytics',
    'PurchasePayments',
    'PurchaseDocs',

    'Shop',
    'ShopList',
    'ShopStatistics',
    'ShopActivityLogs',
  ],

  endpoints: () => ({}),
})

export default baseApi
