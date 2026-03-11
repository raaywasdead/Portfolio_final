import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const TECH = ['React', 'TypeScript', 'Node.js', 'PostgreSQL']


export const Hero = () => {
  const containerRef = useRef<HTMLElement>(null)
  const barbarosaRef = useRef<HTMLSpanElement>(null)

  const startScramble = (el: HTMLElement) => {
    const target = 'Barbosa.'
    const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#!'
    let step = 0
    const iv = setInterval(() => {
      el.textContent = target
        .split('')
        .map((ch, i) => {
          if (i < Math.floor(step)) return ch
          if (ch === '.') return '.'
          return pool[Math.floor(Math.random() * pool.length)]
        })
        .join('')
      step += 0.22
      if (step >= target.length) {
        el.textContent = target
        clearInterval(iv)
      }
    }, 38)
  }

  useGSAP(() => {
    // Reset to final state first so .from() always records the correct "to" values
    // (fixes React StrictMode double-mount issue where from() can read opacity:0 as the "to" state)
    const targets = ['.hero-label', '.hero-name-left', '.hero-name-right', '.hero-sub', '.hero-desc', '.hero-tech li', '.hero-actions']
    gsap.set(targets, { clearProps: 'opacity,transform' })

    const tl = gsap.timeline({ delay: 0.1 })
    tl.fromTo('.hero-label', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
      .fromTo('.hero-name-left', { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.3')
      .fromTo('.hero-name-right', { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '<')
      .fromTo('.hero-sub', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.4')
      .fromTo('.hero-desc', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .fromTo('.hero-tech li', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.06, ease: 'power2.out' }, '-=0.4')
      .fromTo('.hero-actions', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .call(() => {
        if (barbarosaRef.current) startScramble(barbarosaRef.current)
      }, [], '-=0.1')
  }, { scope: containerRef })

  return (
    <section
      id="inicio"
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-16 overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto px-5 md:px-10 flex flex-col items-center">

        {/* Label */}
        <div className="hero-label flex items-center justify-center gap-3 mb-5">
          <span className="w-10 h-px bg-purple-500/40" />
          <span className="shiny-text text-[11px] font-semibold tracking-[0.25em] uppercase">
            Full Stack Developer
          </span>
          <span className="w-10 h-px bg-purple-500/40" />
        </div>

        {/* Name row */}
        <div className="flex items-baseline justify-center gap-5 md:gap-8 lg:gap-14">
          <h1
            className="hero-name-left font-heading font-black leading-[0.85] tracking-tighter text-white"
            style={{ fontSize: 'clamp(3.5rem, 9.5vw, 8.5rem)' }}
          >
            JOÃO
          </h1>
          <h1
            className="hero-name-right font-heading font-black leading-[0.85] tracking-tighter text-white"
            style={{ fontSize: 'clamp(3.5rem, 9.5vw, 8.5rem)' }}
          >
            VITOR
          </h1>
        </div>

        {/* Barbosa. */}
        <div className="hero-sub flex items-center justify-center gap-4 mt-1 mb-10">
          <span className="hidden md:block w-20 h-px bg-white/10" />
          <span
            ref={barbarosaRef}
            className="font-heading font-black italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-300 to-purple-400"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)' }}
          >
            Barbosa.
          </span>
          <span className="hidden md:block w-20 h-px bg-white/10" />
        </div>

        {/* desc + tags + actions */}
        <div className="flex flex-col items-center gap-5 text-center max-w-xl mx-auto pb-4">
          <p className="hero-desc text-white/45 text-sm md:text-base leading-relaxed">
            Desenvolvedor Full Stack Júnior focado em criar interfaces modernas,
            performáticas e centradas na experiência do usuário.
          </p>

          <ul className="hero-tech flex flex-wrap justify-center gap-2 list-none p-0">
            {TECH.map((t) => (
              <li
                key={t}
                className="px-3 py-1.5 text-xs font-medium border border-purple-600/25 text-purple-300/70 rounded-full bg-purple-600/[0.08] tracking-wide transition-all duration-200 hover:border-purple-400/50 hover:text-purple-200 hover:bg-purple-600/15 hover:-translate-y-0.5 cursor-default"
              >
                {t}
              </li>
            ))}
          </ul>

          <div className="hero-actions flex gap-3">
            <a
              href="#contato"
              onClick={(e) => {
                e.preventDefault()
                const el = document.querySelector('#contato')
                if (el) window.scrollTo({ top: (el as HTMLElement).offsetTop - 80, behavior: 'smooth' })
              }}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/40 active:scale-95 text-sm"
            >
              Entre em Contato
            </a>
            <a
              href="#projetos"
              onClick={(e) => {
                e.preventDefault()
                const el = document.querySelector('#projetos')
                if (el) window.scrollTo({ top: (el as HTMLElement).offsetTop - 80, behavior: 'smooth' })
              }}
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/12 text-white/55 hover:text-white hover:border-white/30 font-semibold rounded-full transition-all duration-300 active:scale-95 text-sm"
            >
              Ver Projetos
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 select-none pointer-events-none">
          <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-white/25">Scroll</span>
          <div
            className="w-px h-8 bg-gradient-to-b from-white/35 to-transparent"
            style={{ animation: 'scrollFade 1.8s ease-in-out infinite' }}
          />
        </div>

      </div>
    </section>
  )
}
