'use client'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EMAIL, SOCIALS } from '@/lib/data'
import { ArrowUpRight, EASE_OUT, FadeUp, SectionTitle } from './fx/primitives'

/* Contact as a short chat: one question at a time, answers appear as bubbles. */

type Msg = { id: number; from: 'me' | 'you'; text: string }
type Step = 'name' | 'email' | 'topic' | 'message' | 'review' | 'sending' | 'done'

const TOPICS = ['Website', 'E-shop', 'Mobile app', 'Brand & design', 'Something else']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function TypingDots() {
  return (
    <div className="flex w-fit gap-1 rounded-2xl rounded-bl-md bg-deep px-4 py-3.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-mist"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}

function Bubble({ msg }: { msg: Msg }) {
  const mine = msg.from === 'me'
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
      className={`flex ${mine ? 'justify-start' : 'justify-end'}`}
    >
      <p
        className={`max-w-[85%] whitespace-pre-wrap break-words px-4 py-3 text-[15.5px] leading-relaxed ${
          mine
            ? 'rounded-2xl rounded-bl-md bg-deep text-ink'
            : 'rounded-2xl rounded-br-md bg-ink text-void'
        }`}
      >
        {msg.text}
      </p>
    </motion.div>
  )
}

export default function Contact() {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [step, setStep] = useState<Step>('name')
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const [data, setData] = useState({ name: '', email: '', topic: '', message: '' })
  const [started, setStarted] = useState(false)

  const scroller = useRef<HTMLDivElement>(null)
  const field = useRef<HTMLTextAreaElement>(null)
  const nextId = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const push = (from: Msg['from'], text: string) =>
    setMsgs((m) => [...m, { id: nextId.current++, from, text }])

  // My messages arrive after a short "typing" pause
  const say = (text: string, then?: () => void) => {
    setTyping(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setTyping(false)
      push('me', text)
      then?.()
    }, 650 + Math.min(text.length * 8, 700))
  }

  // Start the conversation when the chat scrolls into view
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        setStarted(true)
        say("Hi, I'm Mathias. What's your name?")
        obs.disconnect()
      }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => { obs.disconnect() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  // Keep the newest message in view without moving the page
  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing, step])

  // Return focus to the field after each of my replies, once the visitor has started typing
  useEffect(() => {
    if (!typing && msgs.length > 1 && (step === 'name' || step === 'email' || step === 'message')) {
      field.current?.focus({ preventScroll: true })
    }
  }, [typing, step, msgs.length])

  const answer = (text: string) => {
    const value = text.trim()
    if (!value || typing) return
    setInput('')
    push('you', value)

    if (step === 'name') {
      setData((d) => ({ ...d, name: value }))
      setStep('email')
      say(`Nice to meet you, ${value.split(' ')[0]}. What email should I reply to?`)
    } else if (step === 'email') {
      if (!EMAIL_RE.test(value)) {
        say("That doesn't look like an email address. Could you check it?")
        return
      }
      setData((d) => ({ ...d, email: value }))
      setStep('topic')
      say('Thanks. What are you working on?')
    } else if (step === 'topic') {
      setData((d) => ({ ...d, topic: value }))
      setStep('message')
      say('Got it. Tell me a bit about it: goals, timeline, links, anything that helps.')
    } else if (step === 'message') {
      setData((d) => ({ ...d, message: value }))
      setStep('review')
      say("Perfect, that's everything. Shall I send it?")
    }
  }

  const send = async () => {
    push('you', 'Send it')
    setStep('sending')
    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          name:    data.name,
          email:   data.email,
          message: data.message,
          subject: `${data.topic && data.topic !== 'Something else' ? data.topic : 'New project'} inquiry from ${data.name}`,
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setStep('done')
      say(`Sent! Thanks, ${data.name.split(' ')[0]}. I'll get back to you at ${data.email}, usually within a day.`)
    } catch {
      setStep('review')
      say(`Hmm, that didn't go through. Try again, or write to me at ${EMAIL}.`)
    }
  }

  const restart = () => {
    if (timer.current) clearTimeout(timer.current)
    setMsgs([])
    setData({ name: '', email: '', topic: '', message: '' })
    setInput('')
    setStep('name')
    say("Let's start over. What's your name?")
  }

  const showInput = step === 'name' || step === 'email' || step === 'message'
  const placeholder = step === 'name' ? 'Your name' : step === 'email' ? 'Your email' : 'Your message'

  return (
    <section id="contact" className="py-24 md:py-36">
      <div className="container-wide grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionTitle lines={['Have a project', 'in mind?']} />
          <FadeUp delay={0.1}>
            <p className="mt-8 max-w-[34ch] text-mist">Say hi in the chat, or write to me directly.</p>
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

        <FadeUp delay={0.15} className="lg:col-span-7">
          <div className="relative flex h-[560px] flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-abyss shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] md:h-[600px]">
            <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-sonar to-transparent opacity-50" />

            {/* chat header */}
            <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-deep font-display text-[15px] font-semibold text-ink">
                  M
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-abyss bg-[#30a46c]" />
                </div>
                <div className="leading-tight">
                  <p className="text-[15px] font-medium text-ink">Mathias</p>
                  <p className="text-[13px] text-fog">{typing ? 'typing…' : 'Usually replies within a day'}</p>
                </div>
              </div>
              {msgs.length > 2 && step !== 'sending' && (
                <button onClick={restart} className="link-line text-[13px] text-fog hover:text-ink">
                  Start over
                </button>
              )}
            </div>

            {/* conversation */}
            <div ref={scroller} data-lenis-prevent className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-5 py-6">
              {msgs.map((m) => <Bubble key={m.id} msg={m} />)}
              <AnimatePresence>
                {typing && (
                  <motion.div key="typing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <TypingDots />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* quick replies */}
              {step === 'topic' && !typing && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-1 flex flex-wrap justify-end gap-2">
                  {TOPICS.map((t) => (
                    <button
                      key={t}
                      onClick={() => answer(t)}
                      className="rounded-full border border-[var(--line-bright)] px-4 py-2 text-[14.5px] text-ink transition-all duration-300 hover:border-sonar hover:shadow-[0_0_18px_rgba(127,216,236,0.25)] active:scale-[0.97]"
                    >
                      {t}
                    </button>
                  ))}
                </motion.div>
              )}

              {(step === 'review' || step === 'sending') && !typing && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-1 flex justify-end gap-2">
                  <button
                    onClick={send}
                    disabled={step === 'sending'}
                    className="inline-flex items-center gap-2 rounded-full bg-sonar px-5 py-2.5 text-[14.5px] font-medium text-void transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(127,216,236,0.5)] disabled:opacity-60"
                  >
                    {step === 'sending' ? 'Sending…' : 'Send it'}
                  </button>
                </motion.div>
              )}
            </div>

            {/* composer */}
            <form
              onSubmit={(e) => { e.preventDefault(); answer(input) }}
              className={`flex items-end gap-2 border-t border-[var(--line)] p-3 transition-opacity duration-300 ${showInput ? '' : 'pointer-events-none opacity-40'}`}
            >
              <textarea
                ref={field}
                rows={1}
                value={input}
                disabled={!showInput}
                placeholder={showInput ? placeholder : ''}
                aria-label={placeholder}
                maxLength={step === 'message' ? 2000 : 200}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); answer(input) }
                }}
                className="max-h-36 min-h-[46px] flex-1 resize-none rounded-2xl border border-[var(--line)] bg-[rgba(236,239,242,0.03)] px-4 py-3 text-[15.5px] text-ink outline-none transition-[border-color,box-shadow] duration-300 [field-sizing:content] placeholder:text-fog focus:border-[rgba(127,216,236,0.55)] focus:shadow-[0_0_20px_rgba(127,216,236,0.1)]"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!input.trim() || typing}
                className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-ink text-void transition-[opacity,box-shadow] duration-300 hover:shadow-[0_0_20px_rgba(127,216,236,0.45)] disabled:opacity-30"
              >
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" />
                </svg>
              </button>
            </form>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
