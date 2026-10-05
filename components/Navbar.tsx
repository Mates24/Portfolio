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
          scrolled && !mobileOpen ? 'border-b border-[var(--line)] bg-[rgba(3,7,13,0.9)] backdrop-blur-md' : 'border-b border-transparent'
        }`}
      >
        <div className="container-wide flex h-16 items-center justify-between text-[14px]">
          <a href="#hero" className="font-medium text-ink">Mathias Matejčík</a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className={`link-line transition-colors ${active === href.slice(1) ? 'text-ink' : 'text-mist hover:text-ink'}`}
              >
                {label}
              </a>
            ))}
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            className="text-ink md:hidden"
          >
            {mobileOpen ? 'Close' : 'Menu'}
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
