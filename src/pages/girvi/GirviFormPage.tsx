// FILE: src/pages/girvi/GirviFormPage.tsx
import { useNavigate as useNavigateForm, useParams } from 'react-router-dom'
import { GirviForm } from '@/components/girvi/GirviForm'
 
import { useGirviById } from '@/hooks/girvi/useGirviById'
import { mapGirviToFormData } from '@/components/girvi/GirviForm/GirviForm.mappers'

export const GirviFormPage = () => {
  const navigate            = useNavigateForm()
  const { shopId, girviId } = useParams()
  const isEditMode          = Boolean(girviId)

  const { girvi, isLoading } = useGirviById(shopId!, girviId ?? '')

  // Edit mode mein jab tak data nahi aata, loader dikhao
  if (isEditMode && isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    )
  }

  // Edit mode mein girvi nahi mila
  if (isEditMode && !girvi) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-text-secondary">Girvi not found.</p>
      </div>
    )
  }

  return (
    <GirviForm
      key={girviId ?? 'create'}          // ← yeh important hai
      shopId={shopId!}
      girviId={girviId}
      mode={isEditMode ? 'edit' : 'create'}
      initialData={isEditMode ? mapGirviToFormData(girvi) : {}}
      onSuccess={() => navigate(`/shops/${shopId}/girvi`)}
      onCancel={() => navigate(`/shops/${shopId}/girvi`)}
    />
  )
}