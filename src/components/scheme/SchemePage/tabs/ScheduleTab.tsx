// FILE: src/components/scheme/SchemePage/tabs/ScheduleTab.tsx

import React, { useState } from 'react'
import { useTranslation }  from 'react-i18next'
import { Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { Badge }   from '@/components/ui/data-display/Badge'
import { DataTable } from '@/components/ui/data-display/DataTable'
import { useSchemeEnrollments } from '@/hooks/scheme/useEnrollments'
import { useInstallmentSchedule } from '@/hooks/scheme/useEnrollmentPayments'
import type { Scheme, SchemeEnrollment, ScheduleItem } from '@/types/scheme.types'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable'

interface ScheduleTabProps {
  scheme: Scheme
  shopId: string
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({
  scheme,
  shopId,
}) => {
  const { t } = useTranslation()

  const [selectedEnrollment, setSelectedEnrollment] =
    useState<SchemeEnrollment | null>(null)

  const { enrollments, isLoading: enrollmentsLoading } =
    useSchemeEnrollments(shopId, scheme._id, { limit: 100 })

  const { schedule, isLoading: scheduleLoading } =
    useInstallmentSchedule(shopId, selectedEnrollment?._id || '')

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(amount)

  const statusIcon = (status: string) => {
    switch (status) {
      case 'paid':    return <CheckCircle className="h-4 w-4 text-status-success" />
      case 'pending': return <Clock className="h-4 w-4 text-text-tertiary" />
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-status-error" />
      case 'missed':  return <AlertTriangle className="h-4 w-4 text-status-warning" />
      default:        return null
    }
  }

  const scheduleItems: ScheduleItem[] =
    (schedule as any)?.schedule || []

  const scheduleColumns: DataTableColumn<ScheduleItem>[] = [
    {
      id:          'installmentNumber',
      header:      '#',
      accessorKey: 'installmentNumber',
      width:       '60px',
      cell: ({ row }) => (
        <span className="text-sm font-medium text-text-primary">
          {row.installmentNumber}
        </span>
      ),
    },
    {
      id:          'dueDate',
      header:      t('scheme.schedule.dueDate'),
      accessorKey: 'dueDate',
      cell: ({ row }) => (
        <span className="text-sm text-text-secondary">
          {new Date(row.dueDate).toLocaleDateString('en-IN')}
        </span>
      ),
    },
    {
      id:          'amount',
      header:      t('scheme.schedule.amount'),
      accessorKey: 'amount',
      align:       'right',
      cell: ({ row }) => (
        <span className="text-sm font-medium text-text-primary">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      id:          'paidAmount',
      header:      t('scheme.schedule.paidAmount'),
      accessorKey: 'paidAmount',
      align:       'right',
      cell: ({ row }) => (
        <span className={`text-sm font-medium ${
          row.paidAmount ? 'text-status-success' : 'text-text-tertiary'
        }`}>
          {row.paidAmount ? formatCurrency(row.paidAmount) : '—'}
        </span>
      ),
    },
    {
      id:          'paidDate',
      header:      t('scheme.schedule.paidDate'),
      accessorKey: 'paidDate',
      cell: ({ row }) => (
        <span className="text-sm text-text-secondary">
          {row.paidDate
            ? new Date(row.paidDate).toLocaleDateString('en-IN')
            : '—'}
        </span>
      ),
    },
    {
      id:          'status',
      header:      t('scheme.schedule.status'),
      accessorKey: 'status',
      cell: ({ row }) => {
        const variants: Record<string, string> = {
          paid:    'success',
          pending: 'default',
          overdue: 'error',
          missed:  'warning',
        }
        return (
          <div className="flex items-center gap-1.5">
            {statusIcon(row.status)}
            <Badge variant={variants[row.status] as any} size="sm">
              {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
            </Badge>
          </div>
        )
      },
    },
  ]

  const enrollmentColumns: DataTableColumn<SchemeEnrollment>[] = [
    {
      id:          'enrollmentNumber',
      header:      t('scheme.enrollment.enrollmentNumber'),
      accessorKey: 'enrollmentNumber',
      cell: ({ row }) => (
        <button
          onClick={() => setSelectedEnrollment(row)}
          className={`font-mono text-sm font-medium hover:text-accent ${
            selectedEnrollment?._id === row._id
              ? 'text-accent'
              : 'text-text-primary'
          }`}
        >
          {row.enrollmentNumber}
        </button>
      ),
    },
    {
      id:          'customer',
      header:      t('scheme.enrollment.customer'),
      accessorKey: 'customerDetails',
      cell: ({ row }) => (
        <p className="text-sm text-text-primary">
          {row.customerDetails?.customerName}
        </p>
      ),
    },
    {
      id:          'progress',
      header:      t('scheme.enrollment.progress'),
      accessorKey: 'paidInstallments',
      cell: ({ row }) => (
        <span className="text-sm text-text-secondary">
          {row.paidInstallments}/{row.totalInstallments}
        </span>
      ),
    },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Enrollments */}
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-4">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent" />
            <h3 className="text-lg font-semibold text-text-primary">
              {t('scheme.enrollment.selectEnrollment')}
            </h3>
          </div>
          <DataTable
            data={enrollments}
            columns={enrollmentColumns}
            pagination={{ enabled: false }}
            emptyState={{
              message: enrollmentsLoading
                ? t('table.loading')
                : t('scheme.enrollment.noEnrollments'),
            }}
            style={{ hoverEffect: true, showBorder: true, rounded: true }}
          />
        </div>

        {/* Schedule */}
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-4 lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary">
              {selectedEnrollment
                ? `${t('scheme.schedule.scheduleFor')} ${selectedEnrollment.enrollmentNumber}`
                : t('scheme.schedule.selectEnrollmentFirst')}
            </h3>

            {/* Summary */}
            {schedule && selectedEnrollment && (
              <div className="mt-3 flex gap-4">
                <div>
                  <p className="text-xs text-text-tertiary">
                    {t('scheme.schedule.paid')}
                  </p>
                  <p className="text-sm font-semibold text-status-success">
                    {(schedule as any).paidInstallments}/
                    {(schedule as any).totalInstallments}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">
                    {t('scheme.schedule.nextDue')}
                  </p>
                  <p className="text-sm font-semibold text-status-warning">
                    {(schedule as any).nextDueDate
                      ? new Date(
                          (schedule as any).nextDueDate
                        ).toLocaleDateString('en-IN')
                      : '—'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {selectedEnrollment ? (
            <DataTable
              data={scheduleItems}
              columns={scheduleColumns}
              pagination={{ enabled: false }}
              emptyState={{
                message: scheduleLoading
                  ? t('table.loading')
                  : t('scheme.schedule.noSchedule'),
              }}
              style={{ hoverEffect: true, showBorder: true, rounded: true }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="mb-3 h-10 w-10 text-text-tertiary" />
              <p className="text-sm text-text-tertiary">
                {t('scheme.schedule.selectEnrollmentFirst')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}