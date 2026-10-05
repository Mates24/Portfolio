'use client'
import { useEffect, useRef } from 'react'

// Two-part cursor: a precise dot and a lagging ring that grows over interactive elements.
export default function Cursor() {
  const dot  = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const pos    = { x: -100, y: -100 }
    const lagged = { x: -100, y: -100 }
    let hovering = false
    let raf = 0

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
      const target = e.target as HTMLElement | null
      hovering = !!target?.closest('a, button, [data-cursor], input, textarea')
    }

    const tick = () => {
      lagged.x += (pos.x - lagged.x) * 0.18
      lagged.y += (pos.y - lagged.y) * 0.18
      if (dot.current)  dot.current.style.transform  = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`
      if (ring.current) {
        ring.current.style.transform = `translate3d(${lagged.x}px, ${lagged.y}px, 0) translate(-50%, -50%) scale(${hovering ? 1.9 : 1})`
        ring.current.style.borderColor = hovering ? 'rgba(255,138,76,0.8)' : 'rgba(94,231,255,0.5)'
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="cursor-ui pointer-events-none fixed left-0 top-0 z-[100] hidden h-8 w-8 rounded-full border md:block"
        style={{ transition: 'transform 0.25s var(--ease-out), border-color 0.25s', transform: 'translate3d(-100px,-100px,0)' }}
      />
      <div
        ref={dot}
        aria-hidden
        className="cursor-ui pointer-events-none fixed left-0 top-0 z-[100] hidden h-1.5 w-1.5 rounded-full bg-sonar shadow-[0_0_12px_rgba(94,231,255,0.9)] md:block"
        style={{ transform: 'translate3d(-100px,-100px,0)' }}
      />
    </>
  )
}
