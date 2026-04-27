// FILE: src/components/girviCashbook/GirviCashbookTable/GirviCashbookTable.tsx

import React, { useState } from 'react'
import { useTranslation }   from 'react-i18next'
import { DataTable }        from '@/components/ui/data-display/DataTable'
import { useGirviCashbookList }    from '@/hooks/girviCashbook/useGirviCashbookList'
import { useGirviSpecificCashbook } from '@/hooks/girviCashbook/'
import { girviCashbookTableColumns } from './GirviCashbookTableColumns'
import type { GirviCashbookTableProps } from './GirviCashbookTable.types'

export const GirviCashbookTable: React.FC<GirviCashbookTableProps> = ({
  shopId,
  girviId,
}) => {
  const { t } = useTranslation()

  const [page,  setPage]  = useState(1)
  const [limit, setLimit] = useState(50)

  const listHook  = useGirviCashbookList(shopId, { page, limit })
  const girviHook = useGirviSpecificCashbook(shopId, girviId ?? '')

  const entries    = girviId ? girviHook.entries   : listHook.entries
  const pagination = girviId ? undefined           : listHook.pagination
  const isLoading  = girviId ? girviHook.isLoading : listHook.isLoading

  return (
    <div className="w-full space-y-4">
      <DataTable
        data={entries}
        columns={girviCashbookTableColumns}
        loading={{ isLoading }}
        sorting={{ enabled: true }}
        pagination={
          !girviId
            ? {
                enabled:              true,
                pageIndex:            page - 1,
                pageSize:             limit,
                totalItems:           pagination?.total,
                pageSizeOptions:      [20, 50, 100],
                showPageSizeSelector: true,
                showPageInfo:         true,
                showFirstLastButtons: true,
                onPaginationChange: state => {
                  setPage(state.pageIndex + 1)
                  setLimit(state.pageSize as number)
                },
              }
            : { enabled: false }
        }
        emptyState={{
          message: t('table.noEntries', 'No cashbook entries found'),
        }}
        style={{
          variant:      'default',
          size:         'md',
          stickyHeader: true,
          hoverEffect:  true,
          showBorder:   true,
          rounded:      true,
          shadow:       true,
          fullWidth:    true,
        }}
        getRowId={row => row._id}
        testId="girvi-cashbook-table"
      />
    </div>
  )
}