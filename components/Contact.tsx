'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EMAIL, SOCIALS } from '@/lib/data'
import { ArrowUpRight, EASE_OUT, FadeUp, SectionTitle } from './fx/primitives'

type FormState = 'idle' | 'loading' | 'success' | 'error'

// [phrase shown in the sentence, subject used in the email]
const TOPICS: [string, string][] = [
  ['a website', 'Website'],
  ['an e-shop', 'E-shop'],
  ['a mobile app', 'Mobile app'],
  ['a brand', 'Brand & design'],
  ['something else', 'Project'],
]

/* An underlined blank inside the sentence that grows with what is typed. */
function Blank({
  value,
  onChange,
  placeholder,
  type = 'text',
  name,
  autoComplete,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  type?: string
  name: string
  autoComplete: string
}) {
  return (
    <input
      type={type}
      name={name}
      required
      value={value}
      autoComplete={autoComplete}
      placeholder={placeholder}
      aria-label={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: `${Math.max(value.length, placeholder.length) + 1}ch` }}
      className="mx-1 max-w-full border-0 border-b-2 border-dashed border-[var(--line-bright)] bg-transparent px-1 pb-0.5 text-ink outline-none transition-colors duration-300 placeholder:text-fog focus:border-solid focus:border-sonar"
    />
  )
}

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState(0)
  const [message, setMessage] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [sentTo, setSentTo] = useState({ name: '', email: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('loading')
    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, message, subject: `${TOPICS[topic][1]} inquiry from ${name}` }),
      })
      if (!res.ok) throw new Error('Failed')
      setSentTo({ name, email })
      setState('success')
      setName(''); setEmail(''); setMessage(''); setTopic(0)
    } catch {
      setState('error')
    }
  }

  return (
    <section id="contact" className="py-24 md:py-36">
      <div className="container-wide">
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-16">
          <SectionTitle lines={['Have a project', 'in mind?']} className="lg:col-span-7" />
          <FadeUp delay={0.1} className="lg:col-span-5">
            <a href={`mailto:${EMAIL}`} className="group inline-flex items-center gap-2 text-[clamp(1.05rem,1.6vw,1.3rem)] text-ink">
              <span className="link-line">{EMAIL}</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-mist">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="link-line transition-colors hover:text-ink">
                  {s.label}
                </a>
              ))}
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={0.15} className="mt-14 md:mt-20">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-abyss px-6 py-9 md:px-14 md:py-14">
            <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-sonar to-transparent opacity-50" />

            <AnimatePresence mode="wait">
              {state === 'success' ? (
                <motion.div
                  key="ok"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE_OUT }}
                  className="font-display text-[clamp(1.5rem,2.8vw,2.4rem)] font-medium leading-[1.45] tracking-[-0.02em] text-mist"
                >
                  <p>
                    Thanks, <span className="text-ink">{sentTo.name}</span>. Your message is on its way and
                    I&apos;ll reply to <span className="text-ink">{sentTo.email}</span> soon.
                  </p>
                  <button onClick={() => setState('idle')} className="link-line mt-8 font-body text-[15px] font-normal tracking-normal text-mist hover:text-ink">
                    Write another message
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} exit={{ opacity: 0 }} className="relative">
                  <p className="font-display text-[clamp(1.5rem,2.8vw,2.4rem)] font-medium leading-[1.7] tracking-[-0.02em] text-mist">
                    Hi Mathias, I&apos;m
                    <Blank name="name" autoComplete="name" placeholder="your name" value={name} onChange={setName} />
                    and I&apos;m looking for{' '}
                    {TOPICS.map(([phrase], i) => (
                      <span key={phrase}>
                        <button
                          type="button"
                          aria-pressed={topic === i}
                          onClick={() => setTopic(i)}
                          className={`relative rounded-md px-1 transition-colors duration-300 ${
                            topic === i ? 'text-ink' : 'text-fog hover:text-mist'
                          }`}
                        >
                          {phrase}
                          {topic === i && (
                            <motion.span
                              layoutId="topic-underline"
                              className="absolute inset-x-1 -bottom-0.5 h-[2px] rounded-full bg-sonar shadow-[0_0_10px_rgba(127,216,236,0.7)]"
                              transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                            />
                          )}
                        </button>
                        {i < TOPICS.length - 2 ? ', ' : i === TOPICS.length - 2 ? ' or ' : ''}
                      </span>
                    ))}
                    . You can reach me at
                    <Blank name="email" type="email" autoComplete="email" placeholder="your email" value={email} onChange={setEmail} />.
                  </p>

                  <label className="mt-10 block">
                    <span className="text-[15px] text-mist">Tell me more about it</span>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      maxLength={2000}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Goals, timeline, budget, links. Whatever helps."
                      className="mt-3 w-full resize-none rounded-xl border border-[var(--line)] bg-[rgba(236,239,242,0.02)] px-5 py-4 text-[17px] leading-relaxed text-ink outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-fog focus:border-[rgba(127,216,236,0.6)] focus:shadow-[0_0_0_4px_rgba(127,216,236,0.08),0_0_24px_rgba(127,216,236,0.1)]"
                    />
                  </label>

                  {state === 'error' && (
                    <p className="mt-5 text-[15px] text-red-300">
                      That didn&apos;t go through. Please try again or write to {EMAIL}.
                    </p>
                  )}

                  <div className="mt-8 flex flex-col-reverse items-start justify-between gap-5 sm:flex-row sm:items-center">
                    <p className="text-[15px] text-fog">I usually reply within a day.</p>
                    <button
                      type="submit"
                      disabled={state === 'loading'}
                      className="group inline-flex items-center gap-3 rounded-full bg-ink py-2 pl-6 pr-2 text-[16px] font-medium text-void transition-[box-shadow,transform] duration-500 hover:shadow-[0_0_34px_rgba(127,216,236,0.45)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {state === 'loading' ? 'Sending' : 'Send message'}
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-void text-ink transition-transform duration-500 group-hover:rotate-[-45deg]">
                        {state === 'loading' ? (
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
                            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M3 8h10M9 4l4 4-4 4" />
                          </svg>
                        )}
                      </span>
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
