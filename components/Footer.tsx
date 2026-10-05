'use client'
import { useRef } from 'react'
import { motion, useTransform } from 'framer-motion'
import { useScrollProgress } from './fx/primitives'
import { SOCIALS } from '@/lib/data'

const YEAR = new Date().getFullYear()

export default function Footer() {
  const ref = useRef<HTMLElement>(null)
  const scrollYProgress = useScrollProgress({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], ['40%', '0%'])
  const rotateX = useTransform(scrollYProgress, [0, 1], [60, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [0, 1])

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-[var(--line)] pt-14">
      <div className="container-wide">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-fog">
            <p className="text-ink">Mathias Matejčík</p>
            <p>Engineer · Designer · Skipper</p>
            <p>49°05′N 19°37′E · Liptovský Mikuláš</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-mist transition-colors hover:text-sonar">
                {s.label} ↗
              </a>
            ))}
            <a href="#hero" className="text-mist transition-colors hover:text-flare">Back to top ↑</a>
          </div>
        </div>
      </div>

      <div className="mt-10 overflow-hidden" style={{ perspective: 900 }}>
        <motion.p
          aria-hidden
          style={{ y, rotateX, opacity, transformOrigin: '50% 100%' }}
          className="text-gradient-sea select-none whitespace-nowrap text-center font-display text-[18.5vw] font-extrabold leading-[0.78] tracking-[-0.06em]"
        >
          Mathias
        </motion.p>
      </div>

      <div className="container-wide flex flex-col items-center justify-between gap-2 py-6 font-mono text-[10px] uppercase tracking-[0.16em] text-fog sm:flex-row">
        <span>© {YEAR} All rights reserved</span>
        <span>Designed &amp; built by hand, fair winds</span>
      </div>
    </footer>
  )
}
