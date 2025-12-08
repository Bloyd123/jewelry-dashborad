// // ============================================================================
// // FILE: src/hooks/customer/useCustomers.ts
// // Get Customer List Query Hook
// // ============================================================================

// import { useQuery } from '@tanstack/react-query'
// import { customerService } from '@/api/services/customerService'
// import type { CustomerQueryParams, PaginatedResponse, CustomerListItem } from '@/types'

// interface UseCustomersOptions {
//   enabled?: boolean
//   refetchOnWindowFocus?: boolean
//   keepPreviousData?: boolean
// }

// export const useCustomers = (
//   params: CustomerQueryParams,
//   options?: UseCustomersOptions
// ) => {
//   return useQuery<PaginatedResponse<CustomerListItem>>({
//     queryKey: ['customers', params],
//     queryFn: () => customerService.getCustomers(params),
//     enabled: options?.enabled ?? true,
//     refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
//     placeholderData: (previousData) => 
//       options?.keepPreviousData ? previousData : undefined,
//     staleTime: 2 * 60 * 1000, // 2 minutes
//   })
// }
