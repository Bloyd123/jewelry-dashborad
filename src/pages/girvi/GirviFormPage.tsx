// FILE: src/pages/girvi/GirviFormPage.tsx
import { useNavigate as useNavigateForm, useParams } from 'react-router-dom'
import { GirviForm } from '@/components/girvi/GirviForm'
 
export const GirviFormPage = () => {
  const navigate        = useNavigateForm()
  const { shopId, girviId } = useParams()
 
  return (
    <GirviForm
      shopId={shopId!}
      girviId={girviId}
      mode={girviId ? 'edit' : 'create'}
      onSuccess={() => navigate(`/shops/${shopId}/girvi`)}
      onCancel={() => navigate(`/shops/${shopId}/girvi`)}
    />
  )
}