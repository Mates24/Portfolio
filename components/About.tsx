'use client'
import { FadeUp, ScrollText, SectionTitle } from './fx/primitives'

const FACTS = [
  ['Based in', 'Liptovský Mikuláš, Slovakia'],
  ['Works', 'Remote, with clients anywhere'],
  ['Does', 'Design, front end, back end, mobile apps'],
  ['Also', 'Licensed skipper'],
]

export default function About() {
  return (
    <section id="about" className="py-24 md:py-36">
      <div className="container-wide grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionTitle lines={['Engineer and', 'designer.']} className="lg:sticky lg:top-28" />
        </div>

        <div className="lg:col-span-7">
          <ScrollText
            className="max-w-[34ch] text-[clamp(1.35rem,2.1vw,1.85rem)] font-medium leading-[1.4] tracking-[-0.01em] text-ink"
            text="I take projects from the first sketch to launch: the brand, the interface and the code behind it. Recent work includes an e-shop with a custom admin for a furniture maker, a booking site for a mountain chalet and LogBook, an app for sailors."
          />

          <dl className="mt-14 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
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
