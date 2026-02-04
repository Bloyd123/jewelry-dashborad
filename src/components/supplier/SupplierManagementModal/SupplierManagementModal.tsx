//
// FILE: src/components/supplier/SupplierManagementModal/SupplierManagementModal.tsx
// Main Supplier Management Modal
//

import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Modal } from '@/components/ui/overlay/Modal/Modal'
import { ModalHeader } from '@/components/ui/overlay/Modal/ModalHeader'
import { ModalBody } from '@/components/ui/overlay/Modal/ModalBody'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/overlay/Sheet/Sheet'
import type {
  SupplierManagementModalProps,
  ManagementAction,
} from './SupplierManagementModal.types'
import { UpdateBalanceSection } from './sections/UpdateBalanceSection'
import { UpdateRatingSection } from './sections/UpdateRatingSection'
import { PreferredSupplierSection } from './sections/PreferredSupplierSection'
import { BlacklistSupplierSection } from './sections/BlacklistSupplierSection'
import { DeleteSupplierSection } from './sections/DeleteSupplierSection'
import { useSupplierActions } from '@/hooks/supplier'

export const SupplierManagementModal = ({
  open,
  onOpenChange,
  supplier,
  action,
  onSuccess,
}: SupplierManagementModalProps) => {
  const { t } = useTranslation()
  if (!supplier?.shopId) return null
  const {
  deleteSupplier,
  blacklistSupplier,
  removeBlacklist,
  markAsPreferred, 
  restoreSupplier,
  removePreferred,
  updateBalance,
  updateRating,
    isDeleting,
  isBlacklisting,
  isRemovingBlacklist,
  isMarkingPreferred,
  isRestoring,
  isRemovingPreferred,
  isUpdatingBalance,
  isUpdatingRating,
} = useSupplierActions(supplier.shopId)


  const isMobile = useMediaQuery('(max-width: 768px)')

  if (!supplier || !action) return null

  const handleClose = () => {
    onOpenChange(false)
  }

  const handleActionSuccess = () => {
    console.log(' Action completed:', action)
    onSuccess?.()
    handleClose()
  }

  // ACTION HANDLERS (Mock - No API Integration)

// ✅ GOOD - Error handling
const handleUpdateBalance = async (data: any) => {
  try {
    const result = await updateBalance(
      supplier._id, 
      data, 
      supplier.businessName
    )
    
    if (result.success) {
      handleActionSuccess()
    }
    // Error notification already shown by hook
  } catch (error) {
    // Hook already handles error notification
    console.error('Balance update failed:', error)
  }
}


const handleUpdateRating = async (data: any) => {
  await updateRating(supplier._id, data)
  handleActionSuccess()
}

const handleMarkPreferred = async () => {
  await markAsPreferred(supplier._id, supplier.businessName)
  handleActionSuccess()
}

const handleRemovePreferred = async () => {
  await removePreferred(supplier._id, supplier.businessName)
  handleActionSuccess()
}


const handleBlacklist = async (reason: string) => {
  await blacklistSupplier(supplier._id, reason, supplier.businessName)
  handleActionSuccess()
}

const handleRemoveBlacklist = async () => {
  await removeBlacklist(supplier._id, supplier.businessName)
  handleActionSuccess()
}


const handleDelete = async () => {
  const result = await deleteSupplier(supplier._id, supplier.businessName)

  if (result?.success) {
    handleActionSuccess()
  }
}


const handleRestore = async () => {
  await restoreSupplier(supplier._id)
  handleActionSuccess()
}


  // GET MODAL CONFIG

  const getModalConfig = (action: ManagementAction) => {
    const configs = {
      'update-balance': {
        title: t('suppliers.balance.title'),
        description: t('suppliers.balance.description'),
      },
      'update-rating': {
        title: t('suppliers.rating.title'),
        description: t('suppliers.rating.description'),
      },
      preferred: {
        title: t('suppliers.preferred.title'),
        description: t('suppliers.preferred.description'),
      },
      blacklist: {
        title: t('suppliers.blacklist.title'),
        description: t('suppliers.blacklist.description'),
      },
      delete: {
        title: t('suppliers.delete.title'),
        description: t('suppliers.delete.description'),
      },
    }

    return configs[action]
  }

  const config = getModalConfig(action)

  // RENDER SECTION CONTENT

  const renderSection = () => {
    switch (action) {
      case 'update-balance':
        return (
          <UpdateBalanceSection
            supplier={supplier}
            onSubmit={handleUpdateBalance}
            onCancel={handleClose}
             isLoading={isUpdatingBalance}
          />
        )

      case 'update-rating':
        return (
          <UpdateRatingSection
            supplier={supplier}
            onSubmit={handleUpdateRating}
            onCancel={handleClose}
              isLoading={isUpdatingRating}
          />
        )

      case 'preferred':
        return (
          <PreferredSupplierSection
            supplier={supplier}
            onMarkPreferred={handleMarkPreferred}
            onRemovePreferred={handleRemovePreferred}
            onCancel={handleClose}

          />
        )

      case 'blacklist':
        return (
          <BlacklistSupplierSection
            supplier={supplier}
            onBlacklist={handleBlacklist}
            onRemoveBlacklist={handleRemoveBlacklist}
            onCancel={handleClose}
          />
        )

      case 'delete':
        return (
          <DeleteSupplierSection
            supplier={supplier}
            onDelete={handleDelete}
            onRestore={handleRestore}
            onCancel={handleClose}
              isDeleting={isDeleting}       // ⭐ ADD THIS
  isRestoring={isRestoring}   
          />
        )

      default:
        return null
    }
  }

  // RENDER MOBILE SHEET

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent size="lg" showHandle showClose>
          <SheetHeader className="text-center">
            <SheetTitle>{config.title}</SheetTitle>
            <SheetDescription>{config.description}</SheetDescription>
          </SheetHeader>

          <SheetBody className="text-center">{renderSection()}</SheetBody>
        </SheetContent>
      </Sheet>
    )
  }

  // RENDER DESKTOP MODAL

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      closeOnEscape
      closeOnOutsideClick
      showCloseButton
    >
      <ModalHeader title={config.title} description={config.description} />

      <ModalBody>{renderSection()}</ModalBody>
    </Modal>
  )
}
