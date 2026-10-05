'use client'
import { useEffect, useRef, type ReactNode } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion'

export const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number]

/**
 * useScroll() progress that is always driven from JS.
 * Framer Motion otherwise hands opacity/transform to native ScrollTimeline,
 * which mis-measures targets inside sticky containers.
 */
export function useScrollProgress(options: Parameters<typeof useScroll>[0]) {
  const { scrollYProgress } = useScroll(options)
  return useTransform(scrollYProgress, (v) => v)
}

/* ── Section label: "// 02 — Work" ─────────────────────────────── */
export function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <motion.div
      className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-mist md:mb-12"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: EASE_OUT }}
    >
      <span className="text-sonar">{index}</span>
      <span className="h-px w-10 bg-gradient-to-r from-sonar to-transparent" />
      <span>{children}</span>
    </motion.div>
  )
}

/* ── Masked line reveal for headings ───────────────────────────── */
export function RevealLines({
  lines,
  className = '',
  delay = 0,
  as: Tag = 'h2',
}: {
  lines: ReactNode[]
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3'
}) {
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className="block will-change-transform"
            initial={{ y: '110%', rotateX: -55, opacity: 0 }}
            whileInView={{ y: '0%', rotateX: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.1, delay: delay + i * 0.09, ease: EASE_OUT }}
            style={{ transformOrigin: '50% 100%', transformPerspective: 800 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/* ── Fade up on enter ──────────────────────────────────────────── */
export function FadeUp({
  children,
  delay = 0,
  className = '',
  y = 40,
}: {
  children: ReactNode
  delay?: number
  className?: string
  y?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}

/* ── 3D tilt with glare ────────────────────────────────────────── */
export function Tilt({
  children,
  className = '',
  max = 10,
  scale = 1.02,
  accent,
}: {
  children: ReactNode
  className?: string
  max?: number
  scale?: number
  accent?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const hover = useMotionValue(1)
  const cfg = { stiffness: 180, damping: 18, mass: 0.6 }
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), cfg)
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), cfg)
  const s       = useSpring(hover, cfg)

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
    hover.set(scale)
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`)
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  const onLeave = () => { px.set(0); py.set(0); hover.set(1) }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`spotlight ${className}`}
      style={{
        rotateX, rotateY, scale: s,
        transformPerspective: 1100,
        transformStyle: 'preserve-3d',
        ...(accent ? { ['--accent' as string]: accent } : {}),
      }}
    >
      {children}
    </motion.div>
  )
}

/* ── Animated counter ──────────────────────────────────────────── */
export function Counter({ to, pad = 2, suffix = '' }: { to: number; pad?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  useEffect(() => {
    if (!inView || !ref.current) return
    const el = ref.current
    const controls = animate(0, to, {
      duration: 1.8,
      ease: EASE_OUT,
      onUpdate: (v) => { el.textContent = String(Math.round(v)).padStart(pad, '0') + suffix },
    })
    return () => controls.stop()
  }, [inView, to, pad, suffix])
  return <span ref={ref}>{'0'.padStart(pad, '0')}{suffix}</span>
}

/* ── Scroll-scrubbed paragraph: words light up as you read ─────── */
export function ScrollText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const scrollYProgress = useScrollProgress({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  )
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  const y       = useTransform(progress, range, [6, 0])
  const accent  = children.startsWith('*')
  return (
    <motion.span style={{ opacity, y }} className={`mr-[0.25em] inline-block ${accent ? 'font-serif italic text-sonar' : ''}`}>
      {accent ? children.slice(1) : children}
    </motion.span>
  )
}

/* ── Magnetic wrapper for buttons ──────────────────────────────── */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(0, { stiffness: 200, damping: 14 })
  const y = useSpring(0, { stiffness: 200, damping: 14 })
  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className="inline-block"
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * strength)
        y.set((e.clientY - r.top - r.height / 2) * strength)
      }}
      onPointerLeave={() => { x.set(0); y.set(0) }}
    >
      {children}
    </motion.div>
  )
}

export function ArrowUpRight({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12L12 4M12 4H6M12 4v6" />
    </svg>
  )
}
