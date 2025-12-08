// // ============================================================================
// // FILE: src/hooks/customer/useCustomerSearch.ts
// // Search Customers Hook
// // ============================================================================

// import { useState } from 'react'
// import { useQuery } from '@tanstack/react-query'
// import { useDebounce } from '@/hooks/useDebounce'
// import { customerService } from '@/api/services/customerService'
// import type { ID, CustomerSearchResult } from '@/types'

// export const useCustomerSearch = (shopId: ID) => {
//   const [searchTerm, setSearchTerm] = useState('')
//   const debouncedSearch = useDebounce(searchTerm, 300)

//   const { data, isLoading, isFetching } = useQuery({
//     queryKey: ['customer-search', shopId, debouncedSearch],
//     queryFn: () => 
//       customerService.searchCustomers(shopId, { search: debouncedSearch }),
//     enabled: debouncedSearch.length >= 2,
//     staleTime: 1 * 60 * 1000, // 1 minute
//   })

//   return {
//     searchTerm,
//     setSearchTerm,
//     results: data?.data || [],
//     isSearching: isLoading || isFetching,
//   }
// }
