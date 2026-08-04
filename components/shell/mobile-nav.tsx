"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Download, Menu, X, Sparkles, ChevronRight } from "lucide-react"
import { navItems } from "@/lib/nav"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)

  const close = useCallback(() => setOpen(false), [])

  // Close on route change
  useEffect(() => {
    close()
  }, [pathname, close])

  // Scroll lock + Escape + focus trap
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = "hidden"

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close()
        return
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener("keydown", onKeyDown)
    const firstLink = panelRef.current?.querySelector<HTMLElement>("a, button")
    firstLink?.focus()

    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open, close])

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    if (deltaX > 60) close() // swipe right to close
    touchStartX.current = null
  }

  return (
    <>
      {/* ── Top Floating Glass Bar ── */}
      <header className="glass-panel fixed inset-x-3 top-3 z-40 flex h-14 items-center justify-between rounded-2xl px-4 backdrop-blur-xl md:hidden border border-glass-border shadow-lg shadow-black/20">
        <Link href="/" className="flex items-center gap-2.5" aria-label="NevPlay home">
          <div className="relative flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 p-0.5 ring-1 ring-primary/30">
            <Image src="/assets/icon.png" alt="" width={32} height={32} className="size-full rounded-lg object-cover" />
          </div>
          <span className="text-base font-extrabold tracking-tight">
            Nev<span className="text-primary">Play</span>
          </span>
        </Link>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex size-9 items-center justify-center rounded-xl bg-secondary/80 text-foreground transition-all duration-200 hover:bg-primary/20 hover:text-primary active:scale-95"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* ── Backdrop Overlay ── */}
      <div
        aria-hidden="true"
        onClick={close}
        className={cn(
          "fixed inset-0 z-50 bg-black/70 backdrop-blur-md transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* ── Premium Mobile Drawer ── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={cn(
          "fixed inset-y-3 right-3 z-50 flex w-80 max-w-[calc(100vw-1.5rem)] flex-col rounded-3xl border border-glass-border bg-card/95 backdrop-blur-2xl shadow-2xl transition-transform duration-300 ease-out md:hidden",
          open ? "translate-x-0" : "translate-x-[calc(100%+1rem)]",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-glass-border/60 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Image src="/assets/icon.png" alt="" width={28} height={28} className="size-7 rounded-lg" />
            <span className="text-lg font-bold tracking-tight">
              Nev<span className="text-primary">Play</span>
            </span>
          </div>
          <button
            type="button"
            onClick={close}
            className="flex size-8 items-center justify-center rounded-full bg-secondary/80 text-muted-foreground transition-all hover:bg-primary/20 hover:text-primary active:scale-90"
            aria-label="Close menu"
          >
            <X className="size-4.5" aria-hidden="true" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-4">
          {navItems.map((item, index) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                style={open ? { transitionDelay: `${index * 25}ms` } : undefined}
                className={cn(
                  "group relative flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-300",
                  open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0",
                  active
                    ? "bg-primary/15 text-primary border border-primary/25 shadow-sm shadow-primary/10"
                    : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                )}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={cn(
                      "flex size-8 items-center justify-center rounded-xl transition-colors",
                      active ? "bg-primary text-primary-foreground" : "bg-secondary/80 text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    <item.icon className="size-4 shrink-0" aria-hidden="true" />
                  </div>
                  <span>{item.label}</span>
                </div>
                <ChevronRight
                  className={cn(
                    "size-4 transition-transform duration-200",
                    active ? "text-primary opacity-100" : "text-muted-foreground/40 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                  )}
                />
              </Link>
            )
          })}
        </nav>

        {/* Bottom Download CTA */}
        <div className="border-t border-glass-border/60 p-5 bg-gradient-to-t from-primary/10 via-transparent to-transparent rounded-b-3xl">
          <Link
            href="/download"
            className="flex items-center justify-center gap-2.5 rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:brightness-110 active:scale-[0.98]"
          >
            <Download className="size-4.5" aria-hidden="true" />
            Download APK
          </Link>
        </div>
      </div>
    </>
  )
}
