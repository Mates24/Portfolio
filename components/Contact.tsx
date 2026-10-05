'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EMAIL, SOCIALS } from '@/lib/data'
import { ArrowUpRight, EASE_OUT, FadeUp, SectionTitle } from './fx/primitives'

type FormState = 'idle' | 'loading' | 'success' | 'error'

interface FormData {
  name:    string
  email:   string
  subject: string
  message: string
}

const TOPICS = ['Website', 'E-shop', 'iOS app', 'Brand & design', 'Something else']
const MAX_MESSAGE = 2000

function Field({
  label,
  name,
  type = 'text',
  value,
  placeholder,
  onChange,
  multiline = false,
}: {
  label:       string
  name:        keyof FormData
  type?:       string
  value:       string
  placeholder: string
  onChange:    (name: keyof FormData, value: string) => void
  multiline?:  boolean
}) {
  const input =
    'w-full bg-transparent text-[16px] text-ink outline-none placeholder:text-fog/70'
  return (
    <label className="group block rounded-xl border border-[var(--line)] bg-[rgba(236,239,242,0.025)] px-4 pb-3 pt-2.5 transition-[border-color,box-shadow,background-color] duration-300 [&:not(:focus-within):hover]:border-[var(--line-bright)] focus-within:border-[rgba(127,216,236,0.6)] focus-within:bg-[rgba(127,216,236,0.04)] focus-within:shadow-[0_0_0_4px_rgba(127,216,236,0.08),0_0_24px_rgba(127,216,236,0.12)]">
      <span className="flex items-center justify-between text-[13px] text-mist transition-colors group-focus-within:text-sonar">
        {label}
        {multiline && <span className="tabular-nums text-fog">{value.length} / {MAX_MESSAGE}</span>}
      </span>
      {multiline ? (
        <textarea
          name={name}
          value={value}
          required
          rows={5}
          maxLength={MAX_MESSAGE}
          placeholder={placeholder}
          onChange={(e) => onChange(name, e.target.value)}
          className={`${input} mt-1 resize-none leading-relaxed`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          required
          placeholder={placeholder}
          onChange={(e) => onChange(name, e.target.value)}
          className={`${input} mt-1`}
        />
      )}
    </label>
  )
}

export default function Contact() {
  const [form, setForm] = useState<FormData>({ name: '', email: '', subject: '', message: '' })
  const [state, setState] = useState<FormState>('idle')

  const handleChange = (name: keyof FormData, value: string) => setForm((prev) => ({ ...prev, [name]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('loading')
    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          ...form,
          subject: form.subject ? `${form.subject} inquiry from ${form.name}` : `New inquiry from ${form.name}`,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setState('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setState('error')
    }
  }

  return (
    <section id="contact" className="py-24 md:py-36">
      <div className="container-wide grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionTitle lines={['Have a project', 'in mind?']} />
          <FadeUp delay={0.1}>
            <p className="mt-8 max-w-[36ch] text-mist">
              Website, e-shop, app or a brand from scratch. Tell me a bit about it, or email me directly.
            </p>
            <a href={`mailto:${EMAIL}`} className="group mt-8 inline-flex items-center gap-2 text-[clamp(1.05rem,1.6vw,1.3rem)] text-ink">
              <span className="link-line">{EMAIL}</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-mist">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="link-line transition-colors hover:text-ink">
                  {s.label}
                </a>
              ))}
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={0.15} className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-abyss p-7 md:p-10">
            {/* faint light along the top edge of the panel */}
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-sonar to-transparent opacity-60" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(127,216,236,0.08),transparent)]" />
            <AnimatePresence mode="wait">
              {state === 'success' ? (
                <motion.div
                  key="ok"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className="relative py-10"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-sonar text-sonar shadow-[0_0_24px_rgba(127,216,236,0.3)]">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12l5 5L20 7" /></svg>
                  </div>
                  <p className="font-display text-2xl font-semibold text-ink">Thanks, message sent.</p>
                  <p className="mt-2 text-mist">I&apos;ll get back to you soon.</p>
                  <button onClick={() => setState('idle')} className="link-line mt-6 text-[14px] text-mist hover:text-ink">
                    Send another one
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} exit={{ opacity: 0 }} className="relative flex flex-col gap-5">
                  <fieldset>
                    <legend className="mb-3 text-[13px] text-mist">What are you working on?</legend>
                    <div className="flex flex-wrap gap-2">
                      {TOPICS.map((t) => {
                        const on = form.subject === t
                        return (
                          <button
                            key={t}
                            type="button"
                            aria-pressed={on}
                            onClick={() => handleChange('subject', on ? '' : t)}
                            className={`rounded-full border px-4 py-2 text-[14px] transition-all duration-300 active:scale-[0.97] ${
                              on
                                ? 'border-sonar bg-[rgba(127,216,236,0.12)] text-ink shadow-[0_0_18px_rgba(127,216,236,0.25)]'
                                : 'border-[var(--line)] text-mist hover:border-[var(--line-bright)] hover:text-ink'
                            }`}
                          >
                            {t}
                          </button>
                        )
                      })}
                    </div>
                  </fieldset>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Name" name="name" placeholder="Jana Nováková" value={form.name} onChange={handleChange} />
                    <Field label="Email" name="email" type="email" placeholder="jana@company.sk" value={form.email} onChange={handleChange} />
                  </div>
                  <Field
                    label="Message"
                    name="message"
                    placeholder="A few lines about the project, timeline and anything I should know."
                    value={form.message}
                    onChange={handleChange}
                    multiline
                  />

                  {state === 'error' && (
                    <p className="rounded-xl border border-[rgba(229,72,77,0.35)] bg-[rgba(229,72,77,0.08)] px-4 py-3 text-[14px] text-red-300">
                      Something went wrong. Please email me directly at {EMAIL}.
                    </p>
                  )}

                  <div className="mt-2 flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <p className="flex items-center gap-2 text-[14px] text-fog">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#30a46c] shadow-[0_0_8px_rgba(48,164,108,0.8)]" />
                      Usually replies within a day
                    </p>
                    <button
                      type="submit"
                      disabled={state === 'loading'}
                      className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3.5 text-[15px] font-medium text-void transition-[box-shadow,transform] duration-500 hover:shadow-[0_0_30px_rgba(127,216,236,0.45)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {state === 'loading' ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
                            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                          </svg>
                          Sending
                        </>
                      ) : (
                        <>
                          Send message
                          <svg className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M3 8h10M9 4l4 4-4 4" />
                          </svg>
                        </>
                      )}
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
