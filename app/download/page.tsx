import type { Metadata } from "next"
import {
  Download,
  Github,
  ShieldCheck,
  Calendar,
  Tag,
  ArrowUpRight,
  PackageOpen,
  Smartphone,
  HardDrive,
  Star,
  Zap,
} from "lucide-react"
import {
  getReleases,
  findApkAsset,
  findImageAsset,
  formatReleaseDate,
  humanFileSize,
  renderReleaseBody,
  extractImageUrl,
  totalDownloads,
} from "@/lib/github"
import { GITHUB_REPO_URL } from "@/lib/nav"
import { Reveal } from "@/components/motion/reveal"
import {
  Badge,
  ButtonLink,
  GlassCard,
  SectionHeading,
} from "@/components/ui/primitives"
import { InstallGuide, StoreCards, SystemRequirements, FaqSection } from "@/components/download/download-sections"

export const revalidate = 43200 // 12 hours (2 times per day)

export const metadata: Metadata = {
  title: "Download",
  description:
    "Download NevPlay for Android — the premium offline music player. Free, secure signed APK, completely private.",
}

export default async function DownloadPage() {
  const releases = await getReleases()
  const stableReleases = releases.filter((r) => !r.prerelease && !r.draft)
  const betaReleases = releases.filter((r) => r.prerelease && !r.draft)
  const latest = stableReleases[0] ?? null
  const latestBeta = betaReleases[0] ?? null
  const downloads = totalDownloads(releases)

  const latestApk = latest ? findApkAsset(latest) : null
  const latestImageUrl = latest
    ? (extractImageUrl(latest.body) ??
       findImageAsset(latest)?.browser_download_url ??
       null)
    : null
  const latestBodyHtml = latest ? renderReleaseBody(latest.body) : ""

  const betaApk = latestBeta ? findApkAsset(latestBeta) : null

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-24 md:pb-20 md:pt-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[56rem] max-w-full -translate-x-1/2 rounded-full bg-glow blur-3xl"
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
          <Badge className="blur-in">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Ad-Free · Privacy-First · Offline
          </Badge>
          <h1 className="blur-in text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl [animation-delay:100ms]">
            Get NevPlay for Android
          </h1>
          <p className="blur-in max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground [animation-delay:200ms]">
            High-fidelity local music playback on your device. Fast, secure, and
            sideload-friendly APK — straight from GitHub.
          </p>

          {/* Stats row */}
          {downloads > 0 && (
            <div className="blur-in flex flex-wrap items-center justify-center gap-6 [animation-delay:300ms]">
              {[
                { icon: Download, label: "Downloads", value: downloads.toLocaleString() },
                { icon: Star, label: "Free Forever", value: "Always" },
                { icon: Zap, label: "No Ads", value: "Zero" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col items-center gap-0.5">
                  <span className="text-2xl font-bold tabular-nums text-foreground">
                    {value}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Icon className="size-3" aria-hidden="true" />
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Latest Stable Release ── */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-4xl">
          {latest && latestApk ? (
            <Reveal>
              <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-card via-card to-primary/5">
                {/* Glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/12 blur-3xl"
                />

                {/* Header strip */}
                <div className="flex flex-wrap items-center gap-3 border-b border-glass-border bg-primary/5 px-6 py-3">
                  <span className="flex size-2 animate-pulse-glow rounded-full bg-primary" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Latest Stable Release
                  </span>
                  <Badge className="ml-auto">Signed APK</Badge>
                </div>

                {/* Banner image */}
                {latestImageUrl && (
                  <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden bg-card">
                    <img
                      src={latestImageUrl}
                      alt={latest.name ? `${latest.name} preview` : "Release preview"}
                      className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
                  </div>
                )}

                <div className="relative z-10 grid gap-8 p-6 md:grid-cols-[1fr_auto] md:p-8">
                  {/* Left: info + notes */}
                  <div className="flex flex-col gap-5">
                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="flex items-center gap-1.5 font-mono font-semibold text-primary">
                        <Tag className="size-3.5" aria-hidden="true" />
                        {latest.tag_name}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="size-3.5" aria-hidden="true" />
                        {formatReleaseDate(latest.published_at)}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <HardDrive className="size-3.5" aria-hidden="true" />
                        {humanFileSize(latestApk.size)}
                      </span>
                    </div>

                    <h2 className="text-balance text-xl font-bold tracking-tight md:text-2xl">
                      {latest.name ?? latest.tag_name}
                    </h2>

                    {/* Release notes */}
                    {latestBodyHtml && (
                      <div
                        className="prose-release text-sm"
                        dangerouslySetInnerHTML={{ __html: latestBodyHtml }}
                      />
                    )}
                  </div>

                  {/* Right: download panel */}
                  <div className="flex flex-col gap-4 md:min-w-52">
                    <GlassCard className="flex flex-col gap-4 p-5">
                      <div className="flex flex-col gap-1">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          Download
                        </p>
                        <p className="font-mono text-sm font-bold text-primary">
                          {latest.tag_name}
                        </p>
                      </div>
                      <ButtonLink
                        href={latestApk.browser_download_url}
                        size="lg"
                        external
                        className="w-full justify-center"
                      >
                        <Download className="size-4.5" aria-hidden="true" />
                        Download APK
                      </ButtonLink>
                      <p className="text-center text-xs text-muted-foreground">
                        {humanFileSize(latestApk.size)} · Android APK
                      </p>
                      <a
                        href={latest.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                      >
                        <Github className="size-3.5" aria-hidden="true" />
                        View on GitHub
                        <ArrowUpRight className="size-3" aria-hidden="true" />
                      </a>
                    </GlassCard>

                    {/* Device requirements */}
                    <GlassCard className="flex flex-col gap-3 p-5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Requirements
                      </p>
                      {[
                        { icon: Smartphone, label: "Android 8.0+" },
                        { icon: HardDrive, label: "~30 MB storage" },
                        { icon: ShieldCheck, label: "Unknown sources on" },
                      ].map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Icon className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                          {label}
                        </div>
                      ))}
                    </GlassCard>
                  </div>
                </div>
              </div>
            </Reveal>
          ) : (
            <Reveal>
              <GlassCard className="flex flex-col items-center gap-6 py-16 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
                  <PackageOpen className="size-7 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-bold tracking-tight">First Release Coming Soon</h2>
                  <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                    The first official NevPlay APK is on its way. The moment it lands on GitHub
                    Releases, the download button appears right here — automatically.
                  </p>
                </div>
                <ButtonLink href={GITHUB_REPO_URL} variant="secondary" external>
                  <Github className="size-4" aria-hidden="true" />
                  Watch on GitHub
                </ButtonLink>
              </GlassCard>
            </Reveal>
          )}
        </div>
      </section>

      {/* ── Beta Release ── */}
      {latestBeta && betaApk && (
        <section className="px-6 pb-16">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-card via-card to-amber-500/5">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-500/8 blur-3xl"
                />

                <div className="flex flex-wrap items-center gap-3 border-b border-amber-500/15 bg-amber-500/5 px-6 py-3">
                  <span className="flex size-2 rounded-full bg-amber-400" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                    Beta Release
                  </span>
                  <span className="ml-auto rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-400">
                    Pre-release
                  </span>
                </div>

                <div className="relative z-10 flex flex-wrap items-center justify-between gap-6 p-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className="font-mono font-semibold text-amber-400">
                        {latestBeta.tag_name}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">
                        {formatReleaseDate(latestBeta.published_at)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold">
                      {latestBeta.name ?? latestBeta.tag_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Try the latest features before they&apos;re stable. May contain bugs.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <ButtonLink
                      href={betaApk.browser_download_url}
                      size="sm"
                      external
                      className="border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                    >
                      <Download className="size-4" aria-hidden="true" />
                      Download Beta ({humanFileSize(betaApk.size)})
                    </ButtonLink>
                    <a
                      href={latestBeta.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      View on GitHub
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ── Previous Versions ── */}
      {stableReleases.length > 1 && (
        <section className="px-6 pb-16">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <SectionHeading
                eyebrow="Archive"
                title="Previous Versions"
                align="left"
                description="Older stable builds for compatibility or testing."
              />
            </Reveal>
            <div className="mt-8 flex flex-col gap-3">
              {stableReleases.slice(1).map((release, i) => {
                const apk = findApkAsset(release)
                return (
                  <Reveal key={release.tag_name} delay={i * 50}>
                    <details className="glass-panel group rounded-xl">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono text-sm font-semibold text-primary">
                            {release.tag_name}
                          </span>
                          {release.name && release.name !== release.tag_name && (
                            <span className="text-sm font-medium">{release.name}</span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {formatReleaseDate(release.published_at)}
                          </span>
                        </div>
                        <span
                          aria-hidden="true"
                          className="shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <div className="flex flex-col gap-4 px-5 pb-5">
                        {apk && (
                          <ButtonLink href={apk.browser_download_url} size="sm" external>
                            <Download className="size-3.5" aria-hidden="true" />
                            Download APK ({humanFileSize(apk.size)})
                          </ButtonLink>
                        )}
                        <a
                          href={release.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                        >
                          View release notes on GitHub
                          <ArrowUpRight className="size-3.5" aria-hidden="true" />
                        </a>
                      </div>
                    </details>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <InstallGuide />
      <StoreCards />
      <SystemRequirements />
      <FaqSection />
    </>
  )
}
