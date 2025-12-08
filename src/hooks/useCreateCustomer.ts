// // ============================================================================
// // FILE: src/hooks/customer/useCreateCustomer.ts
// // Create Customer Mutation Hook
// // ============================================================================

// import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { useNavigate } from 'react-router-dom'
// import { toast } from 'sonner'
// import { customerService } from '@/api/services/customerService'
// import { MESSAGES } from '@/constants/messages'
// import type { CreateCustomerRequest, Customer } from '@/types'

// interface UseCreateCustomerOptions {
//   onSuccess?: (customer: Customer) => void
//   onError?: (error: Error) => void
//   redirectOnSuccess?: boolean
// }

// export const useCreateCustomer = (options?: UseCreateCustomerOptions) => {
//   const queryClient = useQueryClient()
//   const navigate = useNavigate()

//   return useMutation({
//     mutationFn: (data: CreateCustomerRequest) => 
//       customerService.createCustomer(data),
    
//     onSuccess: (customer) => {
//       // Invalidate customer queries
//       queryClient.invalidateQueries({ queryKey: ['customers'] })
//       queryClient.invalidateQueries({ queryKey: ['customer-statistics'] })
      
//       // Show success message
//       toast.success(MESSAGES.CUSTOMER.CUSTOMER_CREATED)
      
//       // Redirect if needed
//       if (options?.redirectOnSuccess) {
//         navigate(`/customers/${customer._id}`)
//       }
      
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