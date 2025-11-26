// ============================================================================
// FILE: src/services/auth/tokenService.ts
// Token management service for JWT tokens
// ============================================================================

import { setItem, getItem, removeItem } from '../storage/localStorageService';
import { api } from '@/api/axios';
import { API_ENDPOINTS } from '@/api/endpoints';
import type { ApiResponse } from '@/types';

// ============================================================================
// STORAGE KEYS
// ============================================================================

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

// ============================================================================
// TOKEN SAVE/GET/REMOVE
// ============================================================================

/**
 * Save access token to localStorage
 * @param token - JWT access token
 * @returns true if successful
 */
export const saveAccessToken = (token: string): boolean => {
  return setItem(TOKEN_KEYS.ACCESS_TOKEN, token);
};

/**
 * Save refresh token to localStorage
 * @param token - JWT refresh token
 * @returns true if successful
 */
export const saveRefreshToken = (token: string): boolean => {
  return setItem(TOKEN_KEYS.REFRESH_TOKEN, token);
};

/**
 * Save both tokens at once
 * @param accessToken - JWT access token
 * @param refreshToken - JWT refresh token
 * @returns true if both saved successfully
 */
export const saveTokens = (accessToken: string, refreshToken: string): boolean => {
  const accessSaved = saveAccessToken(accessToken);
  const refreshSaved = saveRefreshToken(refreshToken);
  return accessSaved && refreshSaved;
};

/**
 * Get access token from localStorage
 * @returns Access token or null
 */
export const getAccessToken = (): string | null => {
  return getItem<string>(TOKEN_KEYS.ACCESS_TOKEN);
};

/**
 * Get refresh token from localStorage
 * @returns Refresh token or null
 */
export const getRefreshToken = (): string | null => {
  return getItem<string>(TOKEN_KEYS.REFRESH_TOKEN);
};

/**
 * Remove access token from localStorage
 * @returns true if successful
 */
export const removeAccessToken = (): boolean => {
  return removeItem(TOKEN_KEYS.ACCESS_TOKEN);
};

/**
 * Remove refresh token from localStorage
 * @returns true if successful
 */
export const removeRefreshToken = (): boolean => {
  return removeItem(TOKEN_KEYS.REFRESH_TOKEN);
};

/**
 * Remove both tokens
 * @returns true if both removed successfully
 */
export const removeTokens = (): boolean => {
  const accessRemoved = removeAccessToken();
  const refreshRemoved = removeRefreshToken();
  return accessRemoved && refreshRemoved;
};

// ============================================================================
// TOKEN VALIDATION
// ============================================================================

/**
 * Decode JWT token (without verification)
 * @param token - JWT token
 * @returns Decoded payload or null
 */
export const decodeToken = (token: string): any | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 * @param token - JWT token
 * @returns true if expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    
    // exp is in seconds, Date.now() is in milliseconds
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Check if access token is valid (exists and not expired)
 * @returns true if valid
 */
export const isAccessTokenValid = (): boolean => {
  const token = getAccessToken();
  if (!token) return false;
  return !isTokenExpired(token);
};

/**
 * Check if refresh token is valid (exists and not expired)
 * @returns true if valid
 */
export const isRefreshTokenValid = (): boolean => {
  const token = getRefreshToken();
  if (!token) return false;
  return !isTokenExpired(token);
};

/**
 * Get token expiration time
 * @param token - JWT token
 * @returns Expiration date or null
 */
export const getTokenExpiration = (token: string): Date | null => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      return null;
    }
    return new Date(decoded.exp * 1000);
  } catch (error) {
    console.error('Error getting token expiration:', error);
    return null;
  }
};

/**
 * Get time until token expires (in seconds)
 * @param token - JWT token
 * @returns Seconds until expiration, or 0 if expired
 */
export const getTimeUntilExpiration = (token: string): number => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      return 0;
    }
    
    const currentTime = Date.now() / 1000;
    const timeLeft = decoded.exp - currentTime;
    return timeLeft > 0 ? timeLeft : 0;
  } catch (error) {
    console.error('Error getting time until expiration:', error);
    return 0;
  }
};

// ============================================================================
// TOKEN REFRESH
// ============================================================================

/**
 * Refresh access token using refresh token
 * @returns New access token or null if failed
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
      console.error('No refresh token available');
      return null;
    }
    
    if (isTokenExpired(refreshToken)) {
      console.error('Refresh token is expired');
      removeTokens();
      return null;
    }
    
    // Call refresh token API
    const response = await api.post<ApiResponse>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      { refreshToken }
    );
    
    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    
    // Save new tokens
    saveAccessToken(accessToken);
    if (newRefreshToken) {
      saveRefreshToken(newRefreshToken);
    }
    
    return accessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    removeTokens();
    return null;
  }
};

/**
 * Auto refresh token if it's about to expire
 * @param thresholdSeconds - Refresh if token expires within this many seconds (default: 5 minutes)
 * @returns true if refreshed successfully or no refresh needed
 */
export const autoRefreshToken = async (thresholdSeconds: number = 300): Promise<boolean> => {
  try {
    const token = getAccessToken();
    
    if (!token) {
      return false;
    }
    
    const timeLeft = getTimeUntilExpiration(token);
    
    // If token expires within threshold, refresh it
    if (timeLeft < thresholdSeconds && timeLeft > 0) {
      const newToken = await refreshAccessToken();
      return newToken !== null;
    }
    
    // Token is still valid for more than threshold
    return true;
  } catch (error) {
    console.error('Error in auto refresh:', error);
    return false;
  }
};

// ============================================================================
// TOKEN INFO
// ============================================================================

/**
 * Get user ID from access token
 * @returns User ID or null
 */
export const getUserIdFromToken = (): string | null => {
  const token = getAccessToken();
  if (!token) return null;
  
  const decoded = decodeToken(token);
  return decoded?.userId || decoded?.id || null;
};

/**
 * Get user role from access token
 * @returns User role or null
 */
export const getUserRoleFromToken = (): string | null => {
  const token = getAccessToken();
  if (!token) return null;
  
  const decoded = decodeToken(token);
  return decoded?.role || null;
};

/**
 * Get token payload
 * @returns Token payload or null
 */
export const getTokenPayload = (): any | null => {
  const token = getAccessToken();
  if (!token) return null;
  
  return decodeToken(token);
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  // Save/Get/Remove
  saveAccessToken,
  saveRefreshToken,
  saveTokens,
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  removeTokens,
  
  // Validation
  decodeToken,
  isTokenExpired,
  isAccessTokenValid,
  isRefreshTokenValid,
  getTokenExpiration,
  getTimeUntilExpiration,
  
  // Refresh
  refreshAccessToken,
  autoRefreshToken,
  
  // Info
  getUserIdFromToken,
  getUserRoleFromToken,
  getTokenPayload,
};