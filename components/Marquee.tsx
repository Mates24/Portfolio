'use client'
import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'

const wrap = (min: number, max: number, v: number) => {
  const r = max - min
  return ((((v - min) % r) + r) % r) + min
}

// Ribbon that drifts on its own and accelerates/reverses with scroll velocity.
function Ribbon({ items, baseVelocity, className }: { items: string[]; baseVelocity: number; className: string }) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 })
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false })
  const skew = useTransform(smooth, [-2000, 2000], [8, -8])
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)
  const dir = useRef(1)

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000)
    if (factor.get() < 0) dir.current = -1
    else if (factor.get() > 0) dir.current = 1
    move += dir.current * move * factor.get()
    baseX.set(baseX.get() + move)
  })

  const row = [...items, ...items]
  return (
    <div className={`flex overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div className="flex shrink-0" style={{ x, skewX: skew }}>
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {row.map((item, i) => (
              <span key={`${k}-${i}`} className="flex items-center">
                <span className="px-6 md:px-10">{item}</span>
                <svg className="h-4 w-4 shrink-0 text-flare md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path d="M10 0l2.2 7.8L20 10l-7.8 2.2L10 20l-2.2-7.8L0 10l7.8-2.2z" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function Marquee() {
  return (
    <section aria-hidden className="relative z-10 -mt-6 overflow-hidden py-16 md:py-24">
      <div className="-rotate-[2.5deg] border-y border-[var(--line-bright)] bg-ink py-4 md:py-5">
        <Ribbon
          baseVelocity={-2.2}
          className="font-display text-[clamp(1.6rem,4vw,3.4rem)] font-extrabold uppercase tracking-[-0.02em] text-void"
          items={['Web development', 'iOS apps', 'Brand identity', 'E-commerce', 'UI / UX', 'Custom CMS']}
        />
      </div>
      <div className="mt-[-1.6rem] rotate-[1.5deg] border-y border-[var(--line)] bg-[rgba(8,19,37,0.85)] py-3 backdrop-blur-md md:mt-[-2.2rem]">
        <Ribbon
          baseVelocity={1.6}
          className="font-serif text-[clamp(1.3rem,3vw,2.4rem)] italic text-mist"
          items={['Precise', 'Intentional', 'Seaworthy', 'Fast', 'Hard to forget', 'Built to last']}
        />
      </div>
    </section>
  )
}
