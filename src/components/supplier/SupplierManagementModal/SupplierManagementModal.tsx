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

export const SupplierManagementModal = ({
  open,
  onOpenChange,
  supplier,
  action,
  onSuccess,
}: SupplierManagementModalProps) => {
  const { t } = useTranslation()
  const isMobile = useMediaQuery('(max-width: 768px)')

  if (!supplier || !action) return null

  const handleClose = () => {
    onOpenChange(false)
  }

  const handleActionSuccess = () => {
    console.log('✅ Action completed:', action)
    onSuccess?.()
    handleClose()
  }

  // ACTION HANDLERS (Mock - No API Integration)

  const handleUpdateBalance = async (data: any) => {
    console.log('💰 Update Balance:', { supplierId: supplier._id, ...data })
    await new Promise(resolve => setTimeout(resolve, 1000)) // Mock delay
    handleActionSuccess()
  }

  const handleUpdateRating = async (data: any) => {
    console.log('⭐ Update Rating:', { supplierId: supplier._id, ...data })
    await new Promise(resolve => setTimeout(resolve, 1000))
    handleActionSuccess()
  }

  const handleMarkPreferred = async () => {
    console.log('❤️ Mark as Preferred:', { supplierId: supplier._id })
    await new Promise(resolve => setTimeout(resolve, 1000))
    handleActionSuccess()
  }

  const handleRemovePreferred = async () => {
    console.log('💔 Remove Preferred:', { supplierId: supplier._id })
    await new Promise(resolve => setTimeout(resolve, 1000))
    handleActionSuccess()
  }

  const handleBlacklist = async (reason: string) => {
    console.log('🚫 Blacklist Supplier:', { supplierId: supplier._id, reason })
    await new Promise(resolve => setTimeout(resolve, 1000))
    handleActionSuccess()
  }

  const handleRemoveBlacklist = async () => {
    console.log('✅ Remove Blacklist:', { supplierId: supplier._id })
    await new Promise(resolve => setTimeout(resolve, 1000))
    handleActionSuccess()
  }

  const handleDelete = async () => {
    console.log('🗑️ Delete Supplier:', { supplierId: supplier._id })
    await new Promise(resolve => setTimeout(resolve, 1000))
    handleActionSuccess()
  }

  const handleRestore = async () => {
    console.log('♻️ Restore Supplier:', { supplierId: supplier._id })
    await new Promise(resolve => setTimeout(resolve, 1000))
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
          />
        )

      case 'update-rating':
        return (
          <UpdateRatingSection
            supplier={supplier}
            onSubmit={handleUpdateRating}
            onCancel={handleClose}
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
