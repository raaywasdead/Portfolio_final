import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const SOCIALS = [
  {
    href: 'https://www.instagram.com/051.jvbarbosa/',
    label: 'Instagram',
    color: 'hover:border-pink-500/50 hover:bg-pink-500/10 hover:text-pink-400 group-hover:text-pink-400',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    href: 'https://www.linkedin.com/in/joaov-bds/',
    label: 'LinkedIn',
    color: 'hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400 group-hover:text-blue-400',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    href: 'https://github.com/raaywasdead',
    label: 'GitHub',
    color: 'hover:border-white/30 hover:bg-white/10 hover:text-white group-hover:text-white',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
]

export const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return

    const badge = section.querySelector('.contact-badge')
    const title = section.querySelector('.contact-title')
    const desc = section.querySelector('.contact-desc')
    const cards = section.querySelectorAll('.contact-card')
    const divider = section.querySelector('.contact-divider')
    const socials = section.querySelectorAll('.social-card')

    gsap.set([badge, title, desc, ...Array.from(cards), divider, ...Array.from(socials)], { opacity: 0, y: 25 })

    ScrollTrigger.create({
      trigger: section,
      start: 'top 58%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline()
        tl.to(badge, { opacity: 1, y: 0, duration: 0.5 })
          .to(title, { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
          .to(desc, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
          .to(cards, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out' }, '-=0.3')
          .to(divider, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2')
          .to(socials, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, '-=0.2')
      },
    })
  }, { scope: sectionRef })

  return (
    <section id="contato" ref={sectionRef} className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-14 lg:gap-20 items-start">

          {/* ── Left: Header ── */}
          <div>
            <div className="contact-badge flex items-center gap-2 mb-4">
              <span className="w-5 h-px bg-purple-500" />
              <span className="text-purple-400 text-sm font-medium tracking-widest uppercase">Contato</span>
            </div>

            <h2 className="contact-title font-heading font-bold text-4xl md:text-5xl leading-tight mb-6">
              Tem um projeto<br />
              em mente?{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-300">
                Vamos conversar!
              </span>
            </h2>

            <p className="contact-desc text-white/55 text-base leading-relaxed mb-10 max-w-md">
              Estou em busca de oportunidades como desenvolvedor Full Stack Júnior para aprender,
              evoluir e contribuir com soluções bem estruturadas e funcionais.
            </p>

            {/* Social links */}
            <div className="contact-divider mb-5">
              <span className="text-xs text-white/30 uppercase tracking-widest font-medium">Redes sociais</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {SOCIALS.map(({ href, label, color, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`social-card group flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/50 transition-all duration-200 hover:-translate-y-0.5 ${color}`}
                  aria-label={`${label} de João Vitor`}
                >
                  {icon}
                  <span className="text-sm font-medium">{label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* ── Right: Contact cards ── */}
          <div className="space-y-4">
            {/* Email */}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=joaov.bds20@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card group block"
              aria-label="Enviar email"
            >
              <div className="flex items-center gap-5 p-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:border-purple-600/50 hover:bg-purple-600/[0.08] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-600/10">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-purple-600/15 text-purple-400 group-hover:bg-purple-600/25 transition-colors">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <polyline points="3,8 12,13 21,8" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/35 text-xs font-medium uppercase tracking-widest mb-1">Email</p>
                  <p className="text-white font-semibold text-sm truncate">joaov.bds20@gmail.com</p>
                  <p className="text-purple-400 text-xs mt-1 flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                    Enviar mensagem
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </p>
                </div>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/5551989367134"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card group block"
              aria-label="Conversar no WhatsApp"
            >
              <div className="flex items-center gap-5 p-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:border-green-500/50 hover:bg-green-500/[0.06] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/10">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-green-500/15 text-green-400 group-hover:bg-green-500/25 transition-colors">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/35 text-xs font-medium uppercase tracking-widest mb-1">WhatsApp</p>
                  <p className="text-white font-semibold text-sm">(51) 98936-7134</p>
                  <p className="text-green-400 text-xs mt-1 flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                    Chamar agora
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </p>
                </div>
              </div>
            </a>

            {/* Availability note */}
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <span className="w-2 h-2 rounded-full bg-green-400 shadow-sm shadow-green-400/50 animate-pulse flex-shrink-0" />
              <p className="text-white/45 text-sm">
                <span className="text-white/70 font-medium">Disponível</span> para novas oportunidades
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
