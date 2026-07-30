"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Download, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { navItems } from "@/lib/nav"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"

const STORAGE_KEY = "nevplay-sidebar-compact"

export function Sidebar() {
  const pathname = usePathname()
  const [compact, setCompact] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === "true") setCompact(true)
      else if (stored === null && window.matchMedia("(max-width: 1200px)").matches) {
        setCompact(true)
      }
    } catch {
      // ignore
    }
  }, [])

  function toggleCompact() {
    setCompact((prev) => {
      try {
        localStorage.setItem(STORAGE_KEY, String(!prev))
      } catch {
        // ignore
      }
      return !prev
    })
  }

  return (
    <aside
      className={cn(
        "fixed inset-y-3 left-3 z-40 hidden flex-col md:flex",
        "transition-[width] duration-300 ease-out",
        compact ? "w-16" : "w-60",
      )}
      aria-label="Primary navigation"
    >
      <div className="glass-panel flex h-full flex-col overflow-hidden rounded-xl">
        {/* Logo header */}
        <div className={cn("flex items-center gap-3 px-4 pb-2 pt-5", compact && "justify-center px-0")}>
          <Link href="/" className="flex items-center gap-3" aria-label="NevPlay home">
            <Image
              src="/assets/icon.png"
              alt=""
              width={32}
              height={32}
              className="size-8 shrink-0 rounded-lg"
            />
            {!compact && (
              <span className="text-lg font-bold tracking-tight">
                Nev<span className="text-primary">Play</span>
              </span>
            )}
          </Link>
        </div>

        {/* Nav items */}
        <nav className="mt-3 flex flex-1 flex-col gap-1 overflow-y-auto px-2.5">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                title={compact ? item.label : undefined}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                  compact && "justify-center px-0",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                  />
                )}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-primary"
                  />
                )}
                <item.icon className="relative size-4.5 shrink-0" aria-hidden="true" />
                {!compact && <span className="relative">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className={cn("flex flex-col gap-2 border-t border-glass-border p-3", compact && "items-center")}>
          <Link
            href="/download"
            className={cn(
              "flex items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:brightness-110",
              compact ? "size-10 p-0" : "px-4",
            )}
            title={compact ? "Download" : undefined}
          >
            <Download className="size-4" aria-hidden="true" />
            {!compact && <span>Download</span>}
          </Link>
          <div className={cn("flex items-center gap-1", compact ? "flex-col" : "justify-between px-1")}>
            {mounted && <ThemeToggle />}
            <button
              type="button"
              onClick={toggleCompact}
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label={compact ? "Expand sidebar" : "Collapse sidebar"}
            >
              {compact ? (
                <PanelLeftOpen className="size-4.5" aria-hidden="true" />
              ) : (
                <PanelLeftClose className="size-4.5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
