import { Bell, Download, Github, ShieldCheck } from "lucide-react"
import {
  type GitHubRelease,
  findApkAsset,
  formatReleaseDate,
  humanFileSize,
} from "@/lib/github"
import { GITHUB_REPO_URL } from "@/lib/nav"
import { Badge, ButtonLink, GlassCard } from "@/components/ui/primitives"

export function DownloadHero({
  latestRelease,
  downloads,
}: {
  latestRelease: GitHubRelease | null
  downloads: number
}) {
  const apk = latestRelease ? findApkAsset(latestRelease) : null

  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-24 md:pt-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-105 w-[52rem] max-w-full -translate-x-1/2 rounded-full bg-glow blur-3xl"
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
          sideload-friendly APK distribution — straight from GitHub.
        </p>

        {latestRelease && apk ? (
          <GlassCard className="blur-in mt-4 w-full max-w-xl p-8 [animation-delay:300ms]">
            <div className="flex flex-col items-center gap-5">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge>Stable · Signed APK</Badge>
                <span className="font-mono text-sm text-muted-foreground">
                  {latestRelease.tag_name}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm text-muted-foreground">
                <span>{formatReleaseDate(latestRelease.published_at)}</span>
                <span>{humanFileSize(apk.size)}</span>
              </div>
              <ButtonLink href={apk.browser_download_url} size="lg" external className="w-full sm:w-auto">
                <Download className="size-4.5" aria-hidden="true" />
                Download APK
              </ButtonLink>
              <a
                href={latestRelease.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                View release notes on GitHub
              </a>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="blur-in relative mt-4 w-full max-w-xl overflow-hidden p-8 [animation-delay:300ms]">
            <div
              aria-hidden="true"
              className="animate-pulse-glow pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-glow blur-3xl"
            />
            <div className="relative flex flex-col items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Bell className="size-5" aria-hidden="true" />
              </div>
              <h2 className="text-balance text-xl font-bold tracking-tight">
                First Release Coming Soon
              </h2>
              <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
                The first official NevPlay APK is on its way. The moment it lands on
                GitHub Releases, the download button appears right here — automatically.
              </p>
              <ButtonLink href={GITHUB_REPO_URL} variant="secondary" external>
                <Github className="size-4.5" aria-hidden="true" />
                Watch on GitHub
              </ButtonLink>
            </div>
          </GlassCard>
        )}
      </div>
    </section>
  )
}
