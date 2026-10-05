'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { EASE_OUT, FadeUp, ScrollText, SectionHead, Tilt } from './fx/primitives'

const FACTS = [
  ['Based in', 'Liptovský Mikuláš, Slovakia'],
  ['Works', 'Remote, with clients anywhere'],
  ['Does', 'Design, front end, back end, iOS'],
  ['Also', 'Licensed skipper'],
]

export default function About() {
  return (
    <section id="about" className="py-24 md:py-36">
      <div className="container-wide">
        <SectionHead label="About">
          <ScrollText
            className="max-w-[24ch] font-display text-[clamp(1.75rem,3.4vw,3rem)] font-medium leading-[1.15] tracking-[-0.025em] text-ink"
            text="I'm Mathias, a software engineer and designer. I take projects from the first sketch to launch: the brand, the interface and the code behind it."
          />
        </SectionHead>

        <div className="mt-16 grid grid-cols-1 gap-12 md:mt-24 md:grid-cols-12 md:gap-6">
          <motion.div
            className="md:col-span-4 md:col-start-4"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.2, ease: EASE_OUT }}
          >
            <Tilt max={7}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-deep">
                <Image
                  src="/portrait.jpeg"
                  alt="Mathias Matejčík"
                  fill
                  sizes="(max-width: 768px) 90vw, 30vw"
                  className="object-cover object-top"
                />
              </div>
            </Tilt>
          </motion.div>

          <div className="flex flex-col justify-end md:col-span-5">
            <FadeUp>
              <p className="max-w-[44ch] text-mist">
                Recent work includes an e-shop with a custom admin for a furniture maker, a booking
                site for a mountain chalet and LogBook, an iOS app for sailors. I like small teams,
                clear goals and getting the details right.
              </p>
            </FadeUp>
            <dl className="mt-10 text-[15px]">
              {FACTS.map(([k, v], i) => (
                <FadeUp key={k} delay={i * 0.05} y={12}>
                  <div className="grid grid-cols-[110px_1fr] border-t border-[var(--line)] py-3">
                    <dt className="text-fog">{k}</dt>
                    <dd className="text-ink">{v}</dd>
                  </div>
                </FadeUp>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
