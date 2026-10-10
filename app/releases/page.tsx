import type { Metadata } from "next"
import { Github, Download, Calendar, Tag, ArrowUpRight, ChevronDown, Zap, Rocket, Clock } from "lucide-react"
import {
  getReleases,
  findApkAsset,
  findImageAsset,
  formatReleaseDate,
  humanFileSize,
  renderReleaseBody,
  extractImageUrl,
} from "@/lib/github"
import { GITHUB_REPO_URL } from "@/lib/nav"
import { Reveal } from "@/components/motion/reveal"
import { Badge, ButtonLink, GlassCard, PageHero, SectionHeading } from "@/components/ui/primitives"
import { RefreshReleaseButton } from "@/components/download/refresh-button"
import type { GitHubRelease } from "@/lib/github"

export const revalidate = 30

export const metadata: Metadata = {
  title: "Releases",
  description:
    "Every NevPlay release — version history, changelogs, and what's new. New GitHub releases appear here automatically.",
}

function LiveIndicator({ label = "LIVE" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      {/* Pinging ring stack */}
      <span className="relative flex size-3">
        <span
          className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"
          style={{ animation: "ping-ring 1.4s cubic-bezier(0,0,0.2,1) infinite" }}
        />
        <span
          className="relative inline-flex size-3 rounded-full bg-primary"
          style={{ animation: "live-pulse 1.8s ease-in-out infinite" }}
        />
      </span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{label}</span>
    </span>
  )
}

function LatestHeroCard({ release }: { release: GitHubRelease }) {
  const apk = findApkAsset(release)
  const imageUrl =
    extractImageUrl(release.body) ??
    findImageAsset(release)?.browser_download_url ??
    null
  const bodyHtml = renderReleaseBody(release.body)

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/8 shadow-2xl shadow-primary/10"
      style={{ animation: "fade-scale-in 0.65s cubic-bezier(0.22,1,0.36,1) both" }}
    >
      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
      />

      {/* Header strip — LIVE badge */}
      <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-primary/20 bg-primary/8 px-6 py-3.5">
        <div className="flex items-center gap-3">
          <LiveIndicator label="Latest Release" />
          {release.prerelease && (
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-400">
              Pre-release
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <RefreshReleaseButton />
          <span className="hidden sm:flex items-center gap-1 rounded-full border border-glass-border bg-surface px-3 py-1 text-xs font-mono text-muted-foreground">
            <Clock className="size-3" aria-hidden="true" />
            {formatReleaseDate(release.published_at)}
          </span>
        </div>
      </div>

      {/* Release cover image */}
      {imageUrl && (
        <div className="relative aspect-[21/8] w-full overflow-hidden bg-card">
          <img
            src={imageUrl}
            alt={release.name ? `${release.name} preview` : "Release preview"}
            className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
          {/* Version tag overlay on image */}
          <div className="absolute bottom-4 left-6 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-card/80 px-3 py-1 font-mono text-sm font-bold text-primary backdrop-blur-md">
              <Tag className="size-3.5" aria-hidden="true" />
              {release.tag_name}
            </span>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col gap-6 p-6 md:p-8">
        {/* Title + meta */}
        <div>
          {!imageUrl && (
            <span className="mb-3 inline-flex items-center gap-1.5 font-mono text-sm font-bold text-primary">
              <Tag className="size-3.5" aria-hidden="true" />
              {release.tag_name}
            </span>
          )}
          <h2 className="text-balance text-2xl font-bold tracking-tight md:text-3xl">
            {release.name ?? release.tag_name}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Released {formatReleaseDate(release.published_at)}
            {apk && ` · ${humanFileSize(apk.size)}`}
          </p>
        </div>

        {/* Download + GitHub CTA */}
        <div className="flex flex-wrap items-center gap-3">
          {apk && (
            <ButtonLink
              href={apk.browser_download_url}
              size="lg"
              className="justify-center shadow-xl shadow-primary/25 font-bold"
              external
            >
              <Download className="size-4.5" aria-hidden="true" />
              Download APK
              <span className="ml-1.5 rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs font-normal">
                {humanFileSize(apk.size)}
              </span>
            </ButtonLink>
          )}
          <a
            href={release.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground hover:underline"
          >
            <Github className="size-3.5" aria-hidden="true" />
            View on GitHub
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>

        {/* Collapsible Release Notes */}
        {bodyHtml && (
          <details className="group rounded-2xl border border-glass-border bg-secondary/20 transition-all" open>
            <summary className="flex cursor-pointer items-center justify-between gap-3 p-4 text-xs font-bold uppercase tracking-widest text-foreground transition-colors hover:text-primary">
              <span className="flex items-center gap-2">
                <Rocket className="size-3.5" aria-hidden="true" />
                Release Notes &amp; Highlights
              </span>
              <ChevronDown className="size-4 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="border-t border-glass-border p-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin">
              <div
                className="prose-release text-xs sm:text-sm"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            </div>
          </details>
        )}
      </div>
    </div>
  )
}

function ReleaseCard({ release, index }: { release: GitHubRelease; index: number }) {
  const apk = findApkAsset(release)
  const bodyHtml = renderReleaseBody(release.body)

  return (
    <Reveal delay={index * 40}>
      <div className="group relative overflow-hidden rounded-2xl border border-glass-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/8">
        {/* Subtle hover glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/0 blur-2xl transition-all duration-500 group-hover:bg-primary/10"
        />

        <div className="relative flex flex-col gap-4 p-5 md:p-6">
          {/* Header row */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 font-mono text-sm font-bold text-primary">
                  <Tag className="size-3.5" aria-hidden="true" />
                  {release.tag_name}
                </span>
                {release.prerelease && (
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Pre-release
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="size-3" aria-hidden="true" />
                  {formatReleaseDate(release.published_at)}
                </span>
              </div>
              <h3 className="text-base font-bold tracking-tight text-foreground">
                {release.name ?? release.tag_name}
              </h3>
            </div>

            {apk && (
              <ButtonLink
                href={apk.browser_download_url}
                variant="secondary"
                size="sm"
                external
                className="w-full sm:w-auto shrink-0 justify-center"
              >
                <Download className="size-3.5" aria-hidden="true" />
                APK · {humanFileSize(apk.size)}
              </ButtonLink>
            )}
          </div>

          {/* Collapsible notes */}
          {bodyHtml && (
            <details className="group/notes border-t border-glass-border pt-3 text-xs text-muted-foreground">
              <summary className="flex cursor-pointer items-center gap-2 font-semibold text-foreground/70 transition-colors hover:text-primary">
                <ChevronDown className="size-3.5 transition-transform duration-300 group-open/notes:rotate-180" aria-hidden="true" />
                View changelog
              </summary>
              <div
                className="prose-release mt-3 max-h-56 overflow-y-auto pr-2 scrollbar-thin border-t border-glass-border pt-3"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            </details>
          )}
        </div>
      </div>
    </Reveal>
  )
}

export default async function ReleasesPage() {
  const allReleases = await getReleases()
  const stableReleases = allReleases.filter((r) => !r.prerelease && !r.draft)
  const betaReleases = allReleases.filter((r) => r.prerelease && !r.draft)

  const latestStable = stableReleases[0] ?? null
  const latestBeta = betaReleases[0] ?? null
  const olderStable = stableReleases.slice(1)

  return (
    <>
      <PageHero
        eyebrow="Version History"
        title="Releases & Changelog"
        description="Everything that's shipped, release by release. New versions published on GitHub appear here automatically in real time."
      >
        <ButtonLink href={GITHUB_REPO_URL} variant="secondary" external>
          <Github className="size-4" aria-hidden="true" />
          Watch on GitHub
        </ButtonLink>
      </PageHero>

      {/* Stats bar */}
      <section className="px-6 pb-8">
        <div
          className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6"
          style={{ animation: "slide-up 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
        >
          {[
            { icon: Rocket, value: String(stableReleases.length), label: "Stable Releases" },
            { icon: Zap, value: String(betaReleases.length), label: "Beta Releases" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="glass-panel flex items-center gap-3 rounded-2xl px-5 py-3 border border-glass-border">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="size-4 text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-lg font-bold tabular-nums text-foreground leading-none">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="mx-auto max-w-4xl space-y-16">

          {/* ── Latest Stable — Live Hero Card ── */}
          {latestStable && (
            <div className="space-y-3">
              <LatestHeroCard release={latestStable} />
            </div>
          )}

          {/* ── Latest Beta (if exists) — muted secondary card ── */}
          {latestBeta && (() => {
            const betaApk = findApkAsset(latestBeta)
            const betaBodyHtml = renderReleaseBody(latestBeta.body)
            return (
              <Reveal>
                <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-card to-amber-500/5 opacity-80 hover:opacity-100 transition-opacity duration-300">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 bg-amber-500/8 px-6 py-3">
                    <div className="flex items-center gap-2">
                      <span className="relative flex size-2.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60"
                          style={{ animation: "ping-ring 1.6s cubic-bezier(0,0,0.2,1) infinite" }} />
                        <span className="relative inline-flex size-2.5 rounded-full bg-amber-400" />
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Latest Beta / Pre-release</span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{formatReleaseDate(latestBeta.published_at)}</span>
                  </div>

                  <div className="flex flex-col gap-4 p-6">
                    <div>
                      <span className="font-mono text-sm font-bold text-amber-400">{latestBeta.tag_name}</span>
                      <h3 className="mt-1 text-lg font-bold text-foreground">{latestBeta.name ?? latestBeta.tag_name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Pre-release testing build for previewing upcoming audio features.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {betaApk && (
                        <ButtonLink
                          href={betaApk.browser_download_url}
                          variant="secondary"
                          size="sm"
                          external
                          className="border-amber-500/30 text-amber-300 hover:border-amber-400 hover:bg-amber-500/15"
                        >
                          <Download className="size-3.5" aria-hidden="true" />
                          Beta APK · {humanFileSize(betaApk.size)}
                        </ButtonLink>
                      )}
                      <a
                        href={latestBeta.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground hover:underline"
                      >
                        View on GitHub
                        <ArrowUpRight className="size-3" aria-hidden="true" />
                      </a>
                    </div>

                    {betaBodyHtml && (
                      <details className="group/beta border-t border-amber-500/15 pt-3 text-xs text-muted-foreground">
                        <summary className="flex cursor-pointer items-center gap-2 font-semibold text-amber-400/70 hover:text-amber-300 transition-colors">
                          <ChevronDown className="size-3.5 transition-transform group-open/beta:rotate-180" aria-hidden="true" />
                          View beta changelog
                        </summary>
                        <div
                          className="prose-release mt-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin border-t border-amber-500/15 pt-3"
                          dangerouslySetInnerHTML={{ __html: betaBodyHtml }}
                        />
                      </details>
                    )}
                  </div>
                </div>
              </Reveal>
            )
          })()}

          {/* ── Previous Stable Releases ── */}
          {olderStable.length > 0 && (
            <div className="space-y-6">
              <Reveal>
                <SectionHeading
                  eyebrow="Archive"
                  title="Previous Stable Releases"
                  align="left"
                />
              </Reveal>

              <div className="space-y-4">
                {olderStable.map((release, index) => (
                  <ReleaseCard key={release.tag_name} release={release} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* GitHub CTA */}
          <Reveal>
            <div className="flex items-center justify-center gap-4 border-t border-glass-border pt-10">
              <ButtonLink href={GITHUB_REPO_URL} variant="secondary" external>
                <Github className="size-4" aria-hidden="true" />
                View All Releases on GitHub
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </ButtonLink>
            </div>
          </Reveal>

        </div>
      </section>
    </>
  )
}
