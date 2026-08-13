import Link from "next/link"
import Image from "next/image"

const productLinks = [
  { label: "Download", href: "/download" },
  { label: "News & Notices", href: "/news" },
  { label: "Features", href: "/features" },
  { label: "Screenshots", href: "/screenshots" },
  { label: "Releases", href: "/releases" },
  { label: "Roadmap", href: "/roadmap" },
]

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Donate", href: "/donate" },
  { label: "Help", href: "/help" },
]

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
]

export function Footer() {
  return (
    <footer className="border-t border-glass-border px-6 py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="flex max-w-sm flex-col gap-4">
            <Link href="/" className="flex items-center gap-3" aria-label="NevPlay home">
              <Image src="/assets/icon.png" alt="" width={32} height={32} className="size-8 rounded-lg" />
              <span className="text-lg font-bold tracking-tight">
                Nev<span className="text-primary">Play</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The premium offline music player for Android. Always free, always private
              — your music stays completely yours.
            </p>
          </div>

          <div className="flex flex-wrap gap-12">
            <nav aria-label="Product" className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold">Product</h3>
              {productLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <nav aria-label="Project" className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold">Project</h3>
              {companyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <nav aria-label="Legal" className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold">Legal</h3>
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-glass-border pt-6 text-xs text-muted-foreground md:flex-row">
          <p>&copy; {new Date().getFullYear()} Nevan Studio. Always free, always private.</p>
          <p>No ads. No tracking. Your privacy guaranteed.</p>
        </div>
      </div>
    </footer>
  )
}
