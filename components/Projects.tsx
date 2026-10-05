'use client'
import { useRef } from 'react'
import Image from 'next/image'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import { PROJECTS, type Project } from '@/lib/data'
import { ArrowUpRight, RevealLines, SectionLabel, useScrollProgress } from './fx/primitives'

function Card({
  project,
  index,
  total,
  progress,
}: {
  project: Project
  index: number
  total: number
  progress: MotionValue<number>
}) {
  const ref = useRef<HTMLDivElement>(null)
  // Entry: card swings up from a tilted plane
  const enter = useScrollProgress({ target: ref, offset: ['start end', 'start start'] })
  const rotateX  = useTransform(enter, [0, 1], [28, 0])
  const imgScale = useTransform(enter, [0, 1], [1.35, 1])
  const imgY     = useTransform(enter, [0, 1], ['-8%', '0%'])

  // Stack: earlier cards shrink and dim as later ones slide over them
  // Card i pins at progress i/(total-1); the next card fully covers it one step later.
  const step        = 1 / (total - 1)
  const start       = Math.min(index * step, 1)
  const isLast      = index === total - 1
  const targetScale = 1 - (total - index - 1) * 0.045
  const scale       = useTransform(progress, isLast ? [0, 1] : [start, 1], [1, targetScale])
  const dim         = useTransform(progress, isLast ? [0, 1] : [start + step * 0.3, Math.min(start + step, 1)], [0, isLast ? 0 : 0.6])

  const isContain = project.imageFit === 'contain'

  return (
    <div ref={ref} className="sticky top-0 flex h-[100svh] items-center justify-center">
      <motion.a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor
        style={{
          scale,
          rotateX,
          top: `calc(${index * 18}px - 2vh)`,
          transformPerspective: 1400,
          transformOrigin: '50% 0%',
          ['--accent' as string]: project.accent,
        }}
        className="spotlight group relative grid h-[min(80svh,680px)] w-full grid-rows-[42%_1fr] overflow-hidden rounded-[28px] border border-[var(--line-bright)] bg-abyss shadow-[0_-20px_80px_rgba(0,0,0,0.6)] md:grid-cols-[1fr_1.25fr] md:grid-rows-1 md:rounded-[34px]"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
          e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
        }}
      >
        {/* accent glow */}
        <div
          className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, rgba(${project.accent},0.22), transparent 70%)` }}
        />

        {/* Text side */}
        <div className="relative z-10 order-2 flex flex-col justify-between p-6 md:order-1 md:p-10 lg:p-12">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-fog md:text-[11px]">
            <span>
              <span style={{ color: `rgb(${project.accent})` }}>{String(index + 1).padStart(2, '0')}</span> / {String(total).padStart(2, '0')}
            </span>
            <span className="hidden sm:inline">{project.category}</span>
          </div>

          <div>
            <h3 className="font-display text-[clamp(2rem,4.5vw,4rem)] font-bold leading-[0.95] tracking-[-0.04em] text-ink">
              {project.title}
            </h3>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-mist sm:hidden">{project.category}</p>
            <p className="mt-4 line-clamp-3 max-w-[460px] text-[14px] leading-relaxed text-mist md:mt-5 md:line-clamp-none md:text-[15px]">
              {project.desc}
            </p>
          </div>

          <div>
            <div className="hidden flex-wrap gap-1.5 md:flex">
              {project.tags.map((t) => (
                <span key={t} className="rounded-md border border-[var(--line)] bg-[rgba(140,200,255,0.03)] px-2.5 py-1 font-mono text-[10.5px] text-mist">
                  {t}
                </span>
              ))}
            </div>
            <span
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold md:mt-6"
              style={{ color: `rgb(${project.accent})` }}
            >
              {project.cta}
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-current transition-transform duration-500 ease-[var(--ease-out)] group-hover:rotate-45">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </span>
          </div>
        </div>

        {/* Image side */}
        <div
          className="relative order-1 m-2 overflow-hidden rounded-[22px] md:order-2 md:m-3 md:rounded-[26px]"
          style={{ background: project.imageBg ?? '#081325' }}
        >
          <motion.div className="absolute inset-0" style={{ scale: imgScale, y: imgY }}>
            <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.06]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className={isContain ? 'object-contain p-[10%] md:p-[14%]' : 'object-cover'}
              />
            </div>
          </motion.div>
          {project.logo && (
            <>
              <div className="absolute inset-0 bg-[rgba(20,10,4,0.45)]" />
              <div className="absolute inset-0 flex items-center justify-center p-[18%]">
                <Image src={project.logo} alt="" width={640} height={192} className="h-auto w-full max-w-[360px] drop-shadow-[0_6px_30px_rgba(0,0,0,0.5)]" />
              </div>
            </>
          )}
          {!isContain && !project.logo && <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(2,5,11,0.45)] to-transparent" />}
        </div>

        {/* Dim layer when buried in the stack */}
        <motion.div className="pointer-events-none absolute inset-0 z-20 bg-void" style={{ opacity: dim }} />
      </motion.a>
    </div>
  )
}

export default function Projects() {
  const stack = useRef<HTMLDivElement>(null)
  const scrollYProgress = useScrollProgress({ target: stack, offset: ['start start', 'end end'] })

  return (
    <section id="work" className="relative pt-20 md:pt-32">
      <div className="container-wide">
        <SectionLabel index="02">Selected work</SectionLabel>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <RevealLines
            className="font-display text-[clamp(2.5rem,7vw,6.5rem)] font-bold leading-[0.9] tracking-[-0.045em] text-ink"
            lines={['Work that', <span key="s" className="font-serif font-normal italic text-sonar">speaks for itself</span>]}
          />
          <p className="max-w-[300px] font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-fog">
            {PROJECTS.length} projects. Apps, platforms, websites &amp; brands. Scroll to flip through the stack.
          </p>
        </div>

        <div ref={stack} className="relative mt-4 md:mt-8">
          {PROJECTS.map((p, i) => (
            <Card key={p.slug} project={p} index={i} total={PROJECTS.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  )
}
