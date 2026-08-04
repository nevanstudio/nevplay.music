import { ArrowRight, Rocket } from "lucide-react"
import {
  type GitHubRelease,
  findApkAsset,
  formatReleaseDate,
  humanFileSize,
  extractImageUrl,
  renderReleaseBody,
} from "@/lib/github"
import { curatedReleases } from "@/lib/data"
import { Reveal } from "@/components/motion/reveal"
import { Badge, ButtonLink } from "@/components/ui/primitives"

export function ReleaseTeaser({ latestRelease }: { latestRelease: GitHubRelease | null }) {
  const curated = curatedReleases[0]
  const apk = latestRelease ? findApkAsset(latestRelease) : null
  const imageUrl = latestRelease ? extractImageUrl(latestRelease.body) : null
  const bodyHtml = latestRelease ? renderReleaseBody(latestRelease.body) : null

  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-2xl">
            {/* Glow accent */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
            />

            {/* Header strip */}
            <div className="flex items-center gap-3 border-b border-glass-border bg-primary/5 px-6 py-3.5">
              <span className="flex size-2 rounded-full bg-primary animate-pulse-glow" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                {latestRelease ? "Latest Release" : "What's New"}
              </span>
              <span className="ml-auto font-mono text-xs text-muted-foreground">
                {latestRelease
                  ? `${latestRelease.tag_name} · ${formatReleaseDate(latestRelease.published_at)}`
                  : `${curated.version} · ${curated.date}`}
              </span>
            </div>

            {/* Release Image Banner */}
            {imageUrl && (
              <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden bg-card border-b border-glass-border">
                <img
                  src={imageUrl}
                  alt={latestRelease?.name ? `${latestRelease.name} preview` : "Release preview"}
                  className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
              </div>
            )}

            {/* Content */}
            <div className="relative flex flex-col gap-6 p-6 md:p-10">
              <h2 className="text-balance text-2xl font-bold tracking-tight md:text-3xl">
                {latestRelease
                  ? (latestRelease.name ?? latestRelease.tag_name)
                  : curated.title}
              </h2>

              {/* Release notes */}
              {bodyHtml ? (
                <div
                  className="prose-release text-sm line-clamp-6"
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />
              ) : (
                <ul className="flex flex-col gap-2.5">
                  {curated.changelog.slice(0, 5).map((line) => (
                    <li key={line} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span
                        aria-hidden="true"
                        className="mt-1.75 size-1.5 shrink-0 rounded-full bg-primary"
                      />
                      {line}
                    </li>
                  ))}
                </ul>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <ButtonLink href="/download">
                  {apk ? `Download (${humanFileSize(apk.size)})` : "Go to Downloads"}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href="/releases" variant="ghost">
                  Full changelog
                </ButtonLink>
              </div>

              {!latestRelease && (
                <p className="text-xs text-muted-foreground">
                  New releases are published on GitHub and appear here automatically.
                </p>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
