export interface Project {
  slug:      string
  title:     string
  category:  string
  year?:     string
  desc:      string
  tags:      string[]
  href:      string
  cta:       string
  image:     string
  imageFit?: 'cover' | 'contain'
  imageBg?:  string
  logo?:     string
  accent:    string
}

export const PROJECTS: Project[] = [
  {
    slug:     'logbook',
    title:    'LogBook',
    category: 'iOS app · Product',
    desc:     'A professional digital yacht logbook, live on the App Store. Fast log entry, crew management, voyage maps, a sailing atlas, a statistics dashboard and polished PDF export for charter operators and skippers.',
    tags:     ['React Native', 'Expo', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma', 'RevenueCat'],
    href:     'https://apps.apple.com/us/app/logbook-digital-yacht-log/id6762569859',
    cta:      'View on App Store',
    image:    '/projects/logbook.png',
    imageFit: 'contain',
    imageBg:  '#d6ccb4',
    accent:   '94,231,255',
  },
  {
    slug:     'postele-liptov',
    title:    'Postele Liptov',
    category: 'E-commerce · CMS · Brand',
    desc:     'Brand, website and custom admin for a Slovak maker of solid-wood beds and sofas. Product catalogue with filters, made-to-order inquiries, showrooms in Liptovský Mikuláš and Košice, and a CMS for products, fabrics, orders, SEO and promo banners.',
    tags:     ['Next.js', 'TypeScript', 'Drizzle', 'PostgreSQL', 'S3', 'Docker', 'Railway', 'Illustrator'],
    href:     'https://posteleliptov.sk',
    cta:      'Visit site',
    image:    '/projects/posteleliptov.jpg',
    logo:     '/projects/posteleliptov-logo.png',
    accent:   '199,174,141',
  },
  {
    slug:     'chata-claudia',
    title:    'Chata Claudia',
    category: 'Website · Booking system',
    desc:     'Full website with an integrated booking system for a mountain chalet in Demänovská Dolina. Mobile-first, fast, and easy for the owner to manage.',
    tags:     ['Next.js', 'TypeScript', 'Tailwind', 'GSAP', 'PocketBase', 'Railway', 'Cloudflare'],
    href:     'https://chataclaudia.sk',
    cta:      'Visit site',
    image:    '/projects/featured.jpg',
    accent:   '134,239,172',
  },
  {
    slug:     'krovmat',
    title:    'Krovmat',
    category: 'Website · Lead generation',
    desc:     'Modern, responsive website for a local roofing company. Clean design, fast performance and clear calls to action that turn visits into inquiries.',
    tags:     ['HTML', 'CSS', 'JavaScript', 'PHP'],
    href:     'https://krovmat.eu',
    cta:      'Visit site',
    image:    '/projects/krovmat.jpg',
    accent:   '255,138,76',
  },
  {
    slug:     'sunclove',
    title:    'Sunclove',
    category: 'Label · Brand identity',
    desc:     'Label and visual identity for a self-tanning cosmetics brand. Gradient treatment, refined typography and a premium feel across two product variants.',
    tags:     ['Illustrator', 'Photoshop', 'Packaging', 'Brand design'],
    href:     'https://www.sunclove.com',
    cta:      'Visit brand',
    image:    '/projects/sunclove.jpg',
    accent:   '196,148,255',
  },
  {
    slug:     'sadrokartony-dunaj',
    title:    'Sadrokartóny Dunaj',
    category: 'Website · Lead generation',
    desc:     'Website for a drywall installation company in Martin. Clean layout, quick loading and calls to action focused on customer inquiries.',
    tags:     ['HTML', 'CSS', 'JavaScript', 'PHP'],
    href:     'https://sadrokartonydunaj.sk',
    cta:      'Visit site',
    image:    '/projects/sadrokartonydunaj.jpg',
    accent:   '120,170,255',
  },
]

export const SKILL_DOMAINS = [
  {
    title: 'Engineering',
    code:  'ENG',
    skills: [
      ['TypeScript', '#3178c6'], ['JavaScript', '#f7df1e'], ['React', '#61dafb'],
      ['React Native', '#61dafb'], ['Next.js', '#ffffff'], ['Expo', '#5ee7ff'],
      ['Node.js', '#5fa04e'], ['PHP', '#777bb4'], ['PostgreSQL', '#4169e1'],
      ['MySQL', '#4479a1'], ['Drizzle', '#c5f74f'], ['Prisma', '#a3b5ff'],
      ['PocketBase', '#b8dbe4'], ['Framer Motion', '#3b82ff'], ['Three.js', '#ffffff'],
    ],
  },
  {
    title: 'Design',
    code:  'DSN',
    skills: [
      ['Figma', '#f24e1e'], ['Illustrator', '#ff9a00'], ['Photoshop', '#31a8ff'],
      ['Adobe XD', '#ff61f6'], ['Premiere Pro', '#9999ff'], ['Brand identity', '#ff8a4c'],
      ['Packaging', '#ff8a4c'], ['Design systems', '#5ee7ff'], ['Typography', '#5ee7ff'],
    ],
  },
  {
    title: 'Tooling',
    code:  'OPS',
    skills: [
      ['Git', '#f05032'], ['GitHub', '#ffffff'], ['Docker', '#2496ed'],
      ['Vercel', '#ffffff'], ['Railway', '#c8d3d5'], ['Cloudflare', '#f6821f'],
      ['Tailwind', '#06b6d4'], ['Linux', '#fcc624'], ['RevenueCat', '#f25a5a'],
    ],
  },
] as const

export const EMAIL = 'matejcikmathias@gmail.com'

export const SOCIALS = [
  { label: 'GitHub',   href: 'https://github.com/Mates24' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/mathiasmatejcik' },
  { label: 'App Store', href: 'https://apps.apple.com/us/app/logbook-digital-yacht-log/id6762569859' },
]
