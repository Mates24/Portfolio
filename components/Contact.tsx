'use client'
import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EMAIL, SOCIALS } from '@/lib/data'
import { ArrowUpRight, EASE_OUT, FadeUp, SectionTitle } from './fx/primitives'

type FormState = 'idle' | 'loading' | 'success' | 'error'

const TOPICS = ['Website', 'E-shop', 'Mobile app', 'Brand & design', 'Something else']

const inputCls =
  'w-full border-b border-[var(--line-bright)] bg-transparent pb-2 font-display text-[clamp(1.3rem,2.2vw,1.75rem)] font-medium tracking-[-0.015em] text-ink outline-none transition-colors duration-300 hover:border-mist focus:border-sonar'

/* One question per row: number + question on the left, answer on the right.
   The rule above the row lights up while you are answering it. */
function Row({ n, question, htmlFor, children }: { n: string; question: string; htmlFor?: string; children: ReactNode }) {
  return (
    <div className="group relative grid grid-cols-1 gap-3 border-t border-[var(--line)] py-7 md:grid-cols-12 md:gap-8 md:py-9">
      <span className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-sonar shadow-[0_0_12px_rgba(127,216,236,0.8)] transition-transform duration-700 ease-[var(--ease-out)] group-focus-within:scale-x-100" />
      <label htmlFor={htmlFor} className="flex gap-4 text-[15px] text-mist transition-colors group-focus-within:text-ink md:col-span-4">
        <span className="tabular-nums text-fog transition-colors group-focus-within:text-sonar">{n}</span>
        {question}
      </label>
      <div className="md:col-span-8">{children}</div>
    </div>
  )
}

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [state, setState] = useState<FormState>('idle')
  const [sender, setSender] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('loading')
    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name,
          email,
          message,
          subject: `${topic && topic !== 'Something else' ? topic : 'New project'} inquiry from ${name}`,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setSender(name)
      setState('success')
      setName(''); setEmail(''); setMessage(''); setTopic(null)
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
            <p className="max-w-[36ch] text-mist">Answer four quick questions, or write to me directly.</p>
            <a href={`mailto:${EMAIL}`} className="group mt-4 inline-flex items-center gap-2 text-[clamp(1.05rem,1.6vw,1.3rem)] text-ink">
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
          <AnimatePresence mode="wait">
            {state === 'success' ? (
              <motion.div
                key="ok"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
                className="border-y border-[var(--line)] py-14"
              >
                <p className="font-display text-[clamp(1.8rem,3.4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
                  Thanks, {sender}. <span className="text-mist">Message received.</span>
                </p>
                <p className="mt-4 text-mist">I&apos;ll reply to your email soon.</p>
                <button onClick={() => setState('idle')} className="link-line mt-8 text-[15px] text-mist hover:text-ink">
                  Write another message
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} exit={{ opacity: 0 }}>
                <Row n="01" question="What's your name?" htmlFor="c-name">
                  <input id="c-name" name="name" required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
                </Row>

                <Row n="02" question="Where can I reply?" htmlFor="c-email">
                  <input id="c-email" name="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
                </Row>

                <Row n="03" question="What do you need?">
                  <div className="flex flex-wrap gap-2.5" role="group" aria-label="What do you need?">
                    {TOPICS.map((t) => {
                      const on = topic === t
                      return (
                        <button
                          key={t}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setTopic(on ? null : t)}
                          className={`rounded-full border px-5 py-2.5 text-[15px] transition-all duration-300 active:scale-[0.97] ${
                            on
                              ? 'border-sonar bg-[rgba(127,216,236,0.12)] text-ink shadow-[0_0_18px_rgba(127,216,236,0.25)]'
                              : 'border-[var(--line-bright)] text-mist hover:border-ink hover:text-ink'
                          }`}
                        >
                          {t}
                        </button>
                      )
                    })}
                  </div>
                </Row>

                <Row n="04" question="Tell me about the project" htmlFor="c-message">
                  <textarea
                    id="c-message"
                    name="message"
                    required
                    rows={3}
                    maxLength={2000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`${inputCls} resize-none leading-snug`}
                  />
                </Row>

                <div className="flex flex-col-reverse items-start justify-between gap-5 border-t border-[var(--line)] pt-8 sm:flex-row sm:items-center">
                  <p className="text-[15px] text-fog">
                    {state === 'error'
                      ? <span className="text-red-300">That didn&apos;t go through. Please try again or email me.</span>
                      : 'I usually reply within a day.'}
                  </p>
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
        </FadeUp>
      </div>
    </section>
  )
}
