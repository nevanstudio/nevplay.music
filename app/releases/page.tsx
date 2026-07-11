import type { Metadata } from "next"
import Image from "next/image"
import { Github, Rocket } from "lucide-react"
import {
  getReleases,
  findApkAsset,
  formatReleaseDate,
  humanFileSize,
  parseChangelog,
} from "@/lib/github"
import { curatedReleases } from "@/lib/data"
import { GITHUB_REPO_URL } from "@/lib/nav"
import { Reveal } from "@/components/motion/reveal"
import { Badge, ButtonLink, GlassCard, PageHero } from "@/components/ui/primitives"

export const metadata: Metadata = {
  title: "Releases",
  description:
    "Every NevPlay release — version history, changelogs, and what's new. New GitHub releases appear here automatically.",
}

export default async function ReleasesPage() {
  const liveReleases = await getReleases()

  return (
    <>
      <PageHero
        eyebrow="Version History"
        title="Releases & Changelog"
        description="Everything that's shipped, release by release. New versions published on GitHub appear here automatically."
      >
        <ButtonLink href={GITHUB_REPO_URL} variant="secondary" external>
          <Github className="size-4" aria-hidden="true" />
          Watch Releases on GitHub
        </ButtonLink>
      </PageHero>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl">
          <ol className="relative flex flex-col gap-10 border-l border-glass-border pl-8">
            {/* Live GitHub releases first */}
            {liveReleases.map((release) => {
              const apk = findApkAsset(release)
              const lines = parseChangelog(release.body)
              return (
                <Reveal as="li" key={release.tag_name} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[2.55rem] top-1.5 flex size-5 items-center justify-center rounded-full border-2 border-background bg-primary"
                  >
                    <Rocket className="size-2.5 text-primary-foreground" aria-hidden="true" />
                  </span>
                  <GlassCard className="flex flex-col gap-4 p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge>Latest from GitHub</Badge>
                      <span className="font-mono text-sm text-muted-foreground">
                        {release.tag_name} · {formatReleaseDate(release.published_at)}
                      </span>
                    </div>
                    <h2 className="text-balance text-xl font-bold tracking-tight md:text-2xl">
                      {release.name ?? release.tag_name}
                    </h2>
                    {lines.length > 0 && (
                      <ul className="flex flex-col gap-2">
                        {lines.map((line) => (
                          <li
                            key={line}
                            className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-1.75 size-1.5 shrink-0 rounded-full bg-primary"
                            />
                            {line}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex flex-wrap items-center gap-4">
                      {apk && (
                        <ButtonLink href={apk.browser_download_url} size="sm" external>
                          Download APK ({humanFileSize(apk.size)})
                        </ButtonLink>
                      )}
                      <a
                        href={release.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                      >
                        View on GitHub
                      </a>
                    </div>
                  </GlassCard>
                </Reveal>
              )
            })}

            {/* Curated historical releases */}
            {curatedReleases.map((release) => (
              <Reveal as="li" key={release.version} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[2.42rem] top-1.5 size-4 rounded-full border-2 border-background bg-secondary"
                />
                <GlassCard className="flex flex-col gap-4 overflow-hidden p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm text-muted-foreground">
                      {release.version} · {release.date}
                    </span>
                  </div>
                  <h2 className="text-balance text-xl font-bold tracking-tight md:text-2xl">
                    {release.title}
                  </h2>
                  <Image
                    src={release.image}
                    alt={`${release.title} release artwork`}
                    width={720}
                    height={400}
                    className="w-full rounded-lg border border-glass-border"
                  />
                  <ul className="flex flex-col gap-2">
                    {release.changelog.map((line) => (
                      <li
                        key={line}
                        className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-1.75 size-1.5 shrink-0 rounded-full bg-primary"
                        />
                        {line}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </Reveal>
            ))}
          </ol>

          <Reveal className="mt-12">
            <p className="text-center text-sm text-muted-foreground">
              Future releases published to GitHub will appear here automatically.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
