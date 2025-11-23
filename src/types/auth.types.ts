export enum UserRole {
  SHOP_ADMIN = 'shop_admin',
  MANAGER = 'manager',
  SALESPERSON = 'salesperson',
  ACCOUNTANT = 'accountant',
  VIEWER = 'viewer',
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  shopId: string
  avatar?: string
  permissions: string[]
  createdAt: Date
  updatedAt: Date
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  name: string
  email: string
  password: string
  shopName: string
}