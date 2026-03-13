import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { asset } from '@/utils/asset'

interface Props {
  onComplete: () => void
}

export const LoadingScreen = ({ onComplete }: Props) => {
  const [progress, setProgress] = useState(0)
  const screenRef = useRef<HTMLDivElement>(null)
  const isCompleteRef = useRef(false)

  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    const minTime = isMobile ? 1400 : 2000
    const startTime = Date.now()

    document.documentElement.classList.add('no-scroll')

    // Progress simulation
    let currentProgress = 0
    let targetProgress  = 0
    let rafId: number

    const animateProgress = () => {
      if (currentProgress < targetProgress) {
        const diff = targetProgress - currentProgress
        currentProgress = Math.min(currentProgress + Math.max(0.4, diff * 0.06), targetProgress)
        setProgress(Math.floor(currentProgress))
      }
      if (!isCompleteRef.current || currentProgress < 100) {
        rafId = requestAnimationFrame(animateProgress)
      }
    }
    rafId = requestAnimationFrame(animateProgress)

    const complete = () => {
      if (isCompleteRef.current) return
      isCompleteRef.current = true
      targetProgress = 100

      const elapsed   = Date.now() - startTime
      const remaining = Math.max(0, minTime - elapsed)

      setTimeout(() => {
        gsap.to(screenRef.current, {
          yPercent: -100,
          duration: 0.85,
          ease: 'power3.inOut',
          onComplete: () => {
            document.documentElement.classList.remove('no-scroll')
            onComplete()
          },
        })
      }, remaining)
    }

    setTimeout(() => { targetProgress = 20 }, 80)
    setTimeout(() => { targetProgress = 45 }, 300)
    setTimeout(() => { targetProgress = 70 }, 650)
    setTimeout(() => { targetProgress = 90 }, 1100)
    setTimeout(complete, 1800)
    setTimeout(complete, 5000) // safety

    return () => {
      cancelAnimationFrame(rafId)
      document.documentElement.classList.remove('no-scroll')
    }
  }, [onComplete])

  return (
    <div
      ref={screenRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: '#05020c' }}
      aria-hidden="true"
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, #9333ea, transparent)' }} />

      <div className="flex flex-col items-center gap-10">
        {/* Logo */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-purple-600/20 blur-2xl scale-150" />
          <img
            src={asset('IMG/logo.png')}
            alt=""
            className="loading-logo-pulse relative w-20 h-20 object-contain"
          />
        </div>

        {/* Progress */}
        <div className="flex flex-col items-center gap-3 w-56">
          <div className="flex justify-between w-full">
            <span className="text-white/25 text-[10px] tracking-widest uppercase">Carregando</span>
            <span className="text-white/50 text-[10px] font-medium tabular-nums">{progress}%</span>
          </div>
          <div className="w-full h-[1px] bg-white/[0.08] rounded-full overflow-hidden">
            <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.4), transparent)' }} />
    </div>
  )
}
