// FILE: src/services/auth/tokenService.ts
// Token management service for JWT tokens

import { api } from '@/api/axios'
import { API_ENDPOINTS } from '@/api/endpoints'
import type { ApiResponse } from '@/types'

import * as storage from '../storage/localStorageService'

// CONSTANTS

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const

// TOKEN SAVE/GET/REMOVE

/**
 * Save access token to localStorage
 */
export const saveAccessToken = (token: string): boolean => {
  return storage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token)
}

/**
 * Save refresh token to localStorage
 */
export const saveRefreshToken = (token: string): boolean => {
  return storage.setItem(TOKEN_KEYS.REFRESH_TOKEN, token)
}

/**
 * Save both tokens at once
 */
export const saveTokens = (
  accessToken: string,
  refreshToken: string
): boolean => {
  const accessSaved = saveAccessToken(accessToken)
  const refreshSaved = saveRefreshToken(refreshToken)
  return accessSaved && refreshSaved
}

/**
 * Get access token from localStorage
 */
export const getAccessToken = (): string | null => {
  return storage.getItem<string>(TOKEN_KEYS.ACCESS_TOKEN)
}

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  return storage.getItem<string>(TOKEN_KEYS.REFRESH_TOKEN)
}
export const clearTokens = (): void => {
  removeAccessToken()
  removeRefreshToken()
}
/**
 * Remove access token from localStorage
 */
export const removeAccessToken = (): boolean => {
  return storage.removeItem(TOKEN_KEYS.ACCESS_TOKEN)
}

/**
 * Remove refresh token from localStorage
 */
export const removeRefreshToken = (): boolean => {
  return storage.removeItem(TOKEN_KEYS.REFRESH_TOKEN)
}

/**
 * Remove both tokens
 */
export const removeTokens = (): boolean => {
  const accessRemoved = removeAccessToken()
  const refreshRemoved = removeRefreshToken()
  return accessRemoved && refreshRemoved
}

// TOKEN VALIDATION

/**
 * Decode JWT token (without verification)
 */
export const decodeToken = (token: string): any | null => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token)
    if (!decoded || !decoded.exp) {
      return true
    }

    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  } catch (error) {
    console.error('Error checking token expiration:', error)
    return true
  }
}

/**
 * Check if access token is valid (exists and not expired)
 */
export const isAccessTokenValid = (): boolean => {
  const token = getAccessToken()
  if (!token) return false
  return !isTokenExpired(token)
}

/**
 * Check if refresh token is valid (exists and not expired)
 */
export const isRefreshTokenValid = (): boolean => {
  const token = getRefreshToken()
  if (!token) return false
  return !isTokenExpired(token)
}

/**
 * Get token expiration time
 */
export const getTokenExpiration = (token: string): Date | null => {
  try {
    const decoded = decodeToken(token)
    if (!decoded || !decoded.exp) {
      return null
    }
    return new Date(decoded.exp * 1000)
  } catch (error) {
    console.error('Error getting token expiration:', error)
    return null
  }
}

/**
 * Get time until token expires (in seconds)
 */
export const getTimeUntilExpiration = (token: string): number => {
  try {
    const decoded = decodeToken(token)
    if (!decoded || !decoded.exp) {
      return 0
    }

    const currentTime = Date.now() / 1000
    const timeLeft = decoded.exp - currentTime
    return timeLeft > 0 ? timeLeft : 0
  } catch (error) {
    console.error('Error getting time until expiration:', error)
    return 0
  }
}

// TOKEN REFRESH

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getRefreshToken()

    if (!refreshToken) {
      console.error('No refresh token available')
      return null
    }

    if (isTokenExpired(refreshToken)) {
      console.error('Refresh token is expired')
      removeTokens()
      return null
    }

    const response = await api.post<ApiResponse>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      { refreshToken }
    )

    const { accessToken, refreshToken: newRefreshToken } = response.data.data

    saveAccessToken(accessToken)
    if (newRefreshToken) {
      saveRefreshToken(newRefreshToken)
    }

    return accessToken
  } catch (error) {
    console.error('Error refreshing access token:', error)
    removeTokens()
    return null
  }
}

/**
 * Auto refresh token if it's about to expire
 */
export const autoRefreshToken = async (
  thresholdSeconds: number = 300
): Promise<boolean> => {
  try {
    const token = getAccessToken()

    if (!token) {
      return false
    }

    const timeLeft = getTimeUntilExpiration(token)

    if (timeLeft < thresholdSeconds && timeLeft > 0) {
      const newToken = await refreshAccessToken()
      return newToken !== null
    }

    return true
  } catch (error) {
    console.error('Error in auto refresh:', error)
    return false
  }
}

// TOKEN INFO

/**
 * Get user ID from access token
 */
export const getUserIdFromToken = (): string | null => {
  const token = getAccessToken()
  if (!token) return null

  const decoded = decodeToken(token)
  return decoded?.userId || decoded?.id || null
}

/**
 * Get user role from access token
 */
export const getUserRoleFromToken = (): string | null => {
  const token = getAccessToken()
  if (!token) return null

  const decoded = decodeToken(token)
  return decoded?.role || null
}

/**
 * Get token payload
 */
export const getTokenPayload = (): any | null => {
  const token = getAccessToken()
  if (!token) return null

  return decodeToken(token)
}

// DEFAULT EXPORT

export default {
  saveAccessToken,
  saveRefreshToken,
  saveTokens,
  getAccessToken,
  clearTokens,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  removeTokens,
  decodeToken,
  isTokenExpired,
  isAccessTokenValid,
  isRefreshTokenValid,
  getTokenExpiration,
  getTimeUntilExpiration,
  refreshAccessToken,
  autoRefreshToken,
  getUserIdFromToken,
  getUserRoleFromToken,
  getTokenPayload,
}
