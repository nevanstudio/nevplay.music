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

export const revalidate = 3600 // 1 hour (24 times per day)

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

          {/* Primary Mobile-First CTA Button */}
          {latestApk && (
            <div className="blur-in flex flex-col items-center gap-3 w-full max-w-sm pt-2 [animation-delay:250ms]">
              <ButtonLink href={latestApk.browser_download_url} size="lg" className="w-full justify-center shadow-xl shadow-primary/20" external>
                <Download className="size-5" aria-hidden="true" />
                Download APK ({humanFileSize(latestApk.size)})
              </ButtonLink>
              <span className="text-xs text-muted-foreground">
                Version {latest.tag_name} · Android 8.0+
              </span>
            </div>
          )}

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

      {/* ── Latest Stable Release Card ── */}
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
                    Latest Release
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

                <div className="relative z-10 flex flex-col gap-6 p-6 md:p-8">
                  {/* Meta row */}
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

                  <h2 className="text-balance text-2xl font-bold tracking-tight md:text-3xl">
                    {latest.name ?? latest.tag_name}
                  </h2>

                  {/* Immediate Download Button (Instant access on mobile) */}
                  <div className="flex flex-wrap items-center gap-3">
                    <ButtonLink href={latestApk.browser_download_url} size="lg" className="w-full sm:w-auto justify-center" external>
                      <Download className="size-4.5" aria-hidden="true" />
                      Download APK
                      <span className="ml-1.5 rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs font-normal">
                        {humanFileSize(latestApk.size)}
                      </span>
                    </ButtonLink>
                    <a
                      href={latest.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground hover:underline"
                    >
                      View on GitHub →
                    </a>
                  </div>

                  {/* Collapsible Release Notes on Mobile */}
                  {latestBodyHtml && (
                    <details className="group rounded-xl border border-glass-border bg-secondary/30 transition-all" open>
                      <summary className="flex cursor-pointer items-center justify-between gap-3 p-4 text-xs font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors">
                        <span>Release Notes & Highlights</span>
                        <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="border-t border-glass-border p-4 max-h-72 overflow-y-auto pr-2 scrollbar-thin">
                        <div
                          className="prose-release text-xs sm:text-sm"
                          dangerouslySetInnerHTML={{ __html: latestBodyHtml }}
                        />
                      </div>
                    </details>
                  )}
                </div>
              </div>
            </Reveal>
          ) : null}

          {/* ── Beta Card (If available) ── */}
          {latestBeta && betaApk && (
            <Reveal className="mt-8">
              <GlassCard className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                      Beta Release
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {latestBeta.tag_name}
                    </span>
                  </div>
                  <h3 className="mt-1 text-base font-bold text-foreground">
                    Try the latest experimental features
                  </h3>
                </div>
                <ButtonLink href={betaApk.browser_download_url} variant="secondary" external className="shrink-0 justify-center">
                  <Download className="size-4" />
                  Download Beta APK ({humanFileSize(betaApk.size)})
                </ButtonLink>
              </GlassCard>
            </Reveal>
          )}
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
