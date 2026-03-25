// FILE: src/features/product/hooks/index.ts
// Barrel export — saare hooks ek jagah se import karo

export { useProductsList }      from './useProductsList'
export { useProductById }       from './useProductById'
export { useProductSearch }     from './useProductSearch'
export { useProductActions }    from './useProductActions'
export { useProductStock }      from '../product/useProductStock'
export { useProductReservation } from '../product/useProductReservation'
export { useProductPricing }    from '../product/useProductPricing'
export {
  useProductAnalytics,
  useLowStock,
  useProductHistory,
}                               from './useProductAnalytics'