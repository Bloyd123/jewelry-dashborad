// ============================================================================
// FILE: src/components/products/ProductForm/index.ts
// ProductForm Exports
// ============================================================================

export { ProductForm } from './ProductForm'
export { default as ProductFormDesktop } from './ProductForm.desktop'
export { default as ProductFormMobile } from './ProductForm.mobile'
export type {
  ProductFormProps,
  FormSectionProps,
  StoneFormData,
  PriceBreakdown,
} from './ProductForm.types'

// Section Components
export { BasicInfoSection } from './sections/BasicInfoForm'
export { MetalWeightSection } from './sections/MetalWeightForm'
export { StonesSection } from './sections/StonesForm'
export { PricingSection } from './sections/PricingForm'
export { StockDetailsSection } from './sections/StockDetailsForm'
