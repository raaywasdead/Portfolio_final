import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { FiLayout, FiGlobe, FiLayers, FiDatabase, FiMonitor, FiTool } from 'react-icons/fi'
import type { ReactNode } from 'react'

gsap.registerPlugin(ScrollTrigger)

interface Service {
  num: string
  title: string
  desc: string
  tags: string[]
  icon: ReactNode
  details: string[]
}

const SERVICES: Service[] = [
  {
    num: '01',
    title: 'Landing Pages & Portfólios',
    desc: 'Páginas de apresentação modernas, animadas e otimizadas para impressionar desde o primeiro scroll. Do conceito ao deploy, com design próprio, alta performance e atenção a cada detalhe visual.',
    tags: ['React', 'TypeScript', 'Tailwind', 'GSAP'],
    icon: <FiLayout size={28} />,
    details: [
      'Design exclusivo, sem templates prontos',
      'Animações com GSAP — scroll, entrada, hover',
      'Performance otimizada (imagens, lazy load, build)',
      'Responsivo para mobile, tablet e desktop',
      'Deploy configurado (Vercel ou Railway)',
    ],
  },
  {
    num: '02',
    title: 'Sites Institucionais',
    desc: 'Sites completos para empresas e projetos. Navegação fluida, SEO básico e layout profissional que transmite credibilidade.',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    icon: <FiGlobe size={18} />,
    details: [
      'Múltiplas páginas com navegação entre rotas',
      'SEO básico — meta tags, Open Graph, sitemap',
      'Formulário de contato funcional',
      'Painel simples para edição de conteúdo (se necessário)',
      'Totalmente responsivo',
    ],
  },
  {
    num: '03',
    title: 'Aplicações Web Full Stack',
    desc: 'Sistemas com autenticação, banco de dados e interface completa. Do frontend ao backend, entregando produto funcional.',
    tags: ['React', 'TypeScript', 'Node.js', 'REST API', 'PostgreSQL'],
    icon: <FiLayers size={18} />,
    details: [
      'Autenticação com login, cadastro e sessão',
      'CRUD completo com banco de dados PostgreSQL',
      'API REST conectando frontend e backend',
      'Interface moderna e responsiva em React',
      'Código organizado e fácil de evoluir',
    ],
  },
  {
    num: '04',
    title: 'APIs & Backend',
    desc: 'APIs REST estruturadas, seguras e integradas com banco de dados. Lógica de negócio clara e bem organizada.',
    tags: ['Node.js', 'PostgreSQL', 'REST API'],
    icon: <FiDatabase size={18} />,
    details: [
      'Endpoints REST organizados por recurso',
      'Validação de dados e tratamento de erros',
      'Banco de dados PostgreSQL modelado e otimizado',
      'Autenticação via JWT quando necessário',
      'Estrutura preparada para escalar',
    ],
  },
  {
    num: '05',
    title: 'UI com Animações',
    desc: 'Interfaces animadas com GSAP e CSS — entradas por scroll, micro-interações, hover effects e transições fluidas que elevam a experiência visual.',
    tags: ['GSAP', 'CSS', 'React', 'TypeScript'],
    icon: <FiMonitor size={18} />,
    details: [
      'Animações de entrada com GSAP + ScrollTrigger',
      'Micro-interações em hover, focus e clique',
      'Efeitos de parallax e spotlight',
      'Transições fluidas entre estados',
      'Compatível com prefers-reduced-motion',
    ],
  },
  {
    num: '06',
    title: 'Manutenção & Evolução',
    desc: 'Melhorias, correções e novas funcionalidades em projetos existentes. Código limpo, sem gambiarra, feito para durar.',
    tags: ['React', 'TypeScript', 'Node.js'],
    icon: <FiTool size={18} />,
    details: [
      'Análise e entendimento do código existente',
      'Correção de bugs e comportamentos incorretos',
      'Refatoração de código confuso ou duplicado',
      'Adição de novas funcionalidades sem quebrar o existente',
      'Atualização de dependências e segurança',
    ],
  },
]

const onFeaturedMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const spot = el.querySelector<HTMLElement>('.feat-spotlight')
  if (spot) {
    spot.style.background = `radial-gradient(520px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, rgba(147,51,234,0.13), transparent 70%)`
    spot.style.opacity = '1'
  }
}

const onFeaturedLeave = (e: React.MouseEvent<HTMLDivElement>) => {
  const spot = e.currentTarget.querySelector<HTMLElement>('.feat-spotlight')
  if (spot) spot.style.opacity = '0'
}

export const Services = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const [openRow, setOpenRow] = useState<string | null>(null)

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
    <section id="servicos" ref={sectionRef} className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-10">

        {/* Header */}
        <div className="max-w-2xl mb-14">
          <div className="services-badge flex items-center gap-2 mb-4">
            <span className="w-5 h-px bg-purple-500" />
            <span className="text-purple-400 text-sm font-medium tracking-widest uppercase">Meus Serviços</span>
          </div>
          <h2 className="services-title font-heading font-bold text-4xl md:text-5xl mb-4 leading-tight">
            O Que Eu{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-300">
              Entrego
            </span>
          </h2>
          <p className="services-sub text-white/50 text-base leading-relaxed">
            Do planejamento ao deploy — soluções completas com código limpo,
            design moderno e atenção a cada detalhe.
          </p>
        </div>

        {/* ── Featured card (01) — always expanded ── */}
        <div
          className="services-featured relative rounded-3xl overflow-hidden mb-4 cursor-default group"
          onMouseMove={onFeaturedMove}
          onMouseLeave={onFeaturedLeave}
        >
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 65% 90% at 0% 50%, rgba(109,40,217,0.28) 0%, transparent 65%)' }} />
          <div className="absolute inset-0 rounded-3xl" style={{ border: '1px solid rgba(124,58,237,0.28)' }} />
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, rgba(168,85,247,0.75), rgba(124,58,237,0.25), transparent)' }} />
          <div className="feat-spotlight absolute inset-0 pointer-events-none rounded-3xl transition-opacity duration-300" style={{ opacity: 0 }} />

          <div className="relative z-10 flex flex-col gap-6 p-8 md:p-12">
            {/* Icon */}
            <div
              className="w-14 h-14 flex items-center justify-center rounded-2xl text-purple-300 flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
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
                  className="px-3 py-1 text-xs font-medium rounded-full border"
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
                  className="group relative w-full flex items-start gap-5 md:gap-8 py-7 cursor-pointer transition-all duration-300 rounded-xl px-3 -mx-3 hover:bg-white/[0.025] text-left"
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
                        className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 transition-colors duration-300"
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
                          className="px-2 py-0.5 text-[10px] font-medium rounded border text-white/25 transition-colors duration-200"
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
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
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
                  className="overflow-hidden transition-all duration-350 ease-in-out"
                  style={{ maxHeight: isOpen ? '320px' : '0px', opacity: isOpen ? 1 : 0 }}
                >
                  <ul className="flex flex-col gap-2.5 pb-7 pl-[4.5rem] pr-14">
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
