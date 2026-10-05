'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Counter, EASE_OUT, FadeUp, ScrollText, SectionLabel, Tilt } from './fx/primitives'

const STATS = [
  { value: 6,   pad: 2, suffix: '',  label: 'Projects shipped',        sub: 'Web, app & brand' },
  { value: 1,   pad: 2, suffix: '',  label: 'App on the App Store',    sub: 'LogBook, for skippers' },
  { value: 576, pad: 3, suffix: 'm', label: 'Above sea level',         sub: 'And still a skipper' },
]

export default function About() {
  return (
    <section id="about" className="relative py-20 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(43,183,224,0.08),transparent_65%)]" />

      <div className="container-wide relative">
        <SectionLabel index="01">About</SectionLabel>

        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
          <div>
            <ScrollText
              className="font-display text-[clamp(1.75rem,3.6vw,3.25rem)] font-semibold leading-[1.12] tracking-[-0.025em] text-ink"
              text="Hi, I'm Mathias. I work where *engineering meets *design, writing code as considered as the interfaces it produces. From a booking system for a mountain chalet to a full e-commerce platform and an iOS app for sailors, I sweat the details most people never notice. That's *exactly the point."
            />

            <FadeUp delay={0.1} className="mt-10 flex flex-wrap gap-2">
              {['Full-stack', 'iOS · React Native', 'UI / UX', 'Brand & packaging', 'Custom CMS', 'Open to remote'].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-[var(--line-bright)] bg-[rgba(94,231,255,0.04)] px-3.5 py-1.5 font-mono text-[11px] tracking-[0.04em] text-mist transition-colors hover:border-sonar hover:text-ink"
                >
                  {chip}
                </span>
              ))}
            </FadeUp>
          </div>

          {/* Portrait — 3D tilt card with HUD frame */}
          <motion.div
            className="relative mx-auto w-full max-w-[400px] lg:mx-0 lg:ml-auto"
            initial={{ opacity: 0, rotateY: -25, rotateX: 8, y: 60 }}
            whileInView={{ opacity: 1, rotateY: 0, rotateX: 0, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.4, ease: EASE_OUT }}
            style={{ transformPerspective: 1200 }}
          >
            <Tilt max={12} className="relative rounded-[28px]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-[var(--line-bright)] bg-deep">
                <Image
                  src="/portrait.jpeg"
                  alt="Mathias Matejčík"
                  fill
                  sizes="(max-width: 1024px) 90vw, 400px"
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(2,5,11,0.85)] via-transparent to-transparent" />
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(94,231,255,0.04)_50%)] bg-[length:100%_4px] mix-blend-overlay" />
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-mist">
                  <div>
                    <p className="text-fog">Subject</p>
                    <p className="text-ink">M. Matejčík</p>
                  </div>
                  <div className="text-right">
                    <p className="text-fog">Role</p>
                    <p className="text-ink">Eng · Design · Skipper</p>
                  </div>
                </div>
              </div>

              {/* Corner brackets */}
              {['-left-2 -top-2', '-right-2 -top-2 rotate-90', '-bottom-2 -right-2 rotate-180', '-bottom-2 -left-2 -rotate-90'].map((pos) => (
                <span key={pos} className={`absolute h-6 w-6 border-l-[1.5px] border-t-[1.5px] border-sonar ${pos}`} style={{ transform: 'translateZ(30px)' }} />
              ))}

              {/* Floating badge pops out in 3D */}
              <div
                className="absolute -left-4 top-8 rounded-2xl border border-[rgba(255,138,76,0.35)] bg-[rgba(5,11,23,0.85)] px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl md:-left-10"
                style={{ transform: 'translateZ(70px)' }}
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-fog">Licensed</p>
                <p className="flex items-center gap-2 font-display text-sm font-semibold text-ink">
                  <svg className="h-4 w-4 text-flare" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <circle cx="12" cy="5" r="2.2" /><path d="M12 7.2V21M5 12H3a9 9 0 0 0 18 0h-2M8 10h8" />
                  </svg>
                  Skipper
                </p>
              </div>
            </Tilt>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--line)] sm:grid-cols-3 md:mt-28">
          {STATS.map((s, i) => (
            <FadeUp key={s.label} delay={i * 0.1} y={24} className="bg-abyss p-7 md:p-9">
              <p className="font-display text-[clamp(2.75rem,5vw,4.25rem)] font-bold leading-none tracking-[-0.04em] text-ink">
                <Counter to={s.value} pad={s.pad} suffix={s.suffix} />
              </p>
              <p className="mt-4 text-sm font-medium text-ink">{s.label}</p>
              <p className="font-mono text-[11px] tracking-[0.04em] text-fog">{s.sub}</p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
