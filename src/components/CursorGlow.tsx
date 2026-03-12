import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export const CursorGlow = () => {
  const arrowRef = useRef<HTMLDivElement>(null)
  const pathRef  = useRef<SVGPathElement>(null)
  const glowRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const arrow = arrowRef.current
    const path  = pathRef.current
    const glow  = glowRef.current
    if (!arrow || !path || !glow) return

    let visible  = false
    let hovering = false

    // Arrow tip is at SVG (1,1) → zero offset needed
    const setX = gsap.quickSetter(arrow, 'x', 'px')
    const setY = gsap.quickSetter(arrow, 'y', 'px')
    // Glow follows with heavy ease
    const glX = gsap.quickTo(glow, 'x', { duration: 0.55, ease: 'power3.out' })
    const glY = gsap.quickTo(glow, 'y', { duration: 0.55, ease: 'power3.out' })

    const onMove = (e: MouseEvent) => {
      if (!visible) {
        gsap.to([arrow, glow], { opacity: 1, duration: 0.25 })
        visible = true
      }
      setX(e.clientX)
      setY(e.clientY)
      glX(e.clientX)
      glY(e.clientY)
    }

    const onLeave = () => {
      gsap.to([arrow, glow], { opacity: 0, duration: 0.35 })
      visible = false
    }

    const onOver = (e: MouseEvent) => {
      const el = e.target as Element
      const isInteractive = !!el.closest('a, button, [role="button"], input, textarea, select, label, [tabindex]')
      if (isInteractive === hovering) return
      hovering = isInteractive

      if (hovering) {
        gsap.to(path, { attr: { fill: '#a855f7' }, duration: 0.2 })
        gsap.to(arrow, { scale: 0.88, duration: 0.18, ease: 'power2.out' })
        gsap.to(glow, {
          width: 52, height: 52, marginLeft: -26, marginTop: -26,
          opacity: 0.28, duration: 0.3,
        })
      } else {
        gsap.to(path, { attr: { fill: '#ffffff' }, duration: 0.2 })
        gsap.to(arrow, { scale: 1, duration: 0.2, ease: 'power2.out' })
        gsap.to(glow, {
          width: 28, height: 28, marginLeft: -14, marginTop: -14,
          opacity: 0.1, duration: 0.3,
        })
      }
    }

    const onDown = () => {
      gsap.to(arrow, { scale: hovering ? 0.7 : 0.8, duration: 0.08, ease: 'power3.in' })
      gsap.to(glow,  { scale: 1.6, opacity: 0.45, duration: 0.1 })
    }

    const onUp = () => {
      gsap.to(arrow, { scale: 1, duration: 0.42, ease: 'elastic.out(1.2, 0.45)' })
      gsap.to(glow,  { scale: 1, opacity: hovering ? 0.28 : 0.1, duration: 0.3, ease: 'power2.out' })
    }

    window.addEventListener('mousemove',  onMove, { passive: true })
    window.addEventListener('mouseover',  onOver, { passive: true })
    window.addEventListener('mousedown',  onDown, { passive: true })
    window.addEventListener('mouseup',    onUp,   { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mouseover',  onOver)
      window.removeEventListener('mousedown',  onDown)
      window.removeEventListener('mouseup',    onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <>
      {/* SVG arrow — tip at SVG (1,1), div placed at exact mouse coords */}
      <div ref={arrowRef} className="cursor-arrow" aria-hidden="true" style={{ transformOrigin: '2px 2px' }}>
        <svg
          width="18" height="24"
          viewBox="0 0 18 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(1px 2px 2px rgba(0,0,0,0.9)) drop-shadow(0 0 8px rgba(0,0,0,0.5))' }}
        >
          <path
            ref={pathRef}
            d="M 1 1 L 1 20 L 5.5 15 L 8.5 21.5 L 11 20.5 L 8 14 L 14.5 14 Z"
            fill="white"
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="0.6"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Soft glow blob — lags behind cursor */}
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
    </>
  )
}
