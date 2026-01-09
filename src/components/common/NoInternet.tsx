// FILE: components/common/NoInternet.tsx
// No Internet Connection Screen

import { WifiOff, RotateCw } from 'lucide-react'
import { useTranslation } from 'react-i18next' // ✅ ADD

interface NoInternetProps {
  checkInternetConnection: () => void
}

export const NoInternet = ({ checkInternetConnection }: NoInternetProps) => {
  const { t } = useTranslation() // ✅ ADD
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-bg-primary">
      <div className="flex max-w-md flex-col items-center space-y-4 px-4">
        {/* Icon */}
        <div className="bg-accent/10 flex h-48 w-48 items-center justify-center rounded-full">
          <WifiOff size={80} className="text-accent" />
        </div>

        {/* Title */}
        <h2 className="mt-6 text-2xl font-bold text-text-primary">
          {t('noInternet.title')}
        </h2>

        {/* Description */}
        <p className="px-4 text-center text-base text-text-secondary">
          {t('noInternet.description')}
        </p>

        {/* Retry Button */}
        <button
          onClick={checkInternetConnection}
          className="hover:bg-accent/90 mt-6 flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors duration-200"
        >
          <RotateCw size={18} />
          {t('noInternet.retryButton')}
        </button>
      </div>
    </div>
  )
}
