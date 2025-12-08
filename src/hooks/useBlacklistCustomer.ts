// // ============================================================================
// // FILE: src/hooks/customer/useBlacklistCustomer.ts
// // Blacklist Customer Mutation Hook
// // ============================================================================

// import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { toast } from 'sonner'
// import { customerService } from '@/api/services/customerService'
// import { MESSAGES } from '@/constants/messages'
// import type { ID, BlacklistCustomerRequest } from '@/types'

// export const useBlacklistCustomer = (customerId: ID) => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (data: BlacklistCustomerRequest) =>
//       customerService.blacklistCustomer(customerId, data),
    
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['customer', customerId] })
//       queryClient.invalidateQueries({ queryKey: ['customers'] })
//       toast.success(MESSAGES.CUSTOMER.CUSTOMER_BLACKLISTED)
//     },
    
//     onError: (error: Error) => {
//       toast.error(error.message || MESSAGES.GENERAL.SOMETHING_WENT_WRONG)
//     },
//   })
// }
