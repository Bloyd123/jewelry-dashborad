// FILE: src/store/api/userApi.ts

import { baseApi } from './baseApi'
import { USER_ENDPOINTS } from '@/api/endpoints'
import { replacePathParams } from '@/utils/api'
import type {
  User,
  UserRole,
  Department,
} from '@/types/user.types'

// ── Request Types ──────────────────────────────────────────
export interface GetUsersInput {
  page?: number
  limit?: number
  search?: string
  role?: UserRole
  department?: Department
  isActive?: boolean
}

export interface UpdateUserInput {
  userId: string
  firstName?: string
  lastName?: string
  phone?: string
  designation?: string
  department?: Department
  employeeId?: string
  joiningDate?: string
  salesTarget?: number
  commissionRate?: number
  role?: UserRole
  primaryShop?: string
  profileImage?: string
  preferences?: Partial<User['preferences']>
}

export interface AdminResetPasswordInput {
  userId: string
  newPassword: string
}

// ── Response Types ─────────────────────────────────────────
export interface UserListResponse {
  success: boolean
  message: string
  data: {
    users: User[]
    total: number
  }
}

export interface UserResponse {
  success: boolean
  message: string
  data: { user: User }
}

// ── API Slice ──────────────────────────────────────────────
export const userManagementApi = baseApi.injectEndpoints({
  endpoints: build => ({

    // ── GET ALL USERS ──────────────────────────────────────
    getAllUsers: build.query<UserListResponse, GetUsersInput>({
      query: (params) => ({
        url: USER_ENDPOINTS.GET_ALL,
        params,
      }),
      providesTags: (result) => [
        { type: 'UserList' as const },
        ...(result?.data?.users || []).map(u => ({
          type: 'User' as const,
          id: u._id,
        })),
      ],
    }),

    // ── GET USER BY ID ─────────────────────────────────────
    getUserById: build.query<User, string>({
      query: (userId) => ({
        url: replacePathParams(USER_ENDPOINTS.GET_BY_ID, { userId }),
      }),
      transformResponse: (response: UserResponse) => response.data.user,
      providesTags: (result, error, userId) => [{ type: 'User' as const, id: userId }],
    }),
getUserActivityLogs: build.query<any, { userId: string; action?: string; dateRange?: string }>({
  query: ({ userId, action, dateRange }) => ({
    url: replacePathParams(USER_ENDPOINTS.ACTIVITY_LOGS, { userId }),
    params: { action, dateRange },
  }),
  providesTags: ['UserActivity'],
}),

    // ── UPDATE USER ────────────────────────────────────────
    updateUser: build.mutation<User, UpdateUserInput>({
      query: ({ userId, ...data }) => ({
        url: replacePathParams(USER_ENDPOINTS.UPDATE, { userId }),
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: UserResponse) => response.data.user,
      invalidatesTags: (result, error, { userId }) => [
        { type: 'User' as const, id: userId },
        { type: 'UserList' as const },
      ],
    }),

    // ── DELETE USER ────────────────────────────────────────
    deleteUser: build.mutation<void, string>({
      query: (userId) => ({
        url: replacePathParams(USER_ENDPOINTS.DELETE, { userId }),
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, userId) => [
        { type: 'User' as const, id: userId },
        { type: 'UserList' as const },
      ],
    }),

    // ── ACTIVATE USER ──────────────────────────────────────
    activateUser: build.mutation<User, string>({
      query: (userId) => ({
        url: replacePathParams(USER_ENDPOINTS.ACTIVATE, { userId }),
        method: 'PATCH',
      }),
      transformResponse: (response: UserResponse) => response.data.user,
      invalidatesTags: (result, error, userId) => [
        { type: 'User' as const, id: userId },
        { type: 'UserList' as const },
      ],
    }),

    // ── DEACTIVATE USER ────────────────────────────────────
    deactivateUser: build.mutation<User, string>({
      query: (userId) => ({
        url: replacePathParams(USER_ENDPOINTS.DEACTIVATE, { userId }),
        method: 'PATCH',
      }),
      transformResponse: (response: UserResponse) => response.data.user,
      invalidatesTags: (result, error, userId) => [
        { type: 'User' as const, id: userId },
        { type: 'UserList' as const },
      ],
    }),

    // ── ADMIN RESET PASSWORD ───────────────────────────────
    adminResetPassword: build.mutation<void, AdminResetPasswordInput>({
      query: ({ userId, newPassword }) => ({
        url: replacePathParams(USER_ENDPOINTS.RESET_PASSWORD, { userId }),
        method: 'PATCH',
        body: { newPassword },
      }),
    }),
  }),
})

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
   useGetUserActivityLogsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
  useAdminResetPasswordMutation,
} = userManagementApi