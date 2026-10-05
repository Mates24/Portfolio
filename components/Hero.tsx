'use client'
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, useTransform } from 'framer-motion'
import { EASE_OUT, useScrollProgress } from './fx/primitives'

const OceanScene = dynamic(() => import('./three/OceanScene'), { ssr: false })

const LINES = ['I design and build', 'websites, apps', 'and brands.']

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

  const progress = useScrollProgress({ target: ref, offset: ['start start', 'end start'] })
  const y       = useTransform(progress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(progress, [0, 0.6], [1, 0])

  return (
    <section ref={ref} id="hero" className="relative h-[100svh] min-h-[620px] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#03070d_0%,#06101c_55%,#081626_100%)]" />
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: EASE_OUT }}
      >
        <OceanScene active={active} />
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-void via-[rgba(3,7,13,0.6)] to-transparent" />

      <motion.div style={{ y, opacity }} className="relative z-10 flex h-full items-end pb-12 md:pb-16">
        <div className="container-wide">
          <h1 className="font-display text-[clamp(2.6rem,7vw,6.5rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-ink">
            {LINES.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.05em]">
                <motion.span
                  className="block"
                  initial={{ y: '105%' }}
                  animate={{ y: '0%' }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 1.1, ease: EASE_OUT }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            className="mt-10 grid grid-cols-1 gap-6 border-t border-[var(--line)] pt-6 text-[15px] md:grid-cols-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
          >
            <p className="text-mist md:col-span-3">Mathias Matejčík</p>
            <p className="max-w-[46ch] text-mist md:col-span-5">
              Engineer and designer from Liptovský Mikuláš, Slovakia. Licensed skipper,
              which is how I ended up building an app for sailors.
            </p>
            <div className="flex gap-6 md:col-span-4 md:justify-end">
              <a href="#work" className="link-line text-ink">See work</a>
              <a href="#contact" className="link-line text-ink">Get in touch</a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
