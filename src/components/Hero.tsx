import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { SiReact, SiTypescript, SiNodedotjs, SiPostgresql } from 'react-icons/si'
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa'
import { useLang } from '@/contexts/LanguageContext'
import { i18n } from '@/data/i18n'

/* ─── ScrambleText ──────────────────────────────────────────── */
const SCRAMBLE = '!@#$%&§Ø∆ΩΞΨ<>[]{}|~*/01'
const ScrambleText = ({ text, delay = 0, className = '', style }: {
  text: string; delay?: number; className?: string; style?: React.CSSProperties
}) => {
  const [display, setDisplay] = useState(() =>
    Array.from({ length: text.length }, () => SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]).join('')
  )
  const rafRef = useRef(0)
  useEffect(() => {
    const total = text.length * 9
    let frame = 0
    const run = () => {
      frame++
      const pct = frame / total
      setDisplay(text.split('').map((ch, i) => {
        if (ch === ' ') return ' '
        if (i < pct * text.length) return ch
        return SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
      }).join(''))
      if (frame < total) rafRef.current = requestAnimationFrame(run)
      else setDisplay(text)
    }
    const t = setTimeout(() => { rafRef.current = requestAnimationFrame(run) }, delay)
    return () => { clearTimeout(t); cancelAnimationFrame(rafRef.current) }
  }, [text, delay])
  return <span className={className} style={style} aria-label={text}>{display}</span>
}

/* ─── Blinking cursor ───────────────────────────────────────── */
const Cursor = () => (
  <span
    className="inline-block w-[2px] h-[0.9em] bg-purple-400 align-middle ml-1"
    style={{ animation: 'heroBlink 1s step-end infinite', verticalAlign: 'middle' }}
  />
)

/* ─── RotatingText ──────────────────────────────────────────── */
const ROLES = ['React Developer', 'Full Stack Dev', 'UI/UX Engineer', 'Node.js Dev']
const RotatingText = () => {
  const [idx, setIdx] = useState(0)
  const [vis, setVis] = useState(true)
  useEffect(() => {
    const iv = setInterval(() => {
      setVis(false)
      setTimeout(() => { setIdx(p => (p + 1) % ROLES.length); setVis(true) }, 300)
    }, 2800)
    return () => clearInterval(iv)
  }, [])
  return (
    <span className="text-purple-400 transition-all duration-300 inline-block"
      style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(8px)' }}>
      {ROLES[idx]}
    </span>
  )
}

/* ─── CircularText ──────────────────────────────────────────── */
const CircularText = ({ text, size = 95, speed = 22 }: { text: string; size?: number; speed?: number }) => {
  const r = size / 2 - 14
  return (
    <div style={{ width: size, height: size, animation: `heroSpin ${speed}s linear infinite` }}
      className="select-none pointer-events-none">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <defs>
          <path id="hcpath" d={`M ${size/2},${size/2} m -${r},0 a ${r},${r} 0 1,1 ${r*2},0 a ${r},${r} 0 1,1 -${r*2},0`} />
        </defs>
        <text fontSize="7.5" fill="rgba(255,255,255,0.28)" fontFamily="monospace" letterSpacing="3.5">
          <textPath href="#hcpath">{text}</textPath>
        </text>
      </svg>
    </div>
  )
}

const STACK = [
  { name: 'React',      icon: SiReact,      color: '#61DAFB' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'Node.js',    icon: SiNodedotjs,  color: '#68A063' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#336791' },
]

const SOCIALS = [
  { href: 'https://github.com/raaywasdead',           icon: FaGithub,    label: 'GitHub'    },
  { href: 'https://www.linkedin.com/in/joaov-bds/',   icon: FaLinkedin,  label: 'LinkedIn'  },
  { href: 'https://www.instagram.com/051.jvbarbosa/', icon: FaInstagram, label: 'Instagram' },
]

/* ─── Hero ──────────────────────────────────────────────────── */
export const Hero = () => (
  <section id="inicio" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
    <h1 className="sr-only">João Vitor Barbosa — Full Stack Developer</h1>
    <div className="text-white text-2xl font-bold text-center p-10">Hero desabilitado para teste de performance</div>
  </section>
)
