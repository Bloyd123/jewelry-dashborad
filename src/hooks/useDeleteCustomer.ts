// // ============================================================================
// // FILE: src/hooks/customer/useDeleteCustomer.ts
// // Delete Customer Mutation Hook
// // ============================================================================

// import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { useNavigate } from 'react-router-dom'
// import { toast } from 'sonner'
// import { customerService } from '@/api/services/customerService'
// import { MESSAGES } from '@/constants/messages'
// import type { ID } from '@/types'

// interface UseDeleteCustomerOptions {
//   onSuccess?: () => void
//   onError?: (error: Error) => void
//   redirectOnSuccess?: boolean
// }

// export const useDeleteCustomer = (options?: UseDeleteCustomerOptions) => {
//   const queryClient = useQueryClient()
//   const navigate = useNavigate()

//   return useMutation({
//     mutationFn: (customerId: ID) => 
//       customerService.deleteCustomer(customerId),
    
//     onSuccess: () => {
//       // Invalidate queries
//       queryClient.invalidateQueries({ queryKey: ['customers'] })
//       queryClient.invalidateQueries({ queryKey: ['customer-statistics'] })
      
//       // Show success message
//       toast.success(MESSAGES.CUSTOMER.CUSTOMER_DELETED)
      
//       // Redirect if needed
//       if (options?.redirectOnSuccess) {
//         navigate('/customers')
//       }
      
//       // Call custom success handler
//       options?.onSuccess?.()
//     },
    
//     onError: (error: Error) => {
//       toast.error(error.message || MESSAGES.GENERAL.SOMETHING_WENT_WRONG)
//       options?.onError?.(error)
//     },
//   })
// }
