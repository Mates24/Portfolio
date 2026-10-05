'use client'
import { useRef } from 'react'
import { motion, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion'
import { ArrowUpRight, useScrollProgress } from './fx/primitives'

const ROUTE = 'M 110 630 C 220 600, 300 560, 380 500 S 470 380, 560 380 S 720 410, 730 330 S 700 170, 920 120'

const LAND = [
  'M0 0 L 380 0 C 360 60, 300 90, 250 140 C 200 190, 120 170, 80 230 C 50 280, 20 300, 0 310 Z',
  'M 520 470 C 560 440, 640 450, 660 490 C 680 530, 620 570, 570 560 C 520 550, 490 500, 520 470 Z',
  'M 790 225 C 830 205, 885 215, 893 252 C 900 290, 852 312, 815 302 C 778 292, 762 244, 790 225 Z',
  'M 1000 540 C 940 570, 900 640, 870 700 L 1000 700 Z',
]

const WAYPOINTS = [
  { t: 0,    x: 110, y: 630 },
  { t: 0.36, x: 380, y: 500 },
  { t: 0.68, x: 730, y: 330 },
  { t: 1,    x: 920, y: 120 },
]

const CHAPTERS = [
  {
    title: 'I have a captain’s license.',
    body: 'Liptov is about as far from the sea as Slovakia gets, but I spend as much time on the water as I can.',
  },
  {
    title: 'Sailing changed how I work.',
    body: 'On a boat you plan the passage, check everything twice and stay calm when the weather turns. I try to run projects the same way.',
  },
  {
    title: 'So I built LogBook.',
    body: 'A digital yacht logbook for skippers and charter crews: voyages, crew, maps, statistics and PDF export. Designed and built by me, out on the App Store.',
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
  const y = useTransform(progress, input, first ? [0, -30] : last ? [30, 0] : [30, 0, 0, -30])
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? 'auto' : 'none'))
  return (
    <motion.div style={{ opacity, y, pointerEvents }} className="absolute inset-0 flex flex-col justify-center">
      <p className="mb-4 text-[14px] text-fog">{i + 1} of {CHAPTERS.length}</p>
      <h3 className="max-w-[16ch] font-display text-[clamp(1.9rem,3.8vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-ink">
        {chapter.title}
      </h3>
      <p className="mt-5 max-w-[42ch] text-mist">{chapter.body}</p>
      {chapter.cta && (
        <a href={chapter.cta.href} target="_blank" rel="noopener noreferrer" className="group mt-7 inline-flex w-fit items-center gap-1.5 text-ink">
          <span className="link-line">{chapter.cta.label}</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      )}
    </motion.div>
  )
}

function Waypoint({ wp, routeT }: { wp: (typeof WAYPOINTS)[number]; routeT: MotionValue<number> }) {
  const from = Math.min(Math.max(wp.t - 0.02, 0), 0.96)
  const opacity = useTransform(routeT, [from, from + 0.04], [0.2, 1])
  return (
    <motion.g style={{ opacity }}>
      <circle cx={wp.x} cy={wp.y} r="6" fill="#03070d" stroke="#eceff2" strokeWidth="1.5" />
    </motion.g>
  )
}

function Chart({ progress }: { progress: MotionValue<number> }) {
  const pathRef = useRef<SVGPathElement>(null)
  const boatRef = useRef<SVGGElement>(null)

  const routeT  = useTransform(progress, [0.04, 0.94], [0, 1], { clamp: true })
  const compass = useTransform(progress, [0, 1], [0, -160])

  useMotionValueEvent(routeT, 'change', (t) => {
    const path = pathRef.current
    if (!path || !boatRef.current) return
    const L = path.getTotalLength()
    const p = path.getPointAtLength(L * t)
    const q = path.getPointAtLength(Math.min(L, L * t + 2))
    const r = path.getPointAtLength(Math.max(0, L * t - 2))
    const angle = (Math.atan2(q.y - r.y, q.x - r.x) * 180) / Math.PI
    boatRef.current.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${angle + 90})`)
  })

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-[var(--line)] bg-abyss">
      <svg viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(236,239,242,0.06)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="1000" height="700" fill="url(#grid)" />

        {LAND.map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke="rgba(127,216,236,0.06)" strokeWidth="44" strokeLinejoin="round" />
            <path d={d} fill="#101c2c" stroke="rgba(236,239,242,0.3)" strokeWidth="1" />
          </g>
        ))}

        {[[200, 420, 18], [460, 620, 32], [640, 260, 27], [860, 420, 41], [330, 300, 12], [700, 610, 36], [560, 160, 22]].map(([x, y, d]) => (
          <text key={`${x}-${y}`} x={x} y={y} fill="rgba(140,151,165,0.55)" fontSize="13" fontStyle="italic">{d}</text>
        ))}

        <path d={ROUTE} fill="none" stroke="rgba(236,239,242,0.2)" strokeWidth="1.5" strokeDasharray="5 7" />
        <motion.path ref={pathRef} d={ROUTE} fill="none" stroke="#ff8a4c" strokeWidth="2" strokeLinecap="round" style={{ pathLength: routeT }} />

        {WAYPOINTS.map((w) => <Waypoint key={w.t} wp={w} routeT={routeT} />)}

        <g ref={boatRef} transform="translate(110 630)">
          <path d="M0 -13 L7 9 L0 5 L-7 9 Z" fill="#ff8a4c" />
        </g>
      </svg>

      <motion.svg viewBox="0 0 200 200" className="absolute right-5 top-5 h-20 w-20 md:h-24 md:w-24" style={{ rotate: compass }} aria-hidden>
        <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(236,239,242,0.25)" />
        {Array.from({ length: 36 }).map((_, i) => (
          <line key={i} x1="100" y1="10" x2="100" y2={i % 9 === 0 ? 24 : 16} stroke="rgba(236,239,242,0.4)" strokeWidth="1" transform={`rotate(${i * 10} 100 100)`} />
        ))}
        <path d="M100 34 L108 100 L100 166 L92 100 Z" fill="none" stroke="rgba(236,239,242,0.5)" />
        <path d="M100 34 L108 100 L92 100 Z" fill="#ff8a4c" />
        <text x="100" y="56" textAnchor="middle" fill="#eceff2" fontSize="14">N</text>
      </motion.svg>
    </div>
  )
}

export default function Skipper() {
  const ref = useRef<HTMLElement>(null)
  const progress = useScrollProgress({ target: ref, offset: ['start start', 'end end'] })

  return (
    <section id="skipper" ref={ref} className="relative h-[320vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pb-6 pt-20 md:pb-10 md:pt-24">
        <div className="container-wide flex min-h-0 flex-1 flex-col">
          <div className="grid grid-cols-1 border-t border-[var(--line)] pt-6 md:grid-cols-12">
            <p className="text-[14px] text-mist md:col-span-3">Sailing</p>
          </div>
          <div className="mt-6 grid min-h-0 flex-1 grid-rows-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-6 md:grid-cols-12 md:grid-rows-1">
            <div className="relative md:col-span-4 md:col-start-4 md:pr-6">
              {CHAPTERS.map((c, i) => (
                <Chapter key={i} i={i} progress={progress} chapter={c} />
              ))}
            </div>
            <div className="md:col-span-5">
              <Chart progress={progress} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
