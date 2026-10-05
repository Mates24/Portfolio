'use client'
import { FadeUp, SectionTitle } from './fx/primitives'

const SERVICES = [
  {
    title: 'Websites and e-shops',
    desc:  'Fast sites that rank well, product catalogues, booking systems and admin panels the client can run on their own.',
    stack: 'Next.js, PostgreSQL, custom CMS',
  },
  {
    title: 'iOS apps',
    desc:  'From the first idea and UX through subscriptions to release on the App Store.',
    stack: 'React Native, Expo, RevenueCat',
  },
  {
    title: 'Brand and packaging',
    desc:  'Logos, visual identities, labels and interfaces designed with a system behind them.',
    stack: 'Figma, Illustrator, Photoshop',
  },
]

export default function Services() {
  return (
    <section className="py-24 md:py-36">
      <div className="container-wide grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionTitle label="Services" lines={['What I can', 'do for you']} />
            <FadeUp delay={0.1}>
              <p className="mt-8 max-w-[36ch] text-mist">
                One person across design and engineering, so nothing gets lost between the mockup and the
                code.
              </p>
            </FadeUp>
          </div>
        </div>

        <div className="lg:col-span-7">
          {SERVICES.map((s, i) => (
            <FadeUp key={s.title} delay={i * 0.06} y={20}>
              <div className={`group relative border-t border-[var(--line)] py-9 ${i === SERVICES.length - 1 ? 'border-b' : ''}`}>
                {/* a thin glowing line that sweeps in on hover */}
                <span className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-sonar shadow-[0_0_12px_rgba(127,216,236,0.8)] transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-x-100" />
                <h3 className="font-display text-[clamp(1.6rem,2.8vw,2.4rem)] font-semibold leading-tight tracking-[-0.025em] text-ink">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-[48ch] text-mist">{s.desc}</p>
                <p className="mt-3 text-[14px] text-fog">{s.stack}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
