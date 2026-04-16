// FILE: src/components/girviTransfer/GirviTransferTable/GirviTransferTableActions.tsx

import React       from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, RotateCcw, XCircle } from 'lucide-react'
import type { RowAction }      from '@/components/ui/data-display/DataTable'
import type { IGirviTransfer } from '@/types/girviTransfer.types'

export const getGirviTransferRowActions = (
  onViewDetails: (transfer: IGirviTransfer) => void,
  onReturn:      (transfer: IGirviTransfer) => void,
  onCancel:      (transfer: IGirviTransfer) => void,
): RowAction<IGirviTransfer>[] => [
  {
    label:   'actions.viewDetails',
    icon:    <Eye className="h-4 w-4" />,
    onClick: onViewDetails,
    variant: 'default',
  },
  {
    label:   'actions.return',
    icon:    <RotateCcw className="h-4 w-4" />,
    onClick: onReturn,
    variant: 'default',
    hidden:  row => row.status !== 'completed',
  },
  {
    label:   'actions.cancel',
    icon:    <XCircle className="h-4 w-4" />,
    onClick: onCancel,
    variant: 'destructive',
    hidden:  row => row.status !== 'pending',
  },
]