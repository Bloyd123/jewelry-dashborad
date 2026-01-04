//
// FILE: src/components/shops/ShopSettings/types/shopSettings.types.ts
// TypeScript interfaces for Shop Settings
//

// Import types from main shop types instead of redefining
import type {
  ShopCurrency,
  ShopLanguage,
  WeightUnit,
  BusinessHours as ShopBusinessHours,
  TimeSlot,
} from '@/types/shop.types'

export interface GeneralSettings {
  currency: ShopCurrency | string
  language: ShopLanguage | string
  timezone: string
  dateFormat: string
  defaultWeightUnit: WeightUnit | string
  priceDecimals: number
  weightDecimals: number
  enableAdvancePayment: boolean
  minimumAdvancePercentage: number
  acceptedPaymentMethods: {
    cash: boolean
    card: boolean
    upi: boolean
    netBanking: boolean
    cheque: boolean
    emi: boolean
  }
  dashboardView: string
  itemsPerPage: number
  showProductImages: boolean
  darkMode: boolean
}

export interface GSTSettings {
  enableGST: boolean
  gstRates: {
    gold: number
    silver: number
    diamond: number
    platinum: number
    makingCharges: number
    otherCharges: number
  }
  hsnCodes: {
    gold: string
    silver: string
    diamond: string
    platinum: string
    makingCharges: string
    otherCharges: string
  }
  priceDisplay: 'exclude' | 'include'
  showGSTBreakup: boolean
  showCGSTSGST: boolean
  showIGST: boolean
  showHSNOnInvoice: boolean
  invoicePrefix: string
  displayPlaceOfSupply: boolean
  displayReverseCharge: boolean
  enableEInvoice: boolean
}

// Use the type from shop.types.ts
export type BusinessHours = ShopBusinessHours

// Create a compatible DayHours type
export interface DayHours {
  open: string
  close: string
}

export interface Features {
  core: {
    inventoryManagement: boolean
    salesBilling: boolean
    customerManagement: boolean
    productCatalog: boolean
  }
  advanced: {
    reportsAnalytics: boolean
    goldSchemeManagement: boolean
    multiCurrencySupport: boolean
    onlineOrders: boolean
  }
  specialized: {
    repairJobWork: boolean
    customOrders: boolean
    giftVouchers: boolean
    loyaltyProgram: boolean
  }
}

export interface ShopSettingsFormData {
  generalSettings: GeneralSettings
  gstSettings: GSTSettings
  businessHours: BusinessHours
  features: Features
}
