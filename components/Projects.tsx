'use client'
import { useRef } from 'react'
import Image from 'next/image'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import { PROJECTS, type Project } from '@/lib/data'
import { ArrowUpRight, SectionHead, useScrollProgress } from './fx/primitives'

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
  // Entry: the card swings up from a tilted plane
  const enter    = useScrollProgress({ target: ref, offset: ['start end', 'start start'] })
  const rotateX  = useTransform(enter, [0, 1], [22, 0])
  const imgScale = useTransform(enter, [0, 1], [1.25, 1])

  // Stack: card i pins at progress i/(total-1); the next card covers it one step later.
  const step        = 1 / (total - 1)
  const start       = Math.min(index * step, 1)
  const isLast      = index === total - 1
  const targetScale = 1 - (total - index - 1) * 0.04
  const scale       = useTransform(progress, isLast ? [0, 1] : [start, 1], [1, targetScale])
  const dim         = useTransform(progress, isLast ? [0, 1] : [start + step * 0.3, Math.min(start + step, 1)], [0, isLast ? 0 : 0.6])

  const isContain = project.imageFit === 'contain'

  return (
    <div ref={ref} className="sticky top-0 flex h-[100svh] items-center justify-center">
      <motion.a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ scale, rotateX, top: `calc(${index * 14}px - 2vh)`, transformPerspective: 1400, transformOrigin: '50% 0%' }}
        className="group relative grid h-[min(80svh,660px)] w-full grid-rows-[45%_1fr] overflow-hidden rounded-lg border border-[var(--line)] bg-abyss md:grid-cols-[1fr_1.3fr] md:grid-rows-1"
      >
        <div className="order-2 flex flex-col justify-between p-6 md:order-1 md:p-10">
          <p className="text-[14px] text-fog">{project.category}</p>

          <div>
            <h3 className="font-display text-[clamp(2rem,4.2vw,3.75rem)] font-semibold leading-[1] tracking-[-0.035em] text-ink">
              {project.title}
            </h3>
            <p className="mt-4 line-clamp-3 max-w-[46ch] text-[15px] text-mist md:line-clamp-none">{project.desc}</p>
            <p className="mt-4 hidden max-w-[46ch] text-[14px] text-fog md:block">{project.tags.join(', ')}</p>
          </div>

          <span className="inline-flex items-center gap-1.5 text-[15px] text-ink">
            <span className="link-line">{project.cta}</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>

        <div className="relative order-1 overflow-hidden md:order-2" style={{ background: project.imageBg ?? '#0b1422' }}>
          <motion.div className="absolute inset-0" style={{ scale: imgScale }}>
            <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.04]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className={isContain ? 'object-contain p-[12%] md:p-[16%]' : 'object-cover'}
              />
            </div>
          </motion.div>
          {project.logo && (
            <>
              <div className="absolute inset-0 bg-[rgba(20,10,4,0.45)]" />
              <div className="absolute inset-0 flex items-center justify-center p-[18%]">
                <Image src={project.logo} alt="" width={640} height={192} className="h-auto w-full max-w-[340px]" />
              </div>
            </>
          )}
        </div>

        <motion.div className="pointer-events-none absolute inset-0 z-20 bg-void" style={{ opacity: dim }} />
      </motion.a>
    </div>
  )
}

export default function Projects() {
  const stack = useRef<HTMLDivElement>(null)
  const progress = useScrollProgress({ target: stack, offset: ['start start', 'end end'] })

  return (
    <section id="work" className="pt-12 md:pt-16">
      <div className="container-wide">
        <SectionHead label="Selected work">
          <p className="max-w-[40ch] text-mist">
            Apps, online shops, websites and brands I have designed and built for clients and for myself.
          </p>
        </SectionHead>

        <div ref={stack} className="relative">
          {PROJECTS.map((p, i) => (
            <Card key={p.slug} project={p} index={i} total={PROJECTS.length} progress={progress} />
          ))}
        </div>
      </div>
    </section>
  )
}
