import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import * as THREE from 'three'

// layer: 0 = grande (mais lento), 1 = médio, 2 = pequeno (mais rápido)
const SUITS = [
  // grandes — outline, parallax lento
  { char: '♠', x: -4,  y: 50, size: 440, opacity: 0.22, rot: -10, color: '#ffffff', dur: 10, fy: 22, layer: 0, outline: true  },
  { char: '♥', x: 84,  y: -8, size: 360, opacity: 0.26, rot:  15, color: '#9333ea', dur: 12, fy: 26, layer: 0, outline: true  },
  { char: '♣', x: 88,  y: 66, size: 290, opacity: 0.20, rot: -18, color: '#ffffff', dur: 14, fy: 16, layer: 0, outline: true  },
  { char: '♦', x:  1,  y: -6, size: 230, opacity: 0.22, rot:  22, color: '#9333ea', dur: 11, fy: 20, layer: 0, outline: true  },
  // médios — preenchidos
  { char: '♥', x: 18,  y: 30, size:  96, opacity: 0.055, rot:   7, color: '#9333ea', dur:  8, fy: 13, layer: 1, outline: false },
  { char: '♦', x: 71,  y: 43, size: 112, opacity: 0.045, rot: -13, color: '#ffffff', dur: 13, fy: 15, layer: 1, outline: false },
  { char: '♠', x: 50,  y: 15, size:  84, opacity: 0.050, rot:  21, color: '#ffffff', dur:  9, fy: 11, layer: 1, outline: false },
  { char: '♣', x: 33,  y: 66, size: 100, opacity: 0.046, rot: -26, color: '#9333ea', dur: 12, fy: 17, layer: 1, outline: false },
  { char: '♠', x: 58,  y: 78, size:  82, opacity: 0.040, rot:  10, color: '#ffffff', dur: 10, fy: 14, layer: 1, outline: false },
  { char: '♦', x: 10,  y: 74, size:  72, opacity: 0.044, rot: -35, color: '#9333ea', dur:  9, fy: 12, layer: 1, outline: false },
  // pequenos — preenchidos, parallax rápido
  { char: '♦', x: 27,  y: 12,  size:  48, opacity: 0.065, rot:  33, color: '#9333ea', dur:  7, fy:  8, layer: 2, outline: false },
  { char: '♠', x: 66,  y: 76,  size:  52, opacity: 0.060, rot:  -8, color: '#ffffff', dur:  8, fy: 10, layer: 2, outline: false },
  { char: '♥', x: 44,  y: 82,  size:  42, opacity: 0.065, rot:  16, color: '#9333ea', dur:  9, fy:  7, layer: 2, outline: false },
  { char: '♣', x: 78,  y: 29,  size:  50, opacity: 0.055, rot: -31, color: '#ffffff', dur: 10, fy: 10, layer: 2, outline: false },
  { char: '♠', x: 19,  y: 50,  size:  38, opacity: 0.055, rot: -18, color: '#ffffff', dur:  7, fy:  8, layer: 2, outline: false },
  { char: '♥', x: 86,  y: 50,  size:  32, opacity: 0.050, rot: -42, color: '#9333ea', dur:  9, fy:  9, layer: 2, outline: false },

  // ── parte inferior (y > 80) ──────────────────────────────────────
  // grandes outline
  { char: '♦', x: -5,  y: 140, size: 400, opacity: 0.20, rot:  12, color: '#9333ea', dur: 13, fy: 24, layer: 0, outline: true  },
  { char: '♠', x: 82,  y: 110, size: 350, opacity: 0.18, rot: -20, color: '#ffffff', dur: 11, fy: 20, layer: 0, outline: true  },
  { char: '♥', x: 40,  y: 160, size: 300, opacity: 0.22, rot:   8, color: '#9333ea', dur: 14, fy: 18, layer: 0, outline: true  },
  { char: '♣', x: -3,  y: 210, size: 270, opacity: 0.18, rot: -14, color: '#ffffff', dur: 12, fy: 22, layer: 0, outline: true  },
  { char: '♦', x: 75,  y: 185, size: 320, opacity: 0.20, rot:  30, color: '#9333ea', dur: 10, fy: 26, layer: 0, outline: true  },
  // médios preenchidos
  { char: '♣', x: 22,  y: 95,  size: 104, opacity: 0.048, rot:  19, color: '#9333ea', dur: 11, fy: 15, layer: 1, outline: false },
  { char: '♥', x: 62,  y: 108, size:  90, opacity: 0.050, rot: -11, color: '#ffffff', dur:  9, fy: 13, layer: 1, outline: false },
  { char: '♠', x: 38,  y: 125, size: 110, opacity: 0.044, rot:  26, color: '#9333ea', dur: 13, fy: 16, layer: 1, outline: false },
  { char: '♦', x:  5,  y: 148, size:  78, opacity: 0.042, rot: -22, color: '#ffffff', dur:  8, fy: 12, layer: 1, outline: false },
  { char: '♣', x: 70,  y: 165, size:  94, opacity: 0.046, rot:  14, color: '#9333ea', dur: 12, fy: 14, layer: 1, outline: false },
  { char: '♥', x: 25,  y: 180, size:  86, opacity: 0.040, rot: -28, color: '#ffffff', dur: 10, fy: 11, layer: 1, outline: false },
  { char: '♠', x: 55,  y: 200, size:  98, opacity: 0.044, rot:  17, color: '#9333ea', dur: 11, fy: 15, layer: 1, outline: false },
  // pequenos
  { char: '♥', x: 48,  y: 92,  size:  44, opacity: 0.060, rot: -37, color: '#9333ea', dur:  8, fy:  9, layer: 2, outline: false },
  { char: '♣', x: 82,  y: 118, size:  36, opacity: 0.055, rot:  23, color: '#ffffff', dur:  7, fy:  7, layer: 2, outline: false },
  { char: '♦', x: 14,  y: 135, size:  50, opacity: 0.058, rot: -14, color: '#9333ea', dur:  9, fy: 10, layer: 2, outline: false },
  { char: '♠', x: 92,  y: 155, size:  40, opacity: 0.052, rot:  39, color: '#ffffff', dur:  8, fy:  8, layer: 2, outline: false },
  { char: '♦', x: 34,  y: 172, size:  46, opacity: 0.060, rot: -20, color: '#9333ea', dur:  7, fy:  9, layer: 2, outline: false },
  { char: '♣', x: 60,  y: 190, size:  34, opacity: 0.050, rot:  12, color: '#ffffff', dur:  9, fy:  7, layer: 2, outline: false },
  { char: '♥', x:  8,  y: 205, size:  42, opacity: 0.055, rot: -33, color: '#9333ea', dur:  8, fy:  8, layer: 2, outline: false },
  { char: '♠', x: 78,  y: 218, size:  38, opacity: 0.048, rot:  25, color: '#ffffff', dur:  7, fy:  9, layer: 2, outline: false },
]

// scroll: quanto cada layer sobe por pixel de scrollY (grandes são lentos)
const SCROLL_STR = [0.10, 0.22, 0.38]
// mouse: deslocamento máximo em px por layer
const MOUSE_STR  = [6,    14,   24  ]

export const Background = () => {
  const mountRef = useRef<HTMLDivElement>(null)
  const effectRef = useRef<any>(null)
  const suitsRef  = useRef<HTMLDivElement>(null)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const mobileScale = isMobile ? 0.52 : 1;

  useEffect(() => {
    if (!isMobile) {
      // ── Vanta fog ──────────────────────────────────────────────────
      import('vanta/dist/vanta.fog.min.js').then((mod) => {
        const VANTA = mod.default
        if (mountRef.current && !effectRef.current) {
          effectRef.current = VANTA({
            el: mountRef.current,
            THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200,
            minWidth:  200,
            highlightColor: 0x0,
            midtoneColor:   0x0,
            lowlightColor:  0x48216b,
            baseColor:      0x0,
            blurFactor: 0.90,
            speed: 3.00,
          })
        }
      })
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return () => { effectRef.current?.destroy(); effectRef.current = null }
    }

    // ── Suits parallax (mouse + scroll + float) via RAF ────────────
    const container = suitsRef.current
    if (!container) return

    const els = Array.from(container.querySelectorAll<HTMLElement>('[data-suit]'))

    // Pre-compute per-element params from data attributes
    const params = els.map((el, i) => ({
      el,
      layer: Number(el.dataset.layer),
      dur:   Number(el.dataset.dur),
      fy:    Number(el.dataset.fy),
      rot:   Number(el.dataset.rot),
      phase: (i / els.length) * Math.PI * 2,   // even phase spread
    }))

    // Smoothed mouse state
    let tmx = 0, tmy = 0
    let cmx = 0, cmy = 0

    const onMouseMove = (e: MouseEvent) => {
      tmx = (e.clientX / window.innerWidth  - 0.5) * 2  // -1…1
      tmy = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    let raf: number
    const tick = () => {
      const t  = performance.now() / 1000
      const sy = window.scrollY

      // Lerp mouse for smoothness
      cmx += (tmx - cmx) * 0.055
      cmy += (tmy - cmy) * 0.055

      params.forEach(({ el, layer, dur, fy, rot, phase }) => {
        const ms  = MOUSE_STR[layer]  ?? 10
        const ss  = SCROLL_STR[layer] ?? 0.2

        const mx   = cmx * ms
        const my   = cmy * ms
        const scrollOffset = sy * ss                          // sobe conforme scroll
        const bob  = Math.sin((t / dur) * Math.PI * 2 + phase) * fy  // flutuação

        el.style.transform = `translate(${mx}px, ${my - scrollOffset + bob}px) rotate(${rot}deg)`
      })

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
      effectRef.current?.destroy()
      effectRef.current = null
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      {/* Vanta fog layer */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* Suits layer */}
      <div ref={suitsRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        {SUITS.map((s, i) => (
          <span
            key={i}
            data-suit=""
            data-layer={s.layer}
            data-dur={s.dur}
            data-fy={s.fy}
            data-rot={s.rot}
            style={{
              position: 'absolute',
              left: `${s.x}%`,
              top: `${s.y}%`,
              fontSize: `${s.size * mobileScale}px`,
              lineHeight: 1,
              color: s.outline ? 'transparent' : s.color,
              WebkitTextStroke: s.outline ? `1.5px ${s.color}` : undefined,
              opacity: s.opacity,
              userSelect: 'none',
              willChange: 'transform',
            } as CSSProperties}
          >
            {s.char}
          </span>
        ))}
      </div>

      {/* Film grain overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 3,
          opacity: 0.038,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '250px 250px',
          backgroundRepeat: 'repeat',
          animation: 'grain 0.35s steps(1) infinite',
        }}
      />
    </div>
  )
}
