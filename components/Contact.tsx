'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

const EASE_SMOOTH = [0.4, 0, 0.2, 1] as [number, number, number, number]
const EASE_SPRING = [0.16, 1, 0.3, 1] as [number, number, number, number]

const EMAIL = 'matejcikmathias@gmail.com'
const SOCIALS = [
  {
    label: 'GitHub',
    href: 'https://github.com/Mates24',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/mathiasmatejcik',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-plain.svg',
  },
]

// Types
type FormState = 'idle' | 'loading' | 'success' | 'error'

interface FormData {
  name:    string
  email:   string
  subject: string
  message: string
}

// Input component
function Field({
  label,
  name,
  type = 'text',
  value,
  onChange,
  multiline = false,
  required = true,
}: {
  label:      string
  name:       keyof FormData
  type?:      string
  value:      string
  onChange:   (name: keyof FormData, value: string) => void
  multiline?: boolean
  required?:  boolean
}) {
  const baseClass = `
    w-full px-4 py-3.5 rounded-xl
    bg-[rgba(6,13,31,0.6)] backdrop-blur-sm
    border border-[rgba(99,179,237,0.12)]
    text-[#e2eaf4] text-sm placeholder:text-[#3d5a7a]
    outline-none
    focus:border-[rgba(56,189,248,0.4)]
    focus:bg-[rgba(6,13,31,0.85)]
    focus:shadow-[0_0_0_3px_rgba(56,189,248,0.07)]
    transition-all duration-200
    font-body
  `

  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-[10px] text-[#3d5a7a] tracking-[0.12em] uppercase">
        {label}
      </label>
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          required={required}
          rows={5}
          className={`${baseClass} resize-none`}
          placeholder={`Your ${label.toLowerCase()}...`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          required={required}
          className={baseClass}
          placeholder={`Your ${label.toLowerCase()}...`}
        />
      )}
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState<FormData>({
    name: '', email: '', subject: '', message: '',
  })
  const [state, setState] = useState<FormState>('idle')

  const handleChange = (name: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

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
    <section id="contact" className="relative py-12 md:py-24 overflow-hidden">

      {/* Ambient glow */}
      <div className="
        absolute bottom-0 left-1/2 -translate-x-1/2
        w-[800px] h-[500px] rounded-full pointer-events-none
        bg-[radial-gradient(ellipse,rgba(56,189,248,0.06)_0%,transparent_70%)]
      " />

      <div className="container-wide relative z-10">

        {/* ── Section label ── */}
        <motion.div
          className="flex items-center gap-3 mb-6 md:mb-14"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE_SMOOTH }}
        >
          <div className="w-8 h-px bg-gradient-to-r from-[#38bdf8] to-transparent" />
          <span className="font-mono text-[11px] text-[#38bdf8] tracking-[0.15em] uppercase">
            Contact
          </span>
        </motion.div>

        {/* ── Two column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16 lg:gap-24 items-start">

          {/* ── Left — heading + info ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: EASE_SMOOTH }}
          >
            <h2 className="
              font-display font-bold leading-[1.1] tracking-[-0.02em]
              text-[clamp(2rem,3.5vw,2.75rem)] text-[#e2eaf4]
              mb-5
            ">
              Let&apos;s build
              <br />
              <span className="text-gradient">something great</span>
            </h2>

            <p className="text-[#7a9bbf] text-[0.95rem] leading-[1.8] mb-10 max-w-[340px]">
              Have a project in mind? I&apos;m available for freelance work.
              Drop me a message and I&apos;ll get back to you within 24 hours.
            </p>

            {/* Email */}
            <div className="mb-8">
              <p className="font-mono text-[10px] text-[#3d5a7a] tracking-[0.12em] uppercase mb-2">
                Email
              </p>
              <a
                href={`mailto:${EMAIL}`}
                className="
                  group inline-flex items-center gap-2
                  text-[#c8ddf0] text-sm font-medium
                  hover:text-[#38bdf8]
                  transition-colors duration-200
                "
              >
                {EMAIL}
                <svg
                  className="w-3.5 h-3.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-1 transition-all duration-200"
                  viewBox="0 0 16 16" fill="none"
                  stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M4 12L12 4M12 4H6M12 4v6" />
                </svg>
              </a>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-[rgba(56,189,248,0.1)] to-transparent mb-8" />

            {/* Socials */}
            <div>
              <p className="font-mono text-[10px] text-[#3d5a7a] tracking-[0.12em] uppercase mb-4">
                Elsewhere
              </p>
              <div className="flex flex-col gap-3">
                {SOCIALS.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      group inline-flex items-center gap-2.5 w-fit
                      text-[#7a9bbf] text-sm
                      hover:text-[#c8ddf0]
                      transition-colors duration-200
                    "
                  >
                    <img
                      src={icon}
                      alt={label}
                      className="w-4 h-4 opacity-50 group-hover:opacity-90 transition-opacity duration-200"
                      style={{ filter: 'brightness(0) invert(1)' }}
                    />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Right — form ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE_SMOOTH }}
          >
            <div className="
              relative p-8 rounded-2xl
              border border-[rgba(99,179,237,0.1)]
              bg-[rgba(6,13,31,0.5)] backdrop-blur-xl
              shadow-[0_0_0_1px_rgba(56,189,248,0.03)_inset]
            ">
              {/* Success state */}
              {state === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: EASE_SPRING }}
                  className="flex flex-col items-center justify-center py-16 text-center gap-4"
                >
                  <div className="
                    w-14 h-14 rounded-full
                    border border-[rgba(56,189,248,0.3)]
                    bg-[rgba(56,189,248,0.08)]
                    flex items-center justify-center
                    text-[#38bdf8] text-2xl
                    shadow-[0_0_24px_rgba(56,189,248,0.15)]
                  ">
                    ✦
                  </div>
                  <h3 className="font-display font-bold text-xl text-[#e2eaf4]">
                    Message sent
                  </h3>
                  <p className="text-[#7a9bbf] text-sm max-w-[260px] leading-relaxed">
                    Thanks for reaching out. I&apos;ll get back to you within 24 hours.
  				        </p>
                  <button
                    onClick={() => setState('idle')}
                    className="
                      mt-2 font-mono text-[11px] text-[#3d5a7a]
                      tracking-[0.1em] uppercase
                      hover:text-[#7a9bbf] transition-colors duration-200
                    "
                  >
                    Send another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field
                      label="Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                    />
                    <Field
                      label="Email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  <Field
                    label="Subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                  />

                  <Field
                    label="Message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    multiline
                  />

                  {/* Error */}
                  {state === 'error' && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-mono text-[11px] text-red-400 tracking-[0.06em]"
                    >
                      Something went wrong. Try emailing me directly.
                    </motion.p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={state === 'loading'}
                    className="
                      group relative flex items-center justify-center gap-2.5
                      w-full py-3.5 rounded-xl mt-1
                      bg-gradient-to-r from-[#38bdf8] to-[#818cf8]
                      text-[#03060f] font-semibold text-sm tracking-[0.01em]
                      shadow-[0_0_24px_rgba(56,189,248,0.25)]
                      hover:shadow-[0_0_40px_rgba(56,189,248,0.4)]
                      hover:-translate-y-px
                      disabled:opacity-60 disabled:cursor-not-allowed
                      disabled:hover:translate-y-0
                      transition-all duration-200
                    "
                  >
                    {state === 'loading' ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin"
                          viewBox="0 0 24 24" fill="none"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg
                          className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                          viewBox="0 0 16 16" fill="none"
                          stroke="currentColor" strokeWidth="1.6"
                          strokeLinecap="round" strokeLinejoin="round"
                        >
                          <path d="M3 8h10M9 4l4 4-4 4" />
                        </svg>
                      </>
                    )}
                  </button>

                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}