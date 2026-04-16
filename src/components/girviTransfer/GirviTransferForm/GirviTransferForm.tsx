// FILE: src/components/girviTransfer/GirviTransferForm/GirviTransferForm.tsx

import { useMediaQuery }             from '@/hooks/useMediaQuery'
import GirviTransferFormDesktop      from './GirviTransferForm.desktop'
import GirviTransferFormMobile       from './GirviTransferForm.mobile'
import type { GirviTransferFormProps } from './GirviTransferForm.types'

export const GirviTransferForm = (props: GirviTransferFormProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  return isDesktop
    ? <GirviTransferFormDesktop {...props} />
    : <GirviTransferFormMobile  {...props} />
}