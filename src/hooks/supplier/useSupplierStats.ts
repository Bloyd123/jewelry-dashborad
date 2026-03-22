// FILE: src/features/supplier/hooks/useSupplierStats.ts
import {
  useGetSupplierStatsQuery,
  useGetTopSuppliersQuery,
} from '@/store/api/supplierApi'
export const useSupplierStats = (shopId: string, topSuppliersLimit = 10) => {
  const {
    data: statsData,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useGetSupplierStatsQuery({ shopId })

  const { data: topSuppliers, isLoading: isLoadingTopSuppliers } =
    useGetTopSuppliersQuery({ shopId, limit: topSuppliersLimit })

  return {
    stats: statsData,
    topSuppliers: topSuppliers || [],
    isLoadingStats,
    isLoadingTopSuppliers,
    refetchStats,
  }
}
