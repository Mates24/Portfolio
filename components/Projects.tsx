'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

// Easing
const EASE_SMOOTH = [0.4, 0, 0.2, 1] as [number, number, number, number]

// Types
interface Project {
  number:   string
  badge?:   string
  title:    string
  desc:     string
  tags:     string[]
  href:     string
  image?:   string
  featured: boolean
  accent:   string
}

// Project data — replace with your real projects
const PROJECTS: Project[] = [
  {
    number:   '01',
    badge:    '✦ Client work',
    title:    'Chata Claudia - Website with booking system',
    desc:     'Designed and developed a full website with an integrated booking system for a mountain chalet in Demänovská Dolina. Built for performance, mobile-first, and easy for the owner to manage.',
    tags:     ['Next.js', 'TypeScript', 'Tailwind', 'GSAP', 'PocketBase', 'Railway', 'Cloudflare'],
    href:     'https://chataclaudia.sk',
    image:    '/projects/featured.png',
    featured: true,
    accent:   'rgba(56,189,248,0.12)',
  },
  {
    number:   '02',
    title:    'Krovmat - Roofing company website',
    desc:     'Modern, responsive website for a local roofing company. Clean design, fast performance, and clear CTAs to drive conversions.',
    tags:     ['HTML', 'CSS', 'JavaScript', 'PHP', 'Framer Motion'],
    href:     'https://krovmat.eu',
    image:    '/projects/krovmat.png',
    featured: false,
    accent:   'rgba(129,140,248,0.15)',
  },
  {
    number:   '03',
    title:    'Sunclove — Label & Brand Design',
    desc:     'Designed the label and visual identity for a self-tanning cosmetics brand. Clean gradient treatment, refined typography, and a premium feel across two product variants.',
    tags:     ['Adobe Illustrator', 'Adobe Photoshop', 'Mockups', 'Brand Design', 'Packaging'],
    href:     'https://www.sunclove.com',
    image:    '/projects/sunclove.jpg',
    featured: false,
    accent:   'rgba(56,189,248,0.12)',
  },
  {
    number:   '04',
    title:    'LogBook - App for sailors',
    desc:     'Designed and developed LogBook, a mobile app for sailors to track their voyages, log weather conditions, and manage their sailing schedules.',
    tags:     ['React Native', 'TypeScript', 'Expo', 'PocketBase', 'Adobe Illustrator', 'Adobe XD'],
    href:     'https://github.com/Mates24/LogBook_app',
    image:    '/projects/logbook.png',
    featured: false,
    accent:   'rgba(56,189,248,0.12)',
  },
]

// Arrow icon
function ArrowIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12L12 4M12 4H6M12 4v6" />
    </svg>
  )
}

// Tag row
function TagRow({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="
            px-2.5 py-1 rounded-md
            border border-[rgba(99,179,237,0.12)]
            bg-[rgba(56,189,248,0.05)]
            font-mono text-[10px] text-[#3d5a7a]
            tracking-[0.05em]
          "
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

// Featured card
function FeaturedCard({ project }: { project: Project }) {
  return (
    <motion.a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex h-[480px] rounded-[24px] overflow-hidden
        border border-[rgba(99,179,237,0.12)]
        hover:border-[rgba(56,189,248,0.28)]
        transition-colors duration-500 cursor-pointer
        mb-5"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: EASE_SMOOTH }}
    >
      {/* Background — image or gradient */}
      <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `
                radial-gradient(circle at 70% 40%, ${project.accent} 0%, transparent 55%),
                radial-gradient(circle at 20% 80%, rgba(129,140,248,0.08) 0%, transparent 45%),
                linear-gradient(135deg, #060d1f 0%, #0a1e3d 50%, #051525 100%)
              `,
            }}
          />
        )}
        {/* Subtle grid overlay */}
        <div className="
          absolute inset-0 opacity-50
          bg-[linear-gradient(rgba(56,189,248,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.05)_1px,transparent_1px)]
          bg-[size:40px_40px]
        " />
      </div>

      <div className="absolute inset-0 bg-[rgba(3,6,15,0.45)]" />
      {/* Gradient overlay */}
      <div className="
        absolute inset-0
        bg-gradient-to-t from-[rgba(3,6,15,1)] via-[rgba(3,6,15,0.75)] to-transparent
        group-hover:from-[rgba(3,6,15,0.98)]
        transition-all duration-500
      " />

      {/* Corner arrow */}
      <div className="
        absolute top-8 right-8 z-10
        w-10 h-10 rounded-[10px]
        border border-[rgba(99,179,237,0.15)]
        bg-[rgba(6,13,31,0.6)] backdrop-blur-md
        flex items-center justify-center
        text-[#38bdf8]
        opacity-0 scale-75
        group-hover:opacity-100 group-hover:scale-100
        transition-all duration-300
      ">
        <ArrowIcon size={15} />
      </div>

      {/* Content */}
      <div className="
        relative z-10 h-full flex flex-col justify-end
        p-6 sm:p-8 md:p-10
        transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        group-hover:-translate-y-1.5
      ">
        {/* Number */}
        <p className="
          flex items-center gap-2 mb-3
          font-mono text-[10px] text-[#38bdf8]
          tracking-[0.15em] uppercase
        ">
          <span className="block w-6 h-px bg-[#38bdf8]" />
          {project.number} — Featured
        </p>

        {/* Badge */}
        {project.badge && (
          <div className="
            inline-flex items-center gap-1.5 mb-3
            px-3 py-1 rounded-full w-fit
            border border-[rgba(56,189,248,0.25)]
            bg-[rgba(56,189,248,0.08)]
            font-mono text-[10px] text-[#67e8f9]
            tracking-[0.08em] uppercase
          ">
            {project.badge}
          </div>
        )}

        <h3 className="
          font-display font-bold
          text-[1.5rem] sm:text-[2rem] md:text-[2.25rem]
          leading-[1.15] tracking-[-0.02em]
          text-[#e2eaf4] mb-2.5
        ">
          {project.title}
        </h3>

        <p className="text-[#7a9bbf] text-sm leading-[1.7] max-w-[480px] mb-5">
          {project.desc}
        </p>

        <div className="mb-5">
          <TagRow tags={project.tags} />
        </div>

        {/* View link */}
        <p className="
          hidden md:inline-flex items-center gap-2
          text-[13px] font-medium text-[#38bdf8]
          opacity-0 translate-y-2
          group-hover:opacity-100 group-hover:translate-y-0
          transition-all duration-300
        ">
          View project
          <ArrowIcon size={13} />
        </p>
      </div>
    </motion.a>
  )
}

// Small card
function SmallCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex h-[320px] rounded-[20px] overflow-hidden
        border border-[rgba(99,179,237,0.1)]
        hover:border-[rgba(56,189,248,0.25)]
        transition-colors duration-500 cursor-pointer"
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: EASE_SMOOTH }}
    >
      {/* Background */}
      <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `
                radial-gradient(circle at 60% 30%, ${project.accent} 0%, transparent 55%),
                linear-gradient(135deg, #060d1f 0%, #0a1628 100%)
              `,
            }}
          />
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-[rgba(3,6,15,0.45)]" />
      <div className="
        absolute inset-0
        bg-gradient-to-t from-[rgba(3,6,15,1)] via-[rgba(3,6,15,0.75)] to-transparent
      " />

      {/* Corner arrow */}
      <div className="
        absolute top-6 right-6 z-10
        w-9 h-9 rounded-[9px]
        border border-[rgba(99,179,237,0.15)]
        bg-[rgba(6,13,31,0.6)] backdrop-blur-md
        flex items-center justify-center
        text-[#38bdf8]
        opacity-0 scale-75
        group-hover:opacity-100 group-hover:scale-100
        transition-all duration-300
      ">
        <ArrowIcon size={13} />
      </div>

      {/* Content */}
      <div className="
        relative z-10 h-full flex flex-col justify-end p-7
        transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        group-hover:-translate-y-1
      ">
        <p className="
          flex items-center gap-2 mb-2.5
          font-mono text-[10px] text-[#38bdf8]
          tracking-[0.15em] uppercase
        ">
          <span className="block w-4 h-px bg-[#38bdf8]" />
          {project.number}
        </p>

        <h3 className="
          font-display font-bold text-[1.25rem]
          tracking-[-0.01em] text-[#e2eaf4] mb-1.5
        ">
          {project.title}
        </h3>

        <p className="text-[#7a9bbf] text-[13px] leading-[1.65] mb-4">
          {project.desc}
        </p>

        <TagRow tags={project.tags} />
      </div>
    </motion.a>
  )
}

// Section
export default function Projects() {
  const featured = PROJECTS.filter((p) => p.featured)
  const small    = PROJECTS.filter((p) => !p.featured)

  return (
    <section id="projects" className="relative py-12 md:py-24 overflow-hidden">

      {/* Ambient glow */}
      <div className="
        absolute top-1/3 left-0 -translate-x-1/2
        w-[600px] h-[600px] rounded-full pointer-events-none
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
            Projects
          </span>
        </motion.div>

        {/* ── Heading ── */}
        <motion.h2
          className="
            font-display font-bold leading-[1.15] tracking-[-0.02em]
            text-[clamp(2rem,3.5vw,2.75rem)] text-[#e2eaf4]
            mb-14
          "
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: EASE_SMOOTH }}
        >
          Work that
          <br />
          <span className="text-gradient">speaks for itself</span>
        </motion.h2>

        {/* ── Featured ── */}
        {featured.map((p) => (
          <FeaturedCard key={p.title} project={p} />
        ))}

        {/* ── Small cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {small.map((p, i) => (
            <SmallCard key={p.title} project={p} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}