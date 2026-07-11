import { Download } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { ButtonLink } from "@/components/ui/primitives"

export function FinalCta() {
  return (
    <section className="px-6 pb-24 md:pb-32">
      <Reveal>
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-xl border border-glass-border bg-surface px-8 py-16 text-center md:py-20">
          <div
            aria-hidden="true"
            className="animate-pulse-glow pointer-events-none absolute left-1/2 top-1/2 h-72 w-[36rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow blur-3xl"
          />
          <div className="relative flex flex-col items-center gap-5">
            <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
              Ready to Experience NevPlay?
            </h2>
            <p className="max-w-xl text-pretty leading-relaxed text-muted-foreground">
              Download the latest version and transform how you listen to local music.
              Free forever — no ads, no accounts, no tracking.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-4">
              <ButtonLink href="/download" size="lg">
                <Download className="size-4.5" aria-hidden="true" />
                Get NevPlay Free
              </ButtonLink>
              <ButtonLink href="/features" variant="secondary" size="lg">
                Explore Features
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
