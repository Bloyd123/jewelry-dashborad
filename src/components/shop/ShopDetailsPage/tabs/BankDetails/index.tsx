import { BankDetailsTab } from './BankDetailsTab'
import { dummyShops } from '@/pages/shops/data'

// In your component
const shop = dummyShops[0]

;<BankDetailsTab
  bankDetails={shop.bankDetails}
  upiDetails={shop.upiDetails}
  isAdminView={true}
/>
