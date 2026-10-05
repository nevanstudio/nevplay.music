import Link from "next/link"
import { ArrowRight, Code2, Sparkles, Terminal, UserCheck, ShieldCheck, Zap } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { Badge, ButtonLink } from "@/components/ui/primitives"

export function ComebackDispatch() {
  return (
    <section className="px-6 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-card via-surface to-primary/10 p-6 md:p-10 shadow-2xl shadow-primary/10">
            {/* Ambient corner glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
            />

            {/* Header Badge & Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-glass-border pb-6">
              <div className="flex items-center gap-2.5">
                <span className="flex size-3 rounded-full bg-primary animate-ping-ring" />
                <Badge className="bg-primary/20 text-primary border-primary/40 font-mono">
                  SOLO DEV DISPATCH · OCT 2026
                </Badge>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                60 Days Offline · Status: Restored &amp; Operating
              </span>
            </div>

            {/* Content Body */}
            <div className="mt-8 space-y-6">
              <div className="space-y-3">
                <h2 className="text-balance text-2xl font-extrabold tracking-tight md:text-3xl lg:text-4xl text-foreground">
                  The 60-Day Silence is Over.{" "}
                  <span className="text-primary">We&apos;re Back at the Machine.</span>
                </h2>
                <p className="text-sm md:text-base font-medium text-primary/90">
                  Where was NevPlay since version 2026.08.10? Here is the honest truth from your solo developer.
                </p>
              </div>

              <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                <p>
                  On <strong className="text-foreground">August 10, 2026</strong>, right after shipping our last update, I was struck by an unprecedented personal emergency that completely forced me offline and physically away from my development workstations, source code, and online communication for nearly two full months.
                </p>
                <p>
                  As an independent solo developer with no corporation or secondary maintainers to handle public relations, when life forces you away from your terminal, the entire project goes dark. There were no automated announcements or PR statements—just an abrupt, total radio silence.
                </p>
                <p>
                  <strong className="text-foreground">Rumors of abandonment can now be put to rest.</strong> Rather than letting that involuntary hiatus slow NevPlay down, I used that time away from screens to rethink the architecture from the ground up: identifying bottlenecks, purging unnecessary bloat, and redesigning both our web platform and audio engine for raw speed and minimal latency.
                </p>
                <p>
                  I am officially back at the keyboard. NevPlay is entering its strongest chapter yet: starting today with this lighter, lightning-fast redesigned website, and leading directly into our upcoming major Android app update.
                </p>
              </div>

              {/* Developer Quote / Ethos Box */}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 text-xs sm:text-sm font-mono text-foreground/90 flex items-start gap-3.5">
                <Terminal className="size-5 shrink-0 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-primary">indie_philosophy.log</p>
                  <p className="text-muted-foreground mt-1">
                    &ldquo;Corporate apps abandon users for profit margins. Independent apps survive life&apos;s harshest storms and return with vengeance. Thank you for holding the line.&rdquo;
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-glass-border">
                <ButtonLink href="/news" size="md">
                  Read Full Developer Report
                  <ArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href="/download" variant="secondary" size="md">
                  Download Latest Build
                </ButtonLink>
                <Link
                  href="/about"
                  className="text-xs sm:text-sm font-semibold text-muted-foreground hover:text-primary transition-colors ml-auto"
                >
                  About the Solo Developer →
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
