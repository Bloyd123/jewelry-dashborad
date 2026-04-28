// FILE: src/components/bugReport/BugReportButton/BugReportButton.tsx

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Bug } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/overlay/Modal/Modal'
import { BugReportForm } from '../BugReportForm/BugReportForm'
import { useNotification } from '@/hooks/useNotification'

export interface BugReportButtonProps {
  variant?: 'floating' | 'inline'
  prefillModuleName?: string
}

export const BugReportButton = ({
  variant = 'floating',
  prefillModuleName,
}: BugReportButtonProps) => {
  const { t } = useTranslation()
  const { showSuccess } = useNotification()
  const [open, setOpen] = useState(false)

  const handleSuccess = (ticketNumber?: string) => {
    setOpen(false)
    if (ticketNumber) {
      showSuccess(
        t('bugReport.successTitle'),
        `${t('bugReport.ticket')}: ${ticketNumber}`
      )
    }
  }

  if (variant === 'floating') {
    return (
      <>
        {/* Floating Button */}
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-status-error shadow-lg transition-all hover:scale-110 hover:shadow-xl"
          aria-label={t('bugReport.reportBug')}
          title={t('bugReport.reportBug')}
        >
          <Bug className="h-5 w-5 text-white" />
        </button>

        <Modal
          open={open}
          onOpenChange={setOpen}
          size="xl"
          closeOnOutsideClick={false}
          testId="bug-report-modal"
        >
          <div className="p-6">
            <BugReportForm
              onSuccess={handleSuccess}
              onCancel={() => setOpen(false)}
              prefillPageUrl={window.location.href}
              prefillModuleName={prefillModuleName}
            />
          </div>
        </Modal>
      </>
    )
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2 text-status-error hover:border-status-error/30 hover:bg-status-error/10"
      >
        <Bug className="h-4 w-4" />
        {t('bugReport.reportBug')}
      </Button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        size="xl"
        closeOnOutsideClick={false}
        testId="bug-report-modal"
      >
        <div className="p-6">
          <BugReportForm
            onSuccess={handleSuccess}
            onCancel={() => setOpen(false)}
            prefillPageUrl={window.location.href}
            prefillModuleName={prefillModuleName}
          />
        </div>
      </Modal>
    </>
  )
}