import {
  type GitHubRelease,
  findApkAsset,
  formatReleaseDate,
  humanFileSize,
  parseChangelog,
  renderReleaseBody,
  extractSha256,
} from "@/lib/github"
import { Reveal } from "@/components/motion/reveal"
import { GlassCard, SectionHeading } from "@/components/ui/primitives"
import { CopyButton } from "./copy-button"
import { Download } from "lucide-react"

export function ChangelogTimeline({ release }: { release: GitHubRelease }) {
  const htmlContent = renderReleaseBody(release.body)
  if (!htmlContent) return null

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
          <GlassCard className="p-6 md:p-8">
            <div
              className="prose-release space-y-3"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </GlassCard>
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
            const htmlContent = renderReleaseBody(release.body)

            return (
              <Reveal key={release.tag_name}>
                <details className="glass-panel group rounded-xl">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-semibold text-primary">
                        {release.tag_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatReleaseDate(release.published_at)}
                      </span>
                    </div>
                    {apk && (
                      <span className="text-xs text-muted-foreground">
                        {humanFileSize(apk.size)}
                      </span>
                    )}
                  </summary>
                  <div className="border-t border-glass-border p-5 space-y-4">
                    {htmlContent && (
                      <div
                        className="text-sm space-y-2"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                      />
                    )}
                    {apk && (
                      <a
                        href={apk.browser_download_url}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline pt-2"
                      >
                        <Download className="size-3.5" />
                        Download {release.tag_name} APK ({humanFileSize(apk.size)})
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
