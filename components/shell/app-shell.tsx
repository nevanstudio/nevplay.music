import type { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { MobileNav } from "./mobile-nav"
import { Footer } from "./footer"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh">
      <a
        href="#main-content"
        className="sr-only z-100 rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Sidebar />
      <MobileNav />
      <div className="pt-16 md:pl-66 md:pt-0 md:transition-[padding]">
        <main id="main-content">{children}</main>
        <Footer />
      </div>
    </div>
  )
}
