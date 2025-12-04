// ============================================================================
// FILE: config/app.config.ts
// Application Configuration
// ============================================================================

export const APP_CONFIG = {
  NAME: 'Karat Log',
  VERSION: '1.0.0',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  
  DEFAULT_LANGUAGE: 'en',
  SUPPORTED_LANGUAGES: ['en', 'hi', 'mr'],
  
  FEATURES: {
    ENABLE_BETA_FEATURES: false,
    SHOW_TUTORIAL: true,
    ENABLE_DARK_MODE: true,
    ENABLE_NOTIFICATIONS: true,
  },
  
  DEFAULT_PAGINATION: {
    PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
  
  AUTH: {
    TOKEN_KEY: 'auth_token',
    SESSION_TIMEOUT: 3600000, // 1 hour
  },
    API: {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
    TIMEOUT: 30000,
    },
  CURRENCY: {
    CODE: 'INR',
    SYMBOL: '₹',
  },
} as const

export type AppConfig = typeof APP_CONFIG