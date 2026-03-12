import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { FaEnvelope, FaWhatsapp } from 'react-icons/fa'
import { useLang } from '@/contexts/LanguageContext'
import { i18n } from '@/data/i18n'

gsap.registerPlugin(ScrollTrigger)

const CONTACTS = [
  {
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=joaov.bds20@gmail.com',
    label: 'EMAIL',
    value: 'joaov.bds20@gmail.com',
    icon: FaEnvelope,
    color: '#EA4335',
  },
  {
    href: 'https://wa.me/5551989367134',
    label: 'WHATSAPP',
    value: '(51) 98936-7134',
    icon: FaWhatsapp,
    color: '#25D366',
  },
]

const SOCIALS = [
  { href: 'https://www.instagram.com/051.jvbarbosa/', label: 'Instagram' },
  { href: 'https://www.linkedin.com/in/joaov-bds/',  label: 'LinkedIn'  },
  { href: 'https://github.com/raaywasdead',           label: 'GitHub'    },
]

export const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const { lang } = useLang()
  const t = i18n[lang].contact

  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return

    const left  = section.querySelectorAll('.ct-left')
    const panel = section.querySelector('.ct-panel')
    const rows  = section.querySelectorAll('.ct-row')
    const foot  = section.querySelector('.ct-foot')

    gsap.set([...Array.from(left), panel, ...Array.from(rows), foot], { opacity: 0, y: 24 })

    ScrollTrigger.create({
      trigger: section,
      start: 'top 60%',
      once: true,
      onEnter: () => {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .to(left,  { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 })
          .to(panel, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
          .to(rows,  { opacity: 1, y: 0, duration: 0.45, stagger: 0.1 }, '-=0.25')
          .to(foot,  { opacity: 1, y: 0, duration: 0.4 }, '-=0.15')
      },
    })
  }, { scope: sectionRef })

  return (
    <section id="contato" ref={sectionRef} className="relative py-28 md:py-40 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-10">

        {/* Badge */}
        <div className="ct-left flex items-center gap-3 mb-8">
          <span className="font-mono text-[9px] tracking-[0.12em] text-white/22 border border-white/[0.07] px-2 py-0.5">05-25</span>
          <span className="w-5 h-px bg-purple-500/30" />
          <span className="shiny-text font-mono text-[9px] tracking-[0.28em] uppercase">{t.badge}</span>
        </div>

        {/* Title */}
        <h2
          className="ct-left font-display uppercase leading-none tracking-wide mb-6"
          style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)' }}
        >
          {t.h2a}{' '}
          <span className="text-purple-400">{t.h2b}</span>
        </h2>

        {/* Sub */}
        <p className="ct-left text-white/38 text-sm leading-relaxed max-w-xl mb-8">
          {t.sub}
        </p>

        {/* Chips */}
        <div className="ct-left flex flex-wrap items-center gap-2 mb-14 md:mb-20">
          {t.chips.map(chip => (
            <span
              key={chip}
              className="font-mono text-[10px] tracking-[0.15em] uppercase px-3 py-1"
              style={{ border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.28)' }}
            >
              {chip}
            </span>
          ))}
          <span
            className="font-mono text-[10px] tracking-[0.15em] uppercase px-3 py-1 flex items-center gap-2"
            style={{ border: '1px solid rgba(124,58,237,0.3)', color: 'rgba(196,181,253,0.7)', background: 'rgba(124,58,237,0.08)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            {t.available}
          </span>
        </div>

        {/* Divider */}
        <div className="ct-panel w-full h-px mb-0" style={{ background: 'rgba(255,255,255,0.07)' }} />

        {/* Contact rows */}
        {CONTACTS.map(({ href, label, value, icon: Icon, color }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="ct-row group flex items-center justify-between py-5 md:py-6 transition-colors duration-200"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center gap-4 md:gap-7">
              {/* Icon box */}
              <div
                className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-105"
                style={{
                  background: `${color}10`,
                  border: `1px solid ${color}28`,
                }}
              >
                <Icon size={16} style={{ color: `${color}99` }} />
              </div>
              {/* Label + value */}
              <div className="flex flex-col gap-0.5">
                <span className="font-mono text-[9px] tracking-[0.18em] text-white/20 uppercase">{label}</span>
                <span
                  className="font-display uppercase tracking-wide text-white/70 group-hover:text-white transition-colors duration-200"
                  style={{ fontSize: 'clamp(1rem, 2.4vw, 1.75rem)' }}
                >
                  {value}
                </span>
              </div>
            </div>
            <svg
              className="text-white/20 group-hover:text-purple-400 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0"
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
            >
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        ))}

        {/* Footer */}
        <div className="ct-foot flex flex-wrap items-center justify-between gap-4 pt-8">
          <div className="flex items-center gap-5 md:gap-7">
            {SOCIALS.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/25 hover:text-white/60 transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <p className="font-mono text-[10px] tracking-wide text-white/30">
              {t.response} <span className="text-white/50">{t.responseHighlight}</span>
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
