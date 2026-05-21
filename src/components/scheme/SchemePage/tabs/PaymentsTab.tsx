// FILE: src/components/scheme/SchemePage/tabs/PaymentsTab.tsx

import React, { useState } from 'react'
import { useTranslation }  from 'react-i18next'
import { CreditCard }      from 'lucide-react'
import { DataTable }       from '@/components/ui/data-display/DataTable'
import { Badge }           from '@/components/ui/data-display/Badge'
import { useSchemeEnrollments } from '@/hooks/scheme/useEnrollments'
import { useEnrollmentPayments } from '@/hooks/scheme/useEnrollmentPayments'
import type { Scheme, SchemeEnrollment } from '@/types/scheme.types'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable'

interface PaymentsTabProps {
  scheme: Scheme
  shopId: string
}

export const PaymentsTab: React.FC<PaymentsTabProps> = ({
  scheme,
  shopId,
}) => {
  const { t } = useTranslation()

  const [selectedEnrollment, setSelectedEnrollment] =
    useState<SchemeEnrollment | null>(null)

  const { enrollments, isLoading: enrollmentsLoading } =
    useSchemeEnrollments(shopId, scheme._id, { limit: 100 })

  const { payments, isLoading: paymentsLoading } =
    useEnrollmentPayments(
      shopId,
      selectedEnrollment?._id || ''
    )

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(amount)

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
      id:          'totalPaid',
      header:      t('scheme.enrollment.totalPaid'),
      accessorKey: 'totalPaidAmount',
      align:       'right',
      cell: ({ row }) => (
        <span className="text-sm font-semibold text-text-primary">
          {formatCurrency(row.totalPaidAmount)}
        </span>
      ),
    },
    {
      id:          'status',
      header:      t('scheme.enrollment.status'),
      accessorKey: 'status',
      cell: ({ row }) => (
        <Badge
          variant={row.status === 'active' ? 'active' : 'default'}
          size="sm"
          dot
        >
          {row.status}
        </Badge>
      ),
    },
  ]

  const paymentColumns: DataTableColumn<any>[] = [
    {
      id:          'paymentNumber',
      header:      t('scheme.payment.paymentNumber'),
      accessorKey: 'paymentNumber',
      cell: ({ row }) => (
        <span className="font-mono text-sm text-text-primary">
          {row.paymentNumber}
        </span>
      ),
    },
    {
      id:          'amount',
      header:      t('scheme.payment.amount'),
      accessorKey: 'amount',
      align:       'right',
      cell: ({ row }) => (
        <span className="text-sm font-semibold text-status-success">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      id:          'paymentMode',
      header:      t('scheme.payment.paymentMode'),
      accessorKey: 'paymentMode',
      cell: ({ row }) => (
        <Badge variant="default" size="sm">
          {row.paymentMode}
        </Badge>
      ),
    },
    {
      id:          'paymentDate',
      header:      t('scheme.payment.paymentDate'),
      accessorKey: 'paymentDate',
      cell: ({ row }) => (
        <span className="text-sm text-text-secondary">
          {new Date(row.paymentDate).toLocaleDateString('en-IN')}
        </span>
      ),
    },
    {
      id:          'status',
      header:      t('scheme.payment.status'),
      accessorKey: 'status',
      cell: ({ row }) => (
        <Badge
          variant={row.status === 'completed' ? 'success' : 'warning'}
          size="sm"
          dot
        >
          {row.status}
        </Badge>
      ),
    },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Enrollments List */}
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-4">
          <div className="mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-accent" />
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

        {/* Payments List */}
        <div className="rounded-lg border border-border-primary bg-bg-secondary p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary">
              {selectedEnrollment
                ? `${t('scheme.payment.paymentsFor')} ${selectedEnrollment.enrollmentNumber}`
                : t('scheme.payment.selectEnrollmentFirst')}
            </h3>
          </div>

          {selectedEnrollment ? (
            <DataTable
              data={payments}
              columns={paymentColumns}
              pagination={{ enabled: false }}
              emptyState={{
                message: paymentsLoading
                  ? t('table.loading')
                  : t('scheme.payment.noPayments'),
              }}
              style={{ hoverEffect: true, showBorder: true, rounded: true }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CreditCard className="mb-3 h-10 w-10 text-text-tertiary" />
              <p className="text-sm text-text-tertiary">
                {t('scheme.payment.selectEnrollmentFirst')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}