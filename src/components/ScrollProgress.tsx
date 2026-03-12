import { useEffect, useRef } from 'react'

export const ScrollProgress = () => {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const pct = scrollTop / (scrollHeight - clientHeight)
      bar.style.transform = `scaleX(${pct})`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '2px',
        background: 'linear-gradient(90deg, #7c3aed, #a855f7, #c084fc)',
        transformOrigin: 'left',
        transform: 'scaleX(0)',
        zIndex: 10000,
        pointerEvents: 'none',
        boxShadow: '0 0 8px rgba(168,85,247,0.7)',
      }}
    />
  )
}
