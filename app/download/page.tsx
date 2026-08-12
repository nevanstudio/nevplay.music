import type { Metadata } from "next"
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
import {
  Download,
  ShieldCheck,
  Tag,
  Calendar,
  HardDrive,
  CheckCircle2,
  Github,
  Star,
  Zap,
  ArrowRight,
  ChevronDown,
} from "lucide-react"
import { GITHUB_REPO_URL } from "@/lib/nav"
import { Reveal } from "@/components/motion/reveal"
import {
  Badge,
  ButtonLink,
  GlassCard,
  SectionHeading,
} from "@/components/ui/primitives"
import { InstallGuide, StoreCards, SystemRequirements, FaqSection } from "@/components/download/download-sections"
import { RefreshReleaseButton } from "@/components/download/refresh-button"

export const revalidate = 30 // Revalidate every 30 seconds

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
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden px-6 pb-12 pt-20 md:pb-16 md:pt-28">
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
          <p className="blur-in max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg [animation-delay:200ms]">
            High-fidelity local music playback on your device. Fast, secure, and
            sideload-friendly APK — straight from GitHub.
          </p>
              {/* Side-by-Side Hero Download Options */}
          <div className="blur-in flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl pt-2 [animation-delay:250ms]">
            {latestApk && (
              <div className="flex flex-col items-center gap-2 w-full sm:w-1/2">
                <ButtonLink
                  href={latestApk.browser_download_url}
                  size="lg"
                  className="w-full justify-center shadow-xl shadow-primary/25 bg-gradient-to-r from-primary to-primary/90 hover:brightness-110"
                  external
                >
                  <Download className="size-5" aria-hidden="true" />
                  Stable APK
                </ButtonLink>
                <span className="text-xs text-muted-foreground font-mono">
                  v{latest.tag_name} · {humanFileSize(latestApk.size)}
                </span>
              </div>
            )}

            {betaApk && (
              <div className="flex flex-col items-center gap-2 w-full sm:w-1/2">
                <ButtonLink
                  href={betaApk.browser_download_url}
                  size="lg"
                  variant="secondary"
                  className="w-full justify-center border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/5 text-amber-300 hover:border-amber-400 hover:bg-amber-500/20 shadow-lg shadow-amber-500/10"
                  external
                >
                  <Zap className="size-5 text-amber-400 fill-amber-400/20" aria-hidden="true" />
                  Beta / Pre-release
                </ButtonLink>
                <span className="text-xs text-amber-400/80 font-mono">
                  v{latestBeta.tag_name} · {humanFileSize(betaApk.size)}
                </span>
              </div>
            )}
          </div>

          {/* Stats row */}
          {downloads > 0 && (
            <div className="blur-in flex flex-wrap items-center justify-center gap-6 pt-4 [animation-delay:300ms]">
              {[
                { icon: Download, label: "Downloads", value: downloads.toLocaleString() },
                { icon: Star, label: "Free Forever", value: "Always" },
                { icon: Zap, label: "No Ads", value: "Zero" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col items-center gap-0.5">
                  <span className="text-xl font-bold tabular-nums text-foreground sm:text-2xl">
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

      {/* ── Side-by-Side Stable & Beta Comparison Grid ── */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-6xl space-y-6">
          <SectionHeading
            eyebrow="Choose Your Channel"
            title="Stable vs Pre-release (Beta)"
            description="Pick the release that fits your needs. Stable for rock-solid daily use, or Beta to get early access to upcoming features."
          />

          <div className="grid gap-8 lg:grid-cols-2 items-stretch">
            {/* ── Stable Release Card ── */}
            {latest && latestApk && (
              <Reveal className="h-full">
                <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-b from-card via-card to-primary/10 shadow-xl shadow-primary/10 transition-all hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/20">
                  {/* Glow */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
                  />

                  {/* Header strip */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/20 bg-primary/10 px-6 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="flex size-2.5 animate-pulse-glow rounded-full bg-primary" />
                      <span className="text-xs font-bold uppercase tracking-widest text-primary">
                        Stable Channel
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RefreshReleaseButton />
                      <Badge className="bg-primary/20 text-primary border-primary/30">Official Build</Badge>
                    </div>
                  </div>

                  <div className="relative z-10 flex flex-1 flex-col gap-5 p-6 md:p-7">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 font-mono text-sm font-bold text-primary">
                        <Tag className="size-4" aria-hidden="true" />
                        {latest.tag_name}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="size-3.5" aria-hidden="true" />
                        {formatReleaseDate(latest.published_at)}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-foreground">
                        {latest.name ?? latest.tag_name}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        Recommended for all users. Battle-tested, stable performance with complete reliability.
                      </p>
                    </div>

                    <div className="mt-auto pt-2 space-y-4">
                      <ButtonLink
                        href={latestApk.browser_download_url}
                        size="lg"
                        className="w-full justify-center shadow-lg shadow-primary/25"
                        external
                      >
                        <Download className="size-5" aria-hidden="true" />
                        Download Stable APK
                        <span className="ml-1.5 rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs font-normal">
                          {humanFileSize(latestApk.size)}
                        </span>
                      </ButtonLink>

                      {latestBodyHtml && (
                        <details className="group/det rounded-xl border border-glass-border bg-secondary/20 transition-all" open>
                          <summary className="flex cursor-pointer items-center justify-between gap-3 p-3.5 text-xs font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors">
                            <span>Release Notes & Highlights</span>
                            <ChevronDown className="size-4 text-muted-foreground transition-transform group-open/det:rotate-180" />
                          </summary>
                          <div className="border-t border-glass-border p-3.5 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                            <div
                              className="prose-release text-xs"
                              dangerouslySetInnerHTML={{ __html: latestBodyHtml }}
                            />
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            )}

            {/* ── Beta / Pre-release Card (Pop Highlight) ── */}
            {latestBeta && betaApk && (() => {
              const betaBodyHtml = renderReleaseBody(latestBeta.body)
              return (
                <Reveal className="h-full">
                  <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-card via-card to-amber-500/10 shadow-xl shadow-amber-500/15 transition-all hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/25">
                    {/* Vibrant Amber Glow */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/25 blur-3xl"
                    />

                    {/* Top Pop Badge Strip */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/30 bg-amber-500/15 px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="flex size-2.5 animate-ping rounded-full bg-amber-400" />
                        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                          Pre-release / Beta
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RefreshReleaseButton channel="beta" />
                        <span className="rounded-full border border-amber-400/40 bg-amber-400/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">
                          Early Access
                        </span>
                      </div>
                    </div>

                    <div className="relative z-10 flex flex-1 flex-col gap-5 p-6 md:p-7">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 font-mono text-sm font-bold text-amber-400">
                          <Tag className="size-4" aria-hidden="true" />
                          {latestBeta.tag_name}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="size-3.5" aria-hidden="true" />
                          {formatReleaseDate(latestBeta.published_at)}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold tracking-tight text-foreground">
                          {latestBeta.name ?? latestBeta.tag_name}
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          Bleeding-edge build containing the newest experimental features and enhancements.
                        </p>
                      </div>

                      <div className="mt-auto pt-2 space-y-4">
                        <ButtonLink
                          href={betaApk.browser_download_url}
                          size="lg"
                          variant="secondary"
                          className="w-full justify-center border-amber-500/50 bg-gradient-to-r from-amber-500/25 via-amber-500/20 to-amber-500/15 text-amber-300 hover:border-amber-400 hover:bg-amber-500/30 shadow-lg shadow-amber-500/20 font-bold"
                          external
                        >
                          <Zap className="size-5 text-amber-400 fill-amber-400/30" aria-hidden="true" />
                          Download Beta APK
                          <span className="ml-1.5 rounded-full bg-amber-400/20 px-2 py-0.5 text-xs font-semibold text-amber-200">
                            {humanFileSize(betaApk.size)}
                          </span>
                        </ButtonLink>

                        {betaBodyHtml && (
                          <details className="group/det rounded-xl border border-amber-500/25 bg-amber-500/5 transition-all" open>
                            <summary className="flex cursor-pointer items-center justify-between gap-3 p-3.5 text-xs font-bold uppercase tracking-widest text-amber-300 hover:text-amber-200 transition-colors">
                              <span>Beta Changelog & Features</span>
                              <ChevronDown className="size-4 text-amber-400 transition-transform group-open/det:rotate-180" />
                            </summary>
                            <div className="border-t border-amber-500/20 p-3.5 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                              <div
                                className="prose-release text-xs"
                                dangerouslySetInnerHTML={{ __html: betaBodyHtml }}
                              />
                            </div>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              )
            })()}
          </div>
        </div>
      </section>

      {/* ── App Stores ── */}
      <StoreCards />

      {/* ── Install Guide ── */}
      <InstallGuide />

      {/* ── System Requirements ── */}
      <SystemRequirements />

      {/* ── FAQ ── */}
      <FaqSection />
    </>
  )
}
