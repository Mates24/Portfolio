'use client'
import { FadeUp, SectionHead } from './fx/primitives'

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
    <section className="pb-24 md:pb-36">
      <div className="container-wide">
        <SectionHead label="What I do">
          <div>
            {SERVICES.map((s, i) => (
              <FadeUp key={s.title} delay={i * 0.06} y={16}>
                <div className={`group grid grid-cols-1 gap-3 py-7 md:grid-cols-9 md:gap-6 ${i > 0 ? 'border-t border-[var(--line)]' : 'pt-0'}`}>
                  <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-tight tracking-[-0.02em] text-ink transition-transform duration-500 ease-[var(--ease-out)] md:col-span-4 md:group-hover:translate-x-2">
                    {s.title}
                  </h3>
                  <div className="md:col-span-5">
                    <p className="text-mist">{s.desc}</p>
                    <p className="mt-2 text-[14px] text-fog">{s.stack}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </SectionHead>
      </div>
    </section>
  )
}
