import type { Metadata } from "next"
import { Github, Rocket, Download, Calendar, Tag, ArrowUpRight, PackageOpen } from "lucide-react"
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
        <div className="mx-auto max-w-4xl space-y-16">

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
                        alt={
                          latestRelease.name
                            ? `${latestRelease.name} preview`
                            : "Release preview"
                        }
                        className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
                    </div>
                  )}

                  <div className="relative z-10 flex flex-col gap-6 p-6 md:p-8">
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

                    {/* Release notes */}
                    {bodyHtml ? (
                      <div
                        className="prose-release text-sm"
                        dangerouslySetInnerHTML={{ __html: bodyHtml }}
                      />
                    ) : (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        Release notes are available on GitHub.
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      {apk ? (
                        <ButtonLink href={apk.browser_download_url} size="lg" external>
                          <Download className="size-4.5" aria-hidden="true" />
                          Download APK
                          <span className="ml-1 rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs font-normal">
                            {humanFileSize(apk.size)}
                          </span>
                        </ButtonLink>
                      ) : (
                        <ButtonLink href={latestRelease.html_url} size="lg" variant="secondary" external>
                          <PackageOpen className="size-4.5" aria-hidden="true" />
                          View Release
                        </ButtonLink>
                      )}
                      <a
                        href={latestRelease.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                      >
                        View on GitHub
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })()}

          {/* ── Older Releases ── */}
          {olderReleases.length > 0 && (
            <div>
              <Reveal>
                <h2 className="mb-8 text-lg font-bold tracking-tight text-muted-foreground">
                  Previous Releases
                </h2>
              </Reveal>

              <ol className="relative flex flex-col gap-8 border-l border-glass-border pl-8">
                {olderReleases.map((release, i) => {
                  const apk = findApkAsset(release)
                  const imageUrl =
                    extractImageUrl(release.body) ??
                    findImageAsset(release)?.browser_download_url ??
                    null
                  const bodyHtml = renderReleaseBody(release.body)

                  return (
                    <Reveal as="li" key={release.tag_name} className="relative" delay={i * 50}>
                      {/* Timeline dot */}
                      <span
                        aria-hidden="true"
                        className="absolute -left-[2.55rem] top-5 flex size-5 items-center justify-center rounded-full border-2 border-background bg-secondary"
                      >
                        <Rocket className="size-2.5 text-muted-foreground" aria-hidden="true" />
                      </span>

                      <GlassCard className="flex flex-col gap-4 p-5 md:p-6">
                        {/* Image if available */}
                        {imageUrl && (
                          <div className="overflow-hidden rounded-xl border border-glass-border bg-card">
                            <img
                              src={imageUrl}
                              alt={release.name ? `${release.name} preview` : "Release preview"}
                              className="h-48 w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                            />
                          </div>
                        )}

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-2">
                          {release.prerelease && (
                            <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-400">
                              Pre-release
                            </Badge>
                          )}
                          <span className="font-mono text-sm font-semibold text-primary">
                            {release.tag_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatReleaseDate(release.published_at)}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold tracking-tight md:text-lg">
                          {release.name ?? release.tag_name}
                        </h3>

                        {/* Body preview */}
                        {bodyHtml ? (
                          <div
                            className="prose-release text-sm line-clamp-[12]"
                            dangerouslySetInnerHTML={{ __html: bodyHtml }}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Release notes available on GitHub.
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-3 pt-1">
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
                            className="inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                          >
                            View on GitHub
                            <ArrowUpRight className="size-3.5" aria-hidden="true" />
                          </a>
                        </div>
                      </GlassCard>
                    </Reveal>
                  )
                })}
              </ol>
            </div>
          )}

          {/* Empty state */}
          {liveReleases.length === 0 && (
            <Reveal>
              <GlassCard className="flex flex-col items-center gap-4 py-16 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-secondary">
                  <Rocket className="size-6 text-muted-foreground" aria-hidden="true" />
                </div>
                <h2 className="text-lg font-bold">No releases yet</h2>
                <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                  The first NevPlay release will appear here automatically once it&apos;s published
                  on GitHub.
                </p>
                <ButtonLink href={GITHUB_REPO_URL} variant="secondary" external>
                  <Github className="size-4" aria-hidden="true" />
                  Watch on GitHub
                </ButtonLink>
              </GlassCard>
            </Reveal>
          )}

          {/* Footer note */}
          <Reveal>
            <p className="text-center text-sm text-muted-foreground">
              Future releases published to GitHub will appear here automatically.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
