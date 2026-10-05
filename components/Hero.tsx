'use client'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, useTransform } from 'framer-motion'
import { EASE_OUT, Magnetic, useScrollProgress } from './fx/primitives'

const OceanScene = dynamic(() => import('./three/OceanScene'), { ssr: false })

const WORDS = [
  { text: 'Engineer.', className: '' },
  { text: 'Designer.', className: 'text-outline' },
  { text: 'Skipper.',  className: 'font-serif italic font-normal text-sonar tracking-[-0.01em]' },
]

function LocalTime() {
  const [time, setTime] = useState<string>('--:--:--')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/Bratislava',
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return <span suppressHydrationWarning>{time}</span>
}

function Heading() {
  // Compass heading follows the pointer: a small instrument-panel touch.
  const [hdg, setHdg] = useState(274)
  useEffect(() => {
    const onMove = (e: PointerEvent) => setHdg(Math.round(240 + (e.clientX / window.innerWidth) * 70))
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  return <span>{String(hdg).padStart(3, '0')}°</span>
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const scrollYProgress = useScrollProgress({ target: ref, offset: ['start start', 'end start'] })
  const y        = useTransform(scrollYProgress, [0, 1], ['0%', '35%'])
  const opacity  = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const rotateX  = useTransform(scrollYProgress, [0, 1], [0, 18])
  const blur     = useTransform(scrollYProgress, [0, 0.7], ['blur(0px)', 'blur(10px)'])

  return (
    <section ref={ref} id="hero" className="relative h-[100svh] min-h-[640px] overflow-hidden">
      {/* Sky + horizon glow behind the transparent WebGL canvas */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_100%,#0b2a4a_0%,#050b17_45%,#02050b_100%)]" />
      <div className="absolute inset-x-0 top-[38%] h-[30%] bg-[radial-gradient(50%_60%_at_50%_50%,rgba(255,138,76,0.16),transparent_70%)] blur-2xl" />
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.2, ease: EASE_OUT }}
      >
        <OceanScene active={active} />
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-void to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(2,5,11,0.65)_0%,rgba(2,5,11,0.2)_45%,transparent_70%)]" />

      {/* Main content */}
      <motion.div
        style={{ y, opacity, rotateX, filter: blur, transformPerspective: 1200 }}
        className="relative z-10 flex h-full items-end pb-16 md:items-center md:pb-0 md:pt-10"
      >
        <div className="container-wide">
          <motion.div
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-[var(--line-bright)] bg-[rgba(5,11,23,0.55)] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-mist backdrop-blur-md md:text-[11px]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: EASE_OUT }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="ping-soft absolute inset-0 rounded-full bg-flare" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-flare" />
            </span>
            Mathias Matejčík · Open for projects
          </motion.div>

          <h1 className="font-display text-[clamp(3.4rem,11vw,10.5rem)] font-extrabold leading-[0.86] tracking-[-0.045em] text-ink">
            {WORDS.map((w, i) => (
              <span key={w.text} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={`block ${w.className}`}
                  initial={{ y: '115%', rotateX: -70, opacity: 0 }}
                  animate={{ y: '0%', rotateX: 0, opacity: 1 }}
                  transition={{ delay: 0.45 + i * 0.13, duration: 1.3, ease: EASE_OUT }}
                  style={{ transformOrigin: '50% 100%', transformPerspective: 900 }}
                >
                  {w.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <div className="mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:items-end md:gap-16">
            <motion.p
              className="max-w-[440px] text-[clamp(1rem,1.4vw,1.15rem)] leading-relaxed text-mist"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 1, ease: EASE_OUT }}
            >
              I design and build websites, iOS apps and brands, from the first sketch
              to the App Store. Based in Liptov, at the helm whenever I can be.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1, ease: EASE_OUT }}
            >
              <Magnetic>
                <a
                  href="#work"
                  className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-void transition-colors"
                >
                  <span className="absolute inset-0 translate-y-full rounded-full bg-sonar transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-y-0" />
                  <span className="relative">See the work</span>
                  <svg className="relative h-4 w-4 transition-transform duration-500 group-hover:translate-y-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 3v10M4 9l4 4 4-4" /></svg>
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--line-bright)] bg-[rgba(5,11,23,0.4)] px-6 py-3.5 text-sm font-medium text-ink backdrop-blur-md transition-colors hover:border-flare hover:text-flare"
                >
                  Start a project
                </a>
              </Magnetic>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* HUD — bottom corners */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-6 z-10 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
      >
        <div className="container-wide flex items-end justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-mist">
          <div className="space-y-1">
            <p><span className="text-fog">POS</span> 49°05′N 19°37′E</p>
            <p><span className="text-fog">LOC</span> Liptovský Mikuláš, SK</p>
          </div>
          <div className="space-y-1 text-right">
            <p><span className="text-fog">LT</span> <LocalTime /></p>
            <p><span className="text-fog">HDG</span> <Heading /></p>
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-fog">Drop anchor · Scroll</span>
        <span className="relative h-12 w-px overflow-hidden bg-[var(--line)]">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent to-sonar"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.div>
    </section>
  )
}
