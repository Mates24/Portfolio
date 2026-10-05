'use client'
import { useRef, type ReactNode } from 'react'
import {
  motion,
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

/* Section heading. An optional count sits as a small superscript after the last line, e.g. "(06)". */
export function SectionTitle({ lines, count, className = '' }: { lines: ReactNode[]; count?: number; className?: string }) {
  const last = lines.length - 1
  const withCount = lines.map((line, i) =>
    i === last && count !== undefined ? (
      <span key={i}>
        {line}
        <sup className="ml-[0.15em] align-super text-[0.28em] font-normal tracking-normal text-mist">
          ({String(count).padStart(2, '0')})
        </sup>
      </span>
    ) : (
      line
    ),
  )
  return (
    <RevealLines
      className={`font-display text-[clamp(2.4rem,5.2vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-ink ${className}`}
      lines={withCount}
    />
  )
}

/* Heading revealed line by line from behind a mask. */
export function RevealLines({
  lines,
  className = '',
  delay = 0,
}: {
  lines: ReactNode[]
  className?: string
  delay?: number
}) {
  // The heading (not each line) is observed: a line translated fully below its
  // overflow mask counts as invisible to IntersectionObserver and would never trigger.
  return (
    <motion.h2
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ staggerChildren: 0.08, delayChildren: delay }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className="block"
            variants={{ hidden: { y: '105%' }, show: { y: '0%', transition: { duration: 1, ease: EASE_OUT } } }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.h2>
  )
}

export function FadeUp({
  children,
  delay = 0,
  className = '',
  y = 24,
}: {
  children: ReactNode
  delay?: number
  className?: string
  y?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  )
}

/* Pointer-driven 3D tilt. */
export function Tilt({ children, className = '', max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const cfg = { stiffness: 160, damping: 20, mass: 0.6 }
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), cfg)
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), cfg)

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse' || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        px.set((e.clientX - r.left) / r.width - 0.5)
        py.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={() => { px.set(0); py.set(0) }}
    >
      {children}
    </motion.div>
  )
}

/* Paragraph whose words brighten as it scrolls through the viewport. */
export function ScrollText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const progress = useScrollProgress({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} progress={progress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  )
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  )
}

export function ArrowUpRight({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12L12 4M12 4H6M12 4v6" />
    </svg>
  )
}
