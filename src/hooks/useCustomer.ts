// // ============================================================================
// // FILE: src/hooks/customer/useCustomer.ts
// // Get Single Customer Query Hook
// // ============================================================================

// import { useQuery } from '@tanstack/react-query'
// import { customerService } from '@/api/services/customerService'
// import type { Customer, ID } from '@/types'

// interface UseCustomerOptions {
//   enabled?: boolean
//   refetchOnWindowFocus?: boolean
// }

// export const useCustomer = (customerId: ID, options?: UseCustomerOptions) => {
//   return useQuery({
//     queryKey: ['customer', customerId],
//     queryFn: () => customerService.getCustomer(customerId),
//     enabled: options?.enabled ?? true,
//     refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//   })
// }
