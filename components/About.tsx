'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { EASE_OUT, FadeUp, ScrollText, SectionTitle, Tilt } from './fx/primitives'

const FACTS = [
  ['Based in', 'Liptovský Mikuláš, Slovakia'],
  ['Works', 'Remote, with clients anywhere'],
  ['Does', 'Design, front end, back end, iOS'],
  ['Also', 'Licensed skipper'],
]

export default function About() {
  return (
    <section id="about" className="py-24 md:py-36">
      <div className="container-wide grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-16">
        <motion.div
          className="relative lg:col-span-5"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.2, ease: EASE_OUT }}
        >
          {/* soft light behind the portrait */}
          <div className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(127,216,236,0.12),transparent)]" />
          <Tilt max={6}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[var(--line)] bg-deep">
              <Image
                src="/portrait.jpeg"
                alt="Mathias Matejčík"
                fill
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover object-top"
              />
            </div>
          </Tilt>
        </motion.div>

        <div className="lg:col-span-7">
          <SectionTitle lines={['Engineer and', 'designer.']} />

          <ScrollText
            className="mt-10 max-w-[38ch] text-[clamp(1.15rem,1.6vw,1.4rem)] leading-[1.5] text-ink"
            text="I take projects from the first sketch to launch: the brand, the interface and the code behind it. Recent work includes an e-shop with a custom admin for a furniture maker, a booking site for a mountain chalet and LogBook, an iOS app for sailors."
          />

          <dl className="mt-12 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
            {FACTS.map(([k, v], i) => (
              <FadeUp key={k} delay={i * 0.05} y={12} className="border-t border-[var(--line)] py-4">
                <dt className="text-[14px] text-fog">{k}</dt>
                <dd className="mt-1 text-ink">{v}</dd>
              </FadeUp>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
