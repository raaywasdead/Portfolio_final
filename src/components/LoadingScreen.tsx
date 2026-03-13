import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { asset } from '@/utils/asset'

interface Props {
  onComplete: () => void
}

export const LoadingScreen = ({ onComplete }: Props) => {
  // Desabilitado para teste de performance
  return null
}
