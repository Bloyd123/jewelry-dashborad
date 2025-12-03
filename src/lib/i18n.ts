// ============================================================================
// FILE: lib/i18n.ts
// i18n Configuration (react-i18next)
// ============================================================================

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translations
// CORRECT — import each language properly
import { english, hindi, marathi } from '@/locales'



// ============================================================================
// RESOURCES
// ============================================================================

const resources = {
  en: {
    translation: english,
  },
  hi: {
    translation: hindi,
  },
  mr: {
    translation: marathi,
  },
}

// ============================================================================
// I18N CONFIGURATION
// ============================================================================

// Get saved language from memory (since localStorage is not available)
let savedLanguage = 'en'

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en',
    lng: savedLanguage,
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already escapes
    },

    // Language detection options
    detection: {
      order: ['navigator'],
    },

    // Namespace
    ns: ['translation'],
    defaultNS: 'translation',

    // Keys handling
    keySeparator: '.', // Use dots for nested keys
    
    // React options
    react: {
      useSuspense: true,
    },
  })

export default i18n

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Change language (store in memory)
export const changeLanguage = (lng: string) => {
  savedLanguage = lng
  i18n.changeLanguage(lng)
}

// Get current language
export const getCurrentLanguage = () => i18n.language

// Get available languages
export const getAvailableLanguages = () => Object.keys(resources)