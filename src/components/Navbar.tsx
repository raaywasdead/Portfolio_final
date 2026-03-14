import { useState, useEffect, useCallback, useRef } from 'react'
let gsap: typeof import('gsap') | null = null;
const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
if (!isMobile) {
  gsap = require('gsap');
}
import { asset } from '@/utils/asset'
import { useLang } from '@/contexts/LanguageContext'
import { i18n } from '@/data/i18n'

const NAV_HREFS = ['#inicio', '#sobre', '#servicos', '#projetos', '#contato']
const NAV_NUMS  = ['01', '02', '03', '04', '05']

const SOCIALS = [
  {
    label: 'GitHub',
    href: 'https://github.com/raaywasdead',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/joaov-bds/',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
]

const scrollTo = (href: string) => {
  const target = document.querySelector(href)
  if (!target) return
  const y = (target as HTMLElement).getBoundingClientRect().top + window.pageYOffset - 80
  window.scrollTo({ top: y, behavior: 'smooth' })
}

export const Navbar = () => {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [active,    setActive]    = useState('inicio')
  const { lang } = useLang()
  const t = i18n[lang]
  const NAV_LINKS = NAV_HREFS.map((href, i) => ({ href, label: t.nav.links[i], num: NAV_NUMS[i] }))
  const headerRef   = useRef<HTMLElement>(null)
  const hiddenRef   = useRef(false)
  const lastYRef    = useRef(0)
  const scrollRafId = useRef(0)

  /* ── Smart hide / show on scroll direction ── */
  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(scrollRafId.current)
      scrollRafId.current = requestAnimationFrame(() => {
        const y      = window.scrollY
        const atTop  = y < 80
        const goDown = y > lastYRef.current

        setScrolled(y > 60)

        // Detect active section
        const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'))
        const pos = y + 200
        for (const el of sections) {
          const id = el.getAttribute('id')
          if (id && pos >= el.offsetTop && pos < el.offsetTop + el.offsetHeight) {
            setActive(id); break
          }
        }

        if (atTop) {
          if (hiddenRef.current) {
            if (gsap && !isMobile) {
              (gsap as any).to(headerRef.current, { y: 0, duration: 0.45, ease: 'power3.out' });
            }
            hiddenRef.current = false
          }
        } else if (goDown && !hiddenRef.current && y > 180) {
          if (gsap && !isMobile) {
            (gsap as any).to(headerRef.current, { y: '-110%', duration: 0.35, ease: 'power3.in' });
          }
          hiddenRef.current = true
        } else if (!goDown && hiddenRef.current) {
          if (gsap && !isMobile) {
            (gsap as any).to(headerRef.current, { y: 0, duration: 0.45, ease: 'power3.out' });
          }
          hiddenRef.current = false
        }

        lastYRef.current = y
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(scrollRafId.current) }
  }, [])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleNavClick = useCallback((href: string) => {
    scrollTo(href); setMenuOpen(false)
  }, [])

  return (
    <>
      {/* ══ HEADER ══ */}
      <header
        ref={headerRef}
        role="banner"
        className={`fixed top-0 left-0 right-0 z-[60] border-b transition-colors duration-300 ${
          scrolled
            ? 'bg-[#0a0a0a]/85 backdrop-blur-lg border-white/[0.06] shadow-xl shadow-black/30'
            : 'border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between h-16">
          <a
            href="#inicio"
            onClick={(e) => { e.preventDefault(); handleNavClick('#inicio') }}
            className="flex items-center gap-2.5 group"
          >
            <img src={asset('IMG/logo.png')} alt="Logo João Vitor" className="w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-110" loading="lazy" />
            <span className="font-heading font-semibold text-white text-sm sm:text-base leading-none whitespace-nowrap">
              João Vitor<span className="text-purple-400"> B.S</span>
            </span>
          </a>

          <nav aria-label="Navegação principal" className="hidden md:block">
            <ul className="flex items-center gap-7 list-none m-0 p-0">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} onClick={(e) => { e.preventDefault(); handleNavClick(href) }}
                    className={`nav-link pb-1 ${active === href.slice(1) ? 'active !text-white' : ''}`}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <button type="button" onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} aria-controls="mobile-menu"
            className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-[5px]">
            <span className={`block h-[1.5px] bg-white rounded-full transition-all duration-300 ${menuOpen ? 'w-5 rotate-45 translate-y-[6.5px]' : 'w-5'}`} />
            <span className={`block h-[1.5px] bg-white rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0 w-0' : 'w-5'}`} />
            <span className={`block h-[1.5px] bg-white rounded-full transition-all duration-300 ${menuOpen ? 'w-5 -rotate-45 -translate-y-[6.5px]' : 'w-5'}`} />
          </button>
        </div>
      </header>

      {/* ══ BACKDROP ══ */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`md:hidden fixed inset-0 transition-all duration-400 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ zIndex: 57, background: 'rgba(0,0,0,0.5)', backdropFilter: menuOpen ? 'blur(2px)' : 'none' }}
      />

      {/* ══ SIDEBAR ══ */}
      <aside
        id="mobile-menu"
        aria-hidden={!menuOpen}
        className={`
          md:hidden fixed top-0 right-0 bottom-0
          w-[72vw] max-w-[280px] flex flex-col
          transition-transform duration-[400ms] ease-[cubic-bezier(0.76,0,0.24,1)]
          ${menuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{
          zIndex: 58,
          background: '#0e0d11',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          boxShadow: menuOpen ? '-20px 0 60px rgba(0,0,0,0.7)' : 'none',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(147,51,234,0.5) 50%, transparent)' }} />
        <div className="absolute pointer-events-none"
          style={{ top: '15%', right: '-20%', width: '200px', height: '200px',
            background: 'radial-gradient(circle, rgba(147,51,234,0.09) 0%, transparent 70%)', filter: 'blur(24px)' }} />
        <div className="h-16 flex-shrink-0" />

        <div
          style={{ transitionDelay: menuOpen ? '80ms' : '0ms' }}
          className={`px-6 pt-6 pb-5 border-b border-white/[0.05] transition-all duration-300 ${menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3'}`}
        >
          <div className="flex items-center gap-2.5 mb-2">
            <img src={asset('IMG/logo.png')} alt="" className="w-7 h-7 object-contain opacity-80" loading="lazy" />
            <span className="font-heading font-semibold text-white text-sm leading-none">
              João Vitor<span className="text-purple-400"> B.S</span>
            </span>
          </div>
          <p className="text-[11px] text-white/25 leading-snug font-mono tracking-wide">Full Stack Developer</p>
        </div>

        <nav aria-label="Menu mobile" className="flex-1 px-4 py-3 overflow-y-auto">
          <ul className="list-none m-0 p-0">
            {NAV_LINKS.map(({ href, label, num }, i) => {
              const isActive = active === href.slice(1)
              return (
                <li key={href} className="border-b border-white/[0.04] last:border-0">
                  <a
                    href={href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(href) }}
                    style={{ transitionDelay: menuOpen ? `${120 + i * 45}ms` : '0ms' }}
                    className={`group relative flex items-center gap-3 py-[14px] pl-3 pr-2 transition-all duration-300 ${menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3'}`}
                  >
                    {isActive && <span className="absolute left-0 top-3 bottom-3 w-0.5 bg-purple-500 rounded-full" />}
                    <span className={`text-[9px] font-mono tabular-nums w-5 flex-shrink-0 transition-colors duration-200 ${isActive ? 'text-purple-400' : 'text-white/15 group-hover:text-white/25'}`}>{num}</span>
                    <span className={`font-heading font-bold text-[1.05rem] leading-none tracking-tight transition-colors duration-200 flex-1 ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>{label}</span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      className={`flex-shrink-0 transition-all duration-200 ${isActive ? 'text-purple-400 opacity-100' : 'text-white/0 opacity-0 group-hover:opacity-40 group-hover:text-white'}`}>
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div
          style={{ transitionDelay: menuOpen ? '380ms' : '0ms' }}
          className={`px-6 py-5 border-t border-white/[0.05] transition-all duration-300 ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] text-white/30 font-mono tracking-wide">{t.nav.available}</span>
          </div>
          <div className="flex items-center gap-3">
            {SOCIALS.map(({ label, href, icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 border border-white/[0.07] text-white/30 hover:text-white/70 hover:border-white/15 transition-all duration-200 text-[11px] font-medium tracking-wide">
                {icon}{label}
              </a>
            ))}
          </div>
        </div>
      </aside>
    </>
  )
}
