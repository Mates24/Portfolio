'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'About',      href: '#about'      },
  { label: 'Skills',     href: '#skills'      },
  { label: 'Projects',   href: '#projects'    },
  { label: 'Experience', href: '#experience'  },
]

export default function Navbar() {
  const [scrolled,      setScrolled]      = useState(false)
  const [activeSection, setActiveSection] = useState('about')
  const [mobileOpen,    setMobileOpen]    = useState(false)

  // Glow intensifies after scrolling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = NAV_LINKS.map(l => l.href.slice(1))
    const observers: IntersectionObserver[] = []

    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-40% 0px -50% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 sm:px-6"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <nav
          className={[
            'relative flex items-center justify-between',
            'w-full max-w-[860px] h-[52px] px-5 rounded-full',
            'transition-all duration-500',
            'bg-[rgba(6,13,31,0.72)] backdrop-blur-2xl',
            scrolled
              ? 'border border-[rgba(99,179,237,0.28)] shadow-[0_0_0_1px_rgba(56,189,248,0.08)_inset,0_8px_40px_rgba(0,0,0,0.5),0_0_40px_rgba(56,189,248,0.12)]'
              : 'border border-[rgba(99,179,237,0.12)] shadow-[0_0_0_1px_rgba(56,189,248,0.03)_inset,0_8px_32px_rgba(0,0,0,0.35),0_0_16px_rgba(56,189,248,0.04)]',
          ].join(' ')}
        >

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="
              w-7 h-7 rounded-[8px] flex items-center justify-center
              bg-gradient-to-br from-[#38bdf8] to-[#818cf8]
              shadow-[0_0_16px_rgba(56,189,248,0.4)]
              group-hover:shadow-[0_0_24px_rgba(56,189,248,0.6)]
              transition-shadow duration-300
              font-display font-bold text-[13px] text-white tracking-tight
            ">
              YN
            </div>
            <span className="font-display font-semibold text-[15px] text-[#e2eaf4] tracking-tight">
              Your Name
            </span>
          </Link>

          {/* ── Desktop Links ── */}
          <ul className="hidden md:flex items-center gap-0.5 list-none">
            {NAV_LINKS.map(({ label, href }) => {
              const id       = href.slice(1)
              const isActive = activeSection === id
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={[
                      'relative block px-3.5 py-1.5 rounded-full',
                      'text-[13.5px] tracking-[0.01em] transition-colors duration-200',
                      isActive
                        ? 'text-[#e2eaf4] bg-[rgba(56,189,248,0.1)]'
                        : 'text-[#7a9bbf] hover:text-[#c8ddf0] hover:bg-[rgba(56,189,248,0.06)]',
                    ].join(' ')}
                  >
                    {label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-dot"
                        className="
                          absolute -bottom-px left-1/2 -translate-x-1/2
                          w-4 h-[2px] rounded-full
                          bg-gradient-to-r from-[#38bdf8] to-[#67e8f9]
                          shadow-[0_0_8px_rgba(56,189,248,0.7)]
                        "
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* ── Desktop CTA ── */}
          <div className="hidden md:flex items-center">
            <Link
              href="#contact"
              className="
                flex items-center gap-2 px-4 py-[7px] rounded-full
                bg-[rgba(56,189,248,0.1)] border border-[rgba(56,189,248,0.22)]
                text-[#67e8f9] text-[13px] font-medium tracking-[0.01em]
                hover:bg-[rgba(56,189,248,0.18)] hover:border-[rgba(56,189,248,0.42)]
                hover:shadow-[0_0_20px_rgba(56,189,248,0.15)]
                hover:text-[#a5f3fc]
                transition-all duration-200
              "
            >
              <span className="
                w-1.5 h-1.5 rounded-full bg-[#38bdf8]
                shadow-[0_0_6px_rgba(56,189,248,0.9)]
                animate-pulse
              " />
              Let's Talk
            </Link>
          </div>

          {/* ── Mobile Toggle ── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            className="md:hidden flex flex-col gap-1 p-2 cursor-pointer"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 5 }   : { rotate: 0, y: 0 }}
              className="block w-5 h-[1.5px] bg-[#7a9bbf] rounded-full origin-center"
              transition={{ duration: 0.25 }}
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              className="block w-5 h-[1.5px] bg-[#7a9bbf] rounded-full"
              transition={{ duration: 0.2 }}
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
              className="block w-5 h-[1.5px] bg-[#7a9bbf] rounded-full origin-center"
              transition={{ duration: 0.25 }}
            />
          </button>

        </nav>
      </motion.header>

      {/* ── Mobile Menu Overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="
              fixed inset-0 z-40 flex flex-col
              bg-[rgba(3,6,15,0.95)] backdrop-blur-2xl
              md:hidden
            "
          >
            {/* Ambient glow */}
            <div className="
              absolute top-0 left-1/2 -translate-x-1/2
              w-[500px] h-[300px] rounded-full
              blur-[120px] pointer-events-none
              bg-[rgba(56,189,248,0.06)]
            " />

            <nav className="flex flex-col items-center justify-center flex-1 gap-2">
              {NAV_LINKS.map(({ label, href }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ delay: i * 0.07, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                >
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="
                      block px-8 py-3
                      font-display font-semibold text-3xl tracking-tight
                      text-[#3d5a7a] hover:text-[#e2eaf4]
                      transition-colors duration-200
                    "
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.07 + 0.05, duration: 0.4 }}
                className="mt-8"
              >
                <Link
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="
                    flex items-center gap-2.5 px-8 py-3.5 rounded-full
                    border border-[rgba(56,189,248,0.3)]
                    text-[#67e8f9] font-medium text-base tracking-wide
                    hover:bg-[rgba(56,189,248,0.1)]
                    transition-all duration-200
                  "
                >
                  <span className="
                    w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse
                    shadow-[0_0_8px_rgba(56,189,248,0.8)]
                  " />
                  Let's Talk
                </Link>
              </motion.div>
            </nav>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-mono text-[11px] text-[#3d5a7a] text-center pb-8 tracking-widest"
            >
              PORTFOLIO — 2025
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}