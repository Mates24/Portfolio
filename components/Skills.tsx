'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { SKILL_DOMAINS } from '@/lib/data'
import { EASE_OUT, RevealLines, SectionLabel } from './fx/primitives'

const ALL = SKILL_DOMAINS.flatMap((d) => d.skills.map(([name, color]) => ({ name, color })))

/* Fibonacci sphere of tags, rotated in JS and projected with 2D transforms (cheap + crisp text). */
function TagSphere() {
  const wrap  = useRef<HTMLDivElement>(null)
  const items = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const n = ALL.length
    const pts = ALL.map((_, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n)
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)
      return [Math.cos(theta) * Math.sin(phi), Math.sin(theta) * Math.sin(phi), Math.cos(phi)]
    })
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const idle = reduce ? 0.0006 : 0.0028
    const mouse = { x: 0, y: 0, inside: false }
    let rx = 0.3, ry = 0, vx = 0, vy = idle
    let visible = true
    let drag: { x: number; y: number } | null = null
    let raf = 0

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      if (drag) {
        vy = (e.clientX - drag.x) * 0.0009
        vx = -(e.clientY - drag.y) * 0.0009
        drag = { x: e.clientX, y: e.clientY }
        return
      }
      mouse.x = (e.clientX - r.left) / r.width - 0.5
      mouse.y = (e.clientY - r.top) / r.height - 0.5
      mouse.inside = true
    }
    const onLeave = () => { mouse.inside = false; drag = null }
    const onDown = (e: PointerEvent) => { drag = { x: e.clientX, y: e.clientY } }
    const onUp = () => { drag = null }

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(el)

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible) return
      if (!drag) {
        const tx = mouse.inside ? -mouse.y * 0.02 : 0
        const ty = mouse.inside ? mouse.x * 0.02 : idle
        vx += (tx - vx) * 0.04
        vy += (ty - vy) * 0.04
      }
      rx += vx
      ry += vy
      const R = el.offsetWidth * 0.4
      const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry)
      for (let i = 0; i < n; i++) {
        const node = items.current[i]
        if (!node) continue
        const [x0, y0, z0] = pts[i]
        // rotate Y then X
        const x1 = x0 * cy + z0 * sy
        const z1 = -x0 * sy + z0 * cy
        const y2 = y0 * cx - z1 * sx
        const z2 = y0 * sx + z1 * cx
        const depth = (z2 + 1) / 2 // 0 back … 1 front
        node.style.transform = `translate3d(${x1 * R}px, ${y2 * R}px, 0) translate(-50%, -50%) scale(${0.55 + depth * 0.65})`
        node.style.opacity = String(0.12 + depth * 0.88)
        node.style.zIndex = String(Math.round(depth * 100))
        node.style.filter = depth < 0.35 ? 'blur(1px)' : 'none'
      }
    }
    raf = requestAnimationFrame(tick)

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  return (
    <div ref={wrap} data-cursor className="relative mx-auto aspect-square w-full max-w-[560px] cursor-grab touch-pan-y select-none active:cursor-grabbing">
      {/* gyroscope rings */}
      <div className="pointer-events-none absolute inset-[14%]" style={{ perspective: 900 }}>
        <div className="gyro absolute inset-0">
          <div className="absolute inset-0 rounded-full border border-[rgba(94,231,255,0.18)]" />
          <div className="absolute inset-0 rounded-full border border-[rgba(94,231,255,0.12)]" style={{ transform: 'rotateY(60deg)' }} />
          <div className="absolute inset-0 rounded-full border border-[rgba(255,138,76,0.18)]" style={{ transform: 'rotateY(120deg)' }} />
          <div className="absolute inset-0 rounded-full border border-[rgba(94,231,255,0.1)]" style={{ transform: 'rotateX(90deg)' }} />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-[30%] rounded-full bg-[radial-gradient(circle,rgba(94,231,255,0.18),transparent_70%)] blur-2xl" />

      <div className="absolute left-1/2 top-1/2">
        {ALL.map((s, i) => (
          <span
            key={s.name}
            ref={(n) => { items.current[i] = n }}
            className="absolute left-0 top-0 whitespace-nowrap rounded-full border border-[var(--line-bright)] bg-[rgba(5,11,23,0.75)] px-3 py-1 font-mono text-[11px] text-ink backdrop-blur-sm md:text-[12.5px]"
          >
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="relative overflow-hidden py-20 md:py-32">
      <div className="pointer-events-none absolute right-0 top-1/2 h-[700px] w-[700px] -translate-y-1/2 translate-x-1/3 rounded-full bg-[radial-gradient(circle,rgba(43,183,224,0.08),transparent_65%)]" />

      <div className="container-wide relative">
        <SectionLabel index="03">Instruments</SectionLabel>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <RevealLines
              className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[0.92] tracking-[-0.045em] text-ink"
              lines={['The tools', <span key="t" className="font-serif font-normal italic text-sonar">on my bridge</span>]}
            />
            <p className="mt-6 max-w-[420px] text-mist">
              A stack chosen for speed, reliability and craft. Grab the sphere and spin it.
            </p>

            <div className="mt-12 space-y-8">
              {SKILL_DOMAINS.map((d, i) => (
                <motion.div
                  key={d.code}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.9, delay: i * 0.1, ease: EASE_OUT }}
                  className="border-t border-[var(--line)] pt-5"
                >
                  <div className="mb-3 flex items-baseline justify-between">
                    <h3 className="font-display text-lg font-semibold text-ink">{d.title}</h3>
                    <span className="font-mono text-[10px] tracking-[0.2em] text-fog">{d.code} · {String(d.skills.length).padStart(2, '0')}</span>
                  </div>
                  <p className="text-[14px] leading-[1.9] text-mist">
                    {d.skills.map(([name], j) => (
                      <span key={name}>
                        <span className="transition-colors hover:text-ink">{name}</span>
                        {j < d.skills.length - 1 && <span className="mx-2 text-fog">/</span>}
                      </span>
                    ))}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.6, ease: EASE_OUT }}
          >
            <TagSphere />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
