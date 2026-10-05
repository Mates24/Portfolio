'use client'
import { motion } from 'framer-motion'
import { EASE_OUT, RevealLines, Tilt } from './fx/primitives'

const SERVICES = [
  {
    code:  'WEB',
    title: 'Websites & e-commerce',
    desc:  'Fast, SEO-ready sites, online catalogues, booking systems and custom admin panels your team can actually use.',
    stack: 'Next.js · Postgres · CMS',
    accent: '94,231,255',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-full w-full">
        <rect x="5" y="9" width="38" height="28" rx="3" />
        <path d="M5 16h38M10 12.5h.01M14 12.5h.01M18 12.5h.01M16 42h16M24 37v5" />
        <path d="M13 23h12M13 28h20M13 32h8" opacity=".55" />
      </svg>
    ),
  },
  {
    code:  'APP',
    title: 'Mobile apps',
    desc:  'Native-feeling iOS apps with React Native and Expo, from idea and UX to subscriptions and App Store release.',
    stack: 'React Native · Expo · RevenueCat',
    accent: '255,138,76',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-full w-full">
        <rect x="14" y="4" width="20" height="40" rx="4" />
        <path d="M21 8h6M19 15h10M19 20h10M19 25h6" opacity=".55" />
        <circle cx="24" cy="38" r="1.6" />
      </svg>
    ),
  },
  {
    code:  'BRD',
    title: 'Brand & interface design',
    desc:  'Logos, visual identities, labels and packaging, plus interfaces designed in Figma with real design systems behind them.',
    stack: 'Figma · Illustrator · Photoshop',
    accent: '196,148,255',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-full w-full">
        <path d="M24 4l5 15h15l-12 9 5 16-13-10-13 10 5-16L4 19h15z" />
        <circle cx="24" cy="24" r="5" opacity=".55" />
      </svg>
    ),
  },
]

export default function Services() {
  return (
    <section className="relative py-16 md:py-24">
      <div className="container-wide">
        <div className="mb-14 flex flex-col justify-between gap-6 md:mb-20 md:flex-row md:items-end">
          <RevealLines
            className="font-display text-[clamp(2.25rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.035em] text-ink"
            lines={['What I bring', <span key="b" className="font-serif font-normal italic text-sonar">on board</span>]}
          />
          <p className="max-w-[340px] text-mist">
            One person across design and engineering means nothing gets lost in translation, from the logo to the last API route.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3" style={{ perspective: 1400 }}>
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.code}
              initial={{ opacity: 0, y: 80, rotateX: 35 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1.2, delay: i * 0.12, ease: EASE_OUT }}
              style={{ transformOrigin: '50% 100%' }}
            >
              <Tilt max={9} accent={s.accent} className="panel group h-full rounded-[26px] p-7 md:p-8">
                <div className="flex items-start justify-between" style={{ transform: 'translateZ(40px)' }}>
                  <div className="h-14 w-14 transition-transform duration-700 ease-[var(--ease-out)] group-hover:rotate-[-8deg] group-hover:scale-110" style={{ color: `rgb(${s.accent})` }}>
                    {s.icon}
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-fog">0{i + 1} / {s.code}</span>
                </div>
                <h3 className="mt-14 font-display text-2xl font-semibold tracking-[-0.02em] text-ink" style={{ transform: 'translateZ(30px)' }}>
                  {s.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-mist">{s.desc}</p>
                <div className="mt-8 border-t border-[var(--line)] pt-4 font-mono text-[11px] tracking-[0.05em] text-fog">
                  {s.stack}
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
