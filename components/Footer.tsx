import { SOCIALS } from '@/lib/data'

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="container-wide">
      <div className="flex flex-col justify-between gap-4 border-t border-[var(--line)] py-8 text-[14px] text-mist sm:flex-row">
        <p>© {YEAR} Mathias Matejčík</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="link-line transition-colors hover:text-ink">
              {s.label}
            </a>
          ))}
          <a href="#hero" className="link-line transition-colors hover:text-ink">Back to top</a>
        </div>
      </div>
    </footer>
  )
}
