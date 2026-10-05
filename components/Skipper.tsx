'use client'
import { useRef } from 'react'
import { motion, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion'
import { ArrowUpRight, SectionLabel, useScrollProgress } from './fx/primitives'

const ROUTE = 'M 110 630 C 220 600, 300 560, 380 500 S 470 380, 560 380 S 720 410, 730 330 S 700 170, 920 120'

const LAND = [
  'M0 0 L 380 0 C 360 60, 300 90, 250 140 C 200 190, 120 170, 80 230 C 50 280, 20 300, 0 310 Z',
  'M 520 470 C 560 440, 640 450, 660 490 C 680 530, 620 570, 570 560 C 520 550, 490 500, 520 470 Z',
  'M 790 225 C 830 205, 885 215, 893 252 C 900 290, 852 312, 815 302 C 778 292, 762 244, 790 225 Z',
  'M 1000 540 C 940 570, 900 640, 870 700 L 1000 700 Z',
]

const WAYPOINTS = [
  { t: 0,    x: 110, y: 630, label: 'WP01 · Cast off' },
  { t: 0.36, x: 380, y: 500, label: 'WP02 · Open water' },
  { t: 0.68, x: 730, y: 330, label: 'WP03 · Pass the cape' },
  { t: 1,    x: 920, y: 120, label: 'WP04 · Landfall' },
]

const CHAPTERS = [
  {
    kicker: 'Chapter 01 · The license',
    title: <>I hold a <span className="font-serif font-normal italic text-sonar">captain&apos;s</span> license.</>,
    body: 'Liptov is about as far from the sea as Slovakia gets, and still, whenever I can, I am at the helm. Being responsible for a boat and everyone on it is the best brief I have ever had.',
  },
  {
    kicker: 'Chapter 02 · What the sea teaches',
    title: <>Plan the passage. <span className="font-serif font-normal italic text-sonar">Respect</span> the conditions.</>,
    body: 'Checklists, redundancy, calm decisions under pressure. The habits that keep a crew safe are the same ones I bring to software: prepare well, test everything, build systems that hold when it matters.',
  },
  {
    kicker: 'Chapter 03 · Built on board',
    title: <>So I built the logbook <span className="font-serif font-normal italic text-flare">I wanted.</span></>,
    body: 'LogBook is a professional digital yacht log for skippers and charter crews: voyages, crew, maps, statistics and PDF export. Designed, built and shipped to the App Store by me.',
    cta: { label: 'LogBook on the App Store', href: 'https://apps.apple.com/us/app/logbook-digital-yacht-log/id6762569859' },
  },
]

function Chapter({ i, progress, chapter }: { i: number; progress: MotionValue<number>; chapter: (typeof CHAPTERS)[number] }) {
  const a = i / CHAPTERS.length
  const b = (i + 1) / CHAPTERS.length
  const first = i === 0
  const last = i === CHAPTERS.length - 1
  // Fade out fully before the next chapter fades in. Offsets must stay inside 0–1,
  // so the first/last chapters skip their outer fade.
  const input = first ? [b - 0.07, b - 0.01] : last ? [a + 0.01, a + 0.07] : [a + 0.01, a + 0.07, b - 0.07, b - 0.01]
  const opacity = useTransform(progress, input, first ? [1, 0] : last ? [0, 1] : [0, 1, 1, 0])
  const y = useTransform(progress, input, first ? [0, -50] : last ? [50, 0] : [50, 0, 0, -50])
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? 'auto' : 'none'))
  return (
    <motion.div style={{ opacity, y, pointerEvents }} className="absolute inset-0 flex flex-col justify-center">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-flare md:text-[11px]">{chapter.kicker}</p>
      <h3 className="font-display text-[clamp(1.9rem,4vw,3.6rem)] font-bold leading-[1] tracking-[-0.035em] text-ink">{chapter.title}</h3>
      <p className="mt-5 max-w-[460px] text-[15px] leading-relaxed text-mist md:text-base">{chapter.body}</p>
      {chapter.cta && (
        <a
          href={chapter.cta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(255,138,76,0.4)] bg-[rgba(255,138,76,0.08)] px-5 py-3 text-sm font-medium text-flare transition-colors hover:bg-[rgba(255,138,76,0.18)]"
        >
          {chapter.cta.label}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      )}
    </motion.div>
  )
}

function Waypoint({ wp, last, routeT }: { wp: (typeof WAYPOINTS)[number]; last: boolean; routeT: MotionValue<number> }) {
  const from = Math.min(Math.max(wp.t - 0.02, 0), 0.96)
  const opacity = useTransform(routeT, [from, from + 0.04], [0.15, 1])
  return (
    <motion.g style={{ opacity }}>
      <circle cx={wp.x} cy={wp.y} r="7" fill="none" stroke="#5ee7ff" strokeWidth="1.5" />
      <circle cx={wp.x} cy={wp.y} r="2" fill="#5ee7ff" />
      <text x={wp.x + 14} y={wp.y + (last ? 22 : -10)} fill="#e9f1f8" fontSize="13" fontFamily="var(--font-mono)" letterSpacing="1">{wp.label}</text>
    </motion.g>
  )
}

function Chart({ progress }: { progress: MotionValue<number> }) {
  const pathRef = useRef<SVGPathElement>(null)
  const boatRef = useRef<SVGGElement>(null)
  const hdgRef  = useRef<HTMLSpanElement>(null)
  const dtgRef  = useRef<HTMLSpanElement>(null)
  const legRef  = useRef<HTMLSpanElement>(null)

  const routeT  = useTransform(progress, [0.04, 0.94], [0, 1], { clamp: true })
  const compass = useTransform(progress, [0, 1], [0, -200])

  useMotionValueEvent(routeT, 'change', (t) => {
    const path = pathRef.current
    if (!path || !boatRef.current) return
    const L = path.getTotalLength()
    const p = path.getPointAtLength(L * t)
    const q = path.getPointAtLength(Math.min(L, L * t + 2))
    const r = path.getPointAtLength(Math.max(0, L * t - 2))
    const angle = (Math.atan2(q.y - r.y, q.x - r.x) * 180) / Math.PI
    boatRef.current.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${angle + 90})`)
    const hdg = (Math.round(angle + 90) + 360) % 360
    if (hdgRef.current) hdgRef.current.textContent = `${String(hdg).padStart(3, '0')}°`
    if (dtgRef.current) dtgRef.current.textContent = `${(24 * (1 - t)).toFixed(1)} nm`
    if (legRef.current) legRef.current.textContent = `0${Math.min(3, Math.floor(t * 3) + 1)}/03`
  })

  return (
    <div className="panel relative h-full w-full overflow-hidden rounded-[28px]">
      <svg viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(140,200,255,0.08)" strokeWidth="1" />
          </pattern>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff8a4c" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ff8a4c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1000" height="700" fill="url(#grid)" />

        {/* Depth contours + land */}
        {LAND.map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke="rgba(94,231,255,0.05)" strokeWidth="60" strokeLinejoin="round" />
            <path d={d} fill="none" stroke="rgba(94,231,255,0.08)" strokeWidth="28" strokeLinejoin="round" />
            <path d={d} fill="none" stroke="rgba(94,231,255,0.25)" strokeWidth="1" strokeDasharray="3 5" />
            <path d={d} fill="#0c1b33" stroke="rgba(94,231,255,0.45)" strokeWidth="1.2" />
          </g>
        ))}

        {/* Sounding numbers scattered on the chart */}
        {[[200, 420, 18], [460, 620, 32], [640, 260, 27], [860, 420, 41], [330, 300, 12], [700, 610, 36], [560, 160, 22]].map(([x, y, d]) => (
          <text key={`${x}-${y}`} x={x} y={y} fill="rgba(139,163,189,0.5)" fontSize="13" fontFamily="var(--font-mono)">{d}</text>
        ))}

        {/* Planned route (ghost) + sailed route */}
        <path d={ROUTE} fill="none" stroke="rgba(233,241,248,0.18)" strokeWidth="1.5" strokeDasharray="6 8" />
        <motion.path ref={pathRef} d={ROUTE} fill="none" stroke="#ff8a4c" strokeWidth="2.5" strokeLinecap="round" style={{ pathLength: routeT }} />

        {WAYPOINTS.map((w, i) => (
          <Waypoint key={w.label} wp={w} last={i === WAYPOINTS.length - 1} routeT={routeT} />
        ))}

        {/* Boat marker */}
        <g ref={boatRef} transform="translate(110 630)">
          <circle r="26" fill="url(#glow)" opacity="0.35" />
          <path d="M0 -14 L8 10 L0 5 L-8 10 Z" fill="#ff8a4c" stroke="#ffd9c4" strokeWidth="1" />
        </g>
      </svg>

      {/* Compass rose */}
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute right-4 top-4 h-24 w-24 md:right-6 md:top-6 md:h-32 md:w-32"
        style={{ rotate: compass }}
        aria-hidden
      >
        <circle cx="100" cy="100" r="92" fill="rgba(5,11,23,0.6)" stroke="rgba(94,231,255,0.35)" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(94,231,255,0.15)" />
        {Array.from({ length: 36 }).map((_, i) => (
          <line key={i} x1="100" y1="10" x2="100" y2={i % 9 === 0 ? 26 : 18} stroke="rgba(94,231,255,0.5)" strokeWidth={i % 9 === 0 ? 2 : 1} transform={`rotate(${i * 10} 100 100)`} />
        ))}
        <path d="M100 30 L110 100 L100 170 L90 100 Z" fill="rgba(94,231,255,0.15)" stroke="#5ee7ff" />
        <path d="M100 30 L110 100 L90 100 Z" fill="#ff8a4c" />
        <path d="M30 100 L100 92 L170 100 L100 108 Z" fill="rgba(94,231,255,0.1)" stroke="rgba(94,231,255,0.5)" />
        <text x="100" y="52" textAnchor="middle" fill="#e9f1f8" fontSize="14" fontFamily="var(--font-mono)">N</text>
      </motion.svg>

      {/* HUD readout */}
      <div className="absolute inset-x-4 bottom-4 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] font-mono text-[10px] uppercase tracking-[0.15em] md:inset-x-6 md:bottom-6 md:text-[11px]">
        {[
          ['HDG', hdgRef, '017°'],
          ['DTG', dtgRef, '24.0 nm'],
          ['LEG', legRef, '01/03'],
        ].map(([label, ref, init]) => (
          <div key={label as string} className="bg-[rgba(5,11,23,0.85)] px-3 py-2.5 backdrop-blur md:px-4">
            <p className="text-fog">{label as string}</p>
            <span ref={ref as React.RefObject<HTMLSpanElement>} className="text-ink">{init as string}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Skipper() {
  const ref = useRef<HTMLElement>(null)
  const scrollYProgress = useScrollProgress({ target: ref, offset: ['start start', 'end end'] })

  return (
    <section id="skipper" ref={ref} className="relative h-[340vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pt-24 pb-6 md:pt-28 md:pb-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_70%_60%,rgba(43,183,224,0.08),transparent_70%)]" />
        <div className="container-wide relative flex min-h-0 flex-1 flex-col">
          <SectionLabel index="04">Off the keyboard</SectionLabel>
          <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:grid-rows-1 lg:gap-14">
            <div className="relative">
              {CHAPTERS.map((c, i) => (
                <Chapter key={i} i={i} progress={scrollYProgress} chapter={c} />
              ))}
            </div>
            <Chart progress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  )
}
