// ============================================================================
// FILE: components/common/ThemePicker.tsx
// Theme Picker Component - Visual Theme Selector
// ============================================================================

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setTheme } from '@/store/slices/uiSlice'
import { themes, type ThemeName } from '@/themes/presets'
import { Check } from 'lucide-react'

interface ThemeInfo {
  name: ThemeName
  label: string
  description: string
}

const themeList: ThemeInfo[] = [
  {
    name: 'default',
    label: 'Default',
    description: 'Light theme with orange accent',
  },
  {
    name: 'defaultDark',
    label: 'Default Dark',
    description: 'Dark theme with orange accent',
  },
  {
    name: 'legacy',
    label: 'Legacy',
    description: 'Classic gold and cream theme',
  },
  { name: 'light', label: 'Light', description: 'Dark blue-gray with emerald' },
  { name: 'light2', label: 'Light 2', description: 'Warm yellow theme' },
  { name: 'light3', label: 'Light 3', description: 'Deep indigo and purple' },
  { name: 'light4', label: 'Light 4', description: 'Clean blue theme' },
  { name: 'light5', label: 'Light 5', description: 'Teal dark theme' },
]

export const ThemePicker = () => {
  const dispatch = useAppDispatch()
  const { themeName } = useAppSelector(state => state.ui)

  const handleThemeChange = (name: ThemeName) => {
    dispatch(setTheme(name))
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold text-text-primary">
          Theme Selector
        </h2>
        <p className="text-text-secondary">
          Choose your preferred theme. Changes apply instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {themeList.map(({ name, label, description }) => {
          const theme = themes[name]
          const isActive = themeName === name

          return (
            <button
              key={name}
              onClick={() => handleThemeChange(name)}
              className={`relative rounded-lg border-2 p-4 text-left transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                isActive
                  ? 'scale-105 border-accent shadow-lg'
                  : 'hover:border-accent/50 border-border-primary'
              } `}
            >
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}

              {/* Theme Preview */}
              <div className="mb-3 space-y-2">
                {/* Header Preview */}
                <div
                  className="flex h-8 items-center rounded px-3"
                  style={{ backgroundColor: theme.colors.header.primary }}
                >
                  <div
                    className="h-2 w-16 rounded"
                    style={{ backgroundColor: theme.colors.header.secondary }}
                  />
                </div>

                {/* Body Preview */}
                <div
                  className="h-20 space-y-1 rounded p-2"
                  style={{ backgroundColor: theme.colors.background.primary }}
                >
                  <div
                    className="h-full rounded p-2"
                    style={{
                      backgroundColor: theme.colors.background.secondary,
                    }}
                  >
                    <div
                      className="mb-1 h-2 w-full rounded"
                      style={{
                        backgroundColor: theme.colors.text.primary,
                        opacity: 0.8,
                      }}
                    />
                    <div
                      className="h-2 w-3/4 rounded"
                      style={{
                        backgroundColor: theme.colors.text.secondary,
                        opacity: 0.6,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Theme Info */}
              <div>
                <h3 className="mb-1 font-semibold text-text-primary">
                  {label}
                </h3>
                <p className="text-xs text-text-tertiary">{description}</p>
              </div>

              {/* Mode Badge */}
              <div className="mt-3">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    theme.mode === 'dark'
                      ? 'bg-gray-800 text-gray-200'
                      : 'bg-gray-200 text-gray-800'
                  } `}
                >
                  {theme.mode === 'dark' ? '🌙 Dark' : '☀️ Light'}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Current Theme Info */}
      <div className="mt-8 rounded-lg border border-border-primary bg-bg-secondary p-4">
        <h3 className="mb-2 font-semibold text-text-primary">Current Theme</h3>
        <div className="flex items-center gap-4 text-sm text-text-secondary">
          <span>
            <strong>Name:</strong> {themes[themeName].name}
          </span>
          <span>
            <strong>Mode:</strong> {themes[themeName].mode}
          </span>
          <span>
            <strong>Primary:</strong>
            <span
              className="ml-2 inline-block h-4 w-4 rounded border border-border-primary"
              style={{ backgroundColor: themes[themeName].colors.primary }}
            />
          </span>
          <span>
            <strong>Accent:</strong>
            <span
              className="ml-2 inline-block h-4 w-4 rounded border border-border-primary"
              style={{ backgroundColor: themes[themeName].colors.accent }}
            />
          </span>
        </div>
      </div>
    </div>
  )
}
