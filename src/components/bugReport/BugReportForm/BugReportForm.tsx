// FILE: src/components/bugReport/BugReportForm/BugReportForm.tsx

import { useMediaQuery } from '@/hooks/useMediaQuery'
import { BugReportFormDesktop } from './BugReportForm.desktop'
import { BugReportFormMobile } from './BugReportForm.mobile'

export interface BugReportFormProps {
  onSuccess?: (ticketNumber?: string) => void
  onCancel?: () => void
  prefillPageUrl?: string
  prefillModuleName?: string
}

export const BugReportForm = (props: BugReportFormProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  return isDesktop ? (
    <BugReportFormDesktop {...props} />
  ) : (
    <BugReportFormMobile {...props} />
  )
}