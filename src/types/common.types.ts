export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
  statusCode: number
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type Status = 'active' | 'inactive' | 'pending' | 'deleted'

export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
  status: Status
}