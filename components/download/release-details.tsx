import {
  type GitHubRelease,
  findApkAsset,
  formatReleaseDate,
  humanFileSize,
  parseChangelog,
  extractSha256,
} from "@/lib/github"
import { Reveal } from "@/components/motion/reveal"
import { GlassCard, SectionHeading } from "@/components/ui/primitives"
import { CopyButton } from "./copy-button"
import { Download } from "lucide-react"

export function ChangelogTimeline({ release }: { release: GitHubRelease }) {
  const lines = parseChangelog(release.body)
  if (lines.length === 0) return null

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionHeading
            eyebrow="Changelog"
            title={`What's New in ${release.tag_name}`}
            align="left"
          />
        </Reveal>
        <Reveal className="mt-8">
          <ol className="relative flex flex-col gap-4 border-l border-glass-border pl-6">
            {lines.map((line) => (
              <li key={line} className="relative text-sm leading-relaxed text-muted-foreground">
                <span
                  aria-hidden="true"
                  className="absolute -left-[1.72rem] top-1.5 size-2.5 rounded-full border-2 border-background bg-primary"
                />
                {line}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}

export function Sha256Section({ release }: { release: GitHubRelease }) {
  const sha = extractSha256(release.body)
  if (!sha) return null

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionHeading
            eyebrow="Verify"
            title="SHA-256 Checksum"
            description="Verify your download's integrity by comparing this checksum against your local file."
            align="left"
          />
        </Reveal>
        <Reveal className="mt-6">
          <GlassCard className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <code className="break-all font-mono text-xs text-muted-foreground md:text-sm">
              {sha}
            </code>
            <CopyButton value={sha} />
          </GlassCard>
        </Reveal>
      </div>
    </section>
  )
}

export function PreviousVersions({ releases }: { releases: GitHubRelease[] }) {
  const previous = releases.slice(1)
  if (previous.length === 0) return null

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <SectionHeading eyebrow="Archive" title="Previous Versions" align="left" />
        </Reveal>
        <div className="mt-8 flex flex-col gap-3">
          {previous.map((release) => {
            const apk = findApkAsset(release)
            return (
              <Reveal key={release.tag_name}>
                <details className="glass-panel group rounded-xl">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono text-sm font-semibold">{release.tag_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatReleaseDate(release.published_at)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground transition-transform group-open:rotate-180">
                      &#9662;
                    </span>
                  </summary>
                  <div className="flex flex-col gap-3 px-5 pb-5">
                    <ul className="flex flex-col gap-1.5">
                      {parseChangelog(release.body)
                        .slice(0, 6)
                        .map((line) => (
                          <li key={line} className="text-sm leading-relaxed text-muted-foreground">
                            {line}
                          </li>
                        ))}
                    </ul>
                    {apk && (
                      <a
                        href={apk.browser_download_url}
                        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        <Download className="size-4" aria-hidden="true" />
                        {apk.name} ({humanFileSize(apk.size)})
                      </a>
                    )}
                  </div>
                </details>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
