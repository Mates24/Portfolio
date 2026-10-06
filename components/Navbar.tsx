'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EASE_OUT } from './fx/primitives'

const NAV_LINKS = [
  { label: 'About',   href: '#about'   },
  { label: 'Work',    href: '#work'    },
  { label: 'Tools',   href: '#skills'  },
  { label: 'Sailing', href: '#skipper' },
  { label: 'Contact', href: '#contact' },
]

/* Menu icon: three small waves that ripple, folding into an × when open.
   Wave and × paths share the same commands (M Q T T) so they can morph. */
const wave = (y: number, amp: number) => `M3 ${y} Q6 ${y - amp} 9 ${y} T15 ${y} T21 ${y}`
const CROSS_A = 'M4 4 Q7 7 10 10 T16 16 T20 20'
const CROSS_B = 'M4 20 Q7 17 10 14 T16 8 T20 4'

function WaveMenu({ open }: { open: boolean }) {
  const lines = [
    { y: 6.5,  cross: CROSS_A, delay: 0 },
    { y: 12,   cross: null,    delay: 0.25 },
    { y: 17.5, cross: CROSS_B, delay: 0.5 },
  ]
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 overflow-visible" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
      {lines.map(({ y, cross, delay }) => (
        <motion.path
          key={y}
          initial={false}
          animate={
            open
              ? { d: cross ?? wave(y, 0), opacity: cross ? 1 : 0 }
              : { d: [wave(y, 1.6), wave(y, -1.6), wave(y, 1.6)], opacity: 1 }
          }
          transition={
            open
              ? { duration: 0.45, ease: EASE_OUT }
              : { d: { duration: 2.6, ease: 'easeInOut', repeat: Infinity, delay }, opacity: { duration: 0.2 } }
          }
        />
      ))}
    </svg>
  )
}

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [active,     setActive]     = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    // Hero is observed too so no link stays highlighted at the top of the page.
    ;['#hero', ...NAV_LINKS.map((l) => l.href)].forEach((href) => {
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
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled && !mobileOpen ? 'border-b border-[var(--line)] bg-[rgba(3,7,13,0.85)] backdrop-blur-md' : 'border-b border-transparent'
        }`}
      >
        <div className="container-wide flex h-[72px] items-center justify-between">
          <a href="#hero" className="group flex items-center font-display text-[19px] font-semibold tracking-[-0.02em]" aria-label="Mathias.dev, back to top">
            <span className="text-ink">Mathias</span>
            <span className="text-sonar">.dev</span>
          </a>

          <div className="hidden items-center gap-9 md:flex">
            <nav className="flex items-center gap-8 text-[14.5px]">
              {NAV_LINKS.filter((l) => l.href !== '#contact').map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className={`link-line transition-colors ${active === href.slice(1) ? 'text-ink' : 'text-mist hover:text-ink'}`}
                >
                  {label}
                </a>
              ))}
            </nav>
            <a
              href="#contact"
              className={`rounded-full border px-5 py-2 text-[14.5px] transition-[border-color,box-shadow,color] duration-300 hover:shadow-[0_0_20px_rgba(127,216,236,0.25)] ${
                active === 'contact' ? 'border-sonar text-ink' : 'border-[var(--line-bright)] text-ink hover:border-sonar'
              }`}
            >
              Contact
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="-mr-2 flex h-11 w-11 items-center justify-center text-ink md:hidden"
          >
            <WaveMenu open={mobileOpen} />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col justify-end bg-void px-5 pb-12 md:hidden"
          >
            <nav className="flex flex-col">
              {NAV_LINKS.map(({ label, href }, i) => (
                <motion.a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.6, ease: EASE_OUT }}
                  className="border-t border-[var(--line)] py-4 font-display text-4xl font-semibold tracking-tight text-ink"
                >
                  {label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
