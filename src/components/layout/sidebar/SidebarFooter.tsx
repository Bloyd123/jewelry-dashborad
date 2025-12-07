// ============================================================================
// FILE: layout/sidebar/SidebarFooter.tsx
// Sidebar Footer - User Info, Settings, Logout
// ============================================================================

import { Settings, LogOut, User } from 'lucide-react'
import { useSidebar } from '@/hooks/useSidebar'
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'

import { useErrorHandler } from '@/hooks/useErrorHandler'
import { useNotification } from '@/hooks/useNotification'
import { Spinner } from '@/components/ui/loader'

export const SidebarFooter = () => {
  const { isCollapsed } = useSidebar()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { handleError } = useErrorHandler()
  const { showSuccess } = useNotification()
  const [loading, setLoading] = useState(false)
  const handleLogout = useCallback(async () => {
    setLoading(true)

    try {
      await logout()
      showSuccess(t('auth.logout.success'), t('auth.logout.title'))

      navigate('/login')
    } catch (error: any) {
      handleError(error)
      showSuccess(t('auth.logout.sessionCleared'), t('auth.logout.title'))

      navigate('/login')
    } finally {
      setLoading(false)
    }
  }, [logout, navigate, handleError, showSuccess, t])

  return (
    <div className="mt-auto border-t border-sidebar-border p-4">
      {!isCollapsed ? (
        <div className="space-y-2">
          {/* User Info */}
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white">
              <User size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-text">
                John Doe
              </p>
              <p className="truncate text-xs text-sidebar-muted">
                john@example.com
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-text transition-colors hover:bg-sidebar-hover">
              <Settings size={16} />
              <span>Settings</span>
            </button>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-text transition-colors hover:bg-sidebar-hover"
            >
              {loading ? (
                <>
                  <Spinner size="xs" className="text-sidebar-text" />
                  <span>{t('common.loading')}</span>
                </>
              ) : (
                <>
                  <LogOut size={18} />
                  <span className="text-sm">{t('auth.logout.button')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        // Collapsed state
        <div className="flex flex-col gap-2">
          <button className="rounded-md p-2 text-sidebar-text transition-colors hover:bg-sidebar-hover">
            <User size={20} />
          </button>
          <button className="rounded-md p-2 text-sidebar-text transition-colors hover:bg-sidebar-hover">
            <Settings size={20} />
          </button>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="rounded-md p-2 text-sidebar-text transition-colors hover:bg-sidebar-hover"
            title={t('auth.logout.button')}
          >
            {loading ? (
              <Spinner size="sm" className="text-sidebar-text" />
            ) : (
              <LogOut size={20} />
            )}
          </button>
        </div>
      )}
    </div>
  )
}
