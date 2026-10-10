import type { Metadata } from "next"
import Link from "next/link"
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
  Star,
  Zap,
  ArrowRight,
  ChevronDown,
  Newspaper,
  AlertCircle,
  Info,
} from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import {
  Badge,
  ButtonLink,
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
  const latestBodyHtml = latest ? renderReleaseBody(latest.body) : ""

  const betaApk = latestBeta ? findApkAsset(latestBeta) : null

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden px-6 pb-8 pt-16 md:pb-12 md:pt-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[56rem] max-w-full -translate-x-1/2 rounded-full bg-glow blur-3xl"
        />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-5 text-center">
          <Badge className="blur-in">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Ad-Free · Privacy-First · Offline
          </Badge>
          <h1 className="blur-in text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl [animation-delay:100ms]">
            Get NevPlay for Android
          </h1>
          <p className="blur-in max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base [animation-delay:200ms]">
            High-fidelity local music playback on your device. Fast, secure, and
            sideload-friendly APK — straight from GitHub or official stores.
          </p>

          {/* Primary Download Button */}
          <div className="blur-in flex flex-col items-center justify-center gap-3 w-full max-w-md pt-2 [animation-delay:250ms]">
            {latestApk && (
              <div className="flex flex-col items-center gap-2 w-full">
                <ButtonLink
                  href={latestApk.browser_download_url}
                  size="lg"
                  className="w-full justify-center text-base py-4 shadow-2xl shadow-primary/30 bg-gradient-to-r from-primary via-primary to-primary/90 hover:brightness-110 ring-2 ring-primary/40 font-bold"
                  external
                >
                  <Download className="size-5" aria-hidden="true" />
                  Download Stable APK
                  <span className="ml-2 rounded-full bg-primary-foreground/20 px-2.5 py-0.5 text-xs font-normal">
                    v{latest.tag_name} · {humanFileSize(latestApk.size)}
                  </span>
                </ButtonLink>
                <span className="text-xs text-muted-foreground font-medium">
                  Official Stable Release · Recommended for all Android devices
                </span>
              </div>
            )}

            {/* Link to Return Dispatch */}
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline pt-1 transition-colors"
            >
              <Zap className="size-3.5 text-primary" aria-hidden="true" />
              October 2026 Developer Dispatch: The 60-day silence is broken
              <ArrowRight className="size-3" aria-hidden="true" />
            </Link>
          </div>

          {/* Stats row */}
          {downloads > 0 && (
            <div className="blur-in flex flex-wrap items-center justify-center gap-6 pt-2 [animation-delay:300ms]">
              {[
                { icon: Download, label: "Downloads", value: downloads.toLocaleString() },
                { icon: Star, label: "Free Forever", value: "Always" },
                { icon: Zap, label: "No Ads", value: "Zero" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col items-center gap-0.5">
                  <span className="text-lg font-bold tabular-nums text-foreground sm:text-xl">
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

      {/* ── Alternative Stores Section (Prominently placed directly below main download) ── */}
      <StoreCards />

      {/* ── Main Release Details & Changelog ── */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-5xl space-y-8">
          <SectionHeading
            eyebrow="Official Build Details"
            title="NevPlay Stable Release"
            description="Our primary release for daily listening. Rock-solid performance, battery optimized, and 100% private."
          />

          {/* ── Primary Outstanding Stable Release Card ── */}
          {latest && latestApk && (
            <Reveal>
              <div className="group relative overflow-hidden rounded-3xl border-2 border-primary/50 bg-gradient-to-b from-card via-card to-primary/10 shadow-2xl shadow-primary/15 transition-all hover:border-primary/70 hover:shadow-primary/25">
                {/* Background glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl"
                />

                {/* Top strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/20 bg-primary/15 px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-3 animate-pulse-glow rounded-full bg-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">
                      Primary GitHub Channel
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshReleaseButton />
                    <Badge className="bg-primary/20 text-primary border-primary/30">Official Stable Build</Badge>
                  </div>
                </div>

                <div className="relative z-10 flex flex-col gap-5 p-6 md:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 font-mono text-xs font-bold text-primary">
                        <Tag className="size-3.5" aria-hidden="true" />
                        Version {latest.tag_name}
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold tracking-tight text-foreground mt-1">
                        {latest.name ?? `NevPlay ${latest.tag_name}`}
                      </h3>
                    </div>

                    <span className="flex items-center gap-1.5 rounded-full border border-glass-border bg-surface px-3 py-1 text-xs font-mono text-muted-foreground">
                      <Calendar className="size-3.5" aria-hidden="true" />
                      Published {formatReleaseDate(latest.published_at)}
                    </span>
                  </div>

                  <p className="text-xs md:text-sm leading-relaxed text-muted-foreground max-w-3xl">
                    NevPlay Stable is tested across dozens of Android devices for total stability, high-res audio playback, low battery consumption, and zero telemetry collection.
                  </p>

                  <div className="pt-2 space-y-4">
                    <ButtonLink
                      href={latestApk.browser_download_url}
                      size="lg"
                      className="w-full sm:w-auto justify-center shadow-xl shadow-primary/25 text-sm px-8 py-3 font-bold"
                      external
                    >
                      <Download className="size-4" aria-hidden="true" />
                      Download Direct APK ({humanFileSize(latestApk.size)})
                    </ButtonLink>

                    {latestBodyHtml && (
                      <details className="group/det rounded-2xl border border-glass-border bg-secondary/20 transition-all">
                        <summary className="flex cursor-pointer items-center justify-between gap-3 p-4 text-xs font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors">
                          <span>Release Highlights & Detailed Changelog</span>
                          <ChevronDown className="size-4 text-muted-foreground transition-transform group-open/det:rotate-180" />
                        </summary>
                        <div className="border-t border-glass-border p-4 max-h-72 overflow-y-auto pr-2 scrollbar-thin">
                          <div
                            className="prose-release text-xs md:text-sm"
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

          {/* ── Security & Integrity Guarantee ── */}
          <Reveal>
            <div className="rounded-2xl border border-glass-border bg-card/60 p-6 md:p-7 space-y-4 shadow-sm backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3 border-b border-glass-border pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
                  Direct Signed APK Security Guarantee
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">
                  Verified SHA-256
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-semibold text-foreground">
                  100% Free · No Ads · Zero Analytics
                </h4>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  Every APK is built and signed directly via official GitHub Actions pipelines. NevPlay does not require account registration, requests zero invasive Android permissions, and never connects to remote telemetry or advertising servers. Your music, playlists, and listening habits stay 100% on your device.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <Info className="size-3.5" aria-hidden="true" />
                  Read About the Solo Dev &amp; Independent Mission
                  <ArrowRight className="size-3" aria-hidden="true" />
                </Link>

                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                >
                  <Github className="size-3.5" aria-hidden="true" />
                  Verify Source on GitHub
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Install Guide ── */}
      <InstallGuide />

      {/* ── System Requirements ── */}
      <SystemRequirements />

      {/* ── FAQ ── */}
      <FaqSection />
    </>
  )
}
