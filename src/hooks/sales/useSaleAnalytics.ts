// FILE: src/features/sales/hooks/useSaleAnalytics.ts

import { useState } from 'react'
import {
  useGetSalesAnalyticsQuery,
  useGetSalesDashboardQuery,
  useGetCustomerSalesSummaryQuery,
  useGetSalesPersonPerformanceQuery,
  useGetSalesPersonSalesQuery,
  useGetCustomerSalesQuery,
} from '@/store/api/salesApi'

// ─────────────────────────────────────────────
// SALES ANALYTICS (date range based)
// ─────────────────────────────────────────────
export const useSaleAnalytics = (
  shopId: string,
  options?: {
    startDate?: string
    endDate?: string
    groupBy?: 'day' | 'week' | 'month' | 'year'
    customerId?: string
    userId?: string         // for salesperson
    page?: number
    limit?: number
  }
) => {
  // ─── Overall Analytics ───────────────────
  const {
    data: analytics,
    isLoading: isAnalyticsLoading,
    refetch: refetchAnalytics,
  } = useGetSalesAnalyticsQuery({
    shopId,
    startDate: options?.startDate,
    endDate:   options?.endDate,
    groupBy:   options?.groupBy,
  })

  // ─── Dashboard ───────────────────────────
  const {
    data: dashboard,
    isLoading: isDashboardLoading,
    refetch: refetchDashboard,
  } = useGetSalesDashboardQuery({ shopId })

  // ─── Customer Summary (optional) ─────────
  const {
    data: customerSummary,
    isLoading: isCustomerSummaryLoading,
  } = useGetCustomerSalesSummaryQuery(
    { shopId, customerId: options?.customerId! },
    { skip: !options?.customerId }
  )

  // ─── Customer Sales (optional) ───────────
  const {
    data: customerSalesData,
    isLoading: isCustomerSalesLoading,
  } = useGetCustomerSalesQuery(
    {
      shopId,
      customerId: options?.customerId!,
      page:       options?.page  || 1,
      limit:      options?.limit || 10,
    },
    { skip: !options?.customerId }
  )

  // ─── SalesPerson Performance (optional) ──
  const {
    data: salesPersonPerformance,
    isLoading: isSalesPersonPerfLoading,
  } = useGetSalesPersonPerformanceQuery(
    {
      shopId,
      userId:    options?.userId!,
      startDate: options?.startDate,
      endDate:   options?.endDate,
    },
    { skip: !options?.userId }
  )

  // ─── SalesPerson Sales (optional) ────────
  const {
    data: salesPersonSalesData,
    isLoading: isSalesPersonSalesLoading,
  } = useGetSalesPersonSalesQuery(
    {
      shopId,
      userId: options?.userId!,
      page:   options?.page  || 1,
      limit:  options?.limit || 10,
    },
    { skip: !options?.userId }
  )

  return {
    // ── Analytics Data ────────────────────
    analytics:   analytics   || null,
    dashboard:   dashboard   || null,

    // ── Customer Data ─────────────────────
    customerSummary:  customerSummary  || null,
    customerSales:    customerSalesData?.data?.sales || [],
    customerTotal:    customerSalesData?.data?.total || 0,

    // ── SalesPerson Data ──────────────────
    salesPersonPerformance: salesPersonPerformance || null,
    salesPersonSales:       salesPersonSalesData?.data?.sales || [],
    salesPersonTotal:       salesPersonSalesData?.data?.total || 0,

    // ── Computed Dashboard Helpers ────────
    todayCount:      dashboard?.today?.count       || 0,
    todayValue:      dashboard?.today?.value       || 0,
    pendingPayments: dashboard?.pendingPayments    || 0,
    recentSales:     dashboard?.recentSales        || [],

    // ── Loading States ────────────────────
    isAnalyticsLoading,
    isDashboardLoading,
    isCustomerSummaryLoading,
    isCustomerSalesLoading,
    isSalesPersonPerfLoading,
    isSalesPersonSalesLoading,

    isLoading:
      isAnalyticsLoading ||
      isDashboardLoading,

    // ── Utils ─────────────────────────────
    refetchAnalytics,
    refetchDashboard,
  }
}