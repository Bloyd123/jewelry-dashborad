// ============================================================================
// FILE: src/components/shops/ShopSettings/sections/BusinessHoursSection.tsx
// (Only showing the changed parts)
// ============================================================================

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Clock, Plus, X, Copy } from 'lucide-react'
import { FormInput } from '@/components/forms/FormInput'
import { FormDatePicker } from '@/components/forms/FormDatePicker'
import { SectionDivider } from '@/components/ui/layout/Separator'
import { Button } from '@/components/ui/button'
import type { BusinessHours } from '../shopSettings.types'

interface BusinessHoursSectionProps {
  data: BusinessHours
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
}

export const BusinessHoursSection: React.FC<BusinessHoursSectionProps> = ({
  data,
  onChange,
  errors,
}) => {
  const { t } = useTranslation()

  const days: Array<keyof Omit<BusinessHours, 'holidays'>> = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ]

  const handleDayChange = (
    day: keyof Omit<BusinessHours, 'holidays'>,
    field: 'open' | 'close',
    value: string
  ) => {
    const currentDay = data[day]
    
    // Ensure currentDay exists
    if (!currentDay) {
      onChange(day, {
        open: field === 'open' ? value : '10:00',
        close: field === 'close' ? value : '21:00',
      })
      return
    }

    onChange(day, {
      ...currentDay,
      [field]: value,
    })
  }

  const handleDayClosedChange = (
    day: keyof Omit<BusinessHours, 'holidays'>,
    closed: boolean
  ) => {
    const currentDay = data[day]
    
    if (!currentDay) {
      onChange(day, {
        open: '10:00',
        close: '21:00',
      })
      return
    }

    // For shop.types.ts TimeSlot format (no 'closed' field)
    // We just keep open/close times
    onChange(day, {
      open: currentDay.open,
      close: currentDay.close,
    })
  }

  const handleCopyToAllDays = () => {
    const mondayHours = data.monday

    if (!mondayHours) return

    days.forEach(day => {
      if (day !== 'monday') {
        onChange(day, { ...mondayHours })
      }
    })
  }

  const handleAddHoliday = () => {
    const newHoliday = {
      date: new Date().toISOString(),
      occasion: '',
    }

    onChange('holidays', [...(data.holidays || []), newHoliday])
  }

  const handleRemoveHoliday = (index: number) => {
    const updatedHolidays = (data.holidays || []).filter((_, i) => i !== index)
    onChange('holidays', updatedHolidays)
  }

  const handleHolidayChange = (
    index: number,
    field: 'date' | 'occasion',
    value: string
  ) => {
    const updatedHolidays = [...(data.holidays || [])]
    updatedHolidays[index] = {
      ...updatedHolidays[index],
      [field]: value,
    }
    onChange('holidays', updatedHolidays)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">
        {t('shops.settings.businessHours.title')}
      </h2>

      {/* Day-wise Schedule */}
      <div className="space-y-4">
        <SectionDivider
          title={t('shops.settings.businessHours.dayWiseSchedule')}
          icon={<Clock className="h-5 w-5" />}
          color="accent"
        />

        {/* Copy to All Days Button */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyToAllDays}
            className="gap-2"
          >
            <Copy className="h-4 w-4" />
            {t('shops.settings.businessHours.copyMondayToAll')}
          </Button>
        </div>

        {/* Days Table */}
        <div className="overflow-hidden rounded-lg border border-border-primary">
          <table className="w-full">
            <thead className="bg-bg-tertiary">
              <tr>
                <th className="border-b border-border-primary px-4 py-3 text-left text-sm font-semibold text-text-primary">
                  {t('shops.settings.businessHours.day')}
                </th>
                <th className="border-b border-border-primary px-4 py-3 text-left text-sm font-semibold text-text-primary">
                  {t('shops.settings.businessHours.openingTime')}
                </th>
                <th className="border-b border-border-primary px-4 py-3 text-left text-sm font-semibold text-text-primary">
                  {t('shops.settings.businessHours.closingTime')}
                </th>
              </tr>
            </thead>
            <tbody>
              {days.map((day, index) => {
                const dayData = data[day] || { open: '10:00', close: '21:00' }
                
                return (
                  <tr
                    key={day}
                    className={
                      index !== days.length - 1
                        ? 'border-b border-border-primary'
                        : ''
                    }
                  >
                    <td className="px-4 py-3 text-sm font-medium capitalize text-text-primary">
                      {t(`shops.settings.businessHours.days.${day}`)}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="time"
                        value={dayData.open}
                        onChange={e =>
                          handleDayChange(day, 'open', e.target.value)
                        }
                        className="w-full rounded-md border border-border-primary bg-bg-secondary px-3 py-2 text-sm text-text-primary"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="time"
                        value={dayData.close}
                        onChange={e =>
                          handleDayChange(day, 'close', e.target.value)
                        }
                        className="w-full rounded-md border border-border-primary bg-bg-secondary px-3 py-2 text-sm text-text-primary"
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Holidays */}
      <div className="space-y-4">
        <SectionDivider
          title={t('shops.settings.businessHours.holidays')}
          color="accent"
        />

        <div className="space-y-3">
          {(data.holidays || []).map((holiday, index) => (
            <div
              key={index}
              className="flex items-end gap-3 rounded-lg border border-border-primary bg-bg-secondary p-3"
            >
              <div className="flex-1">
                <FormDatePicker
                  name={`holiday-date-${index}`}
                  label={t('shops.settings.businessHours.date')}
                  value={holiday.date}
                  onChange={(_, value) =>
                    handleHolidayChange(index, 'date', value)
                  }
                />
              </div>

              <div className="flex-1">
                <FormInput
                  name={`holiday-occasion-${index}`}
                  label={t('shops.settings.businessHours.occasion')}
                  value={holiday.occasion?? ''}
                  onChange={(_, value) =>
                    handleHolidayChange(index, 'occasion', String(value))
                  }
                  placeholder="Republic Day"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveHoliday(index)}
                className="text-status-error hover:bg-status-error/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={handleAddHoliday}
            className="w-full gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('shops.settings.businessHours.addHoliday')}
          </Button>
        </div>
      </div>
    </div>
  )
}