import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SiReact, SiTypescript, SiNodedotjs, SiPostgresql } from 'react-icons/si'
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa'
import { useLang } from '@/contexts/LanguageContext'
import { i18n } from '@/data/i18n'

/* ─── ScrambleText ──────────────────────────────────────────── */
const SCRAMBLE = '!@#$%&§Ø∆ΩΞΨ<>[]{}|~*/01'
const ScrambleText = ({ text, delay = 0, className = '', style }: {
  text: string; delay?: number; className?: string; style?: React.CSSProperties
}) => {
  const [display, setDisplay] = useState(() =>
    Array.from({ length: text.length }, () => SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]).join('')
  )
  const rafRef = useRef(0)
  useEffect(() => {
    const total = text.length * 9
    let frame = 0
    const run = () => {
      frame++
      const pct = frame / total
      setDisplay(text.split('').map((ch, i) => {
        if (ch === ' ') return ' '
        if (i < pct * text.length) return ch
        return SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
      }).join(''))
      if (frame < total) rafRef.current = requestAnimationFrame(run)
      else setDisplay(text)
    }
    const t = setTimeout(() => { rafRef.current = requestAnimationFrame(run) }, delay)
    return () => { clearTimeout(t); cancelAnimationFrame(rafRef.current) }
  }, [text, delay])
  return <span className={className} style={style} aria-label={text}>{display}</span>
}

/* ─── Blinking cursor ───────────────────────────────────────── */
const Cursor = () => (
  <span
    className="inline-block w-[2px] h-[0.9em] bg-purple-400 align-middle ml-1"
    style={{ animation: 'heroBlink 1s step-end infinite', verticalAlign: 'middle' }}
  />
)

/* ─── RotatingText ──────────────────────────────────────────── */
const ROLES = ['React Developer', 'Full Stack Dev', 'UI/UX Engineer', 'Node.js Dev']
const RotatingText = () => {
  const [idx, setIdx] = useState(0)
  const [vis, setVis] = useState(true)
  useEffect(() => {
    const iv = setInterval(() => {
      setVis(false)
      setTimeout(() => { setIdx(p => (p + 1) % ROLES.length); setVis(true) }, 300)
    }, 2800)
    return () => clearInterval(iv)
  }, [])
  return (
    <span className="text-purple-400 transition-all duration-300 inline-block"
      style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(8px)' }}>
      {ROLES[idx]}
    </span>
  )
}

/* ─── CircularText ──────────────────────────────────────────── */
const CircularText = ({ text, size = 95, speed = 22 }: { text: string; size?: number; speed?: number }) => {
  const r = size / 2 - 14
  return (
    <div style={{ width: size, height: size, animation: `heroSpin ${speed}s linear infinite` }}
      className="select-none pointer-events-none">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <defs>
          <path id="hcpath" d={`M ${size/2},${size/2} m -${r},0 a ${r},${r} 0 1,1 ${r*2},0 a ${r},${r} 0 1,1 -${r*2},0`} />
        </defs>
        <text fontSize="7.5" fill="rgba(255,255,255,0.28)" fontFamily="monospace" letterSpacing="3.5">
          <textPath href="#hcpath">{text}</textPath>
        </text>
      </svg>
    </div>
  )
}

const STACK = [
  { name: 'React',      icon: SiReact,      color: '#61DAFB' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'Node.js',    icon: SiNodedotjs,  color: '#68A063' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#336791' },
]

const SOCIALS = [
  { href: 'https://github.com/raaywasdead',           icon: FaGithub,    label: 'GitHub'    },
  { href: 'https://www.linkedin.com/in/joaov-bds/',   icon: FaLinkedin,  label: 'LinkedIn'  },
  { href: 'https://www.instagram.com/051.jvbarbosa/', icon: FaInstagram, label: 'Instagram' },
]

/* ─── Hero ──────────────────────────────────────────────────── */
export const Hero = () => {
  const containerRef = useRef<HTMLElement>(null)
  const { lang, toggle } = useLang()
  const t = i18n[lang].hero

  const tz   = lang === 'pt' ? 'America/Sao_Paulo' : 'America/New_York'
  const tzLabel = lang === 'pt' ? 'BRT' : 'ET'
  const [clock, setClock] = useState(() =>
    new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(new Date())
  )
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz })
    setClock(fmt.format(new Date()))
    const id = setInterval(() => setClock(fmt.format(new Date())), 10_000)
    return () => clearInterval(id)
  }, [tz])

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.1 })
    tl.fromTo('.hc-tl',          { x: -18, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out' })
      .fromTo('.hc-tr',          { x:  18, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }, '<')
      .fromTo('.hero-comment',   { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4,  ease: 'power2.out' }, '-=0.15')
      .fromTo('.hero-name-jv',   { y:  50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9,  ease: 'power3.out' }, '-=0.2')
      .fromTo('.hero-name-bs',   { y:  36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' }, '-=0.6')
      .fromTo('.hero-terminal',  { y:  10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4,  ease: 'power2.out' }, '-=0.3')
      .fromTo('.hero-role',      { y:   8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4,  ease: 'power2.out' }, '-=0.25')
      .fromTo('.hero-tech',      { y:   8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }, '-=0.25')
      .fromTo('.hero-cta',       { y:   6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3,  ease: 'power2.out' }, '-=0.2')
      .fromTo('.hc-bl',          { y:   8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }, '-=0.25')
      .fromTo('.hc-br',          { y:   8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }, '<')
  }, { scope: containerRef })

  return (
    <section
      id="inicio"
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <h1 className="sr-only">João Vitor Barbosa — Full Stack Developer</h1>

      {/* Corner brackets */}
      <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
        <div className="absolute top-4 left-4 w-5 h-5 border-t border-l border-purple-500/[0.18]" />
        <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-purple-500/[0.18]" />
        <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l border-purple-500/[0.18]" />
        <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r border-purple-500/[0.18]" />
      </div>

      {/* Left vertical */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10 hidden xl:flex" aria-hidden="true">
        <span className="font-mono text-[8px] tracking-[0.38em] text-white/[0.07] uppercase select-none"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          FULL · STACK · DEVELOPER · 2026
        </span>
      </div>

      {/* Right vertical */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2 z-10 hidden xl:flex" aria-hidden="true">
        <span className="font-mono text-[8px] tracking-[0.38em] text-white/[0.06] uppercase select-none"
          style={{ writingMode: 'vertical-rl' }}>
          github.com/raaywasdead
        </span>
      </div>


      {/* ── TL ── */}
      <div className="hc-tl absolute top-[6.5rem] left-5 md:left-10 z-10 flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-purple-700/80">{'// '}</span>
          <span className="font-mono text-[10px] tracking-[0.22em] text-white/[0.22] uppercase">full_stack_dev</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-white/[0.15] border border-white/[0.07] px-1.5 py-0.5 tracking-widest">{clock} {tzLabel}</span>
        </div>
      </div>

      {/* ── TR ── */}
      <div className="hc-tr absolute top-[6.5rem] right-5 md:right-10 z-10 flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] tracking-[0.2em] text-emerald-400/75 uppercase">open_to_work</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 7px rgba(52,211,153,0.9)' }} />
        </div>
        <span className="font-mono text-[9px] tracking-[0.18em] text-white/[0.16] uppercase hidden sm:inline">{t.available}</span>
        <button
          onClick={toggle}
          aria-label="Toggle language"
          className="inline-flex items-center font-mono text-[9px] tracking-[0.2em] uppercase transition-all duration-200 active:scale-95 overflow-hidden gap-1.5 pr-1.5"
          style={{ border: '1px solid rgba(124,58,237,0.35)', background: 'rgba(124,58,237,0.06)' }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,0.5)" strokeWidth="1.8" className="ml-1.5 flex-shrink-0">
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          <span
            className="px-2 py-[3px] transition-all duration-200"
            style={{
              background: lang === 'pt' ? '#7c3aed' : 'transparent',
              color: lang === 'pt' ? '#fff' : 'rgba(255,255,255,0.25)',
            }}
          >PT</span>
          <span style={{ color: 'rgba(124,58,237,0.4)' }}>/</span>
          <span
            className="px-2 py-[3px] transition-all duration-200"
            style={{
              background: lang === 'en' ? '#7c3aed' : 'transparent',
              color: lang === 'en' ? '#fff' : 'rgba(255,255,255,0.25)',
            }}
          >EN</span>
        </button>
      </div>

      {/* ── BL (desktop only) ── */}
      <div className="hc-bl absolute bottom-7 left-5 md:left-10 z-10 hidden sm:flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400/80" style={{ boxShadow: '0 0 6px rgba(74,222,128,0.8)' }} />
          <span className="font-mono text-[10px] tracking-[0.2em] text-white/[0.22] uppercase">available_for_hire</span>
        </div>
        <span className="font-mono text-[9px] tracking-[0.16em] text-white/[0.1] uppercase">LAT -30.03 · LNG -51.22 · BR</span>
      </div>

      {/* ── Mobile socials — centered bottom ── */}
      <div className="hc-bl absolute bottom-6 left-0 right-0 z-10 flex sm:hidden items-center justify-center gap-4">
        {SOCIALS.map(({ href, icon: Icon, label }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer"
            className="text-white/[0.22] hover:text-purple-400 transition-colors duration-200" aria-label={label}>
            <Icon size={14} />
          </a>
        ))}
      </div>

      {/* ── BR ── */}
      <div className="hc-br absolute bottom-5 right-5 md:right-10 z-10 flex items-center gap-3">
        <div className="hidden md:flex flex-col items-end gap-1.5">
          <span className="font-mono text-[9px] tracking-[0.2em] text-white/[0.2] uppercase">Vol.01 · 2026</span>
          <div className="flex items-center gap-3">
            {SOCIALS.map(({ href, icon: Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="text-white/[0.15] hover:text-purple-400 transition-colors duration-200" aria-label={label}>
                <Icon size={12} />
              </a>
            ))}
          </div>
        </div>
        <div className="relative hidden md:flex items-center justify-center">
          <CircularText text="JOÃO·VITOR·BARBOSA·DEV·2026·" size={95} speed={22} />
          <div className="absolute w-1.5 h-1.5 bg-purple-500 rounded-full"
            style={{ boxShadow: '0 0 8px rgba(147,51,234,0.9)' }} />
        </div>
      </div>

      {/* ── CENTER ─────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-5 w-full max-w-3xl pt-10 sm:pt-0"
        style={{ gap: '1.1rem' }}>

        {/* Code comment */}
        <div className="hero-comment self-center font-mono text-[11px] text-zinc-600 flex items-center gap-1.5">
          <span className="text-purple-700">{'// '}</span>
          <span>joao_vitor.dev</span>
          <Cursor />
        </div>

        {/* Name */}
        <div style={{ lineHeight: 1.05, paddingTop: '0.25rem', overflow: 'visible' }}>
          <span
            className="hero-name-jv font-heading font-black tracking-tight select-none block hero-glitch"
            style={{
              fontSize: 'clamp(2rem, 7.5vw, 6.5rem)',
              letterSpacing: '-0.03em',
              color: 'transparent',
              WebkitTextStroke: '1.5px rgba(255,255,255,0.8)',
            }}
            aria-hidden="true"
          >
            JOÃO VITOR
          </span>
          <ScrambleText
            text="BARBOSA"
            delay={650}
            className="hero-name-bs font-heading font-black tracking-tight select-none block"
            style={{
              fontSize: 'clamp(1.8rem, 6.5vw, 5.5rem)',
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #e879f9 0%, #c026d3 35%, #a855f7 65%, #7e22ce 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 28px rgba(168,85,247,0.65)) drop-shadow(0 0 55px rgba(168,85,247,0.2))',
            }}
          />
        </div>

        {/* Terminal line */}
        <div className="hero-terminal self-center font-mono text-[11px] text-zinc-500 flex items-center gap-2">
          <span className="text-green-400 text-xs">$</span>
          <span>{t.terminal}</span>
        </div>

        {/* Role divider */}
        <div className="hero-role flex items-center gap-3 w-full max-w-xs">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(139,92,246,0.3))' }} />
          <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-white/25">
            <RotatingText />
          </span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(139,92,246,0.3))' }} />
        </div>

        {/* Tech mini cards */}
        <div className="hero-tech grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2">
          {STACK.map(({ name, icon: Icon, color }) => (
            <div key={name}
              className="flex items-center gap-2 px-3.5 py-2 border bg-white/[0.015] transition-all duration-200 hover:bg-white/[0.04] cursor-default"
              style={{ borderColor: `${color}22` }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = `${color}55`)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = `${color}22`)}
            >
              <Icon size={11} style={{ color, opacity: 0.8 }} />
              <span className="font-mono text-[9px] tracking-[0.14em] uppercase"
                style={{ color: 'rgba(255,255,255,0.28)' }}>
                {name}
              </span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="hero-cta flex gap-3 flex-wrap justify-center items-center">
          <a
            href="#contato"
            onClick={e => { e.preventDefault(); document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="inline-flex items-center gap-2 px-7 py-3 font-mono font-bold text-[10px] tracking-[0.22em] uppercase text-white transition-all duration-300 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #6d28d9, #9333ea)',
              clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
              boxShadow: '0 0 0 rgba(147,51,234,0)',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 28px rgba(147,51,234,0.45)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 0 rgba(147,51,234,0)')}
          >
            {t.contact}
          </a>
          <a
            href="#projetos"
            onClick={e => { e.preventDefault(); document.querySelector('#projetos')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="inline-flex items-center gap-2 px-7 py-3 font-mono font-bold text-[10px] tracking-[0.22em] uppercase transition-all duration-300 active:scale-95"
            style={{
              color: 'rgba(255,255,255,0.38)',
              border: '1px solid rgba(255,255,255,0.1)',
              clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
              e.currentTarget.style.borderColor = 'rgba(147,51,234,0.4)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.38)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            }}
          >
            {t.projects}
          </a>

        </div>
      </div>
    </section>
  )
}
