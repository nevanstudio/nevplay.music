"use client"

import Link from "next/link"
import { AlertTriangle, ArrowRight, ShieldAlert, Smartphone } from "lucide-react"

export function BetaNoticeBanner() {
  return (
    <div className="w-full max-w-6xl mx-auto mb-8 px-6">
      <div className="relative overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 p-5 md:p-6 shadow-xl shadow-amber-500/10 backdrop-blur-xl">
        {/* Glow accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-amber-500/20 blur-2xl"
        />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-inner">
              <AlertTriangle className="size-6 animate-pulse" aria-hidden="true" />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-300">
                  <ShieldAlert className="size-3" aria-hidden="true" />
                  Important Notice
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  Aug 13, 2026 at 09:30 AM
                </span>
              </div>

              <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
                Public Beta Channels Concluded — Early Access Moved In-App
              </h2>

              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-3xl">
                We have ended public Beta channels on GitHub and our website. While beta channels were briefly made public, access is now reserved for targeted testing.
                {" "}<strong className="text-foreground font-semibold">If you wish to join Early Access</strong>, you can request it directly <span className="text-amber-400 font-semibold">inside the NevPlay app</span> provided you are running version <span className="font-mono bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30 text-amber-300">2026.08.12</span> or higher.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0">
            <Link
              href="/download"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs md:text-sm font-bold text-black transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/30 active:scale-95"
            >
              <Smartphone className="size-4" aria-hidden="true" />
              Download Stable (v2026.08.12+)
            </Link>

            <Link
              href="/news"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-xs md:text-sm font-semibold text-amber-300 transition-all hover:bg-amber-500/20 hover:border-amber-500/60"
            >
              Read Full Notice
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
