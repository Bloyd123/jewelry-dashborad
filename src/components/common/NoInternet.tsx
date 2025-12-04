// ============================================================================
// FILE: components/common/NoInternet.tsx
// No Internet Connection Screen
// ============================================================================

import { WifiOff, RotateCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'  // ✅ ADD

    
    interface NoInternetProps {
        checkInternetConnection: () => void
}

export const NoInternet = ({ checkInternetConnection }: NoInternetProps) => {
    const { t } = useTranslation()  // ✅ ADD
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-bg-primary">
      <div className="flex flex-col items-center space-y-4 max-w-md px-4">
        {/* Icon */}
        <div className="w-48 h-48 rounded-full bg-accent/10 flex items-center justify-center">
          <WifiOff size={80} className="text-accent" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-text-primary mt-6">
          {t('noInternet.title')}
        </h2>

        {/* Description */}
        <p className="text-center px-4 text-base text-text-secondary">
           {t('noInternet.description')}
        </p>

        {/* Retry Button */}
        <button
          onClick={checkInternetConnection}
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-semibold py-3 px-6 rounded-lg mt-6 transition-colors duration-200"
        >
          <RotateCw size={18} />
          {t('noInternet.retryButton')} 
        </button>
      </div>
    </div>
  )
}