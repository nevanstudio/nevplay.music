"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Download, Menu, X } from "lucide-react"
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
    // Move focus into the panel
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
      {/* Top bar */}
      <header className="glass-panel fixed inset-x-3 top-3 z-40 flex h-14 items-center justify-between rounded-xl px-4 md:hidden">
        <Link href="/" className="flex items-center gap-2.5" aria-label="NevPlay home">
          <Image src="/assets/icon.png" alt="" width={28} height={28} className="size-7 rounded-md" />
          <span className="text-base font-bold tracking-tight">
            Nev<span className="text-primary">Play</span>
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={close}
        className={cn(
          "fixed inset-0 z-50 bg-background/60 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Drawer */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={cn(
          "glass-panel fixed inset-y-3 right-3 z-50 flex w-72 max-w-[calc(100vw-1.5rem)] flex-col rounded-xl transition-transform duration-300 ease-out md:hidden",
          open ? "translate-x-0" : "translate-x-[calc(100%+1rem)]",
        )}
      >
        <div className="flex items-center justify-between px-5 pb-2 pt-5">
          <span className="text-base font-bold tracking-tight">
            Nev<span className="text-primary">Play</span>
          </span>
          <button
            type="button"
            onClick={close}
            className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {navItems.map((item, index) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                style={open ? { transitionDelay: `${index * 30}ms` } : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-all duration-300",
                  open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0",
                  active
                    ? "bg-accent text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <item.icon className="size-5 shrink-0" aria-hidden="true" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-glass-border p-4">
          <Link
            href="/download"
            className="flex items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
          >
            <Download className="size-4" aria-hidden="true" />
            Download NevPlay
          </Link>
        </div>
      </div>
    </>
  )
}
