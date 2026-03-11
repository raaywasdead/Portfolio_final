import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { asset } from '@/utils/asset'

gsap.registerPlugin(ScrollTrigger)

const scrollTo = (href: string) => {
  const target = document.querySelector(href)
  if (!target) return
  const y = (target as HTMLElement).getBoundingClientRect().top + window.pageYOffset - 80
  window.scrollTo({ top: y, behavior: 'smooth' })
}

export const Footer = () => {
  const footerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.from('.footer-inner > *', {
      scrollTrigger: { trigger: footerRef.current, start: 'top 80%', once: true },
      y: 25,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power2.out',
    })
  }, { scope: footerRef })

  return (
    <footer ref={footerRef} className="relative bg-[#080808] border-t border-white/10 py-16 px-5 md:px-10" role="contentinfo">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
      <div className="max-w-7xl mx-auto">
        <div className="footer-inner grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <a
              href="#inicio"
              onClick={(e) => { e.preventDefault(); scrollTo('#inicio') }}
              className="flex items-center gap-2.5 mb-4 w-fit"
            >
              <img src={asset('IMG/logo.png')} alt="" className="w-9 h-9 object-contain" loading="lazy" />
              <span className="font-heading font-semibold text-white">
                João Vitor <span className="text-purple-400">B.S</span>
              </span>
            </a>
            <p className="text-white/40 text-sm leading-relaxed mb-5 max-w-xs">
              Desenvolvedor Full Stack Júnior criando experiências digitais modernas, funcionais e bem construídas.
            </p>
            <div className="flex gap-2.5">
              {[
                {
                  href: 'https://www.instagram.com/051.jvbarbosa/',
                  label: 'Instagram',
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
                },
                {
                  href: 'https://www.linkedin.com/in/joaov-bds/',
                  label: 'LinkedIn',
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
                },
                {
                  href: 'https://github.com/raaywasdead',
                  label: 'GitHub',
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>,
                },
              ].map(({ href, label, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/[0.08] text-white/40 hover:border-purple-600/40 hover:text-purple-400 hover:-translate-y-0.5 transition-all duration-200"
                  aria-label={label}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <h3 className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-5">Navegação</h3>
            <ul className="space-y-3">
              {[
                ['#inicio', 'Home'],
                ['#sobre', 'Sobre Mim'],
                ['#servicos', 'Serviços'],
                ['#projetos', 'Projetos'],
                ['#contato', 'Contato'],
              ].map(([href, label]) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => { e.preventDefault(); scrollTo(href) }}
                    className="text-white/45 hover:text-purple-400 text-sm transition-colors duration-200"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-5">Contato</h3>
            <ul className="space-y-3">
              {[
                ['https://mail.google.com/mail/?view=cm&fs=1&to=joaov.bds20@gmail.com', 'Email'],
                ['https://wa.me/5551989367134', 'WhatsApp'],
                ['https://www.linkedin.com/in/joaov-bds/', 'LinkedIn'],
                ['https://github.com/raaywasdead', 'GitHub'],
              ].map(([href, label]) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/45 hover:text-purple-400 text-sm transition-colors duration-200"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-white/25 text-xs">&copy; 2026 João Vitor B.S — Todos os direitos reservados</p>
          <p className="text-white/25 text-xs">
            Made by: <span className="text-purple-400/70">João Vitor B.S </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
