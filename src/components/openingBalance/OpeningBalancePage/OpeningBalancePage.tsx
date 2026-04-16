// FILE: src/components/openingBalance/OpeningBalancePage/OpeningBalancePage.tsx

import { useSelector } from 'react-redux'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { selectCurrentShopId } from '@/store/slices/authSlice'
import DesktopOpeningBalancePage from './OpeningBalancePage.desktop'
import MobileOpeningBalancePage from './OpeningBalancePage.mobile'

export const OpeningBalancePage = () => {
  const shopId = useSelector(selectCurrentShopId)!
  const isMobile = useMediaQuery('(max-width: 1024px)')

  return isMobile
    ? <MobileOpeningBalancePage shopId={shopId} />
    : <DesktopOpeningBalancePage shopId={shopId} />
}

export default OpeningBalancePage