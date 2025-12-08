// // ============================================================================
// // FILE: src/hooks/customer/useUpdateCustomer.ts
// // Update Customer Mutation Hook
// // ============================================================================

// import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { toast } from 'sonner'
// import { customerService } from '@/api/services/customerService'
// import { MESSAGES } from '@/constants/messages'
// import type { UpdateCustomerRequest, Customer, ID } from '@/types'

// interface UseUpdateCustomerOptions {
//   onSuccess?: (customer: Customer) => void
//   onError?: (error: Error) => void
// }

// export const useUpdateCustomer = (
//   customerId: ID,
//   options?: UseUpdateCustomerOptions
// ) => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (data: UpdateCustomerRequest) =>
//       customerService.updateCustomer(customerId, data),
    
//     onSuccess: (customer) => {
//       // Invalidate specific customer query
//       queryClient.invalidateQueries({ 
//         queryKey: ['customer', customerId] 
//       })
      
//       // Invalidate customer list
//       queryClient.invalidateQueries({ queryKey: ['customers'] })
      
//       // Show success message
//       toast.success(MESSAGES.CUSTOMER.CUSTOMER_UPDATED)
      
//       // Call custom success handler
//       options?.onSuccess?.(customer)
//     },
    
//     onError: (error: Error) => {
//       // Show error message
//       toast.error(error.message || MESSAGES.GENERAL.SOMETHING_WENT_WRONG)
      
//       // Call custom error handler
//       options?.onError?.(error)
//     },
//   })
// }