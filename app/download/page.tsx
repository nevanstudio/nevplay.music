import type { Metadata } from "next"
import { DownloadHero } from "@/components/download/download-hero"
import {
  ChangelogTimeline,
  PreviousVersions,
  Sha256Section,
} from "@/components/download/release-details"
import {
  FaqSection,
  InstallGuide,
  StoreCards,
  SystemRequirements,
} from "@/components/download/download-sections"
import {
  getStableReleases,
  getBetaReleases,
  getTotalDownloads,
} from "@/app/actions/releases"
import { ReleaseCard } from "@/components/releases/release-card"

export const metadata: Metadata = {
  title: "Download",
  description:
    "Download NevPlay for Android — the premium offline music player. Free, secure signed APK, completely private.",
}

export default async function DownloadPage() {
  const [stableReleases, betaReleases, totalDownloads] = await Promise.all([
    getStableReleases(),
    getBetaReleases(),
    getTotalDownloads(),
  ])

  const latest = stableReleases[0] || null
  const latestBeta = betaReleases[0] || null

  return (
    <>
      {/* Hero Section with Total Downloads */}
      <div className="space-y-8 py-12">
        {latest && (
          <div className="mx-auto max-w-3xl px-4">
            <h1 className="text-4xl font-bold text-white">Download NevPlay</h1>
            <p className="mt-2 text-lg text-gray-400">
              Over {totalDownloads.toLocaleString()} downloads worldwide
            </p>
          </div>
        )}

        {/* Stable Release */}
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-4 text-xl font-bold text-white">Latest Release</h2>
          {latest ? (
            <ReleaseCard
              id={latest.id}
              version={latest.version}
              title={latest.title}
              description={latest.description || undefined}
              releaseNotes={latest.releaseNotes || undefined}
              imageUrl={latest.imageUrl || undefined}
              apkUrl={latest.apkUrl}
              downloadCount={latest.downloadCount}
              releaseType="stable"
            />
          ) : (
            <p className="text-gray-400">No stable releases available</p>
          )}
        </div>

        {/* Beta Release */}
        {latestBeta && (
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="mb-4 text-xl font-bold text-white">Beta Version</h2>
            <ReleaseCard
              id={latestBeta.id}
              version={latestBeta.version}
              title={latestBeta.title}
              description={latestBeta.description || undefined}
              releaseNotes={latestBeta.releaseNotes || undefined}
              imageUrl={latestBeta.imageUrl || undefined}
              apkUrl={latestBeta.apkUrl}
              downloadCount={latestBeta.downloadCount}
              releaseType="beta"
              isBeta={true}
            />
          </div>
        )}

        {/* Previous Versions */}
        {stableReleases.length > 1 && (
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="mb-4 text-xl font-bold text-white">Previous Versions</h2>
            <div className="space-y-3">
              {stableReleases.slice(1).map((release) => (
                <ReleaseCard
                  key={release.id}
                  id={release.id}
                  version={release.version}
                  title={release.title}
                  description={release.description || undefined}
                  apkUrl={release.apkUrl}
                  downloadCount={release.downloadCount}
                  releaseType="stable"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <InstallGuide />
      <StoreCards />
      <SystemRequirements />
      <FaqSection />
    </>
  )
}
