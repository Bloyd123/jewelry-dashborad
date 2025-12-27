// src/components/common/LottieAnimation/LottieAnimation.tsx
import { useLottie } from 'lottie-react'

interface LottieAnimationProps {
  animationData: any
  loop?: boolean
  autoplay?: boolean
  className?: string
}

export const LottieAnimation = ({
  animationData,
  loop = true,
  autoplay = true,
  className = '',
}: LottieAnimationProps) => {
  const { View } = useLottie({
    animationData,
    loop,
    autoplay,
  })

  return <div className={className}>{View}</div>
}
