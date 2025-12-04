// ============================================================================
// FILE: componens/dashboard/components/QuickActions.tsx
// Quick Action Buttons
// ============================================================================

import { Plus, Upload, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const QuickActions = () => {
  const navigate = useNavigate()

  const actions = [
    {
      label: 'Add Sale',
      icon: <Plus size={18} />,
      onClick: () => navigate('/sales/add'),
      color: 'bg-accent hover:bg-accent/90',
    },
    {
      label: 'Add Purchase',
      icon: <Upload size={18} />,
      onClick: () => navigate('/purchases/add'),
      color: 'bg-status-info hover:bg-status-info/90',
    },
    {
      label: 'Add Product',
      icon: <Plus size={18} />,
      onClick: () => navigate('/products/add'),
      color: 'bg-status-success hover:bg-status-success/90',
    },
    {
      label: 'Generate Report',
      icon: <FileText size={18} />,
      onClick: () => navigate('/reports'),
      color: 'bg-status-warning hover:bg-status-warning/90',
    },
  ]

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
      
      <div className="space-y-2">
        {actions.map(action => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white transition-colors ${action.color}`}
          >
            {action.icon}
            <span className="font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}