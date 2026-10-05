'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { SKILL_DOMAINS } from '@/lib/data'
import { EASE_OUT, FadeUp, SectionTitle } from './fx/primitives'

const ALL = SKILL_DOMAINS.flatMap((d) => d.skills.map(([name]) => ({ name })))

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
      const R = el.offsetWidth * 0.38
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
    <div ref={wrap} className="relative mx-auto aspect-square w-full max-w-[540px] cursor-grab touch-pan-y select-none active:cursor-grabbing">
      <div className="absolute left-1/2 top-1/2">
        {ALL.map((s, i) => (
          <span
            key={s.name}
            ref={(n) => { items.current[i] = n }}
            className="absolute left-0 top-0 whitespace-nowrap rounded-full border border-[var(--line)] bg-void px-3 py-1 text-[13px] text-ink md:text-[14px]"
          >
            {s.name}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="py-24 md:py-36">
      <div className="container-wide grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <SectionTitle label="Tools" lines={['The stack', 'I work with']} />
          <div className="mt-12">
            {SKILL_DOMAINS.map((d, i) => (
              <FadeUp key={d.code} delay={i * 0.08} y={16} className="border-t border-[var(--line)] py-5">
                <h3 className="mb-1.5 text-ink">{d.title}</h3>
                <p className="leading-relaxed text-mist">{d.skills.map(([name]) => name).join(', ')}</p>
              </FadeUp>
            ))}
          </div>
        </div>

        <motion.div
          className="relative lg:col-span-6"
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.4, ease: EASE_OUT }}
        >
          <div className="pointer-events-none absolute inset-[22%] rounded-full bg-[radial-gradient(closest-side,rgba(127,216,236,0.14),transparent)]" />
          <TagSphere />
          <p className="mt-2 text-center text-[14px] text-fog">Drag to spin</p>
        </motion.div>
      </div>
    </section>
  )
}
