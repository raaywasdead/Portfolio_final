import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export const CursorGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = glowRef.current
    if (!el) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3.out' })

    let visible = false

    const onMove = (e: MouseEvent) => {
      if (!visible) {
        gsap.to(el, { opacity: 1, duration: 0.4 })
        visible = true
      }
      xTo(e.clientX)
      yTo(e.clientY)
    }

    const onLeave = () => {
      gsap.to(el, { opacity: 0, duration: 0.6 })
      visible = false
    }

    window.addEventListener('mousemove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={glowRef}
      className="cursor-glow"
      aria-hidden="true"
    />
  )
}
