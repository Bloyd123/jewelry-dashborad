// FILE: src/hooks/user/useUsersList.ts

import { useState } from 'react'
import { useGetAllUsersQuery } from '@/store/api/userApi'
import type { GetUsersInput } from '@/store/api/userApi'
import type { UserRole, Department } from '@/types/user.types'

export interface UserFilterValues {
  search: string
  role?: UserRole
  department?: Department
  isActive?: boolean
}

export const useUsersList = (filters?: Partial<UserFilterValues>) => {
  const [page, setPage] = useState(1)
  const limit = 10

  const queryParams: GetUsersInput = {
    page,
    limit,
    search: filters?.search || undefined,
    role: filters?.role,
    department: filters?.department,
    isActive: filters?.isActive,
  }

  const { data, isLoading, error, refetch, isFetching } =
    useGetAllUsersQuery(queryParams)

  const users = data?.data?.users || []
  const total = data?.data?.total || 0
  const totalPages = Math.ceil(total / limit)

  return {
    users,
    total,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    isLoading: isLoading || isFetching,
    error,
    refetch,
    setPage,
  }
}