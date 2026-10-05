'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EMAIL } from '@/lib/data'
import { ArrowUpRight, EASE_OUT, FadeUp, RevealLines, SectionHead } from './fx/primitives'

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
    'w-full border-0 border-b border-[var(--line-bright)] bg-transparent px-0 py-2.5 text-[16px] text-ink outline-none transition-colors focus:border-ink'
  return (
    <label className="block">
      <span className="text-[14px] text-fog">{label}</span>
      {multiline ? (
        <textarea name={name} value={value} required rows={4} onChange={(e) => onChange(name, e.target.value)} className={`${cls} resize-none`} />
      ) : (
        <input type={type} name={name} value={value} required onChange={(e) => onChange(name, e.target.value)} className={cls} />
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
    <section id="contact" className="py-24 md:py-36">
      <div className="container-wide">
        <SectionHead label="Contact">
          <RevealLines
            className="font-display text-[clamp(2.4rem,6vw,5.5rem)] font-semibold leading-[1] tracking-[-0.04em] text-ink"
            lines={['Have a project', 'in mind?']}
          />
          <FadeUp delay={0.1}>
            <a href={`mailto:${EMAIL}`} className="group mt-8 inline-flex items-center gap-2 text-[clamp(1.1rem,2vw,1.5rem)] text-ink">
              <span className="link-line">{EMAIL}</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <p className="mt-3 text-mist">Or use the form below. I usually reply within a day.</p>
          </FadeUp>

          <FadeUp delay={0.15} className="mt-16 max-w-[640px]">
            <AnimatePresence mode="wait">
              {state === 'success' ? (
                <motion.div
                  key="ok"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT }}
                  className="border-t border-[var(--line)] py-10"
                >
                  <p className="font-display text-2xl font-semibold text-ink">Thanks, message sent.</p>
                  <p className="mt-2 text-mist">I&apos;ll get back to you soon.</p>
                  <button onClick={() => setState('idle')} className="link-line mt-6 text-[14px] text-mist hover:text-ink">
                    Send another one
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} exit={{ opacity: 0 }} className="flex flex-col gap-8">
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <Field label="Name" name="name" value={form.name} onChange={handleChange} />
                    <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
                  </div>
                  <Field label="Subject" name="subject" value={form.subject} onChange={handleChange} />
                  <Field label="Message" name="message" value={form.message} onChange={handleChange} multiline />

                  {state === 'error' && (
                    <p className="text-[14px] text-red-400">Something went wrong. Please email me directly.</p>
                  )}

                  <button
                    type="submit"
                    disabled={state === 'loading'}
                    className="w-fit rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-void transition-[opacity,transform] hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {state === 'loading' ? 'Sending…' : 'Send message'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </FadeUp>
        </SectionHead>
      </div>
    </section>
  )
}
