import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { FiLayout, FiGlobe, FiLayers, FiDatabase, FiMonitor, FiTool } from 'react-icons/fi'
import type { ReactNode } from 'react'
import { useLang } from '@/contexts/LanguageContext'
import { i18n } from '@/data/i18n'

gsap.registerPlugin(ScrollTrigger)

interface Service {
  num: string
  title: string
  desc: string
  tags: string[]
  icon: ReactNode
  details: string[]
}

const SERVICES_STATIC = [
  { num: '01', tags: ['React', 'TypeScript', 'Tailwind', 'GSAP'], icon: <FiLayout size={28} /> },
  { num: '02', tags: ['React', 'Node.js', 'PostgreSQL'],           icon: <FiGlobe size={18} /> },
  { num: '03', tags: ['React', 'TypeScript', 'Node.js', 'REST API', 'PostgreSQL'], icon: <FiLayers size={18} /> },
  { num: '04', tags: ['Node.js', 'PostgreSQL', 'REST API'],        icon: <FiDatabase size={18} /> },
  { num: '05', tags: ['GSAP', 'CSS', 'React', 'TypeScript'],       icon: <FiMonitor size={18} /> },
  { num: '06', tags: ['React', 'TypeScript', 'Node.js'],           icon: <FiTool size={18} /> },
]

let _featRaf = 0
const onFeaturedMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const { clientX, clientY } = e
  const el = e.currentTarget
  cancelAnimationFrame(_featRaf)
  _featRaf = requestAnimationFrame(() => {
    const r = el.getBoundingClientRect()
    const spot = el.querySelector<HTMLElement>('.feat-spotlight')
    if (spot) {
      spot.style.background = `radial-gradient(520px circle at ${clientX - r.left}px ${clientY - r.top}px, rgba(147,51,234,0.13), transparent 70%)`
      spot.style.opacity = '1'
    }
  })
}

const onFeaturedLeave = (e: React.MouseEvent<HTMLDivElement>) => {
  const spot = e.currentTarget.querySelector<HTMLElement>('.feat-spotlight')
  if (spot) spot.style.opacity = '0'
}

export const Services = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const [openRow, setOpenRow] = useState<string | null>(null)
  const { lang } = useLang()
  const t = i18n[lang].services
  const SERVICES: Service[] = SERVICES_STATIC.map((s, i) => ({ ...s, ...t.items[i] }))

  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return

    const badge = section.querySelector('.services-badge')
    const title = section.querySelector('.services-title')
    const sub   = section.querySelector('.services-sub')
    const feat  = section.querySelector('.services-featured')
    const rows  = section.querySelectorAll('.service-row')

    gsap.set([badge, title, sub, feat, ...Array.from(rows)], { opacity: 0, y: 32 })

    ScrollTrigger.create({
      trigger: section,
      start: 'top 58%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline()
        tl.to(badge, { opacity: 1, y: 0, duration: 0.5 })
          .to(title,  { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
          .to(sub,    { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
          .to(feat,   { opacity: 1, y: 0, duration: 0.75, ease: 'power2.out' }, '-=0.3')
          .to(rows,   { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '-=0.2')
      },
    })
  }, { scope: sectionRef })

  const [featured, ...rest] = SERVICES

  const toggle = (num: string) => setOpenRow(prev => prev === num ? null : num)

  return (
    <section id="servicos" ref={sectionRef} className="relative py-24 md:py-32">

      <div className="max-w-7xl mx-auto px-5 md:px-10">

        {/* Header */}
        <div className="max-w-2xl mb-14">
          <div className="services-badge flex items-center gap-3 mb-4">
            <span className="font-mono text-[9px] tracking-[0.12em] text-white/22 border border-white/[0.07] px-2 py-0.5">03-25</span>
            <span className="w-5 h-px bg-purple-500/30" />
            <span className="shiny-text font-mono text-[9px] tracking-[0.28em] uppercase">{t.badge}</span>
          </div>
          <h2 className="services-title font-display uppercase text-5xl md:text-6xl mb-4 leading-none tracking-wide">
            {t.h2a}{' '}
            <span className="text-purple-400">
              {t.h2b}
            </span>
          </h2>
          <p className="services-sub text-white/50 text-base leading-relaxed">
            {t.sub}
          </p>
        </div>

        {/* ── Featured card (01) — always expanded ── */}
        <div
          className="services-featured relative overflow-hidden mb-4 cursor-default group"
          onMouseMove={onFeaturedMove}
          onMouseLeave={onFeaturedLeave}
        >
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 65% 90% at 0% 50%, rgba(109,40,217,0.28) 0%, transparent 65%)' }} />
          <div className="absolute inset-0 " style={{ border: '1px solid rgba(124,58,237,0.28)' }} />
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, rgba(168,85,247,0.75), rgba(124,58,237,0.25), transparent)' }} />
          <div className="feat-spotlight absolute inset-0 pointer-events-none  transition-opacity duration-300" style={{ opacity: 0 }} />

          <div className="relative z-10 flex flex-col gap-6 p-5 sm:p-8 md:p-12">
            {/* Icon */}
            <div
              className="w-14 h-14 flex items-center justify-center text-purple-300 flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
              style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.35)' }}
            >
              {featured.icon}
            </div>

            {/* Title */}
            <h3
              className="font-heading font-black text-white leading-[1.05] group-hover:text-purple-50 transition-colors duration-300"
              style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.8rem)' }}
            >
              {featured.title}
            </h3>

            {/* Description */}
            <p className="text-white/50 text-base leading-[1.8] max-w-xl group-hover:text-white/65 transition-colors duration-300">
              {featured.desc}
            </p>

            {/* Details */}
            <ul className="flex flex-col gap-2">
              {featured.details.map((d) => (
                <li key={d} className="flex items-start gap-2.5 text-sm text-white/40 group-hover:text-white/55 transition-colors duration-300">
                  <span className="mt-[5px] w-1 h-1 rounded-full bg-purple-400/60 flex-shrink-0" />
                  {d}
                </li>
              ))}
            </ul>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {featured.tags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 text-xs font-medium border"
                  style={{ background: 'rgba(124,58,237,0.12)', borderColor: 'rgba(124,58,237,0.3)', color: 'rgba(196,181,253,0.85)' }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Service rows (02–06) — expandable ── */}
        <div className="flex flex-col">
          {rest.map((s) => {
            const isOpen = openRow === s.num
            return (
              <div
                key={s.num}
                className="service-row"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                {/* Clickable header row */}
                <button
                  onClick={() => toggle(s.num)}
                  className="group relative w-full flex items-start gap-5 md:gap-8 py-7 cursor-pointer transition-all duration-300 px-3 -mx-3 hover:bg-white/[0.025] text-left"
                  aria-expanded={isOpen}
                >
                  {/* Left accent */}
                  <div
                    className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-purple-500 transition-opacity duration-300"
                    style={{ opacity: isOpen ? 1 : 0 }}
                  />

                  {/* Icon + title + desc + tags */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div
                        className="w-7 h-7 flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                        style={{
                          background: isOpen ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.1)',
                          color: isOpen ? 'rgba(196,181,253,0.9)' : 'rgba(167,139,250,0.65)',
                        }}
                      >
                        {s.icon}
                      </div>
                      <h3
                        className="font-heading font-bold text-base md:text-lg transition-colors duration-300"
                        style={{ color: isOpen ? '#fff' : 'rgba(255,255,255,0.75)' }}
                      >
                        {s.title}
                      </h3>
                    </div>
                    <p className="text-white/35 text-sm leading-relaxed mb-3 group-hover:text-white/52 transition-colors duration-300 max-w-xl">
                      {s.desc}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {s.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 text-[10px] font-medium border text-white/25 transition-colors duration-200"
                          style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.07)' }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Toggle button */}
                  <div className="flex-shrink-0 pt-1">
                    <div
                      className="w-8 h-8 flex items-center justify-center transition-all duration-300"
                      style={{
                        border: isOpen ? '1px solid rgba(124,58,237,0.45)' : '1px solid rgba(255,255,255,0.08)',
                        background: isOpen ? 'rgba(124,58,237,0.12)' : 'transparent',
                        color: isOpen ? 'rgba(196,181,253,0.9)' : 'rgba(255,255,255,0.18)',
                      }}
                    >
                      <svg
                        width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                        style={{ transition: 'transform 0.3s ease', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Expandable details */}
                <div
                  className="overflow-hidden"
                  style={{
                    maxHeight: isOpen ? '320px' : '0px',
                    opacity: isOpen ? 1 : 0,
                    transition: isOpen
                      ? 'max-height 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease 0.15s'
                      : 'max-height 0.45s cubic-bezier(0.4, 0, 1, 1), opacity 0.2s ease',
                  }}
                >
                  <ul className="flex flex-col gap-2.5 pb-7 pl-4 md:pl-[4.5rem] pr-4 md:pr-14">
                    {s.details.map((d) => (
                      <li key={d} className="flex items-start gap-3 text-sm text-white/45">
                        <span className="mt-[6px] w-1 h-1 rounded-full bg-purple-400/55 flex-shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
