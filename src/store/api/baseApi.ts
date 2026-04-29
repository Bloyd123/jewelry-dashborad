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
      'CustomerActivity',   
  'CustomerDocuments',  
  'CustomerLoyalty', 
    'User',
  'UserList',   

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
    'Sale', 
    'SaleList', 
    'SalePayments', 
    'SaleDocuments',
     'SaleAnalytics', 
     'SaleDashboard', 
     'SaleSearch',
'MetalRate',

    'Shop',
    'ShopList',
    'ShopStatistics',
    'ShopActivityLogs',
      'Payment',
  'PaymentList',
  'PaymentDashboard',
  'PaymentAnalytics',
  'PaymentSearch',
  'PendingCheques',
  'BouncedCheques',
  'ClearedCheques',
  'UnreconciledPayments',
  'ReconciliationSummary',
  'Receipt',
  'PartyPayments',
  'PartyPaymentSummary',
  'CashCollection',
  'ReferencePayments',
  'Refunds',
  // Opening Balance Module
'OpeningBalance',
'OpeningBalanceStatus',
'GirviStats',
'GirviList',
'Girvi',
'GirviPartyInterest',
'Girvi',
'GirviTransferList',
'GirviTransfer',
'GirviPayments',
'GirviStats',
'GirviList',
'GirviPayment',
'GirviCashbookList',
'GirviCashbookEntry',
'GirviCashbookList',
'GirviCashbookBalance',
'GirviCashbookSummary'
  ],

  endpoints: () => ({}),
})

export default baseApi
