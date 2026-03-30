'use client'
import { useRef } from 'react'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useTransform,
} from 'framer-motion'

// ── Easing curves ────────────────────────────────────────────────
const EASE_SPRING  = [0.16, 1, 0.3, 1]    as [number, number, number, number]
const EASE_SMOOTH  = [0.4, 0, 0.2, 1]     as [number, number, number, number]

// ── Animation variants ───────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   {
    opacity: 1,
    y: 0,
    transition: { ease: EASE_SMOOTH, duration: 0.7 },
  },
}

const wordVariants = {
  hidden: { opacity: 0, y: 44 },
  show:   {
    opacity: 1,
    y: 0,
    transition: { ease: EASE_SPRING, duration: 0.75 },
  },
}

const staggerContainer = (staggerChildren: number, delayChildren = 0) => ({
  hidden: {},
  show:   { transition: { staggerChildren, delayChildren } },
})

// ── Headline words ───────────────────────────────────────────────
const LINE_1 = ['Crafting', 'digital', 'things']
const LINE_2 = ['beyond', 'ordinary']

// ── Ambient orbs ─────────────────────────────────────────────────
const ORBS = [
  {
    className: 'w-[700px] h-[500px] -top-32 left-1/2 -translate-x-1/2',
    color:     'rgba(56,189,248,0.11)',
    duration:  8,
  },
  {
    className: 'w-[500px] h-[400px] top-24 -right-32',
    color:     'rgba(129,140,248,0.08)',
    duration:  10,
  },
  {
    className: 'w-[400px] h-[320px] -bottom-16 -left-20',
    color:     'rgba(56,189,248,0.07)',
    duration:  12,
  },
]

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target:  containerRef,
    offset:  ['start start', 'end start'],
  })
  const contentY  = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const contentOp = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >

      {/* ── Ambient orbs ── */}
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full pointer-events-none ${orb.className}`}
          style={{
            background: `radial-gradient(ellipse, ${orb.color} 0%, transparent 70%)`,
          }}
          animate={{ y: [0, -24, 0] }}
          transition={{
            duration:  orb.duration,
            repeat:    Infinity,
            ease:      'easeInOut',
            delay:     i * 1.5,
          }}
        />
      ))}

      {/* ── Horizontal atmospheric line ── */}
      <div className="
        absolute top-1/2 left-0 right-0 h-px pointer-events-none
        bg-gradient-to-r from-transparent via-[rgba(56,189,248,0.12)] to-transparent
      " />

      {/* ── Main content ── */}
      <motion.div
        style={{ y: contentY, opacity: contentOp }}
        className="relative z-10 flex flex-col items-center text-center px-6 pt-28 pb-20 max-w-5xl mx-auto"
      >

        {/* ── Headline ── */}
        <h1 className="
          font-display font-extrabold leading-[1.0] tracking-[-0.03em]
          text-[clamp(3rem,8vw,6rem)]
          text-[#e2eaf4] mb-6
        ">
          {/* Line 1 */}
          <motion.span
            className="flex flex-wrap justify-center gap-x-[0.25em] mb-1"
            variants={staggerContainer(0.12, 0.4)}
            initial="hidden"
            animate="show"
          >
            {LINE_1.map((word) => (
              <motion.span
                key={word}
                variants={wordVariants}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </motion.span>

          {/* Line 2 — last word gets gradient */}
          <motion.span
            className="flex flex-wrap justify-center gap-x-[0.25em]"
            variants={staggerContainer(0.12, 0.4 + LINE_1.length * 0.12)}
            initial="hidden"
            animate="show"
          >
            {LINE_2.map((word, i) => (
              <motion.span
                key={word}
                variants={wordVariants}
                className={i === LINE_2.length - 1 ? 'text-gradient' : ''}
              >
                {word}
              </motion.span>
            ))}
          </motion.span>
        </h1>

        {/* ── Sub-headline ── */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.7, delay: 1.1, ease: EASE_SMOOTH }}
          className="
            text-[#7a9bbf] text-[clamp(1rem,2vw,1.15rem)]
            leading-[1.75] max-w-[520px] mb-10
          "
        >
          Software engineer &amp; designer building precise, beautiful
          experiences — where technical craft meets genuine aesthetic intention.
        </motion.p>

        {/* ── CTA ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.7, delay: 1.3, ease: EASE_SMOOTH }}
        >
          <Link
            href="#projects"
            className="
              group flex items-center gap-2 px-7 py-3.5 rounded-full
              bg-gradient-to-r from-[#38bdf8] to-[#818cf8]
              text-[#03060f] font-semibold text-sm tracking-[0.01em]
              shadow-[0_0_32px_rgba(56,189,248,0.3),0_4px_16px_rgba(0,0,0,0.4)]
              hover:shadow-[0_0_48px_rgba(56,189,248,0.5),0_4px_24px_rgba(0,0,0,0.5)]
              hover:-translate-y-px transition-all duration-200
            "
          >
            View My Work
            <motion.svg
              className="w-4 h-4"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              whileHover={{ x: 3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </Link>
        </motion.div>

      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.7, delay: 1.6, ease: EASE_SMOOTH }}
        className="absolute bottom-3 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] text-[#3d5a7a] tracking-[0.15em] uppercase">
          Scroll
        </span>
        <motion.div
          className="w-px h-9 bg-gradient-to-b from-[rgba(56,189,248,0.5)] to-transparent"
          animate={{ scaleY: [1, 1.15, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

    </section>
  )
}