import { ArrowRight, Rocket } from "lucide-react"
import {
  type GitHubRelease,
  findApkAsset,
  formatReleaseDate,
  humanFileSize,
  parseChangelog,
} from "@/lib/github"
import { curatedReleases } from "@/lib/data"
import { Reveal } from "@/components/motion/reveal"
import { Badge, ButtonLink, GlassCard } from "@/components/ui/primitives"

export function ReleaseTeaser({ latestRelease }: { latestRelease: GitHubRelease | null }) {
  const curated = curatedReleases[0]
  const apk = latestRelease ? findApkAsset(latestRelease) : null
  const changelog = latestRelease ? parseChangelog(latestRelease.body) : curated.changelog

  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <GlassCard className="relative overflow-hidden p-8 md:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-glow blur-3xl"
            />
            <div className="relative flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge>
                  <Rocket className="size-3.5" aria-hidden="true" />
                  {latestRelease ? "Latest Release" : "What's New"}
                </Badge>
                <span className="font-mono text-sm text-muted-foreground">
                  {latestRelease
                    ? `${latestRelease.tag_name} · ${formatReleaseDate(latestRelease.published_at)}`
                    : `${curated.version} · ${curated.date}`}
                </span>
              </div>

              <h2 className="text-balance text-2xl font-bold tracking-tight md:text-3xl">
                {latestRelease
                  ? (latestRelease.name ?? latestRelease.tag_name)
                  : curated.title}
              </h2>

              <ul className="flex flex-col gap-2.5">
                {changelog.slice(0, 5).map((line) => (
                  <li key={line} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span
                      aria-hidden="true"
                      className="mt-1.75 size-1.5 shrink-0 rounded-full bg-primary"
                    />
                    {line}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-center gap-4">
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
          </GlassCard>
        </Reveal>
      </div>
    </section>
  )
}
