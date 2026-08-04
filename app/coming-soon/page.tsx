import type { Metadata } from "next"
import { getComingSoonApps } from "@/app/actions/coming-soon"
import { ComingSoonAppCard } from "@/components/coming-soon/app-card"
import { Reveal } from "@/components/motion/reveal"
import { Badge, GlassCard, PageHero } from "@/components/ui/primitives"
import { Sparkles, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "Coming Soon",
  description:
    "Discover upcoming apps and tools from Nevan Studio. Music player enhancements, distribution platforms, and new projects are in active development.",
}

export default async function ComingSoonPage() {
  const apps = await getComingSoonApps()

  return (
    <>
      <PageHero
        eyebrow="In Active Development"
        title="Coming Soon from Nevan Studio"
        description="We're constantly crafting new audio tools, distribution channels, and ecosystem improvements. Take a look at what's shipping next."
      />

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl space-y-16">
          {/* Apps Grid */}
          {apps.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {apps.map((app: any, index: number) => (
                <Reveal key={app.id || index} delay={index * 80}>
                  <ComingSoonAppCard
                    appName={app.appName}
                    description={app.description || undefined}
                    estimatedRelease={app.estimatedRelease || undefined}
                    imageUrl={app.imageUrl || undefined}
                    status={app.status}
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <GlassCard className="p-12 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                  <Sparkles className="size-6" />
                </div>
                <h2 className="text-xl font-bold">New Apps Announced Soon</h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                  Our engineering team is working on exciting next-generation music playback and discovery features.
                </p>
              </GlassCard>
            </Reveal>
          )}

          {/* APK-Pure Teaser Card */}
          {!apps.find((app: any) => app.appName.toLowerCase().includes("apk")) && (
            <Reveal delay={200}>
              <GlassCard className="relative overflow-hidden p-8 md:p-12 border-primary/30 bg-gradient-to-br from-card via-card to-primary/5">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
                />
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-xl">
                    <Badge>
                      <Zap className="size-3.5" />
                      Alternative Distribution
                    </Badge>
                    <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                      APKPure & Third-Party App Store Deployment
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      We are expanding NevPlay availability to major Android app mirrors. Soon you will be able to download and auto-update directly via APKPure and Uptodown with full cryptographic verification.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-5 py-3 text-xs font-bold text-primary shadow-lg shadow-primary/10">
                      <span className="size-2 rounded-full bg-primary animate-pulse" />
                      In Review & Preparation
                    </span>
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          )}
        </div>
      </section>
    </>
  )
}
