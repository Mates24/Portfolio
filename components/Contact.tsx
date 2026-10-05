'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EMAIL, SOCIALS } from '@/lib/data'
import { ArrowUpRight, EASE_OUT, FadeUp, Magnetic, RevealLines, SectionLabel } from './fx/primitives'

type FormState = 'idle' | 'loading' | 'success' | 'error'

interface FormData {
  name:    string
  email:   string
  subject: string
  message: string
}

function Field({
  label,
  name,
  type = 'text',
  value,
  onChange,
  multiline = false,
}: {
  label:      string
  name:       keyof FormData
  type?:      string
  value:      string
  onChange:   (name: keyof FormData, value: string) => void
  multiline?: boolean
}) {
  const cls =
    'peer w-full border-0 border-b border-[var(--line-bright)] bg-transparent px-0 pb-3 pt-6 text-[15px] text-ink outline-none transition-colors placeholder:text-transparent focus:border-sonar'
  return (
    <label className="relative block">
      {multiline ? (
        <textarea name={name} value={value} required rows={4} placeholder={label} onChange={(e) => onChange(name, e.target.value)} className={`${cls} resize-none`} />
      ) : (
        <input type={type} name={name} value={value} required placeholder={label} onChange={(e) => onChange(name, e.target.value)} className={cls} />
      )}
      <span className="pointer-events-none absolute left-0 top-6 font-mono text-[12px] uppercase tracking-[0.14em] text-fog transition-all duration-300 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-sonar peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[10px]">
        {label}
      </span>
      <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-sonar to-flare transition-transform duration-500 peer-focus:scale-x-100" />
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
        body:    JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Failed')
      setState('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setState('error')
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden py-20 md:py-32">
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(255,138,76,0.08),transparent_65%)]" />

      <div className="container-wide relative">
        <SectionLabel index="05">Contact</SectionLabel>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <RevealLines
              className="font-display text-[clamp(2.75rem,7vw,6.5rem)] font-bold leading-[0.9] tracking-[-0.045em] text-ink"
              lines={['Got a project?', <span key="s" className="font-serif font-normal italic text-flare">Let&apos;s set sail.</span>]}
            />
            <FadeUp delay={0.15}>
              <p className="mt-8 max-w-[400px] text-mist">
                Website, e-shop, app or a brand from scratch. Tell me what you are building and I will get back to you within 24 hours.
              </p>

              <Magnetic strength={0.2}>
                <a
                  href={`mailto:${EMAIL}`}
                  className="group mt-10 inline-flex items-center gap-3 font-display text-[clamp(1.1rem,2.2vw,1.6rem)] font-semibold text-ink"
                >
                  <span className="bg-gradient-to-r from-sonar to-flare bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                    {EMAIL}
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-sonar transition-transform duration-500 group-hover:rotate-45" />
                </a>
              </Magnetic>

              <div className="mt-12 flex flex-wrap gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--line-bright)] px-4 py-2 text-[13px] text-mist transition-colors hover:border-sonar hover:text-ink"
                  >
                    {s.label}
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </FadeUp>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 60, rotateX: 20 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.2, ease: EASE_OUT }}
            style={{ transformPerspective: 1200, transformOrigin: '50% 100%' }}
          >
            <div className="conic-border panel rounded-[30px] p-7 md:p-10">
              <AnimatePresence mode="wait">
                {state === 'success' ? (
                  <motion.div
                    key="ok"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                    className="flex flex-col items-center py-16 text-center"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-sonar text-sonar shadow-[0_0_40px_rgba(94,231,255,0.25)]">
                      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
                    </div>
                    <h3 className="mt-6 font-display text-2xl font-bold text-ink">Message received</h3>
                    <p className="mt-2 max-w-[280px] text-sm text-mist">Thanks for reaching out. I&apos;ll reply within 24 hours.</p>
                    <button onClick={() => setState('idle')} className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-fog hover:text-ink">
                      Send another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} exit={{ opacity: 0 }} className="flex flex-col gap-7">
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-fog">
                      <span>New transmission</span>
                      <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sonar" /> Channel open</span>
                    </div>
                    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
                      <Field label="Name" name="name" value={form.name} onChange={handleChange} />
                      <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
                    </div>
                    <Field label="Subject" name="subject" value={form.subject} onChange={handleChange} />
                    <Field label="Message" name="message" value={form.message} onChange={handleChange} multiline />

                    {state === 'error' && (
                      <p className="font-mono text-[11px] tracking-[0.06em] text-red-400">Something went wrong. Try emailing me directly.</p>
                    )}

                    <button
                      type="submit"
                      disabled={state === 'loading'}
                      className="group relative mt-2 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-ink py-4 text-sm font-semibold text-void transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-sonar to-flare transition-transform duration-700 ease-[var(--ease-out)] group-hover:translate-x-0" />
                      <span className="relative">{state === 'loading' ? 'Transmitting…' : 'Send message'}</span>
                      {state !== 'loading' && (
                        <svg className="relative h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
