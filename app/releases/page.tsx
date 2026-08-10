import type { Metadata } from "next"
import { Github, Download, Calendar, Tag, ArrowUpRight, ChevronDown } from "lucide-react"
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
import { Badge, ButtonLink, GlassCard, PageHero } from "@/components/ui/primitives"

export const revalidate = 3600 // 1 hour (24 times per day)

export const metadata: Metadata = {
  title: "Releases",
  description:
    "Every NevPlay release — version history, changelogs, and what's new. New GitHub releases appear here automatically.",
}

export default async function ReleasesPage() {
  const liveReleases = await getReleases()
  const latestRelease = liveReleases[0] ?? null
  const olderReleases = liveReleases.slice(1)

  return (
    <>
      <PageHero
        eyebrow="Version History"
        title="Releases & Changelog"
        description="Everything that's shipped, release by release. New versions published on GitHub appear here automatically."
      >
        <ButtonLink href={GITHUB_REPO_URL} variant="secondary" external>
          <Github className="size-4" aria-hidden="true" />
          Watch on GitHub
        </ButtonLink>
      </PageHero>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl space-y-12">

          {/* ── Latest Release – Hero Card ── */}
          {latestRelease && (() => {
            const apk = findApkAsset(latestRelease)
            const imageUrl =
              extractImageUrl(latestRelease.body) ??
              findImageAsset(latestRelease)?.browser_download_url ??
              null
            const bodyHtml = renderReleaseBody(latestRelease.body)

            return (
              <Reveal>
                <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
                  {/* Glow accent */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
                  />

                  {/* Latest badge strip */}
                  <div className="flex items-center gap-3 border-b border-glass-border bg-primary/5 px-6 py-3">
                    <span className="flex size-2 rounded-full bg-primary animate-pulse-glow" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                      Latest Release
                    </span>
                    {latestRelease.prerelease && (
                      <span className="ml-auto rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-400">
                        Pre-release
                      </span>
                    )}
                  </div>

                  {/* Release image */}
                  {imageUrl && (
                    <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden bg-card">
                      <img
                        src={imageUrl}
                        alt={latestRelease.name ? `${latestRelease.name} preview` : "Release preview"}
                        className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                    </div>
                  )}

                  <div className="relative z-10 flex flex-col gap-5 p-6 md:p-8">
                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1.5 font-mono text-sm font-semibold text-primary">
                        <Tag className="size-3.5" aria-hidden="true" />
                        {latestRelease.tag_name}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="size-3.5" aria-hidden="true" />
                        {formatReleaseDate(latestRelease.published_at)}
                      </span>
                      {apk && (
                        <>
                          <span className="text-muted-foreground">·</span>
                          <span className="text-sm text-muted-foreground">
                            {humanFileSize(apk.size)}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-balance text-2xl font-bold tracking-tight md:text-3xl">
                      {latestRelease.name ?? latestRelease.tag_name}
                    </h2>

                    {/* Immediate Download Button Top Placement (Instant on mobile) */}
                    <div className="flex flex-wrap items-center gap-3">
                      {apk && (
                        <ButtonLink href={apk.browser_download_url} size="lg" className="w-full sm:w-auto justify-center" external>
                          <Download className="size-4.5" aria-hidden="true" />
                          Download APK
                          <span className="ml-1.5 rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs font-normal">
                            {humanFileSize(apk.size)}
                          </span>
                        </ButtonLink>
                      )}
                      <a
                        href={latestRelease.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground hover:underline"
                      >
                        View on GitHub
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      </a>
                    </div>

                    {/* Collapsible Release Notes Container */}
                    {bodyHtml && (
                      <details className="group mt-2 rounded-xl border border-glass-border bg-secondary/30 transition-all" open>
                        <summary className="flex cursor-pointer items-center justify-between gap-3 p-4 text-xs font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors">
                          <span>Release Notes</span>
                          <ChevronDown className="size-4 text-muted-foreground transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="border-t border-glass-border p-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
                          <div
                            className="prose-release text-xs sm:text-sm"
                            dangerouslySetInnerHTML={{ __html: bodyHtml }}
                          />
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              </Reveal>
            )
          })()}

          {/* ── Older Releases List ── */}
          {olderReleases.length > 0 && (
            <div className="space-y-6 pt-4">
              <Reveal>
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  Previous Versions
                </h3>
              </Reveal>

              <div className="space-y-4">
                {olderReleases.map((release, index) => {
                  const apk = findApkAsset(release)
                  const bodyHtml = renderReleaseBody(release.body)

                  return (
                    <Reveal key={release.tag_name} delay={index * 30}>
                      <GlassCard className="p-6 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-glass-border pb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-base font-bold text-primary">
                                {release.tag_name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                · {formatReleaseDate(release.published_at)}
                              </span>
                            </div>
                            <h4 className="mt-1 text-sm font-semibold text-foreground">
                              {release.name ?? release.tag_name}
                            </h4>
                          </div>

                          {apk && (
                            <ButtonLink href={apk.browser_download_url} variant="secondary" size="sm" external className="w-full sm:w-auto justify-center">
                              <Download className="size-3.5" />
                              Download APK ({humanFileSize(apk.size)})
                            </ButtonLink>
                          )}
                        </div>

                        {bodyHtml && (
                          <details className="group text-xs text-muted-foreground">
                            <summary className="cursor-pointer font-semibold text-foreground hover:text-primary transition-colors">
                              View release notes →
                            </summary>
                            <div
                              className="prose-release mt-3 pt-3 border-t border-glass-border max-h-60 overflow-y-auto pr-2"
                              dangerouslySetInnerHTML={{ __html: bodyHtml }}
                            />
                          </details>
                        )}
                      </GlassCard>
                    </Reveal>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </section>
    </>
  )
}
