// FILE: components/dashboard/components/QuickActions.tsx

import { Plus, Upload, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTE_PATHS } from '@/constants/routePaths'

export const QuickActions = () => {
  const { t }    = useTranslation()
  const navigate = useNavigate()

  const actions = [
    {
      label:   t('dashboard.quickActions.addSale'),
      icon:    <Plus size={18} />,
      onClick: () => navigate(ROUTE_PATHS.SALES.ADD),
      color:   'bg-accent hover:bg-accent/90',
    },
    {
      label:   t('dashboard.quickActions.addPurchase'),
      icon:    <Upload size={18} />,
      onClick: () => navigate(ROUTE_PATHS.PURCHASES.ADD),
      color:   'bg-status-info hover:bg-status-info/90',
    },
    {
      label:   t('dashboard.quickActions.addProduct'),
      icon:    <Plus size={18} />,
      onClick: () => navigate(ROUTE_PATHS.PRODUCTS.ADD),
      color:   'bg-status-success hover:bg-status-success/90',
    },
    {
      label:   t('dashboard.quickActions.generateReport'),
      icon:    <FileText size={18} />,
      onClick: () => navigate(ROUTE_PATHS.SALES.LIST),
      color:   'bg-status-warning hover:bg-status-warning/90',
    },
  ]

  return (
    <div className="card">
      <h3 className="mb-4 text-lg font-semibold text-text-primary">
        {t('dashboard.quickActions.title')}
      </h3>

      <div className="space-y-2">
        {actions.map(action => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-white transition-colors ${action.color}`}
          >
            {action.icon}
            <span className="font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}