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
  HardDrive,
  CheckCircle2,
  Github,
  Star,
  Zap,
  ArrowRight,
  ChevronDown,
  Newspaper,
  AlertCircle,
  Smartphone,
  Info,
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

          {/* Primary & Standout Download Option (Stable Build) */}
          <div className="blur-in flex flex-col items-center justify-center gap-4 w-full max-w-md pt-2 [animation-delay:250ms]">
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
                  Official Stable Release · Battle-tested & Recommended for everyone
                </span>
              </div>
            )}

            {/* Subdued link to News report */}
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400/90 hover:text-amber-300 hover:underline pt-1 transition-colors"
            >
              <AlertCircle className="size-3.5" aria-hidden="true" />
              Notice: Public Beta channels closed — Early Access moved in-app (v2026.08.12+)
              <ArrowRight className="size-3" aria-hidden="true" />
            </Link>
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

      {/* ── Main Download Section: Stable Version Primary Stage ── */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-5xl space-y-10">
          <SectionHeading
            eyebrow="Official Distribution"
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
                      Primary & Recommended Channel
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshReleaseButton />
                    <Badge className="bg-primary/20 text-primary border-primary/30">Official Stable Build</Badge>
                  </div>
                </div>

                <div className="relative z-10 flex flex-col gap-6 p-6 md:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 font-mono text-sm font-bold text-primary">
                        <Tag className="size-4" aria-hidden="true" />
                        Version {latest.tag_name}
                      </div>
                      <h3 className="text-2xl font-bold tracking-tight text-foreground mt-1">
                        {latest.name ?? `NevPlay ${latest.tag_name}`}
                      </h3>
                    </div>

                    <span className="flex items-center gap-1.5 rounded-full border border-glass-border bg-surface px-3 py-1 text-xs font-mono text-muted-foreground">
                      <Calendar className="size-3.5" aria-hidden="true" />
                      Published {formatReleaseDate(latest.published_at)}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground max-w-3xl">
                    NevPlay Stable is tested across dozens of Android devices for total stability, high-res audio playback, low battery consumption, and zero telemetry collection.
                  </p>

                  <div className="pt-2 space-y-4">
                    <ButtonLink
                      href={latestApk.browser_download_url}
                      size="lg"
                      className="w-full sm:w-auto justify-center shadow-xl shadow-primary/25 text-base px-8 py-3.5 font-bold"
                      external
                    >
                      <Download className="size-5" aria-hidden="true" />
                      Download Stable APK ({humanFileSize(latestApk.size)})
                    </ButtonLink>

                    {latestBodyHtml && (
                      <details className="group/det rounded-2xl border border-glass-border bg-secondary/20 transition-all" open>
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

          {/* ── Subdued & De-emphasized Beta Notice Box ── */}
          <Reveal>
            <div className="rounded-2xl border border-glass-border bg-secondary/15 p-6 md:p-7 space-y-4 opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between gap-3 border-b border-glass-border pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Info className="size-4 text-muted-foreground" aria-hidden="true" />
                  Beta Channel Status Notice
                </div>
                <span className="text-[11px] font-mono text-muted-foreground">
                  Concluded
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-base font-semibold text-foreground">
                  Public Beta Downloads Concluded
                </h4>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  We have officially ended public Beta releases on our website and GitHub. Public beta channels cannot be open for everyone, but users running version <strong className="text-foreground">2026.08.12</strong> or higher can request Early Access directly <strong className="text-foreground">inside the NevPlay Android app</strong> under Settings.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <Newspaper className="size-3.5" aria-hidden="true" />
                  Read Full News Notice & Details
                  <ArrowRight className="size-3" aria-hidden="true" />
                </Link>

                {betaApk && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      Legacy Beta Build (v{latestBeta?.tag_name})
                    </summary>
                    <div className="mt-2 p-2 rounded bg-background border border-glass-border text-[11px]">
                      <a
                        href={betaApk.browser_download_url}
                        className="text-muted-foreground underline hover:text-foreground"
                      >
                        Download legacy pre-release build ({humanFileSize(betaApk.size)})
                      </a>
                    </div>
                  </details>
                )}
              </div>
            </div>
          </Reveal>
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
