// FILE: src/pages/bugReport/BugReportPage.tsx

import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BugReportForm } from '@/components/bugReport/BugReportForm/BugReportForm'

export default function BugReportPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <BugReportForm
          onSuccess={() => navigate(-1)}
          onCancel={() => navigate(-1)}
          prefillPageUrl={window.location.href}
        />
      </div>
    </div>
  )
}