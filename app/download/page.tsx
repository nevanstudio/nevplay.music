import type { Metadata } from "next"
import { getReleases, totalDownloads } from "@/lib/github"
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

export const metadata: Metadata = {
  title: "Download",
  description:
    "Download NevPlay for Android — the premium offline music player. Free, secure signed APK, completely private.",
}

export default async function DownloadPage() {
  const releases = await getReleases()
  const latest = releases.find((r) => !r.prerelease) ?? releases[0] ?? null

  return (
    <>
      <DownloadHero latestRelease={latest} downloads={totalDownloads(releases)} />
      {latest && <ChangelogTimeline release={latest} />}
      {latest && <Sha256Section release={latest} />}
      <InstallGuide />
      <PreviousVersions releases={releases} />
      <StoreCards />
      <SystemRequirements />
      <FaqSection />
    </>
  )
}
