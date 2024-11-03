'use client'

import LoginLottie from '../public/lottie/login.json'
import Lottie, { LottieComponentProps } from 'lottie-react'

type LottieComponent = Omit<LottieComponentProps, 'animationData'>

export const LottieComp = {
  login: (props: LottieComponent) => (
    <Lottie {...props} animationData={LoginLottie} />
  ),
}
