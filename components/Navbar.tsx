'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { EASE_OUT } from './fx/primitives'

const NAV_LINKS = [
  { label: 'About',   href: '#about'   },
  { label: 'Work',    href: '#work'    },
  { label: 'Skills',  href: '#skills'  },
  { label: 'Skipper', href: '#skipper' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [hidden,     setHidden]     = useState(false)
  const [active,     setActive]     = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  // Hide on scroll down, reveal on scroll up
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      setHidden(y > 600 && y > last + 4)
      if (y < last - 4) setHidden(false)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    NAV_LINKS.forEach(({ href }) => {
      const el = document.getElementById(href.slice(1))
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(href.slice(1)) },
        { rootMargin: '-45% 0px -50% 0px' },
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <motion.div
        className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-sonar via-tide to-flare"
        style={{ scaleX: progress }}
      />

      <motion.header
        className="fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-5"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden && !mobileOpen ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
      >
        <nav
          className={[
            'flex h-[54px] w-full max-w-[920px] items-center justify-between rounded-full pl-4 pr-2 transition-all duration-500',
            scrolled || mobileOpen
              ? 'border border-[var(--line-bright)] bg-[rgba(5,11,23,0.72)] shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl'
              : 'border border-transparent bg-transparent',
          ].join(' ')}
        >
          <a href="#hero" className="flex items-center gap-2" aria-label="Back to top">
            <Image src="/logo.svg" alt="" width={24} height={24} className="h-6 w-6" />
            <span className="font-display text-[15px] font-semibold tracking-tight text-ink">Mathias</span>
          </a>

          <ul className="hidden list-none items-center gap-1 md:flex">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = active === href.slice(1)
              return (
                <li key={href}>
                  <a
                    href={href}
                    className={`relative block rounded-full px-3.5 py-1.5 text-[13.5px] transition-colors duration-300 ${isActive ? 'text-void' : 'text-mist hover:text-ink'}`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-ink"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{label}</span>
                  </a>
                </li>
              )
            })}
          </ul>

          <a
            href="#contact"
            className="hidden items-center gap-2 rounded-full border border-[rgba(255,138,76,0.35)] bg-[rgba(255,138,76,0.08)] px-4 py-2 text-[13px] font-medium text-flare transition-all hover:bg-[rgba(255,138,76,0.18)] md:flex"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-flare shadow-[0_0_8px_rgba(255,138,76,0.9)]" />
            Let&apos;s talk
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <motion.span animate={mobileOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }} className="block h-[1.5px] w-5 rounded-full bg-ink" />
            <motion.span animate={mobileOpen ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }} className="block h-[1.5px] w-5 rounded-full bg-ink" />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ clipPath: 'circle(0% at 90% 40px)' }}
            animate={{ clipPath: 'circle(150% at 90% 40px)' }}
            exit={{ clipPath: 'circle(0% at 90% 40px)' }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
            className="chart-grid fixed inset-0 z-40 flex flex-col bg-abyss md:hidden"
          >
            <nav className="flex flex-1 flex-col justify-center gap-1 px-6">
              {NAV_LINKS.map(({ label, href }, i) => (
                <motion.a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: EASE_OUT }}
                  className="flex items-baseline gap-4 py-2 font-display text-5xl font-bold tracking-tight text-ink"
                >
                  <span className="font-mono text-xs text-sonar">0{i + 1}</span>
                  {label}
                </motion.a>
              ))}
            </nav>
            <p className="pb-10 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-fog">
              49°05′N 19°37′E · Liptov, Slovakia
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
