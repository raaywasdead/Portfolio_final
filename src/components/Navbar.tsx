import { useState, useEffect, useCallback } from 'react'
import { asset } from '@/utils/asset'

const NAV_LINKS = [
  { href: '#inicio', label: 'Home' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#contato', label: 'Contato' },
]

const scrollTo = (href: string) => {
  const target = document.querySelector(href)
  if (!target) return
  const y = (target as HTMLElement).getBoundingClientRect().top + window.pageYOffset - 80
  window.scrollTo({ top: y, behavior: 'smooth' })
}

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('inicio')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)

      const sections = document.querySelectorAll('section[id]')
      const scrollPos = window.scrollY + 200
      sections.forEach((section) => {
        const el = section as HTMLElement
        const id = el.getAttribute('id')
        if (id && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
          setActive(id)
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('no-scroll', menuOpen)
    return () => document.documentElement.classList.remove('no-scroll')
  }, [menuOpen])

  const handleNavClick = useCallback((href: string) => {
    scrollTo(href)
    setMenuOpen(false)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0a]/85 backdrop-blur-lg border-white/[0.06] shadow-xl shadow-black/30'
          : 'border-transparent'
      }`}
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between h-16">
        {/* Logo */}
        <a
          href="#inicio"
          onClick={(e) => { e.preventDefault(); handleNavClick('#inicio') }}
          className="flex items-center gap-2.5 group"
        >
          <img
            src={asset('IMG/logo.png')}
            alt="Logo João Vitor"
            className="w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-heading font-semibold text-white text-base leading-none">
            João Vitor<span className="text-purple-400"> B.S</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav aria-label="Navegação principal" className="hidden md:block">
          <ul className="flex items-center gap-7 list-none m-0 p-0">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(href) }}
                  className={`nav-link pb-1 ${active === href.slice(1) ? 'active !text-white' : ''}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA desktop */}
        <a
          href="#contato"
          onClick={(e) => { e.preventDefault(); handleNavClick('#contato') }}
          className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-purple-600/15 border border-purple-600/30 text-purple-300 rounded-full hover:bg-purple-600/25 hover:text-white hover:border-purple-500/50 transition-all duration-200"
        >
          Contato
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2 z-50 relative"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          type="button"
        >
          <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden flex flex-col items-center justify-center transition-all duration-300 ${
          menuOpen
            ? 'opacity-100 pointer-events-auto bg-[#0a0a0a]/96 backdrop-blur-xl'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => { if (e.target === e.currentTarget) setMenuOpen(false) }}
      >
        <nav>
          <ul className="flex flex-col items-center gap-7 list-none m-0 p-0">
            {NAV_LINKS.map(({ href, label }, i) => (
              <li
                key={href}
                style={{ transitionDelay: menuOpen ? `${i * 60}ms` : '0ms' }}
                className={`transition-all duration-300 ${menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                <a
                  href={href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(href) }}
                  className={`text-2xl font-heading font-semibold tracking-wide transition-colors duration-200 ${
                    active === href.slice(1) ? 'text-purple-400' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
