// FILE: src/features/girvi/hooks/useGirviById.ts

import { useGetGirviByIdQuery } from '@/store/api/girviApi'
import type { GirviCustomer } from '@/types/girvi.types'

export const useGirviById = (shopId: string, girviId: string) => {
  const { data: girvi, isLoading, error, refetch } = useGetGirviByIdQuery(
    { shopId, girviId },
    { skip: !shopId || !girviId }
  )

  const isActive      = girvi?.status === 'active'
  const isReleased    = girvi?.status === 'released'
  const isTransferred = girvi?.status === 'transferred'
  const isOverdue     = girvi?.status === 'overdue' || girvi?.isOverdue === true
  const isAuctioned   = girvi?.status === 'auctioned'

  const canRelease    = isActive || isOverdue
  const canUpdate     = isActive || isOverdue       // backend allows active/overdue updates
  const canDelete     = isReleased || isAuctioned   // backend blocks active/overdue deletion

  const customer = girvi?.customerId && typeof girvi.customerId === 'object'
    ? (girvi.customerId as GirviCustomer)
    : null

  const customerName = customer
    ? `${customer.firstName} ${customer.lastName}`
    : null

  return {
    girvi,
    isLoading,
    error,
    refetch,

    isActive,
    isReleased,
    isTransferred,
    isOverdue,
    isAuctioned,

    canRelease,
    canUpdate,
    canDelete,

    customer,
    customerName,

    outstandingPrincipal: girvi?.outstandingPrincipal ?? 0,
    accruedInterest:      girvi?.accruedInterest      ?? 0,
    totalAmountDue:       girvi?.totalAmountDue        ?? 0,
    daysElapsed:          girvi?.daysElapsed           ?? 0,
  }
}