// ============================================================================
// FILE: src/features/customer/components/CustomerTable/index.ts
// CustomerTable Barrel Export
// ============================================================================

export { CustomerTable } from './CustomerTable'
export type { CustomerTableProps } from './CustomerTable'

export {
  getCustomerTableColumns,
  getCompactCustomerTableColumns,
} from './CustomerTableColumns'

export {
  getCustomerRowActions,
  getSimpleCustomerRowActions,
  copyCustomerDetails,
  openPhoneDialer,
  openEmailClient,
  openWhatsApp,
} from './CustomerTableActions'

export type {
  CustomerActionHandlers,
  CustomerPermissions,
} from './CustomerTableActions'

export default CustomerTable