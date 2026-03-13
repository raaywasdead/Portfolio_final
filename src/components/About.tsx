import { useRef, useState, useEffect, useCallback, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { asset } from '@/utils/asset'
import { useLang } from '@/contexts/LanguageContext'
import { i18n } from '@/data/i18n'
import {
  SiHtml5, SiCss, SiJavascript, SiTypescript, SiReact,
  SiNodedotjs, SiPostgresql, SiGit, SiVite, SiGoogleauthenticator, SiOpenai, SiTailwindcss,
} from 'react-icons/si'
import { VscVscode } from 'react-icons/vsc'
import { TbApi } from 'react-icons/tb'
import { FiCode, FiDatabase, FiSettings } from 'react-icons/fi'

gsap.registerPlugin(ScrollTrigger)

/* ─────────────────────────────────────────
   useDragScroll
   Returns ref + handlers for mouse/touch drag-scroll.
   Also exposes `isDragging` so buttons can ignore clicks mid-drag.
───────────────────────────────────────── */
function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const isDragging = useRef(false)
  const moved = useRef(false)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    isDragging.current = true
    moved.current = false
    startX.current = e.pageX - el.offsetLeft
    scrollLeft.current = el.scrollLeft
    el.style.cursor = 'grabbing'
    el.style.userSelect = 'none'
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return
    const el = ref.current
    if (!el) return
    const x = e.pageX - el.offsetLeft
    const walk = (x - startX.current) * 1.2
    if (Math.abs(walk) > 4) moved.current = true
    el.scrollLeft = scrollLeft.current - walk
  }, [])

  const onMouseUp = useCallback(() => {
    isDragging.current = false
    const el = ref.current
    if (el) { el.style.cursor = ''; el.style.userSelect = '' }
  }, [])

  // Touch
  // Touch: delegate entirely to native scroll (touch-action: pan-x on container)
  const onTouchStart = useCallback(() => {}, [])
  const onTouchMove  = useCallback(() => {}, [])
  const onTouchEnd   = useCallback(() => {}, [])

  const wasDragged = useCallback(() => moved.current, [])

  return {
    ref,
    handlers: { onMouseDown, onMouseMove, onMouseUp, onMouseLeave: onMouseUp, onTouchStart, onTouchMove, onTouchEnd },
    wasDragged,
  }
}

type TechItem = { label: string; color: string; bg: string; border: string; icon: ReactNode }

const TECH_ICONS: TechItem[] = [
  { label: 'HTML5',      color: '#E34F26', bg: 'rgba(227,79,38,0.1)',   border: 'rgba(227,79,38,0.22)',   icon: <SiHtml5      size={22} color="#E34F26" /> },
  { label: 'CSS3',       color: '#264de4', bg: 'rgba(38,77,228,0.1)',   border: 'rgba(38,77,228,0.22)',   icon: <SiCss        size={22} color="#264de4" /> },
  { label: 'JavaScript', color: '#F7DF1E', bg: 'rgba(247,223,30,0.1)', border: 'rgba(247,223,30,0.2)',   icon: <SiJavascript size={20} color="#F7DF1E" /> },
  { label: 'TypeScript', color: '#3178C6', bg: 'rgba(49,120,198,0.1)', border: 'rgba(49,120,198,0.22)', icon: <SiTypescript size={20} color="#3178C6" /> },
  { label: 'React',      color: '#61DAFB', bg: 'rgba(97,218,251,0.07)',border: 'rgba(97,218,251,0.18)', icon: <SiReact      size={22} color="#61DAFB" /> },
  { label: 'Node.js',    color: '#5FA04E', bg: 'rgba(95,160,78,0.1)',  border: 'rgba(95,160,78,0.22)',  icon: <SiNodedotjs  size={20} color="#5FA04E" /> },
  { label: 'PostgreSQL', color: '#336791', bg: 'rgba(51,103,145,0.1)', border: 'rgba(51,103,145,0.22)', icon: <SiPostgresql size={20} color="#336791" /> },
  { label: 'Git',        color: '#F05032', bg: 'rgba(240,80,50,0.1)',  border: 'rgba(240,80,50,0.22)',  icon: <SiGit        size={20} color="#F05032" /> },
  { label: 'VS Code',    color: '#007ACC', bg: 'rgba(0,122,204,0.09)', border: 'rgba(0,122,204,0.2)',   icon: <VscVscode    size={20} color="#007ACC" /> },
  { label: 'Tailwind',   color: '#38BDF8', bg: 'rgba(56,189,248,0.08)',border: 'rgba(56,189,248,0.2)',  icon: <SiTailwindcss size={20} color="#38BDF8" /> },
  { label: 'Vite',       color: '#646CFF', bg: 'rgba(100,108,255,0.1)',border: 'rgba(100,108,255,0.22)',icon: <SiVite       size={20} color="#646CFF" /> },
  { label: 'REST API',   color: '#22D3EE', bg: 'rgba(34,211,238,0.07)',border: 'rgba(34,211,238,0.18)', icon: <TbApi        size={22} color="#22D3EE" /> },
  { label: 'Google Auth',color: '#4285F4', bg: 'rgba(66,133,244,0.08)',border: 'rgba(66,133,244,0.18)', icon: <SiGoogleauthenticator size={20} color="#4285F4" /> },
  { label: 'IA / OpenAI',color: '#10A37F', bg: 'rgba(16,163,127,0.1)', border: 'rgba(16,163,127,0.22)',icon: <SiOpenai     size={20} color="#10A37F" /> },
]

const GAMES_BASE = [
  { name: 'Undertale',            image: 'IMG/game-undertale.webp',        genre: 'RPG'           },
  { name: 'Deltarune',            image: 'IMG/game-deltarune.webp',        genre: 'RPG'           },
  { name: 'Elden Ring',           image: 'IMG/game-eldenring.webp',        genre: 'Soulslike'     },
  { name: 'Dark Souls',           image: 'IMG/game-darksouls.webp',        genre: 'Soulslike'     },
  { name: 'Terraria',             image: 'IMG/game-terraria.webp',         genre: 'Survival'      },
  { name: 'Ultrakill',            image: 'IMG/game-ultrakill.webp',        genre: 'FPS'           },
  { name: 'The Binding of Isaac', image: 'IMG/game-isaac.webp',            genre: 'Roguelike'     },
  { name: 'Bloons TD6',           image: 'IMG/game-bloons.webp',           genre: 'Tower Defense' },
  { name: 'Brawl Stars',          image: 'IMG/game-brawlstars.webp',       genre: 'Multiplayer'   },
  { name: 'Dead Cells',           image: 'IMG/game-deadcells.webp',        genre: 'Roguelike'     },
  { name: 'Hotline Miami',        image: 'IMG/game-hotlinemiami.webp',     genre: 'Action'        },
  { name: 'Borderlands 2',        image: 'IMG/game-borderlands2.webp',     genre: 'Looter Shooter'},
  { name: 'Minecraft',            image: 'IMG/game-minecraft.webp',        genre: 'Sandbox'       },
  { name: 'Omori',                image: 'IMG/game-omori.webp',            genre: 'RPG'           },
  { name: 'GTA 5',                image: 'IMG/game-gta5.webp',             genre: 'Open World'    },
  { name: 'Black Ops 2',          image: 'IMG/game-cod-bo2.webp',          genre: 'FPS'           },
  { name: 'Vampire Survivors',    image: 'IMG/game-vampiresurvivors.webp', genre: 'Roguelike'     },
  { name: 'Megabonk',             image: 'IMG/game-megabonk.webp',         genre: 'Roguelike'     },
]


type SoftIcon = { icon: ReactNode; extra?: ReactNode }
const SOFT_ICONS: SoftIcon[] = [
  { icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> },
  { icon: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></> },
  { icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> },
  { icon: <polyline points="23 4 23 10 17 10" />, extra: <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /> },
  { icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></> },
  { icon: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /> },
]

function StatCounter({ value, active }: { value: string; active: boolean }) {
  const num = parseFloat(value)
  const isNumeric = !isNaN(num)
  const [display, setDisplay] = useState(isNumeric ? '0' : value)
  const hasRun = useRef(false)

  if (isNumeric && active && !hasRun.current) {
    hasRun.current = true
    const suffix = value.replace(/^[\d.]+/, '')
    const start = performance.now()
    const dur = 1100
    const run = (now: number) => {
      const t = Math.min((now - start) / dur, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.ceil(num * ease) + suffix)
      if (t < 1) requestAnimationFrame(run)
      else setDisplay(value)
    }
    requestAnimationFrame(run)
  }

  return <>{isNumeric ? (active ? display : '0') : value}</>
}

export const About = () => {
  const { lang } = useLang()
  const t = i18n[lang].about
  const GAMES = GAMES_BASE.map((g, i) => ({ ...g, desc: t.gameDescs[i] }))

  const sectionRef = useRef<HTMLElement>(null)
  const [statsActive, setStatsActive] = useState(false)
  const [openedIdx, setOpenedIdx] = useState<number | null>(null)
  const modalOverlayRef = useRef<HTMLDivElement>(null)
  const modalCardRef = useRef<HTMLDivElement>(null)
  const modalContentRef = useRef<HTMLDivElement>(null)
  const isAnimRef = useRef(false)

  // Drag-scroll hook for the bookshelf
  const { ref: shelfRef, handlers: shelfHandlers, wasDragged } = useDragScroll<HTMLDivElement>()

  const openBook = (idx: number) => {
    // Don't open if user was dragging
    if (wasDragged()) return
    if (isAnimRef.current) return
    isAnimRef.current = true
    setOpenedIdx(idx)
  }

  useEffect(() => {
    if (openedIdx === null) return
    const bookBtn = document.querySelector(`[data-book-idx="${openedIdx}"]`) as HTMLElement
    const overlay = modalOverlayRef.current
    const card = modalCardRef.current
    const content = modalContentRef.current
    if (!bookBtn || !overlay || !card) { isAnimRef.current = false; return }

    const rect = bookBtn.getBoundingClientRect()
    const targetW = Math.min(window.innerWidth * 0.9, 500)
    const targetH = Math.min(window.innerHeight * 0.88, 560)
    const targetL = (window.innerWidth - targetW) / 2
    const targetT = (window.innerHeight - targetH) / 2

    overlay.style.display = 'flex'
    if (content) gsap.set(content, { opacity: 0 })
    gsap.set(card, { top: rect.top, left: rect.left, width: rect.width, height: rect.height, borderRadius: '3px' })
    gsap.set(overlay, { opacity: 0 })

    gsap.to(overlay, { opacity: 1, duration: 0.28 })
    gsap.to(card, {
      top: targetT, left: targetL, width: targetW, height: targetH, borderRadius: '16px',
      duration: 0.52, ease: 'power3.out',
      onComplete: () => {
        if (content) gsap.to(content, { opacity: 1, y: 0, duration: 0.22 })
        isAnimRef.current = false
      },
    })
  }, [openedIdx])

  const closeBook = () => {
    if (isAnimRef.current || openedIdx === null) return
    const bookBtn = document.querySelector(`[data-book-idx="${openedIdx}"]`) as HTMLElement
    const overlay = modalOverlayRef.current
    const card = modalCardRef.current
    const content = modalContentRef.current
    if (!bookBtn || !overlay || !card) return
    isAnimRef.current = true

    const rect = bookBtn.getBoundingClientRect()
    if (content) gsap.to(content, { opacity: 0, duration: 0.15 })
    gsap.to(overlay, { opacity: 0, duration: 0.3, delay: 0.15 })
    gsap.to(card, {
      top: rect.top, left: rect.left, width: rect.width, height: rect.height, borderRadius: '3px',
      duration: 0.44, ease: 'power3.in',
      onComplete: () => {
        overlay.style.display = 'none'
        setOpenedIdx(null)
        isAnimRef.current = false
      },
    })
  }

  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return

    const items = section.querySelectorAll('.ab-item')
    const gameRows = section.querySelectorAll('.game-row')

    gsap.set([...Array.from(items), ...Array.from(gameRows)], { clearProps: 'opacity,transform' })
    gsap.set(items, { opacity: 0, y: 28 })
    gsap.set(gameRows, { opacity: 0, x: -16 })

    ScrollTrigger.create({
      trigger: section,
      start: 'top 62%',
      once: true,
      onEnter: () => {
        setStatsActive(true)
        gsap.to(items, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' })
      },
    })

    ScrollTrigger.create({
      trigger: '.games-section',
      start: 'top 70%',
      once: true,
      onEnter: () => {
        gsap.to(gameRows, { opacity: 1, x: 0, duration: 0.45, stagger: 0.07, ease: 'power2.out', clearProps: 'transform' })
      },
    })

  }, { scope: sectionRef })

  return (
    <section id="sobre" ref={sectionRef} className="relative py-24 md:py-36">

      <div className="max-w-7xl mx-auto px-5 md:px-10">

        {/* ── 1. Intro ── */}
        <div className="ab-item mb-20 max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-[9px] tracking-[0.12em] text-white/22 border border-white/[0.07] px-2 py-0.5">02-25</span>
            <span className="w-5 h-px bg-purple-500/30" />
            <span className="shiny-text font-mono text-[9px] tracking-[0.28em] uppercase">{t.badge}</span>
          </div>

          <h2
            className="font-display uppercase leading-none tracking-wide mb-8"
            style={{ fontSize: 'clamp(3rem, 5.5vw, 5.5rem)' }}
          >
            {t.h2a}<br />
            <span className="text-purple-400">
              {t.h2b}
            </span>
          </h2>

          <div className="space-y-4 mb-8">
            <p className="text-white/55 text-base leading-[1.85]">{t.bio1}</p>
            <p className="text-white/55 text-base leading-[1.85]">{t.bio2}</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <a
              href={asset('João Vitor B.S - Currículo.pdf')}
              download
              aria-label="Baixar currículo em formato PDF"
              className="inline-flex items-center gap-2 px-5 py-2.5 font-mono font-semibold text-white text-[10px] tracking-[0.18em] uppercase w-fit transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 10px 28px rgba(147,51,234,0.45)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {t.resume}
            </a>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/35 text-xs">{t.location}</span>
            </div>
          </div>
        </div>

        {/* ── 3. Tecnologias com categorias ── */}
        <div className="ab-item mb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-mono text-[9px] tracking-[0.12em] text-white/22 border border-white/[0.07] px-2 py-0.5">TCH</span>
            <span className="w-4 h-px bg-purple-500/30" />
            <span className="shiny-text font-mono text-[9px] tracking-[0.28em] uppercase">{t.techBadge}</span>
          </div>
          <div className="tech-categories grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: t.categories[0], items: TECH_ICONS.filter(ti => ['HTML5','CSS3','JavaScript','TypeScript','React','Tailwind','Vite'].includes(ti.label)) },
              { label: t.categories[1], items: TECH_ICONS.filter(ti => ['Node.js','PostgreSQL','REST API'].includes(ti.label)) },
              { label: t.categories[2], items: TECH_ICONS.filter(ti => ['Git','VS Code','Google Auth','IA / OpenAI'].includes(ti.label)) },
            ].map(({ label, items }) => (
              <div
                key={label}
                className="shine-border relative flex flex-col gap-5 p-6 overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="absolute -bottom-4 -right-4 pointer-events-none select-none text-purple-500/[0.06]">
                  {label === 'Frontend' ? <FiCode size={120} /> : label === 'Backend' ? <FiDatabase size={120} /> : <FiSettings size={120} />}
                </div>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 flex items-center justify-center flex-shrink-0 text-purple-400/80"
                    style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.22)' }}
                  >
                    {label === 'Frontend' ? <FiCode size={13} /> : label === 'Backend' ? <FiDatabase size={13} /> : <FiSettings size={13} />}
                  </div>
                  <p className="text-xs font-semibold text-white/50 uppercase tracking-[0.15em]">{label}</p>
                  <span className="ml-auto text-[10px] font-bold text-white/20">{items.length}</span>
                </div>
                <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                  {items.map((item) => (
                    <div
                      key={item.label}
                      className="group flex flex-col items-center gap-2 cursor-default"
                      onMouseEnter={e => {
                        const card = e.currentTarget.querySelector<HTMLElement>('[data-icon-card]')
                        if (card) card.style.boxShadow = `0 0 20px 3px ${item.color}40`
                      }}
                      onMouseLeave={e => {
                        const card = e.currentTarget.querySelector<HTMLElement>('[data-icon-card]')
                        if (card) card.style.boxShadow = 'none'
                      }}
                    >
                      <div
                        data-icon-card=""
                        className="w-[52px] h-[52px] rounded-sm flex items-center justify-center group-hover:scale-[1.14] group-hover:-translate-y-1"
                        style={{
                          background: item.bg,
                          border: `1px solid ${item.border}`,
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          willChange: 'transform',
                        }}
                      >
                        {item.icon}
                      </div>
                      <span className="text-[9px] font-medium text-white/28 tracking-wide text-center leading-tight" style={{ maxWidth: '52px' }}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. Education + Soft Skills ── */}
        <div className="ab-item grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">

          {/* Education */}
          <div className="p-5 md:p-7" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-3 mb-7">
              <span className="font-mono text-[9px] tracking-[0.12em] text-white/22 border border-white/[0.07] px-2 py-0.5">EDU</span>
              <span className="w-4 h-px bg-purple-500/30" />
              <span className="shiny-text font-mono text-[9px] tracking-[0.28em] uppercase">{t.eduBadge}</span>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 flex flex-col items-center gap-0 pt-1">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.35)' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,0.9)" strokeWidth="2.2">
                    <path d="M22 10v6M2 10l10-7 10 7-10 7-10-7z" />
                  </svg>
                </div>
                <div className="w-px flex-1 mt-2" style={{ background: 'rgba(124,58,237,0.2)', minHeight: '100px' }} />
              </div>
              <div className="flex flex-col gap-4 flex-1 pt-0.5">
                {t.education.map((e, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex items-center flex-shrink-0 mt-3">
                      <div className="w-4 h-px" style={{ background: e.highlight ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.1)' }} />
                      <div className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: e.highlight ? '#a78bfa' : 'rgba(255,255,255,0.18)' }} />
                    </div>
                    <div className="flex-1 pb-1">
                      <p className="text-[9px] font-bold uppercase tracking-widest mb-1"
                        style={{ color: e.highlight ? 'rgba(167,139,250,0.65)' : 'rgba(255,255,255,0.2)' }}>{e.year}</p>
                      <p className={`text-sm font-semibold mb-0.5 ${e.highlight ? 'text-white' : 'text-white/50'}`}>{e.title}</p>
                      <p className="text-[11px] text-white/28">
                        {e.place}{e.note && <span style={{ color: 'rgba(167,139,250,0.5)' }}> — {e.note}</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Soft Skills */}
          <div className="p-5 md:p-7" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-3 mb-7">
              <span className="font-mono text-[9px] tracking-[0.12em] text-white/22 border border-white/[0.07] px-2 py-0.5">SSK</span>
              <span className="w-4 h-px bg-purple-500/30" />
              <span className="shiny-text font-mono text-[9px] tracking-[0.28em] uppercase">{t.softBadge}</span>
            </div>
            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3">
              {SOFT_ICONS.map((s, i) => (
                <div
                  key={t.softSkills[i]}
                  className="group flex items-center gap-3 p-3 cursor-default transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.3)'; (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.07)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)' }}
                >
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center transition-colors duration-200"
                    style={{ background: 'rgba(124,58,237,0.12)' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(167,139,250,0.75)" strokeWidth="2">
                      {s.icon}
                      {s.extra}
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-white/50 group-hover:text-white/80 transition-colors duration-200 leading-tight">
                    {t.softSkills[i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── 5. Divider ── */}
        <div className="ab-item flex items-center gap-5 mb-14">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(124,58,237,0.35))' }} />
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-purple-500/60">
            {t.divider}
          </span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(124,58,237,0.35))' }} />
        </div>

        {/* ── 6. Games ── */}
        <div className="games-section">
          <div className="ab-item mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="font-mono text-[9px] tracking-[0.12em] text-white/22 border border-white/[0.07] px-2 py-0.5">GME</span>
              <span className="w-4 h-px bg-purple-500/30" />
              <span className="shiny-text font-mono text-[9px] tracking-[0.28em] uppercase">{t.gameBadge}</span>
            </div>
            <p
              className="font-display uppercase leading-none tracking-wide text-white mb-4"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}
            >
              {t.gameH2}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-300">
                {t.gameH2Highlight}
              </span>
            </p>
            <p className="text-white/42 text-sm leading-[1.85] max-w-lg mb-6">
              {t.gameSub}
            </p>
            <div className="flex flex-wrap gap-2">
              {['RPG', 'Soulslike', 'Roguelike', 'Survival', 'Tower Defense', 'Platformer'].map(g => (
                <span
                  key={g}
                  className="px-3 py-1 text-[11px] font-mono font-medium cursor-default tracking-wider uppercase"
                  style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.22)', color: 'rgba(196,181,253,0.7)' }}
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* ── Bookshelf — draggable on mobile ── */}
          <div
            ref={shelfRef}
            {...shelfHandlers}
            className="-mx-5 px-5 sm:mx-0 sm:px-0 games-scroll"
            style={{
              overflowX: 'auto',
              overflowY: 'hidden',
              cursor: 'grab',
              scrollbarWidth: 'none',
              touchAction: 'pan-x',
              overscrollBehaviorX: 'contain',
            } as React.CSSProperties}
          >
            {/* hide scrollbar for webkit */}
            <style>{`.games-scroll::-webkit-scrollbar { display: none; }`}</style>

            <div style={{ minWidth: 480 }}>
              {([
                { start: 0,  games: GAMES.slice(0, 6)  },
                { start: 6,  games: GAMES.slice(6, 12) },
                { start: 12, games: GAMES.slice(12)    },
              ] as { start: number; games: typeof GAMES }[]).map(({ start, games: row }, rowIdx) => (
                <div key={rowIdx} style={{ marginBottom: rowIdx < 2 ? '1.75rem' : '0' }}>

                  {/* Shelf niche */}
                  <div style={{ display: 'flex', alignItems: 'stretch' }}>
                    {/* Left wall */}
                    <div className="shelf-wall" style={{
                      background: 'linear-gradient(to right, #04030a 0%, #0b0916 70%, #080613 100%)',
                      borderTop: '1px solid rgba(255,255,255,0.03)',
                      borderLeft: '2px solid rgba(35,22,65,0.85)',
                      boxShadow: 'inset -6px 0 12px rgba(0,0,0,0.5)',
                    }} />

                    {/* Back wall + books */}
                    <div
                      className="relative overflow-hidden"
                      style={{
                        flex: 1,
                        background: '#07050e',
                        borderTop: '1px solid rgba(255,255,255,0.03)',
                        padding: '18px 10px 0 10px',
                      }}
                    >
                      <div className="absolute inset-0 pointer-events-none" style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 47px, rgba(255,255,255,0.012) 47px, rgba(255,255,255,0.012) 48px)',
                      }} />
                      <div className="absolute inset-0 pointer-events-none" style={{
                        boxShadow: 'inset 0 14px 28px rgba(0,0,0,0.75), inset 0 -6px 14px rgba(0,0,0,0.35)',
                      }} />
                      <div className="absolute inset-0 pointer-events-none" style={{
                        background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,255,255,0.022), transparent 55%)',
                      }} />

                      {/* Books */}
                      <div className="relative z-10 flex items-end gap-[10px] pb-[2px]">
                        {row.map((g, i) => {
                          const idx = start + i
                          return (
                            <button
                              key={g.name}
                              onClick={() => openBook(idx)}
                              title={g.name}
                              aria-label={`Abrir detalhes de ${g.name}`}
                              data-book-idx={idx}
                              className="game-row group relative overflow-hidden focus:outline-none"
                              style={{
                                flex: '1',
                                aspectRatio: '2/3',
                                borderRadius: '2px 2px 0 0',
                                border: '1px solid rgba(255,255,255,0.04)',
                                boxShadow: '4px 0 14px rgba(0,0,0,0.65), -1px 0 5px rgba(0,0,0,0.4)',
                                filter: 'brightness(0.85)',
                                transition: 'filter 0.3s ease',
                                userSelect: 'none',
                              }}
                            >
                              <img
                                src={asset(g.image)}
                                alt={g.name}
                                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                                loading="lazy"
                                draggable={false}
                              />
                              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.6), transparent)' }} />
                              <div className="absolute inset-x-0 top-0 h-[5px] pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)' }} />
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: 'rgba(124,58,237,0.22)' }} />
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Right wall */}
                    <div className="shelf-wall" style={{
                      background: 'linear-gradient(to left, #04030a 0%, #0b0916 70%, #080613 100%)',
                      borderTop: '1px solid rgba(255,255,255,0.03)',
                      borderRight: '2px solid rgba(35,22,65,0.85)',
                      boxShadow: 'inset 6px 0 12px rgba(0,0,0,0.5)',
                    }} />
                  </div>

                  {/* Shelf plank */}
                  <div style={{ display: 'flex' }}>
                    <div className="shelf-wall" style={{ height: '16px', background: 'linear-gradient(135deg, #1a1109 0%, #0e0b05 100%)', borderLeft: '2px solid rgba(35,22,65,0.85)', borderTop: '1px solid rgba(110,75,20,0.22)' }} />
                    <div style={{
                      flex: 1, height: '16px',
                      background: 'linear-gradient(to bottom, #201711 0%, #150f09 55%, #0b0805 100%)',
                      borderTop: '1px solid rgba(140,95,28,0.22)',
                      boxShadow: 'inset 0 1px 0 rgba(200,145,45,0.07), inset 0 -1px 0 rgba(0,0,0,0.5)',
                    }} />
                    <div className="shelf-wall" style={{ height: '16px', background: 'linear-gradient(225deg, #1a1109 0%, #0e0b05 100%)', borderRight: '2px solid rgba(35,22,65,0.85)', borderTop: '1px solid rgba(110,75,20,0.22)' }} />
                  </div>

                  {/* Front edge shadow */}
                  <div style={{ display: 'flex' }}>
                    <div className="shelf-wall" style={{ height: '7px', background: '#060402', borderLeft: '2px solid rgba(25,15,50,0.7)' }} />
                    <div style={{ flex: 1, height: '7px', background: 'linear-gradient(to bottom, #0c0906 0%, #030201 100%)', boxShadow: '0 10px 32px rgba(0,0,0,0.95)' }} />
                    <div className="shelf-wall" style={{ height: '7px', background: '#060402', borderRight: '2px solid rgba(25,15,50,0.7)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ── Book modal ── */}
      <div
        ref={modalOverlayRef}
        style={{ display: 'none', opacity: 0 }}
        className="fixed inset-0 z-[9999] items-center justify-center"
        onClick={closeBook}
      >
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)' }} />
        <div
          ref={modalCardRef}
          className="fixed overflow-hidden"
          style={{ background: '#0e0e0e', border: '1px solid rgba(124,58,237,0.45)', boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(124,58,237,0.15)' }}
          onClick={e => e.stopPropagation()}
        >
          {openedIdx !== null && (() => {
            const g = GAMES[openedIdx]
            return (
              <>
                <img src={asset(g.image)} alt={g.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" draggable={false} />
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(5,2,12,1) 0%, rgba(5,2,12,0.92) 25%, rgba(5,2,12,0.55) 50%, transparent 75%)' }} />
                <button
                  onClick={closeBook}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-white/20 z-10"
                  style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.14)' }}
                  aria-label="Fechar"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                <div ref={modalContentRef} className="absolute bottom-0 left-0 right-0 px-7 pb-8 pt-4 z-10" style={{ opacity: 0 }}>
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest mb-3 w-fit"
                    style={{ background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.4)', color: 'rgba(196,181,253,0.9)' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                    {openedIdx === 1 ? 'Favorito' : g.genre}
                  </span>
                  <h3 className="font-heading font-black text-white text-3xl leading-tight mb-1">{g.name}</h3>
                  <p className="text-purple-300/55 text-xs font-medium mb-3">{g.genre}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{g.desc}</p>
                </div>
              </>
            )
          })()}
        </div>
      </div>
    </section>
  )
}