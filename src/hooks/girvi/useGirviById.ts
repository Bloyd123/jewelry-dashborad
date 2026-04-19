// FILE: src/features/girvi/hooks/useGirviById.ts

import { useGetGirviByIdQuery } from '@/store/api/girviApi'
import type { GirviCustomer }   from '@/types/girvi.types'

export const useGirviById = (shopId: string, girviId: string) => {
  const { data: girvi, isLoading, error, refetch } = useGetGirviByIdQuery(
    { shopId, girviId },
    { skip: !shopId || !girviId }
  )

  const isActive          = girvi?.status === 'active'
  const isReleased        = girvi?.status === 'released'
  const isTransferred     = girvi?.status === 'transferred'
  const isOverdue         = girvi?.status === 'overdue' || girvi?.isOverdue === true
  const isAuctioned       = girvi?.status === 'auctioned'
  const isPartialReleased = girvi?.status === 'partial_released'

  // Full release: active or overdue only
  const canRelease        = isActive || isOverdue

  const canPartialRelease = isActive || isOverdue || isPartialReleased

  const canRenew          = isActive || isOverdue || isPartialReleased

  const canUpdate         = isActive || isOverdue

  const canDelete         = isReleased || isAuctioned

  const customer = girvi?.customerId && typeof girvi.customerId === 'object'
    ? (girvi.customerId as GirviCustomer)
    : null

  const customerName = customer
    ? `${customer.firstName} ${customer.lastName}`
    : null

  const activeItems = (girvi?.items || []).filter(
    (item) => item.itemStatus !== 'released'
  )

  const releasedItems = (girvi?.items || []).filter(
    (item) => item.itemStatus === 'released'
  )

  const hasMultipleActiveItems = activeItems.length > 1

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
    isPartialReleased,

    canRelease,
    canPartialRelease,
    canRenew,
    canUpdate,
    canDelete,

    customer,
    customerName,

    activeItems,
    releasedItems,
    hasMultipleActiveItems,
    activeItemCount:   activeItems.length,
    releasedItemCount: releasedItems.length,

    outstandingPrincipal: girvi?.outstandingPrincipal ?? 0,
    accruedInterest:      girvi?.accruedInterest      ?? 0,
    totalAmountDue:       girvi?.totalAmountDue        ?? 0,
    daysElapsed:          girvi?.daysElapsed           ?? 0,

    renewalCount:        (girvi?.renewals        || []).length,
    partialReleaseCount: (girvi?.partialReleases || []).length,
lastRenewal:
  (girvi?.renewals || [])[(girvi?.renewals || []).length - 1],

lastPartialRelease:
  (girvi?.partialReleases || [])[(girvi?.partialReleases || []).length - 1],
  }
}