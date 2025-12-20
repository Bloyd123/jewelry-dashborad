// ============================================================================
// FILE: hooks/index.ts
// Hooks Exports
// ============================================================================

export { useSidebar } from './useSidebar'
export { useMediaQuery } from './useMediaQuery'
export { useTheme } from './useTheme'
export { useThemeSync } from './useThemeSync'
export { useCustomerFilters } from './useCustomerFilters'
export { useCustomerPagination } from './useCustomerPagination'
export { useCustomerSelection } from './useCustomerSelection'
export { useCustomerForm } from './useCustomerForm'
export { useCustomers } from './useCustomers'
export {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useGetCustomersQuery,
  useGetCustomerQuery,
  useSearchCustomerQuery,
  useBlacklistCustomerMutation,
  useRemoveBlacklistMutation,
  useAddLoyaltyPointsMutation,
  useRedeemLoyaltyPointsMutation,
  useGetCustomerStatisticsQuery,
} from '@/api/services/customerService'
