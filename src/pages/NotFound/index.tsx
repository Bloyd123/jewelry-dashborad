// src/pages/NotFound/index.tsx
import { LottieAnimation } from '@/components/common/LottieAnimation/LottieAnimation'
import notFoundAnimation from '@/assets/animations/not-found.json'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <LottieAnimation
        animationData={notFoundAnimation}
        className="h-40 w-52"
      />
      <h1 className="mt-8 text-2xl font-bold text-text-primary">
        Page Not Found
      </h1>
    </div>
  )
}
