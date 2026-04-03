'use client'
import { useEffect, useRef, useState } from 'react'

// Brand colors per skill 
const BRAND: Record<string, string> = {
  'TypeScript':    '#3178c6',
  'JavaScript':    '#f7df1e',
  'React':         '#61dafb',
  'React Native':  '#61dafb',
  'Next.js':       '#ffffff',
  'Expo':          '#38bdf8',
  'Node.js':       '#5fa04e',
  'PHP':           '#777bb4',
  'MySQL':         '#4479a1',
  'PostgreSQL':    '#4169e1',
  'PocketBase':    '#b8dbe4',
  'Framer Motion': '#0055ff',
  'Figma':         '#f24e1e',
  'Illustrator':   '#ff9a00',
  'Photoshop':     '#31a8ff',
  'Adobe XD':      '#ff61f6',
  'Premiere Pro':  '#9999ff',
  'Design Systems':'#38bdf8',
  'Typography':    '#38bdf8',
  'Git':           '#f05032',
  'GitHub':        '#ffffff',
  'Docker':        '#2496ed',
  'Vercel':        '#ffffff',
  'Linux':         '#fcc624',
  'Tailwind':      '#06b6d4',
  'Railway':       '#c8d3d5',
  'Cloudflare':    '#f6821f',
}

const DOMAINS = [
  {
    letter: 'E',
    icon:   '⚙',
    title:  'Engineering',
    sub:    'Core stack',
    skills: [
      { name: 'TypeScript',    icon: { type: 'devicon', cls: 'devicon-typescript-plain'        } },
      { name: 'JavaScript',    icon: { type: 'devicon', cls: 'devicon-javascript-plain'        } },
      { name: 'React',         icon: { type: 'devicon', cls: 'devicon-react-original'          } },
      { name: 'React Native',  icon: { type: 'devicon', cls: 'devicon-react-original'          } },
      { name: 'Next.js',       icon: { type: 'devicon', cls: 'devicon-nextjs-plain'            } },
      { name: 'Expo',          icon: { type: 'devicon', cls: 'devicon-expo-original'           } },
      { name: 'Node.js',       icon: { type: 'devicon', cls: 'devicon-nodejs-plain'            } },
      { name: 'PHP',           icon: { type: 'devicon', cls: 'devicon-php-plain'               } },
      { name: 'MySQL',         icon: { type: 'devicon', cls: 'devicon-mysql-plain'             } },
      { name: 'PostgreSQL',    icon: { type: 'devicon', cls: 'devicon-postgresql-plain'        } },
      { name: 'PocketBase',    icon: { type: 'simple',  slug: 'pocketbase'                     } },
      { name: 'Framer Motion', icon: { type: 'simple',  slug: 'framer'                         } },
    ],
  },
  {
    letter: 'D',
    icon:   '✦',
    title:  'Design',
    sub:    'Craft & tools',
    skills: [
      { name: 'Figma',         icon: { type: 'devicon', cls: 'devicon-figma-plain'             } },
      { name: 'Illustrator',   icon: { type: 'devicon', cls: 'devicon-illustrator-plain'       } },
      { name: 'Photoshop',     icon: { type: 'devicon', cls: 'devicon-photoshop-plain'         } },
      { name: 'Adobe XD',      icon: { type: 'devicon', cls: 'devicon-xd-plain'                } },
      { name: 'Premiere Pro',  icon: { type: 'devicon', cls: 'devicon-premierepro-plain'       } },
      { name: 'Design Systems',icon: { type: 'none',    slug: ''                               } },
      { name: 'Typography',    icon: { type: 'none',    slug: ''                               } },
    ],
  },
  {
    letter: 'T',
    icon:   '◈',
    title:  'Tooling',
    sub:    'Environment',
    skills: [
      { name: 'Git',           icon: { type: 'devicon', cls: 'devicon-git-plain'               } },
      { name: 'GitHub',        icon: { type: 'devicon', cls: 'devicon-github-original'         } },
      { name: 'Docker',        icon: { type: 'devicon', cls: 'devicon-docker-plain'            } },
      { name: 'Vercel',        icon: { type: 'devicon', cls: 'devicon-vercel-plain'            } },
      { name: 'Linux',         icon: { type: 'devicon', cls: 'devicon-linux-plain'             } },
      { name: 'Tailwind',      icon: { type: 'devicon', cls: 'devicon-tailwindcss-original'    } },
      { name: 'Railway',       icon: { type: 'devicon', cls: 'devicon-railway-plain'           } },
      { name: 'Cloudflare',    icon: { type: 'devicon', cls: 'devicon-cloudflare-plain'        } },
    ],
  },
]

// Types
type SkillIconDef =
  | { type: 'devicon'; cls: string }
  | { type: 'simple';  slug: string }
  | { type: 'none';    slug: string }

// Icon renderer
function SkillIcon({
  icon,
  hovered,
  brand,
}: {
  icon: SkillIconDef
  hovered: boolean
  brand: string
}) {
  const style: React.CSSProperties = hovered
    ? { color: brand, filter: 'none', transition: 'all 0.25s ease' }
    : { color: 'rgba(178,212,232,0.45)', filter: 'grayscale(1) brightness(1.6)', transition: 'all 0.25s ease' }

  if (icon.type === 'devicon') {
    return <i className={`${icon.cls} text-[15px] flex-shrink-0`} style={style} />
  }

  if (icon.type === 'simple') {
    return (
      <img
        src={
          hovered
            ? `https://cdn.simpleicons.org/${icon.slug}/${brand.replace('#', '')}`
            : `https://cdn.simpleicons.org/${icon.slug}/b2d4e8`
        }
        alt=""
        width={14}
        height={14}
        className="flex-shrink-0"
        style={{
          filter:     hovered ? 'none' : 'grayscale(1) brightness(1.6)',
          transition: 'filter 0.25s ease',
          opacity:    hovered ? 1 : 0.45,
        }}
      />
    )
  }

  return (
    <span
      className="w-3.5 h-3.5 rounded-sm flex-shrink-0 flex items-center justify-center text-[7px]"
      style={{
        border: `1px solid ${hovered ? brand : 'rgba(99,179,237,0.2)'}`,
        background: hovered ? `${brand}18` : 'rgba(56,189,248,0.08)',
        color: hovered ? brand : '#3d5a7a',
        transition: 'all 0.25s ease',
      }}
    >
      ✦
    </span>
  )
}

// Skill pill
function SkillPill({ skill }: { skill: typeof DOMAINS[number]['skills'][number] }) {
  const [hovered, setHovered] = useState(false)
  const brand = BRAND[skill.name] ?? '#38bdf8'

  // Hex → rgba helper for glow/tint
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `${r},${g},${b}`
  }

  const rgb = /^#[0-9a-fA-F]{6}$/.test(brand) ? hexToRgb(brand) : '56,189,248'

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-default"
      style={{
        border:     `1px solid ${hovered ? `rgba(${rgb},0.35)` : 'rgba(99,179,237,0.12)'}`,
        background: hovered ? `rgba(${rgb},0.08)` : 'rgba(56,189,248,0.04)',
        boxShadow:  hovered ? `0 0 12px rgba(${rgb},0.15)` : 'none',
        transition: 'all 0.25s ease',
      }}
    >
      <SkillIcon icon={skill.icon as SkillIconDef} hovered={hovered} brand={brand} />
      <span
        className="font-mono text-[11px] tracking-[0.03em]"
        style={{
          color:      hovered ? '#e2eaf4' : '#7a9bbf',
          transition: 'color 0.25s ease',
        }}
      >
        {skill.name}
      </span>
    </span>
  )
}

// Card
function SkillCard({
  domain,
  index,
}: {
  domain: typeof DOMAINS[number]
  index:  number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.animationDelay = `${index * 0.1}s`
          el.classList.add('in-view')
          obs.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [index])

  return (
    <div
      ref={ref}
      className="skill-card group relative rounded-[20px] p-8 overflow-hidden cursor-default
        border border-[rgba(99,179,237,0.1)]
        bg-[rgba(6,13,31,0.6)] backdrop-blur-xl
        hover:border-[rgba(56,189,248,0.22)]
        hover:bg-[rgba(6,13,31,0.85)]
        hover:-translate-y-1
        hover:shadow-[0_0_0_1px_rgba(56,189,248,0.05)_inset,0_20px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(56,189,248,0.07)]
        transition-all duration-300"
    >
      <span className="
        absolute -top-2 right-4 select-none pointer-events-none
        font-display font-extrabold text-[8rem] leading-none
        text-[rgba(56,189,248,0.03)]
        group-hover:text-[rgba(56,189,248,0.06)]
        transition-colors duration-300
      ">
        {domain.letter}
      </span>

      {/* ── Card icon ── */}
      <div className="
        relative w-10 h-10 rounded-[10px] mb-5
        flex items-center justify-center
        border border-[rgba(56,189,248,0.2)]
        bg-[rgba(56,189,248,0.07)]
        text-[18px]
      ">
        {domain.icon}
      </div>

      <h3 className="font-display font-bold text-[1.05rem] tracking-[-0.01em] text-[#e2eaf4] mb-1">
        {domain.title}
      </h3>
      <p className="font-mono text-[10px] text-[#3d5a7a] tracking-[0.1em] uppercase mb-6">
        {domain.sub}
      </p>

      <div className="h-px bg-gradient-to-r from-[rgba(56,189,248,0.12)] to-transparent mb-6" />

      <div className="flex flex-wrap gap-2">
        {domain.skills.map((skill) => (
          <SkillPill key={skill.name} skill={skill} />
        ))}
      </div>
    </div>
  )
}

// Section
export default function Skills() {
  return (
    <section id="skills" className="relative py-12 md:py-24 overflow-hidden">

      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
      />

      <div className="
        absolute top-1/2 right-0 -translate-y-1/2
        w-[600px] h-[600px] rounded-full pointer-events-none
        bg-[radial-gradient(ellipse,rgba(129,140,248,0.05)_0%,transparent_70%)]
      " />

      <div className="container-wide relative z-10">

        <div className="flex items-center gap-3 mb-6 md:mb-14">
          <div className="w-8 h-px bg-gradient-to-r from-[#38bdf8] to-transparent" />
          <span className="font-mono text-[11px] text-[#38bdf8] tracking-[0.15em] uppercase">
            Skills
          </span>
        </div>

        <h2 className="
          font-display font-bold leading-[1.15] tracking-[-0.02em]
          text-[clamp(2rem,3.5vw,2.75rem)] text-[#e2eaf4]
          mb-16
        ">
          Technologies
          <br />
          <span className="text-gradient">I Work With</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DOMAINS.map((domain, i) => (
            <SkillCard key={domain.title} domain={domain} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}