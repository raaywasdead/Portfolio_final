import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { projects } from '@/data/projects'
import { asset } from '@/utils/asset'

gsap.registerPlugin(ScrollTrigger)

const ExternalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

const GithubIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

export const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const currentRef = useRef(0)
  const isAnimatingRef = useRef(false)

  // Keep DOM in sync without re-renders during animation
  const updateCardDOM = (idx: number) => {
    const section = sectionRef.current
    if (!section) return
    const project = projects[idx]

    const badge = section.querySelector<HTMLElement>('.proj-badge-pill')
    const num = section.querySelector<HTMLElement>('.proj-num')
    const title = section.querySelector<HTMLElement>('.proj-title')
    const desc = section.querySelector<HTMLElement>('.proj-desc')
    const tagsEl = section.querySelector<HTMLElement>('.proj-tags')
    const linkLive = section.querySelector<HTMLAnchorElement>('.proj-link-live')
    const linkGh = section.querySelector<HTMLAnchorElement>('.proj-link-gh')
    const img = imgRef.current

    if (badge) {
      badge.textContent = project.badge ?? ''
      badge.style.display = project.badge ? 'inline-flex' : 'none'
    }
    if (num) num.textContent = `Projeto ${String(idx + 1).padStart(2, '0')}`
    if (title) title.textContent = project.title
    if (desc) desc.textContent = project.description
    if (tagsEl) {
      tagsEl.innerHTML = project.tags
        .map((t) => `<span class="px-2.5 py-1 text-[11px] border border-white/[0.08] text-white/35 rounded-lg bg-white/[0.03] hover:border-purple-600/30 hover:text-white/55 transition-all duration-200 cursor-default">${t}</span>`)
        .join('')
    }
    if (linkLive) linkLive.href = project.liveUrl
    if (linkGh) linkGh.href = project.githubUrl
    if (img) img.src = asset(project.image)
    // Progress dots
    section.querySelectorAll<HTMLElement>('.proj-dot').forEach((dot, i) => {
      dot.style.width = i === idx ? '28px' : '6px'
      dot.style.background = i === idx ? '#9333ea' : 'rgba(255,255,255,0.15)'
    })
  }

  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return

    const badge = section.querySelector('.projects-badge')
    const title = section.querySelector('.projects-title')
    const card = section.querySelector('.projects-card')

    gsap.set([badge, title, card], { opacity: 0, y: 35 })

    ScrollTrigger.create({
      trigger: section,
      start: 'top 58%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline()
        tl.to(badge, { opacity: 1, y: 0, duration: 0.5 })
          .to(title, { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
          .to(card, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3')
      },
    })
  }, { scope: sectionRef })

  const switchTo = (next: number, dir: -1 | 1 = 1) => {
    if (isAnimatingRef.current) return
    const idx = ((next % projects.length) + projects.length) % projects.length
    if (idx === currentRef.current) return
    isAnimatingRef.current = true

    const card = cardRef.current
    if (!card) {
      currentRef.current = idx
      updateCardDOM(idx)
      isAnimatingRef.current = false
      return
    }

    // Slide out in the travel direction, swap content, slide in from opposite
    gsap.to(card, {
      x: dir * -48,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        currentRef.current = idx
        updateCardDOM(idx)
        gsap.fromTo(
          card,
          { x: dir * 48, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.32, ease: 'power2.out', onComplete: () => { isAnimatingRef.current = false } }
        )
      },
    })
  }

  const handlePrev = () => switchTo(currentRef.current - 1, -1)
  const handleNext = () => switchTo(currentRef.current + 1, 1)

  // Spotlight + parallax
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const spot = el.querySelector<HTMLElement>('.proj-spotlight')
    if (spot) {
      spot.style.background = `radial-gradient(500px circle at ${x}px ${y}px, rgba(147,51,234,0.1), transparent 70%)`
      spot.style.opacity = '1'
    }
    if (imgRef.current) {
      const dx = (x - r.width / 2) / (r.width / 2)
      const dy = (y - r.height / 2) / (r.height / 2)
      gsap.to(imgRef.current, { x: dx * 12, y: dy * 7, duration: 0.9, ease: 'power2.out' })
    }
  }

  const onMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const spot = e.currentTarget.querySelector<HTMLElement>('.proj-spotlight')
    if (spot) spot.style.opacity = '0'
    if (imgRef.current) gsap.to(imgRef.current, { x: 0, y: 0, duration: 1.1, ease: 'power3.out' })
  }

  const p0 = projects[0]

  return (
    <section id="projetos" ref={sectionRef} className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-5 md:px-10">

        {/* Header */}
        <div className="mb-10">
          <div className="projects-badge flex items-center gap-2 mb-4">
            <span className="w-5 h-px bg-purple-500" />
            <span className="text-purple-400 text-sm font-medium tracking-widest uppercase">Meus Projetos</span>
          </div>
          <h2 className="projects-title font-heading font-bold text-4xl md:text-5xl leading-tight">
            O Que Eu Já{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-300">
              Construí
            </span>
          </h2>
        </div>

        {/* Card */}
        <div
          className="projects-card"
          ref={cardRef}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
        >
          <div
            className="shine-border relative rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden"
            style={{ height: '460px' }}
          >
            {/* Spotlight */}
            <div
              className="proj-spotlight absolute inset-0 pointer-events-none z-10 rounded-2xl transition-opacity duration-300"
              style={{ opacity: 0 }}
            />
            {/* Shine top */}
            <div
              className="absolute top-0 left-0 right-0 h-px z-20 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.4), transparent)' }}
            />

            {/* Split layout */}
            <div className="flex flex-col lg:flex-row h-full">

              {/* Image side */}
              <div className="relative overflow-hidden bg-[#0d0d0d] lg:w-[58%] aspect-video lg:aspect-auto flex-shrink-0">
                <img
                  ref={imgRef}
                  src={asset(p0.image)}
                  alt={`Screenshot — ${p0.title}`}
                  className="w-full h-full object-cover scale-[1.08]"
                  style={{ willChange: 'transform' }}
                  loading="lazy"
                />
                {/* Right fade (desktop) */}
                <div
                  className="hidden lg:block absolute inset-y-0 right-0 w-28 pointer-events-none"
                  style={{ background: 'linear-gradient(to right, transparent, rgba(10,10,10,0.9))' }}
                />
                {/* Bottom fade (mobile) */}
                <div
                  className="lg:hidden absolute inset-x-0 bottom-0 h-16 pointer-events-none"
                  style={{ background: 'linear-gradient(to bottom, transparent, rgba(10,10,10,0.9))' }}
                />
                {/* Badge pill */}
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className="proj-badge-pill inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-purple-600/80 backdrop-blur-sm text-white border border-purple-400/30"
                    style={{ display: p0.badge ? 'inline-flex' : 'none' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-200 animate-pulse" />
                    {p0.badge}
                  </span>
                </div>
              </div>

              {/* Content side */}
              <div className="flex flex-col justify-center flex-1 p-7 lg:p-10 lg:pl-8">
                <p
                  className="proj-num text-[10px] font-bold tracking-[0.2em] uppercase mb-5"
                  style={{ color: 'rgba(167,139,250,0.55)' }}
                >
                  Projeto 01
                </p>
                <h3 className="proj-title font-heading font-bold text-2xl lg:text-3xl text-white mb-4 leading-tight">
                  {p0.title}
                </h3>
                <p className="proj-desc text-white/48 text-sm leading-relaxed mb-7 line-clamp-4">
                  {p0.description}
                </p>
                <div className="proj-tags flex flex-wrap gap-1.5 mb-8">
                  {p0.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-[11px] border border-white/[0.08] text-white/35 rounded-lg bg-white/[0.03] hover:border-purple-600/30 hover:text-white/55 transition-all duration-200 cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2.5">
                  <a
                    href={p0.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="proj-link-live flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-xl transition-all duration-200 active:scale-95 hover:-translate-y-0.5"
                  >
                    Acessar <ExternalIcon />
                  </a>
                  <a
                    href={p0.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="proj-link-gh flex items-center gap-2 px-5 py-2.5 border border-white/12 hover:border-purple-600/50 hover:bg-purple-600/10 text-white/65 hover:text-white text-sm font-medium rounded-xl transition-all duration-200 active:scale-95 hover:-translate-y-0.5"
                  >
                    GitHub <GithubIcon />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="flex items-center justify-between mt-5">
          {/* Dots */}
          <div className="flex items-center gap-2">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => switchTo(i)}
                aria-label={`Ir para projeto ${i + 1}`}
                className="proj-dot rounded-full transition-all duration-300"
                style={{
                  width: i === 0 ? '28px' : '6px',
                  height: '6px',
                  background: i === 0 ? '#9333ea' : 'rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              aria-label="Projeto anterior"
              className="w-10 h-10 rounded-full border border-white/[0.1] bg-white/[0.03] hover:border-purple-500/50 hover:bg-purple-600/12 text-white/45 hover:text-purple-300 flex items-center justify-center transition-all duration-200 active:scale-90"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              aria-label="Próximo projeto"
              className="w-10 h-10 rounded-full border border-white/[0.1] bg-white/[0.03] hover:border-purple-500/50 hover:bg-purple-600/12 text-white/45 hover:text-purple-300 flex items-center justify-center transition-all duration-200 active:scale-90"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
