import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { asset } from '@/utils/asset'
import { useLang } from '@/contexts/LanguageContext'
import { i18n } from '@/data/i18n'

gsap.registerPlugin(ScrollTrigger)

const scrollTo = (href: string) => {
  const target = document.querySelector(href)
  if (!target) return
  const y = (target as HTMLElement).getBoundingClientRect().top + window.pageYOffset - 80
  window.scrollTo({ top: y, behavior: 'smooth' })
}

const NAV_HREFS = ['#inicio', '#sobre', '#servicos', '#projetos', '#contato']

const CONTACTS = [
  {
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=joaov.bds20@gmail.com',
    label: 'Email',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.910 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>,
  },
  {
    href: 'https://wa.me/5551989367134',
    label: 'WhatsApp',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  },
  {
    href: 'https://www.linkedin.com/in/joaov-bds/',
    label: 'LinkedIn',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
  },
  {
    href: 'https://github.com/raaywasdead',
    label: 'GitHub',
    icon: <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>,
  },
]

const SOCIALS = [
  {
    href: 'https://www.instagram.com/051.jvbarbosa/', label: 'Instagram',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  },
  {
    href: 'https://www.linkedin.com/in/joaov-bds/', label: 'LinkedIn',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  },
  {
    href: 'https://github.com/raaywasdead', label: 'GitHub',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>,
  },
]

export const Footer = () => {
  const footerRef = useRef<HTMLElement>(null)
  const { lang } = useLang()
  const t = i18n[lang].footer
  const NAV = NAV_HREFS.map((href, i) => [href, t.navLinks[i]])

  useGSAP(() => {
    gsap.set(['.ft-brand', '.ft-nav', '.ft-contact', '.ft-bottom'], { opacity: 0, y: 18 })
    ScrollTrigger.create({
      trigger: footerRef.current,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.to(['.ft-brand', '.ft-nav', '.ft-contact'], { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 })
          .to('.ft-bottom', { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
      },
    })
  }, { scope: footerRef })

  return (
    <footer ref={footerRef} className="relative overflow-hidden" role="contentinfo"
      style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.06)' }}>

      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(147,51,234,0.5), transparent)' }} />

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand col */}
          <div className="ft-brand flex flex-col gap-5">
            <a href="#inicio" onClick={(e) => { e.preventDefault(); scrollTo('#inicio') }} className="flex items-center gap-2.5 w-fit group">
              <img src={asset('IMG/logo.png')} alt="" className="w-9 h-9 object-contain transition-transform duration-300 group-hover:scale-105" loading="lazy" />
              <span className="font-heading font-semibold text-white">João Vitor <span className="text-purple-400">B.S</span></span>
            </a>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.15em] text-emerald-400/60 uppercase">{t.available}</span>
            </div>
            <div className="flex gap-2">
              {SOCIALS.map(({ href, label, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="w-8 h-8 flex items-center justify-center border border-white/[0.07] text-white/35 hover:border-purple-600/40 hover:text-purple-400 hover:-translate-y-0.5 transition-all duration-200">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav col */}
          <div className="ft-nav">
            <h3 className="font-mono text-[9px] tracking-[0.25em] text-white/25 uppercase mb-5">{t.navLabel}</h3>
            <ul className="space-y-2.5">
              {NAV.map(([href, label]) => (
                <li key={href}>
                  <a href={href} onClick={(e) => { e.preventDefault(); scrollTo(href) }}
                    className="group flex items-center gap-2 text-white/40 hover:text-purple-400 text-sm transition-colors duration-200">
                    <span className="w-1 h-1 rounded-full bg-white/15 group-hover:bg-purple-500 transition-all duration-200 flex-shrink-0" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact col */}
          <div className="ft-contact">
            <h3 className="font-mono text-[9px] tracking-[0.25em] text-white/25 uppercase mb-5">{t.contactLabel}</h3>
            <ul className="space-y-2.5">
              {CONTACTS.map(({ href, label }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="group flex items-center gap-2 text-white/40 hover:text-purple-400 text-sm transition-colors duration-200">
                    <span className="w-1 h-1 rounded-full bg-white/15 group-hover:bg-purple-500 transition-all duration-200 flex-shrink-0" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="ft-bottom max-w-7xl mx-auto px-5 md:px-10 pb-8">
        <div className="pt-5 flex flex-col sm:flex-row justify-between items-center gap-2"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="font-mono text-white/18 text-[9px] tracking-[0.14em]">{t.copyright}</p>
          <p className="font-mono text-white/18 text-[9px] tracking-[0.14em]">
            Built with <span className="text-purple-400/50">React · TypeScript · GSAP</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
