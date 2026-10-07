'use client'
import { useRef } from 'react'
import { motion, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion'
import { ArrowUpRight, useScrollProgress } from './fx/primitives'

/* Chart is drawn on a 1000×1000 square. Everything that matters stays inside
   x/y 150–850 so it survives cropping at any panel aspect ratio. */
const ROUTE = 'M 330 735 C 400 700 460 660 500 600 S 600 520 690 480 S 760 420 780 360 S 765 300 708 302'

const MAINLAND = 'M -60 1060 L -60 380 C 40 400 90 470 120 560 C 150 650 230 700 285 745 C 330 785 360 860 470 900 C 560 925 640 985 700 1060 Z'
const LAND = [
  MAINLAND,
  'M 1060 -60 L 760 -60 C 780 40 840 90 900 120 C 960 150 1000 220 1060 240 Z',
  'M 420 330 C 470 260 590 240 650 290 C 700 330 690 400 630 430 C 580 455 540 420 500 440 C 450 465 380 410 420 330 Z',
  'M 760 520 C 800 480 880 490 900 540 C 920 600 870 650 820 640 C 770 630 730 570 760 520 Z',
  'M 560 600 C 580 585 610 590 612 612 C 614 634 585 642 568 632 C 552 622 548 610 560 600 Z',
]

// Depth bands around every shore, outermost first: [stroke width, fill colour]
const DEPTH_BANDS: [number, string][] = [
  [150, '#0a1524'],
  [90,  '#0d1b2d'],
  [44,  '#112338'],
]

/* Channel gates: a red and a green buoy facing each other across the fairway,
   26 units either side of ROUTE at t = 0.45 and t = 0.70. Leaving the marina we
   sail against the direction of buoyage (IALA A), so red is to starboard. */
const GATES: { red: [number, number]; green: [number, number] }[] = [
  { red: [594, 552], green: [570, 506] },
  { red: [763, 467], green: [728, 428] },
]

const SOUNDINGS: [number, number, number][] = [
  [560, 180, 38], [700, 200, 29], [200, 470, 18], [320, 600, 21],
  [420, 540, 26], [540, 520, 31], [620, 680, 24], [720, 760, 19], [840, 760, 27], [900, 400, 33],
  [760, 300, 22], [470, 760, 15], [600, 840, 12], [860, 860, 23],
]

const WAYPOINTS = [
  { t: 0,    x: 330, y: 735 },
  { t: 0.56, x: 690, y: 480 },
  { t: 1,    x: 708, y: 302 },
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
      <p className="mb-4 text-[14px] text-fog">{i + 1} / {CHAPTERS.length}</p>
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
  const from = Math.min(Math.max(wp.t - 0.03, 0), 0.94)
  const opacity = useTransform(routeT, [from, from + 0.06], [0.35, 1])
  return (
    <motion.g style={{ opacity }}>
      <circle cx={wp.x} cy={wp.y} r="6" fill="#03070d" stroke="#eceff2" strokeWidth="1.5" />
    </motion.g>
  )
}

/* Classic chart compass rose: static, true north up. */
function CompassRose({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity="0.55">
      <circle r={r} fill="none" stroke="rgba(236,239,242,0.35)" />
      <circle r={r - 12} fill="none" stroke="rgba(236,239,242,0.2)" />
      {Array.from({ length: 72 }).map((_, i) => (
        <line key={i} x1="0" y1={-r} x2="0" y2={-r + (i % 9 === 0 ? 12 : i % 3 === 0 ? 8 : 4)} stroke="rgba(236,239,242,0.5)" strokeWidth="1" transform={`rotate(${i * 5})`} />
      ))}
      {[0, 90, 180, 270].map((deg) => (
        <g key={deg} transform={`rotate(${deg})`}>
          <path d={`M0 ${-r + 16} L9 0 L0 0 Z`} fill="rgba(236,239,242,0.55)" />
          <path d={`M0 ${-r + 16} L-9 0 L0 0 Z`} fill="rgba(236,239,242,0.15)" />
        </g>
      ))}
      {[45, 135, 225, 315].map((deg) => (
        <path key={deg} d={`M0 ${-r * 0.55} L5 0 L-5 0 Z`} fill="rgba(236,239,242,0.3)" transform={`rotate(${deg})`} />
      ))}
      <text y={-r - 8} textAnchor="middle" fill="#ff8a4c" fontSize="16" fontWeight="600">N</text>
    </g>
  )
}

function Chart({ progress }: { progress: MotionValue<number> }) {
  const pathRef = useRef<SVGPathElement>(null)
  const boatRef = useRef<SVGGElement>(null)

  const routeT = useTransform(progress, [0.04, 0.94], [0, 1], { clamp: true })

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
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-[var(--line)] bg-[#081221]">
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="land-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(236,239,242,0.05)" strokeWidth="2" />
          </pattern>
          <radialGradient id="light-sector">
            <stop offset="0%" stopColor="#ffd08a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffd08a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* graticule */}
        {Array.from({ length: 9 }).map((_, i) => (
          <g key={i} stroke="rgba(236,239,242,0.05)">
            <line x1={(i + 1) * 100} y1="0" x2={(i + 1) * 100} y2="1000" />
            <line x1="0" y1={(i + 1) * 100} x2="1000" y2={(i + 1) * 100} />
          </g>
        ))}

        {/* depth bands: each band is outlined by a thin contour, shallower water gets lighter */}
        {DEPTH_BANDS.map(([w, fill]) => (
          <g key={w} strokeLinejoin="round" fill="none">
            {LAND.map((d, i) => <path key={`c${i}`} d={d} stroke="rgba(127,216,236,0.16)" strokeWidth={w + 2} />)}
            {LAND.map((d, i) => <path key={`f${i}`} d={d} stroke={fill} strokeWidth={w} />)}
          </g>
        ))}

        {/* land */}
        {LAND.map((d, i) => (
          <g key={i}>
            <path d={d} fill="#152131" />
            <path d={d} fill="url(#land-hatch)" />
            <path d={d} fill="none" stroke="rgba(236,239,242,0.45)" strokeWidth="1.2" />
          </g>
        ))}

        {/* soundings (depth in metres) */}
        {SOUNDINGS.map(([x, y, d]) => (
          <text key={`${x}-${y}`} x={x} y={y} fill="rgba(140,151,165,0.6)" fontSize="13" fontStyle="italic" textAnchor="middle">{d}</text>
        ))}


        {/* lighthouse on the island with a slowly flashing light sector */}
        <g transform="translate(792 494)">
          <path d="M0 0 L-110 -70 A130 130 0 0 1 -60 -115 Z" fill="url(#light-sector)">
            <animate attributeName="opacity" values="0.15;1;0.15;0.15" keyTimes="0;0.08;0.25;1" dur="4s" repeatCount="indefinite" />
          </path>
          <path d="M0 -7 L2 -2 L7 -2 L3 1.5 L4.5 7 L0 3.8 L-4.5 7 L-3 1.5 L-7 -2 L-2 -2 Z" fill="#ffd08a" style={{ filter: 'drop-shadow(0 0 4px rgba(255,208,138,0.9))' }} />
          <text x="10" y="18" fill="rgba(236,239,242,0.7)" fontSize="12" fontStyle="italic">Fl 4s</text>
        </g>

        {/* channel buoy gates */}
        {GATES.map(({ red, green }, i) => (
          <g key={i}>
            <rect x={red[0] - 5} y={red[1] - 5} width="10" height="10" fill="#e5484d" />
            <path d={`M${green[0]} ${green[1] - 7} L${green[0] + 7} ${green[1] + 5} L${green[0] - 7} ${green[1] + 5} Z`} fill="#30a46c" />
          </g>
        ))}

        {/* planned track + sailed track */}
        <path d={ROUTE} fill="none" stroke="rgba(236,239,242,0.28)" strokeWidth="1.5" strokeDasharray="6 7" />
        <motion.path
          ref={pathRef}
          d={ROUTE}
          fill="none"
          stroke="#ff8a4c"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ pathLength: routeT, filter: 'drop-shadow(0 0 6px rgba(255,138,76,0.7))' }}
        />

        {WAYPOINTS.map((w) => <Waypoint key={w.t} wp={w} routeT={routeT} />)}

        <g ref={boatRef} transform="translate(330 735)">
          <circle r="16" fill="rgba(255,138,76,0.18)" />
          <path d="M0 -13 L7 9 L0 5 L-7 9 Z" fill="#ff8a4c" style={{ filter: 'drop-shadow(0 0 5px rgba(255,138,76,0.9))' }} />
        </g>
      </svg>

      {/* Compass rose sits outside the cropped chart so its distance from the top and
          left edges is identical on every panel size. viewBox is the rose's exact bounds. */}
      <svg viewBox="-97 -119 194 216" className="pointer-events-none absolute left-8 top-8 h-auto w-[clamp(92px,20%,150px)]" aria-hidden>
        <CompassRose x={0} y={0} r={95} />
      </svg>

      {/* graduated chart border */}
      <div
        className="pointer-events-none absolute inset-2.5 rounded-[10px] border border-[rgba(236,239,242,0.18)]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(236,239,242,0.35) 0 24px, transparent 24px 48px), repeating-linear-gradient(90deg, rgba(236,239,242,0.35) 0 24px, transparent 24px 48px), repeating-linear-gradient(0deg, rgba(236,239,242,0.35) 0 24px, transparent 24px 48px), repeating-linear-gradient(0deg, rgba(236,239,242,0.35) 0 24px, transparent 24px 48px)',
          backgroundSize: '100% 3px, 100% 3px, 3px 100%, 3px 100%',
          backgroundPosition: 'top, bottom, left, right',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* scale bar */}
      <div className="absolute bottom-6 right-6 flex items-end gap-2 text-[11px] text-mist">
        <div className="flex h-1.5 w-24 overflow-hidden border border-[rgba(236,239,242,0.5)]">
          <span className="w-1/2 bg-[rgba(236,239,242,0.6)]" />
        </div>
        <span>1 nm</span>
      </div>
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
          <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-6 lg:grid-cols-12 lg:grid-rows-1 lg:gap-16">
            <div className="relative lg:col-span-5">
              {CHAPTERS.map((c, i) => (
                <Chapter key={i} i={i} progress={progress} chapter={c} />
              ))}
            </div>
            <div className="lg:col-span-7">
              <Chart progress={progress} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
