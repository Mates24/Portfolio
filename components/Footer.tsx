'use client'
import { motion } from 'framer-motion'

const EASE_SMOOTH = [0.4, 0, 0.2, 1] as [number, number, number, number]

const YEAR = new Date().getFullYear()

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <motion.footer
      className="relative z-10 px-6 md:px-12 pb-5 pt-0"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: EASE_SMOOTH }}
    >
      {/* Glowing divider */}
      <div className="
        h-px mb-8
        bg-gradient-to-r
        from-transparent
        via-[rgba(56,189,248,0.18)]
        to-transparent
      " />

      <div className="
        max-w-[1280px] mx-auto
        flex flex-col sm:flex-row items-center
        justify-between gap-5
      ">

        {/* ── Left — signature ── */}
        <div className="flex flex-col gap-1 items-center sm:items-start">
          <span className="
            font-display font-bold text-[14px]
            text-[#e2eaf4] tracking-[-0.01em]
          ">
            Mathias Matejčík
          </span>
          <span className="font-mono text-[10px] text-[#3d5a7a] tracking-[0.06em]">
            © {YEAR} — All rights reserved
          </span>
        </div>

        {/* ── Center — tagline ── */}
        <p className="font-mono text-[10px] text-[#3d5a7a] tracking-[0.1em] text-center">
          Designed &amp; built with{' '}
          <span className="text-[#38bdf8] text-[12px]">✦</span>
        </p>

        {/* ── Right — back to top ── */}
        <button
          onClick={scrollToTop}
          className="group flex items-center gap-2.5 cursor-pointer"
          aria-label="Back to top"
        >
          <span className="
            font-mono text-[10px] text-[#3d5a7a]
            tracking-[0.1em] uppercase
            group-hover:text-[#7a9bbf]
            transition-colors duration-200
          ">
            Back to top
          </span>
          <span className="
            flex items-center justify-center
            w-7 h-7 rounded-[8px]
            border border-[rgba(99,179,237,0.15)]
            bg-[rgba(56,189,248,0.04)]
            group-hover:border-[rgba(56,189,248,0.3)]
            group-hover:bg-[rgba(56,189,248,0.08)]
            transition-all duration-200
          ">
            <motion.svg
              className="w-3 h-3 text-[#38bdf8]"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <path d="M6 9V3M3 6l3-3 3 3" />
            </motion.svg>
          </span>
        </button>

      </div>
    </motion.footer>
  )
}