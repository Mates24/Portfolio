'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'

// ── Easing ───────────────────────────────────────────────────────
const EASE_SMOOTH = [0.4, 0, 0.2, 1] as [number, number, number, number]

// ── Scroll-reveal variant ────────────────────────────────────────
const revealVariants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: EASE_SMOOTH, duration: 0.75 },
  },
}

// ── Detail chips ─────────────────────────────────────────────────
const CHIPS = [
  'Based in Liptovský Mikuláš',
  'Open to remote',
  'Full-stack',
  'UI / UX',
  'Systems thinking',
  'React / Next.js',
]

export default function About() {
  return (
    <section
      id="about"
      className="relative py-32 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-[800px] h-[500px] rounded-full pointer-events-none
        bg-[radial-gradient(ellipse,rgba(56,189,248,0.05)_0%,transparent_70%)]
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
            About
          </span>
        </motion.div>

        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── Left — statement + bio + chips ── */}
          <div>
            {/* Statement */}
            <motion.h2
              className="
                font-display font-bold leading-[1.15] tracking-[-0.02em]
                text-[clamp(2rem,3.5vw,2.75rem)] text-[#e2eaf4]
                mb-7
              "
              variants={revealVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
            >
              I build things that are
              <br />
              <span className="text-gradient">precise, intentional,</span>
              <br />
              and hard to forget.
            </motion.h2>

            {/* Bio */}
            <motion.p
              className="text-[#7a9bbf] text-base leading-[1.85] mb-10 max-w-[440px]"
              variants={revealVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: 0.1 }}
            >
              Based in Liptovský Mikuláš, I work at the intersection of engineering
              and design — writing code that&apos;s as considered as the
              interfaces it produces. I care deeply about the details most
              people never notice, and I think that&apos;s exactly the point.
            </motion.p>

            {/* Chips */}
            <motion.div
              className="flex flex-wrap gap-2"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
              }}
            >
              {CHIPS.map((chip) => (
                <motion.span
                  key={chip}
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    show: {
                      opacity: 1,
                      scale: 1,
                      transition: { ease: EASE_SMOOTH, duration: 0.4 },
                    },
                  }}
                  className="
                    inline-flex items-center gap-1.5
                    px-3.5 py-1.5 rounded-full
                    border border-[rgba(99,179,237,0.14)]
                    bg-[rgba(56,189,248,0.04)]
                    text-[12.5px] text-[#7a9bbf]
                    hover:border-[rgba(56,189,248,0.35)]
                    hover:text-[#c8ddf0]
                    hover:bg-[rgba(56,189,248,0.08)]
                    transition-all duration-200
                    cursor-default
                  "
                >
                  <span className="w-1 h-1 rounded-full bg-[#38bdf8] opacity-60" />
                  {chip}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* ── Right — portrait ── */}
        <motion.div
          className="relative w-full max-w-[360px] lg:ml-auto mt-2 lg:mt-0"
          variants={revealVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          transition={{ delay: 0.2 }}
        >
          {/* Glow behind portrait */}
          <div className="
            absolute -inset-5 rounded-2xl pointer-events-none
            bg-[radial-gradient(ellipse,rgba(56,189,248,0.07)_0%,transparent_70%)]
          " />

          {/* Corner frame accents */}
          {[
            'top-[-8px] left-[-8px]',
            'top-[-8px] right-[-8px] rotate-90',
            'bottom-[-8px] left-[-8px] -rotate-90',
            'bottom-[-8px] right-[-8px] rotate-180',
          ].map((pos, i) => (
            <span
              key={i}
              className={`absolute w-6 h-6 z-10 ${pos}`}
              style={{
                backgroundImage: `
                  linear-gradient(to right, #38bdf8, #38bdf8),
                  linear-gradient(to bottom, #38bdf8, #38bdf8)
                `,
                backgroundSize: '100% 1.5px, 1.5px 100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'top left, top left',
                filter: 'drop-shadow(0 0 4px rgba(56,189,248,0.6))',
              }}
            />
          ))}

          {/* Portrait frame */}
          <div className="
            relative w-full aspect-[4/5] rounded-2xl overflow-hidden
            border border-[rgba(99,179,237,0.12)]
            bg-[#0a1628]
          ">
            <Image
              src="/portrait.jpeg"
              alt="Mathias Matejčík"
              fill
              className="object-cover object-top"
              priority
            />
          </div>
      
          {/* Floating tag */}
          <motion.div
            className="
              absolute -bottom-4 -left-5 z-20
              px-3 py-1 rounded-xl
              bg-[rgba(6,13,31,0.92)] backdrop-blur-xl
              border border-[rgba(56,189,248,0.18)]
              shadow-[0_8px_32px_rgba(0,0,0,0.4)]
            "
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5, ease: EASE_SMOOTH }}
          >
            <p className="font-mono text-[10px] text-[#3d5a7a] tracking-[0.1em] uppercase">
              Currently
            </p>
            <p className="font-display font-semibold text-[13px] text-[#e2eaf4]">
              Building in public
            </p>
          </motion.div>
      
        </motion.div>
        </div>
      </div>
    </section>
  )
}